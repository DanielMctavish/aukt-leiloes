/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { Paid } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { addBidLive } from "../../features/Bids/BidLive";
import FilledCircle from "./FilledCircle";

function CronCard({ currentTime, duration, auct_id, initial_value, real_value,
    reserve_value, currentProduct, onNewBid, isAuctionFinished, isMobile }) {
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [canBid, setCanBid] = useState(true);
    const [clientSession, setClientSession] = useState();
    const [showReserveMessage, setShowReserveMessage] = useState(false);
    const [deadline, setDeadline] = useState(1);
    const [percentual, setPercentual] = useState(1); // Começar em 1%
    const [isFinishedLot,] = useState(false);
    const [updatedProductState, setUpdatedProductState] = useState(null);
    const refBarDeadline = useRef();
    const dispatch = useDispatch();
    const [auctioneerCall, setAuctioneerCall] = useState('');
    const [hasWinner, setHasWinner] = useState(false);

    // Usar o produto atualizado se disponível, ou o produto original como fallback
    const productToUse = updatedProductState || currentProduct;

    useEffect(() => {
        getClientSession();
    }, []);

    // Resetar o produto atualizado quando o produto atual mudar
    useEffect(() => {
        setUpdatedProductState(null);
    }, [currentProduct.id]);

    // Ouvir evento de login bem-sucedido
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

    // Verificar se há vencedor
    useEffect(() => {
        // Se há value (valor) do produto e o leilão está finalizado, consideramos que há um vencedor
        if ((real_value || initial_value) && isAuctionFinished) {
            setHasWinner(true);
        } else {
            setHasWinner(false);
        }
    }, [real_value, initial_value, isAuctionFinished]);

    // Efeito para verificar se o valor de reserva foi atingido
    useEffect(() => {
        if (reserve_value && real_value && real_value >= reserve_value && !showReserveMessage) {
            setShowReserveMessage(true);
            // Esconde a mensagem após 3 segundos
            const timer = setTimeout(() => {
                setShowReserveMessage(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [real_value, reserve_value, showReserveMessage]);

    useEffect(() => {
        const newDeadline = currentTime;
        setDeadline(newDeadline);
        setPercentage(newDeadline);

        // Adiciona as chamadas do leiloeiro
        if (newDeadline <= 3 && newDeadline > 2) {
            setAuctioneerCall('Dou-lhe uma!');
        } else if (newDeadline <= 2 && newDeadline > 1) {
            setAuctioneerCall('Dou-lhe duas!');
        } else if (newDeadline <= 1 && newDeadline > 0) {
            setAuctioneerCall('E...');
        } else if (newDeadline <= 0) {
            // Mostrar "VENDIDO!" apenas se houver um vencedor
            if (real_value) {
                setAuctioneerCall('VENDIDO!');
            } else {
                setAuctioneerCall('Tempo esgotado!');
            }
        } else {
            setAuctioneerCall('');
        }

        if (newDeadline <= 10) {
            // Atualizar a barra com estilo mais limpo e nítido
            const barWidth = Math.max(0, Math.min(100, 100 - ((newDeadline / 10) * 100)));
            
            // Usar classes em vez de inline styles para uma renderização mais eficiente
            refBarDeadline.current.classList.remove('progress-green', 'progress-yellow', 'progress-orange', 'progress-red', 'pulse-animation');
            
            // Aplicar classes baseadas no tempo restante
            if (newDeadline <= 3) {
                refBarDeadline.current.classList.add('progress-red', 'pulse-animation');
            } else if (newDeadline <= 6) {
                refBarDeadline.current.classList.add('progress-orange');
            } else {
                refBarDeadline.current.classList.add('progress-yellow');
            }
            
            // Aplicar a largura com precisão
            refBarDeadline.current.style.width = `${barWidth}%`;
        } else {
            // Resetar a barra para o estado inicial
            refBarDeadline.current.classList.remove('progress-red', 'progress-orange', 'progress-yellow', 'pulse-animation');
            refBarDeadline.current.style.width = "0%";
        }
    }, [currentTime, duration, real_value]);

    const getClientSession = async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
        if (currentSession) {
            try {
                // Verificar se o token ainda é válido
                const tokenResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_API}/client/verify-token`, {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                });
                
                if (!tokenResponse.ok) {
                    // Token inválido, remover sessão
                    console.log("Sessão expirada ou inválida, removendo dados...");
                    localStorage.removeItem("client-auk-session-login");
                    setClientSession(null);
                    return;
                }
                
                // Token válido, buscar dados do cliente
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSession.email}`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${currentSession.token}`
                        }
                    }
                );
                
                setClientSession(response.data);
            } catch (error) {
                console.error("Erro ao verificar sessão:", error);
                // Em caso de erro, é mais seguro remover a sessão
                localStorage.removeItem("client-auk-session-login");
                setClientSession(null);
            }
        }
    };

    const getIncrementValue = (value) => {
        const baseValue = value || initial_value;
        
        if (baseValue <= 600) {
            return 20;
        } else if (baseValue <= 1200) {
            return 24; // 20% a mais que 20
        } else if (baseValue <= 3000) {
            return 30; // 50% a mais que 20
        } else if (baseValue <= 6000) {
            return 40; // 100% a mais que 20
        } else if (baseValue <= 12000) {
            return 60; // 200% a mais que 20
        } else {
            return Math.ceil(baseValue * 0.01); // 1% do valor para valores muito altos
        }
    };

    const getCurrentValue = () => {
        // Se não houver valores definidos, retorna 0
        if (!initial_value && !real_value) {
            return 0;
        }

        // Se não houver real_value, significa que é o primeiro lance
        if (!real_value) {
            return initial_value;
        }

        // Verifica se o valor atual é igual ao real_value
        const currentValue = real_value;
        // Só incrementa se houver lances anteriores
        const hasBids = productToUse.Bid?.length > 0;
        const increment = hasBids ? getIncrementValue(currentValue) : 0;
        const nextValue = currentValue + increment;

        // Se o valor atual for igual ao real_value, retorna o próximo valor calculado
        return currentValue === real_value ? nextValue : currentValue;
    };

    // Função para obter o incremento com base no valor e verificar se já existem lances
    const getDisplayIncrement = (value) => {
        // Verificar se já há lances antes de calcular o incremento
        if (!productToUse.Bid?.length) {
            return 0;
        }
        return getIncrementValue(value);
    };

    // Função para buscar dados atualizados do produto
    const fetchUpdatedProduct = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${currentProduct.id}`
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar dados atualizados do produto:", error);
            return null;
        }
    };

    const handleBidAuctionLive = async () => {
        if (!canBid) return;
        setCanBid(false);
        setIsloadingBid(true);

        try {
            // Obter dados atualizados do produto antes de dar o lance
            const updatedProduct = await fetchUpdatedProduct();
            if (!updatedProduct) {
                throw new Error("Não foi possível obter dados atualizados do produto");
            }

            const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
            if (!currentSession?.token) {
                throw new Error("Sessão inválida");
            }

            const currentValue = updatedProduct.real_value || updatedProduct.initial_value;
            // Usar hasBids para determinar se já existem lances
            const hasBids = updatedProduct.Bid?.length > 0;
            const increment = hasBids ? getIncrementValue(currentValue) : 0;
            const bidValue = currentValue + increment;

            const bidPayload = {
                value: parseFloat(bidValue),
                client_id: clientSession.id,
                product_id: updatedProduct.id,
                auct_id: auct_id,
                Client: clientSession,
                Product: updatedProduct
            };

            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct?bidInCataloge=false`,
                bidPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`                    }
                }
            );

            if (response.status === 200) {
                const newBid = response.data?.body || response.data;
                
                if (newBid) {
                    // Buscar dados atualizados novamente após o lance bem-sucedido
                    const refreshedProduct = await fetchUpdatedProduct();
                    
                    // Atualizar o estado com os novos dados do produto
                    if (refreshedProduct) {
                        setUpdatedProductState(refreshedProduct);
                        console.log("Produto atualizado após lance:", refreshedProduct);
                    }
                    
                    dispatch(addBidLive({
                        value: bidValue,
                        product_id: currentProduct.id
                    }));

                    onNewBid(newBid);

                    setTimeout(() => {
                        setCanBid(true);
                    }, 1000);
                } else {
                    throw new Error("Resposta inválida do servidor");
                }
            }
        } catch (error) {
            console.error("Erro ao dar lance:", error);
        } finally {
            setIsloadingBid(false);
            setCanBid(true);
        }
    };

    const setPercentage = (newDeadline) => {
        // Se o tempo for maior que 10 segundos, a porcentagem é 0
        if (newDeadline > 10) {
            setPercentual(100);
            return;
        }
        // Para os últimos 10 segundos, calcula a porcentagem de forma inversa
        // quanto menor o tempo, maior a porcentagem da barra
        const percentage = Math.max(0, Math.min(100, ((10 - newDeadline) / 10) * 100));
        setPercentual(percentage);
    };

    // Debug
    useEffect(() => {
        if (updatedProductState) {
            console.log("Estado atualizado do produto:", updatedProductState);
            console.log("Número de lances:", updatedProductState.Bid?.length);
        }
    }, [updatedProductState]);

    return (
        <div className={`w-full gap-2 lg:gap-4 flex flex-col justify-start items-center ${isMobile ? '-mx-2' : ''}`}>
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
                
                /* Estilos nítidos para as barras de progresso */
                .progress-bar {
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    transition: width 1s linear;
                }
                
                .progress-green {
                    background-color: #4CAF50;
                    box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
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
            
            <div className={`w-full ${isMobile ? 'h-[45px]' : 'h-[70px]'} flex justify-between ${isMobile ? 'px-3 py-1' : 'p-4'} 
                ${isMobile ? 'bg-white/10' : 'bg-white/95'} backdrop-blur-md 
                ${isMobile ? '' : 'shadow-lg rounded-xl border border-gray-100'}
                items-center relative overflow-hidden`}>
                
                {!isFinishedLot && !isAuctionFinished ? (
                    <>
                        <div 
                            ref={refBarDeadline} 
                            className="progress-bar"
                            style={{ width: '0%' }}
                        />

                        {/* Mensagem de valor de reserva atingido */}
                        {showReserveMessage && (
                            <div className="absolute top-0 right-0 left-0 bg-green-500 text-white text-xs font-medium px-2 py-1 
                                animate-pulse text-center z-30">
                                Valor de reserva atingido!
                            </div>
                        )}

                        {auctioneerCall ? (
                            // Mensagem do Leiloeiro em tela cheia - design mais moderno
                            <div className="absolute inset-0 flex items-center justify-center z-20 
                                bg-black/30 backdrop-blur-[2px]">
                                <div className={`
                                    ${auctioneerCall === 'VENDIDO!' 
                                        ? 'bg-green-500/90' 
                                        : auctioneerCall === 'Tempo esgotado!' 
                                            ? 'bg-red-500/90'
                                            : 'bg-blue-500/90'
                                    }
                                    px-4 lg:px-6 py-2 lg:py-3 rounded-none lg:rounded-lg shadow-lg transform
                                    ${auctioneerCall === 'VENDIDO!' 
                                        ? 'animate-bounce' 
                                        : 'animate-pulse'
                                    }
                                `}>
                                    <span className={`${isMobile ? 'text-lg' : 'text-3xl'} font-bold tracking-wider text-white drop-shadow-md`}>
                                        {auctioneerCall}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            // Conteúdo normal
                            <>
                                <div className="flex items-center gap-3 lg:gap-4 z-10">
                                    <FilledCircle percentage={percentual} />
                                    <span className={`${isMobile ? 'text-base' : 'text-xl'} font-bold ${isMobile ? 'text-white' : 'text-gray-800'}`}>
                                        R$ {(productToUse.Bid?.length > 0 ? productToUse.real_value : productToUse.initial_value)?.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center z-10">
                                    <span className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold 
                                        ${deadline <= 3 ? 'text-red-400 scale-110' : isMobile ? 'text-white' : 'text-gray-800'} 
                                        ${isMobile ? '' : 'bg-white/80 px-4 py-2 rounded-lg shadow-sm'}
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
                        <span className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} text-white tracking-wider`}>
                            {hasWinner ? 'VENDIDO!' : 'Lote Finalizado!'}
                        </span>
                    </div>
                )}
            </div>

            {/* Esconde os botões quando o cronômetro estiver em "VENDIDO!" ou não houver valores definidos */}
            {!isAuctionFinished && deadline > 0 && (productToUse.initial_value || productToUse.real_value) && (
                <div className="w-full flex justify-between items-center gap-2">
                    <div className={`flex-1 ${isMobile ? 'h-[35px] text-sm' : 'h-[50px]'} 
                        ${isMobile ? 'bg-white/10' : 'bg-white/95'}
                        ${isMobile ? '' : 'shadow-lg rounded-xl border border-gray-100'}
                        flex justify-center items-center
                        ${isMobile ? 'text-white' : 'text-gray-700'}`}>
                        R$ {(productToUse.Bid?.length > 0 ? productToUse.real_value : productToUse.initial_value)?.toFixed(2)}
                    </div>

                    {clientSession && !isLoadingBid ? (
                        <button
                            onClick={handleBidAuctionLive}
                            disabled={!canBid}
                            className={`flex-1 ${isMobile ? 'h-[35px] text-sm' : 'h-[50px]'} 
                                ${isMobile ? '' : 'rounded-xl shadow-lg'}
                                flex justify-center items-center gap-2
                                font-bold text-white transition-all duration-300
                                ${canBid
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                                    : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            <Paid sx={{ fontSize: isMobile ? 16 : 24 }} />
                            <span>+ R$ {getDisplayIncrement(getCurrentValue())},00</span>
                        </button>
                    ) : clientSession && (
                        <div className={`flex-1 ${isMobile ? 'h-[35px] text-sm' : 'h-[50px]'} bg-gradient-to-r from-green-500 to-green-600 
                            ${isMobile ? '' : 'rounded-xl shadow-lg'} flex justify-center items-center gap-2
                            font-bold text-white`}>
                            <div className="animate-spin rounded-full h-3 w-3 lg:h-5 lg:w-5 border-2 border-white border-t-transparent"/>
                            <span>Dando lance...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CronCard;
