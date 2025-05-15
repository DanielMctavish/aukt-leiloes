import { Timer, Gavel, ListAlt, Lock, LockOpen } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import ReceiveWebsocketOnFloor from "./class/ReceiveWebsocketOnFloor";
import { useParams } from "react-router-dom";
import axios from "axios";
import avatarClientsUrls from "../media/avatar-floor/AvatarclientsUrls";
import MobileBidsList from "./components/MobileBidsList";

// Convertendo o objeto de URLs em um array
const avatarIndex = Object.values(avatarClientsUrls);

function MobileElements() {
    const [cronTimer, setCronTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isLoadingBid, setIsLoadingBid] = useState(false);
    const [canBid, setCanBid] = useState(true);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [nextIncrementValue, setNextIncrementValue] = useState(0);
    const [clientSession, setClientSession] = useState(null);
    const [showBids, setShowBids] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isEntireAuctionFinished, setIsEntireAuctionFinished] = useState(false);
    const websocketRef = useRef(null);
    const { auct_id } = useParams();
    const refBarDeadline = useRef(null);
    const [bidNotifications, setBidNotifications] = useState([]);

    // Carregar estado do cadeado do localStorage
    useEffect(() => {
        const savedLockState = localStorage.getItem('bid-button-locked');
        if (savedLockState !== null) {
            setIsLocked(JSON.parse(savedLockState));
        }
    }, []);

    // Função para alternar o estado do cadeado
    const toggleLock = () => {
        const newLockState = !isLocked;
        setIsLocked(newLockState);
        localStorage.setItem('bid-button-locked', JSON.stringify(newLockState));
    };

    // Função para calcular incremento
    const calculateIncrement = (value) => {
        if (value <= 600) return 20;
        if (value <= 1200) return 24;
        if (value <= 3000) return 30;
        if (value <= 6000) return 40;
        if (value <= 12000) return 60;
        return Math.ceil(value * 0.01);
    };

    useEffect(() => {
        if (!auct_id) return;

        websocketRef.current = new ReceiveWebsocketOnFloor(auct_id);

        websocketRef.current.receivePlayingAuction((message) => {
            const { cronTimer, body } = message.data;
            setCronTimer(cronTimer);
            setIsActive(cronTimer > 0);
            
            if (body && body.product) {
                // Atualizar o produto mantendo os lances existentes
                setCurrentProduct(prevProduct => {
                    const currentBids = prevProduct?.Bid || [];
                    const newBids = body.product.Bid || [];
                    
                    // Mesclar os lances sem duplicatas
                    const allBids = [...currentBids, ...newBids];
                    const uniqueBids = allBids.reduce((acc, bid) => {
                        if (!acc.find(b => b.id === bid.id)) {
                            acc.push(bid);
                        }
                        return acc;
                    }, []);
                    
                    return {
                        ...body.product,
                        Bid: uniqueBids
                    };
                });
                
                // Atualizar o incremento
                const currentValue = body.product.Bid?.length > 0
                    ? Math.max(...body.product.Bid.map(bid => bid.value))
                    : body.product.initial_value;
                setNextIncrementValue(calculateIncrement(currentValue));
            }
            
            // Não resetar o vencedor aqui
            if (cronTimer > 0) {
                setIsAuctionFinished(false);
            }
        });

        // Listener para novos lances
        websocketRef.current.receiveBidMessage((message) => {
            const { body } = message.data;
            
            // Atualizar o produto com o novo lance
            setCurrentProduct(prevProduct => {
                if (!prevProduct) return prevProduct;
                
                const newBid = {
                    id: Date.now(), // Garantir ID único
                    value: body.currentBid.value,
                    client_id: body.currentBid.client_id,
                    Client: body.currentBid.Client,
                    created_at: new Date().toISOString()
                };
                
                const updatedBids = [...(prevProduct.Bid || []), newBid];
                
                return {
                    ...prevProduct,
                    Bid: updatedBids
                };
            });

            // Adicionar notificação
            const newBidNotification = {
                id: Date.now(),
                value: body.currentBid.value,
                client: body.currentBid.Client,
                avatar: body.currentBid.Client?.client_avatar !== undefined 
                    ? avatarIndex[body.currentBid.Client.client_avatar]
                    : null,
                timestamp: new Date()
            };
            
            setBidNotifications(prev => [...prev, newBidNotification]);

            setTimeout(() => {
                setBidNotifications(prev => prev.filter(n => n.id !== newBidNotification.id));
            }, 3000);
        });

        // Adicionar listeners para finalização
        websocketRef.current.receiveWinnerMessage((message) => {
            const { body } = message.data;
            setWinner(body.winner);
            setIsAuctionFinished(true);
            setIsActive(false);
            
            // Atualizar o produto com o vencedor
            setCurrentProduct(prevProduct => {
                if (!prevProduct) return prevProduct;
                return {
                    ...prevProduct,
                    Winner: body.winner
                };
            });
        });

        websocketRef.current.receiveAuctionFinishedMessage(() => {
            setIsEntireAuctionFinished(true);
            setIsActive(false);
        });
        
        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auct_id]);

    // Efeito para debug do valor atual
    useEffect(() => {
        console.log('Current Product Updated:', currentProduct?.real_value);
    }, [currentProduct]);

    // Recuperar sessão do cliente
    useEffect(() => {
        const currentSession = localStorage.getItem("client-auk-session-login");
        if (currentSession) {
            try {
                const session = JSON.parse(currentSession);
                setClientSession(session);
            } catch (error) {
                setClientSession(null);
            }
        }
    }, []);

    // Buscar dados atualizados do produto ao montar o componente
    useEffect(() => {
        const fetchCurrentProduct = async () => {
            if (!currentProduct?.id) return;

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${currentProduct.id}`
                );
                
                if (response.data) {
                    setCurrentProduct(response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do produto:", error);
            }
        };

        fetchCurrentProduct();
    }, [currentProduct?.id]);

    const handleBidAuctionLive = async () => {
        if (!canBid || !clientSession || !currentProduct) return;
        try {
            setCanBid(false);
            setIsLoadingBid(true);

            // Buscar valor mais recente do produto
            const checkUrl = `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${currentProduct.id}`;
            const checkResponse = await axios.get(checkUrl);
            if (!checkResponse.data) throw new Error("Não foi possível obter os dados mais recentes do produto");
            const latestProduct = checkResponse.data;
            const latestBids = latestProduct.Bid || [];
            const latestValue = latestBids.length > 0 
                ? Math.max(...latestBids.map(bid => bid.value))
                : latestProduct.initial_value;
            const increment = latestBids.length > 0 ? calculateIncrement(latestValue) : 0;
            const nextValue = latestValue + increment;

            // Fazer o lance
            const bidPayload = {
                value: nextValue,
                client_id: clientSession.id,
                product_id: currentProduct.id,
                auct_id: auct_id,
                Client: clientSession,
                Product: latestProduct
            };
            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct?bidInCataloge=false`,
                bidPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${clientSession.token}`
                    }
                }
            );
            if (response.status === 200) {
                // Atualizar o produto com o novo lance
                const newBid = {
                    value: nextValue,
                    client_id: clientSession.id,
                    Client: clientSession
                };
                const updatedProduct = {
                    ...latestProduct,
                    Bid: [...(latestProduct.Bid || []), newBid]
                };
                setCurrentProduct(updatedProduct);
                setNextIncrementValue(calculateIncrement(nextValue));
            }
        } catch (error) {
            alert("Erro ao dar lance. Por favor, tente novamente.");
        } finally {
            setIsLoadingBid(false);
            setTimeout(() => setCanBid(true), 1000);
        }
    };

    // Função para verificar se o usuário está vencendo
    const checkIfUserIsWinning = () => {
        if (!currentProduct?.Bid || !clientSession) return false;
        
        const bids = currentProduct.Bid;
        if (bids.length === 0) return false;

        // Encontrar o lance mais alto
        const highestBid = bids.reduce((max, bid) => 
            (bid.value > max.value) ? bid : max, bids[0]
        );

        return highestBid.client_id === clientSession.id;
    };

    const formatTime = (seconds) => {
        if (seconds <= 0) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (cronTimer <= 10) return "text-red-500";
        if (cronTimer <= 30) return "text-yellow-500";
        return "text-green-500";
    };

    // Função para calcular o percentual baseado no tempo
    const setPercentage = (newDeadline) => {
        if (newDeadline > 10) {
            return;
        }
        const percentage = Math.max(0, Math.min(100, ((10 - newDeadline) / 10) * 100));
        if (refBarDeadline.current) {
            refBarDeadline.current.style.width = `${percentage}%`;
        }
    };

    // Efeito para atualizar a barra de progresso
    useEffect(() => {
        setPercentage(cronTimer);

        if (refBarDeadline.current) {
            if (cronTimer <= 10) {
                const barWidth = Math.max(0, Math.min(100, 100 - ((cronTimer / 10) * 100)));
                refBarDeadline.current.classList.remove('progress-green', 'progress-yellow', 'progress-orange', 'progress-red', 'pulse-animation');
                
                if (cronTimer <= 3) {
                    refBarDeadline.current.classList.add('progress-red', 'pulse-animation');
                } else if (cronTimer <= 6) {
                    refBarDeadline.current.classList.add('progress-orange');
                } else {
                    refBarDeadline.current.classList.add('progress-yellow');
                }
                
                refBarDeadline.current.style.width = `${barWidth}%`;
            } else {
                refBarDeadline.current.classList.remove('progress-red', 'progress-orange', 'progress-yellow', 'pulse-animation');
                refBarDeadline.current.style.width = "0%";
            }
        }
    }, [cronTimer]);

    return (
        <div className="lg:hidden w-full h-full flex flex-col justify-end items-center z-[200] pb-[80px]">
            {/* Container de Notificações */}
            <div className="fixed left-4 bottom-[100px] z-30 pointer-events-none">
                {bidNotifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ x: -100, y: 0, opacity: 0 }}
                        animate={{ x: 0, y: -100, opacity: 1 }}
                        exit={{ x: -50, y: -200, opacity: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="flex items-center gap-2 mb-2 bg-white/90 backdrop-blur-sm rounded-full 
                            px-3 py-2 shadow-lg"
                    >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                            {notification.avatar ? (
                                <img 
                                    src={notification.avatar}
                                    alt={`Avatar de ${notification.client?.nickname || 'Usuário'}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 
                                    flex items-center justify-center text-white text-sm font-bold">
                                    {notification.client?.nickname?.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        
                        {/* Informação do Lance */}
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">
                                {notification.client?.nickname || 'Anônimo'}
                            </span>
                            <span className="text-xs text-gray-600">
                                R$ {notification.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Ícone de Martelo */}
                        <Gavel className="w-4 h-4 text-gray-500" />
                    </motion.div>
                ))}
            </div>

            {/* Valor Atual do Lote */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed bottom-[70px] right-0 w-full max-w-[400px] backdrop-blur-sm 
                    text-white px-4 py-2 rounded-t-lg shadow-lg z-20
                    ${isEntireAuctionFinished ? 'bg-red-600/90' : 'bg-[#012038]/90'}`}
            >
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/80">
                        {isEntireAuctionFinished ? 'Leilão Finalizado' : 
                         isAuctionFinished ? 'Lote Arrematado' : 'Valor Atual:'}
                    </span>
                    <div className="flex items-center gap-2">
                        {isAuctionFinished && winner ? (
                            <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full flex items-center gap-2 font-semibold">
                                <span className="flex items-center gap-1">
                                    <span className="w-[6px] h-[6px] bg-blue-400 rounded-full"></span>
                                </span>
                                {winner.nickname || 'Anônimo'}
                            </span>
                        ) : checkIfUserIsWinning() && (
                            <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-2 font-semibold">
                                <span className="flex items-center gap-1">
                                    <span className="w-[6px] h-[6px] bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="w-[4px] h-[4px] bg-green-400/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-[3px] h-[3px] bg-green-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                </span>
                                Vencendo
                            </span>
                        )}
                        <span className="text-lg font-bold">
                            R$ {(() => {
                                if (!currentProduct) return '0,00';
                                const bids = currentProduct.Bid || [];
                                const currentValue = bids.length > 0
                                    ? Math.max(...bids.map(bid => bid.value))
                                    : currentProduct.initial_value || 0;
                                return currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                            })()}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Miniplayer */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className={`fixed bottom-0 right-0 w-full max-w-[400px] h-[70px] shadow-lg rounded-t-xl flex items-center px-4 z-20
                    ${isEntireAuctionFinished ? 'bg-red-600' : 'bg-white'}`}
            >
                {/* Barra de Progresso */}
                <div 
                    ref={refBarDeadline} 
                    className="progress-bar absolute top-0 left-0 right-0 h-[2px]"
                    style={{ width: '0%' }}
                />

                <style>
                    {`
                    .progress-bar {
                        transition: width 1s linear;
                        height: 2px !important;
                        opacity: 0.8;
                    }
                    
                    .progress-yellow {
                        background-color: #FFC107;
                    }
                    
                    .progress-orange {
                        background-color: #FF9800;
                    }
                    
                    .progress-red {
                        background-color: #F44336;
                    }

                    .pulse-animation {
                        animation: pulse 0.7s infinite;
                    }

                    @keyframes pulse {
                        0% { opacity: 0.8; }
                        50% { opacity: 0.4; }
                        100% { opacity: 0.8; }
                    }
                    `}
                </style>

                {/* Botão para mostrar/ocultar lances */}
                <button
                    className={`mr-2 p-2 rounded-full transition-colors duration-200 ${showBids ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                    onClick={() => setShowBids((prev) => !prev)}
                    aria-label={showBids ? 'Ocultar lances' : 'Mostrar lances'}
                >
                    <ListAlt />
                </button>

                {/* Timer Section */}
                <div className="flex items-center space-x-2 flex-1">
                    <Timer className={`${getTimerColor()}`} />
                    <span className={`font-bold text-xl ${getTimerColor()}`}>
                        {formatTime(cronTimer)}
                    </span>
                </div>

                {/* Bid Button Section */}
                {clientSession && currentProduct && (
                    <div className="flex items-center gap-2">
                        {/* Botão de Cadeado */}
                        <button
                            onClick={toggleLock}
                            className={`p-2 rounded-full transition-colors duration-200 
                                ${isLocked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}
                            aria-label={isLocked ? 'Desbloquear botão de lance' : 'Bloquear botão de lance'}
                        >
                            {isLocked ? <Lock /> : <LockOpen />}
                        </button>

                        {/* Botão de Lance */}
                        {isLoadingBid ? (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                <span>Dando lance...</span>
                            </div>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg 
                                    ${isActive && canBid && !isLocked
                                        ? 'bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white' 
                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    } transition-all duration-200`}
                                disabled={!isActive || !canBid || isLocked}
                                onClick={handleBidAuctionLive}
                            >
                                <Gavel />
                                <span>+ R$ {nextIncrementValue.toFixed(2)}</span>
                            </motion.button>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Modal de lances em tela cheia usando MobileBidsList */}
            {showBids && (
                <div className="absolute flex w-full top-0 h-[90vh] z-[100] mt-[10vh] bg-white flex-col">
                    <MobileBidsList
                        currentProduct={currentProduct}
                        clientSession={clientSession}
                        onClose={() => setShowBids(false)}
                        isAuctionFinished={isAuctionFinished}
                        winner={winner}
                    />
                </div>
            )}
        </div>
    );
}

MobileElements.propTypes = {
    currentAuct: PropTypes.shape({
        deadline: PropTypes.string
    })
};

export default MobileElements;