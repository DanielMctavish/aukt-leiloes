import { Timer, Gavel, ListAlt, Close, Lock, LockOpen } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import ReceiveWebsocketOnFloor from "./class/ReceiveWebsocketOnFloor";
import { useParams } from "react-router-dom";
import axios from "axios";
import FloorBids from "./components/FloorBids";

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
    const websocketRef = useRef(null);
    const { auct_id } = useParams();
    const refBarDeadline = useRef(null);

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
                setCurrentProduct(body.product);
                const productBids = body.product.Bid || [];
                const currentBidValue = productBids.length > 0 
                    ? Math.max(...productBids.map(bid => bid.value))
                    : body.product.initial_value;
                setNextIncrementValue(calculateIncrement(currentBidValue));
            }
        });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auct_id]);

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
                setNextIncrementValue(calculateIncrement(nextValue));
            }
        } catch (error) {
            alert("Erro ao dar lance. Por favor, tente novamente.");
        } finally {
            setIsLoadingBid(false);
            setTimeout(() => setCanBid(true), 1000);
        }
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
            {/* Miniplayer */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 right-0 w-full max-w-[400px] h-[70px] bg-white shadow-lg rounded-t-xl flex items-center px-4 z-20 overflow-hidden"
            >
                {/* Barra de Progresso */}
                <div 
                    ref={refBarDeadline} 
                    className="progress-bar absolute top-0 left-0 h-[2px]"
                    style={{ width: '0%' }}
                />

                <style>
                    {`
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.8; }
                        100% { opacity: 1; }
                    }
                    
                    .pulse-animation {
                        animation: pulse 0.7s infinite;
                    }
                    
                    .progress-bar {
                        transition: width 1s linear;
                    }
                    
                    .progress-yellow {
                        background-color: #FFC107;
                        box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
                    }
                    
                    .progress-orange {
                        background-color: #FF9800;
                        box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
                    }
                    
                    .progress-red {
                        background-color: #F44336;
                        box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
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

            {/* Modal de lances em tela cheia usando FloorBids */}
            {showBids && (
                <div className="absolute flex w-full top-0 h-[90vh] z-[100] mt-[10vh] bg-white flex-col">
                    <button
                        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                        onClick={() => setShowBids(false)}
                        aria-label="Fechar lances"
                    >
                        <Close />
                    </button>
                    <div className="w-full h-full overflow-hidden">
                        <FloorBids />
                    </div>
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