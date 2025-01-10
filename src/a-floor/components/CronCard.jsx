/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { Paid } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { addBidLive } from "../../features/Bids/BidLive";
import FilledCircle from "./FilledCircle";

function CronCard({ currentTime, duration, auct_id, initial_value, real_value, currentProduct, onNewBid, isAuctionFinished }) {
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [canBid, setCanBid] = useState(true);
    const [clientSession, setClientSession] = useState();
    const [deadline, setDeadline] = useState(1);
    const [percentual, setPercentual] = useState(1); // Começar em 1%
    const [isFinishedLot,] = useState(false);
    const refBarDeadline = useRef();
    const dispatch = useDispatch();
    const [auctioneerCall, setAuctioneerCall] = useState('');

    useEffect(() => {
        getClientSession();
    }, []);

    useEffect(() => {
        const newDeadline = duration - currentTime;
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
            setAuctioneerCall('VENDIDO!');
        } else {
            setAuctioneerCall('');
        }

        if (newDeadline <= 10) {
            // Suavizar a transição ao longo de 10 segundos
            refBarDeadline.current.style.transition = "width 10s linear";
            refBarDeadline.current.style.width = `100%`; // A barra vai de 0% até 100% em 10 segundos

            // Alterar a cor da barra dinamicamente com base no tempo restante
            const interval = setInterval(() => {
                const updatedDeadline = duration - currentTime;
                if (updatedDeadline <= 0) {
                    clearInterval(interval);
                    refBarDeadline.current.style.width = `100%`; // Finalizar a barra cheia
                } else {
                    // Alterar a cor da barra gradualmente
                    const color = updatedDeadline <= 5 ? "#b70900" : "#ff9800";
                    refBarDeadline.current.style.transition = "4s";
                    refBarDeadline.current.style.background = color;
                }
            }, 1000); // A cor vai mudando a cada segundo, mas a animação da largura é contínua

            return () => clearInterval(interval); // Limpar intervalo ao desmontar
        } else {
            refBarDeadline.current.style.transition = "none"; // Remover transição
            refBarDeadline.current.style.width = `1%`; // Começar em 1%
            refBarDeadline.current.style.background = "#ff9800"; // Cor inicial laranja
        }
    }, [currentTime, duration]);



    const getClientSession = async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
        if (currentSession)
            try {
                await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSession.email}`, {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }).then((response) => {
                    setClientSession(response.data);
                });
            } catch (error) {
                return error
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
        // Se não houver real_value, significa que é o primeiro lance
        if (!real_value) {
            return initial_value + getIncrementValue(initial_value);
        }
        return real_value;
    };

    const handleBidAuctionLive = async () => {
        if (!canBid) return;
        setCanBid(false);
        setIsloadingBid(true);

        try {
            const updatedProductResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${currentProduct.id}`
            );
            const updatedProduct = updatedProductResponse.data;

            const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
            if (!currentSession?.token) {
                throw new Error("Sessão inválida");
            }

            const currentValue = updatedProduct.real_value || updatedProduct.initial_value;
            const increment = getIncrementValue(currentValue);
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
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }
            );

            if (response.status === 200) {
                const newBid = response.data?.body || response.data;
                
                if (newBid) {
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
        const percentage = (newDeadline / duration) * 100;
        setPercentual(percentage);
    };

    return (
        <div className="w-full gap-4 flex flex-col justify-start items-center">
            <div className="w-full h-[70px] flex justify-between p-4 
                bg-white/95 backdrop-blur-md shadow-lg rounded-xl 
                items-center relative overflow-hidden border border-gray-100">
                
                {!isFinishedLot && !isAuctionFinished ? (
                    <>
                        <div 
                            ref={refBarDeadline} 
                            className="h-full absolute left-0 top-0 bg-gradient-to-r from-orange-500 to-orange-400 
                                transition-all duration-[1.8s] opacity-90"
                        />

                        {auctioneerCall ? (
                            // Mensagem do Leiloeiro em tela cheia
                            <div className="absolute inset-0 flex items-center justify-center z-20 
                                bg-black/20 backdrop-blur-sm">
                                <span className={`text-4xl font-bold tracking-wider
                                    ${auctioneerCall === 'VENDIDO!' 
                                        ? 'text-green-500 animate-bounce' 
                                        : 'text-white animate-pulse'
                                    }
                                    transition-all duration-300 text-center
                                    drop-shadow-lg`}>
                                    {auctioneerCall}
                                </span>
                            </div>
                        ) : (
                            // Conteúdo normal
                            <>
                                <div className="flex items-center gap-4 z-10">
                                    <FilledCircle percentage={percentual} />
                                    <span className="text-xl font-bold text-gray-800">
                                        R$ {(real_value || initial_value)?.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center z-10">
                                    <span className={`text-2xl font-bold 
                                        ${deadline <= 3 ? 'text-red-600 scale-110' : 'text-gray-800'} 
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
                            {auctioneerCall || 'Lote Finalizado!'}
                        </span>
                    </div>
                )}
            </div>

            {!isAuctionFinished && (
                <div className="w-full flex justify-between items-center gap-3">
                    <div className="flex-1 h-[50px] bg-white/95 
                        shadow-lg rounded-xl flex justify-center items-center
                        font-medium text-gray-700 border border-gray-100">
                        R$ {getCurrentValue().toFixed(2)}
                    </div>

                    {clientSession && !isLoadingBid ? (
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
                            <Paid />
                            <span>+ R$ {getIncrementValue(getCurrentValue())},00</span>
                        </button>
                    ) : clientSession && (
                        <div className="flex-1 h-[50px] bg-gradient-to-r from-green-500 to-green-600 
                            rounded-xl shadow-lg flex justify-center items-center gap-2
                            font-bold text-white">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"/>
                            <span>Dando lance...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CronCard;