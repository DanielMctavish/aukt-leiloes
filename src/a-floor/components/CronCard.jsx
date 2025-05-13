/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Paid } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addBidLive } from "../../features/Bids/BidLive";
import FilledCircle from "./FilledCircle";
import ReceiveWebsocketOnFloor from "../class/ReceiveWebsocketOnFloor";

function CronCard({ auct_id }) {
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [canBid, setCanBid] = useState(true);
    const [clientSession, setClientSession] = useState(null);
    const [showReserveMessage, setShowReserveMessage] = useState(false);
    const [deadline, setDeadline] = useState(0);
    const [percentual, setPercentual] = useState(0);
    const [auctioneerCall, setAuctioneerCall] = useState('');
    const [hasWinner, setHasWinner] = useState(false);
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [currentValue, setCurrentValue] = useState(0);
    const [nextIncrementValue, setNextIncrementValue] = useState(0);
    const refBarDeadline = useRef(null);
    const websocketRef = useRef(null);
    const dispatch = useDispatch();

    const calculateIncrement = (value) => {
        if (value <= 600) return 20;
        if (value <= 1200) return 24;
        if (value <= 3000) return 30;
        if (value <= 6000) return 40;
        if (value <= 12000) return 60;
        return Math.ceil(value * 0.01);
    };

  

    const handleBidAuctionLive = async () => {
        if (!canBid || !clientSession || !currentProduct) return;
        
        try {
            setCanBid(false);
            setIsloadingBid(true);

            // Primeiro, buscar o valor mais recente do produto
            const checkUrl = `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${currentProduct.id}`;
            const checkResponse = await axios.get(checkUrl);
            
            if (!checkResponse.data) {
                throw new Error("Não foi possível obter os dados mais recentes do produto");
            }

            const latestProduct = checkResponse.data;
            const latestBids = latestProduct.Bid || [];
            
            // Determinar o valor atual e o incremento
            const latestValue = latestBids.length > 0 
                ? Math.max(...latestBids.map(bid => bid.value))
                : latestProduct.initial_value;

            const increment = latestBids.length > 0 ? calculateIncrement(latestValue) : 0;
            const nextValue = latestValue + increment;

            console.log("Valor mais recente:", latestValue);
            console.log("Incremento calculado:", increment);
            console.log("Próximo valor:", nextValue);

            // Fazer o lance com o valor atualizado
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
                // Atualizar o estado com os dados mais recentes
                setBids(latestBids);
                setCurrentProduct(latestProduct);
                setCurrentValue(nextValue);
                setNextIncrementValue(calculateIncrement(nextValue));

                dispatch(addBidLive({
                    value: nextValue,
                    product_id: currentProduct.id
                }));
            }
        } catch (error) {
            console.error("Erro ao dar lance:", error);
            alert("Erro ao dar lance. Por favor, tente novamente.");
        } finally {
            setIsloadingBid(false);
            setTimeout(() => {
                setCanBid(true);
            }, 1000);
        }
    };

    // Configurar WebSocket
    useEffect(() => {
        websocketRef.current = new ReceiveWebsocketOnFloor(auct_id);

        websocketRef.current.receiveBidMessage(async (message) => {
            const { body } = message.data;
            const newBid = body.currentBid;
            
            console.log("Novo lance recebido via WebSocket:", newBid);
            
            // Atualizar os estados com o novo lance
            setBids(prevBids => {
                // Verificar se já temos este lance
                if (prevBids.some(bid => bid.id === newBid.id)) {
                    return prevBids;
                }
                const newBids = [...prevBids, newBid].sort((a, b) => b.value - a.value);
                return newBids;
            });

            // Atualizar o valor atual e calcular novo incremento apenas se for um lance mais alto
            setCurrentValue(prevValue => {
                if (newBid.value > prevValue) {
                    setNextIncrementValue(calculateIncrement(newBid.value));
                    return newBid.value;
                }
                return prevValue;
            });
            
            setCurrentProduct(prevProduct => {
                if (!prevProduct || prevProduct.id !== body.product.id) return prevProduct;
                return {
                    ...prevProduct,
                    real_value: Math.max(prevProduct.real_value || 0, newBid.value)
                };
            });
        });

        websocketRef.current.receivePlayingAuction((message) => {
            const { body, cronTimer } = message.data;
            const product = body.product;
            const productBids = product.Bid || [];
            
            // Determinar o valor atual
            const currentBidValue = productBids.length > 0 
                ? Math.max(...productBids.map(bid => bid.value))
                : product.initial_value;

            // Só atualizar se o valor for maior que o atual
            setCurrentValue(prevValue => {
                const newValue = Math.max(prevValue || 0, currentBidValue);
                setNextIncrementValue(calculateIncrement(newValue));
                return newValue;
            });

            setBids(productBids);
            setCurrentProduct(prevProduct => {
                if (prevProduct && prevProduct.id === product.id) {
                    return {
                        ...product,
                        real_value: Math.max(prevProduct.real_value || 0, currentBidValue)
                    };
                }
                return {
                    ...product,
                    real_value: currentBidValue
                };
            });
            
            setDeadline(cronTimer);
            setIsAuctionFinished(false);
            setHasWinner(false);
        });

        websocketRef.current.receiveWinnerMessage((message) => {
            const { body } = message.data;
            const product = body.product;
            const productBids = product.Bid || [];
            
            const finalValue = productBids.length > 0 
                ? Math.max(...productBids.map(bid => bid.value))
                : product.initial_value;

            setBids(productBids);
            setCurrentValue(finalValue);
            setNextIncrementValue(calculateIncrement(finalValue));
            setCurrentProduct({
                ...product,
                real_value: finalValue
            });
            setHasWinner(true);
            setIsAuctionFinished(true);
        });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auct_id]);

    // Efeito para monitorar mudanças nos lances
    useEffect(() => {
        if (bids.length > 0) {
            const highestBid = bids[0]; // Já está ordenado pelo valor mais alto
            setCurrentProduct(prevProduct => {
                if (!prevProduct) return prevProduct;
                return {
                    ...prevProduct,
                    real_value: highestBid.value
                };
            });
        }
    }, [bids]);

    // Efeito para verificar se o valor de reserva foi atingido
    useEffect(() => {
        if (currentProduct?.reserve_value && currentProduct?.real_value && 
            currentProduct.real_value >= currentProduct.reserve_value && !showReserveMessage) {
            setShowReserveMessage(true);
            const timer = setTimeout(() => {
                setShowReserveMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentProduct?.real_value, currentProduct?.reserve_value, showReserveMessage]);

    // Efeito para atualizar o cronômetro e chamadas do leiloeiro
    useEffect(() => {
        setPercentage(deadline);

        if (deadline <= 3 && deadline > 2) {
            setAuctioneerCall('Dou-lhe uma!');
        } else if (deadline <= 2 && deadline > 1) {
            setAuctioneerCall('Dou-lhe duas!');
        } else if (deadline <= 1 && deadline > 0) {
            setAuctioneerCall('E...');
        } else if (deadline <= 0) {
            setAuctioneerCall(hasWinner ? 'VENDIDO!' : 'Tempo esgotado!');
        } else {
            setAuctioneerCall('');
        }

        // Atualizar a barra de progresso
        if (refBarDeadline.current) {
            if (deadline <= 10) {
                const barWidth = Math.max(0, Math.min(100, 100 - ((deadline / 10) * 100)));
                refBarDeadline.current.classList.remove('progress-green', 'progress-yellow', 'progress-orange', 'progress-red', 'pulse-animation');
                
                if (deadline <= 3) {
                    refBarDeadline.current.classList.add('progress-red', 'pulse-animation');
                } else if (deadline <= 6) {
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
    }, [deadline, hasWinner]);

    // Efeito para verificar a sessão do cliente
    useEffect(() => {
        const currentSession = localStorage.getItem("client-auk-session-login");
        if (currentSession) {
            try {
                const session = JSON.parse(currentSession);
                setClientSession(session);
            } catch (error) {
                console.error("Erro ao ler sessão:", error);
                setClientSession(null);
            }
        }
    }, []);

    // Ouvir eventos de login e logout
    useEffect(() => {
        const handleLoginSuccess = (event) => {
            setClientSession(event.detail);
        };

        const handleLogout = () => {
            setClientSession(null);
        };

        window.addEventListener('clientLoginSuccess', handleLoginSuccess);
        window.addEventListener('clientLogout', handleLogout);

        return () => {
            window.removeEventListener('clientLoginSuccess', handleLoginSuccess);
            window.removeEventListener('clientLogout', handleLogout);
        };
    }, []);

    const setPercentage = (newDeadline) => {
        if (newDeadline > 10) {
            setPercentual(100);
            return;
        }
        const percentage = Math.max(0, Math.min(100, ((10 - newDeadline) / 10) * 100));
        setPercentual(percentage);
    };

    return (
        <div className="w-full gap-2 lg:gap-4 flex flex-col justify-start items-center">
            {/* Estilos para animações e barras de progresso */}
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
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
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
            
            <div className="w-full h-[70px] flex justify-between p-4 bg-white/95 backdrop-blur-md 
                shadow-lg rounded-xl border border-gray-100 items-center relative overflow-hidden">
                
                {!isAuctionFinished ? (
                    <>
                        <div 
                            ref={refBarDeadline} 
                            className="progress-bar"
                            style={{ width: '0%' }}
                        />

                        {showReserveMessage && (
                            <div className="absolute top-0 right-0 left-0 bg-green-500 text-white text-xs font-medium px-2 py-1 
                                animate-pulse text-center z-30">
                                Valor de reserva atingido!
                            </div>
                        )}

                        {auctioneerCall ? (
                            <div className="absolute inset-0 flex items-center justify-center z-20 
                                bg-black/30 backdrop-blur-[2px]">
                                <div className={`
                                    ${auctioneerCall === 'VENDIDO!' 
                                        ? 'bg-green-500/90' 
                                        : auctioneerCall === 'Tempo esgotado!' 
                                            ? 'bg-red-500/90'
                                            : 'bg-blue-500/90'
                                    }
                                    px-6 py-3 rounded-lg shadow-lg transform
                                    ${auctioneerCall === 'VENDIDO!' 
                                        ? 'animate-bounce' 
                                        : 'animate-pulse'
                                    }
                                `}>
                                    <span className="text-3xl font-bold tracking-wider text-white drop-shadow-md">
                                        {auctioneerCall}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 z-10">
                                    <FilledCircle percentage={percentual} />
                                    <span className="text-xl font-bold text-gray-800">
                                        R$ {currentValue.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center z-10">
                                    <span className={`text-2xl font-bold 
                                        ${deadline <= 3 ? 'text-red-400 scale-110' : 'text-gray-800'} 
                                        bg-white/80 px-4 py-2 rounded-lg shadow-sm
                                        transition-all duration-300`}>
                                        {deadline}s
                                    </span>
                                </div>
                            </>
                        )}
                    </> 
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 
                        flex justify-center items-center">
                        <span className="font-bold text-2xl text-white tracking-wider">
                            {hasWinner ? 'VENDIDO!' : 'Lote Finalizado!'}
                        </span>
                    </div>
                )}
            </div>

            {!isAuctionFinished && deadline > 0 && currentValue > 0 && (
                <div className="w-full flex justify-between items-center gap-2">
                    <div className="flex-1 h-[50px] bg-white/95 shadow-lg rounded-xl border border-gray-100
                        flex justify-center items-center text-gray-700">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-gray-500">Próximo lance</span>
                            <span className="font-medium">
                                R$ {(currentValue + nextIncrementValue).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {clientSession && (
                        isLoadingBid ? (
                            <div className="flex-1 h-[50px] bg-gradient-to-r from-green-500 to-green-600 
                                rounded-xl shadow-lg flex justify-center items-center gap-2
                                font-bold text-white">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"/>
                                <span>Dando lance...</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleBidAuctionLive}
                                disabled={!canBid}
                                className={`flex-1 h-[50px] rounded-xl shadow-lg
                                    flex justify-center items-center gap-2
                                    font-bold text-white transition-all duration-300
                                    ${canBid
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                                        : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                <Paid sx={{ fontSize: 24 }} />
                                <span>+ R$ {nextIncrementValue.toFixed(2)}</span>
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default CronCard;
