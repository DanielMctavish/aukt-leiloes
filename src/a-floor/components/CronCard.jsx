/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { Paid } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { addBidLive } from "../../features/Bids/BidLive";
import FilledCircle from "./FilledCircle";

function CronCard({ currentTime, duration, auct_id, initial_value, currentProduct, onNewBid, isAuctionFinished }) {
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [canBid, setCanBid] = useState(true);
    const [clientSession, setClientSession] = useState();
    const [deadline, setDeadline] = useState(1);
    const [percentual, setPercentual] = useState(1); // Começar em 1%
    const [isFinishedLot,] = useState(false);
    const refBarDeadline = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        getClientSession();
    }, []);

    useEffect(() => {
        const newDeadline = duration - currentTime;
        setDeadline(newDeadline);
        setPercentage(newDeadline);

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

    const handleBidAuctionLive = async () => {
        if (!canBid) return;
        
        setCanBid(false);
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
        const bidValue = initial_value + 20;
        setIsloadingBid(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`, {
                value: parseFloat(bidValue),
                client_id: clientSession.id,
                auct_id: auct_id,
                product_id: currentProduct.id,
                Client: clientSession,
                Product: currentProduct
            }, {
                headers: {
                    "Authorization": `Bearer ${currentSession.token}`
                }
            });

            setIsloadingBid(false);
            dispatch(addBidLive({
                value: bidValue,
                product_id: currentProduct.id
            }));

            onNewBid(response.data);

            setTimeout(() => {
                setCanBid(true);
            }, 1000);

        } catch (error) {
            setIsloadingBid(false);
            setCanBid(true);
        }
    };

    const setPercentage = (newDeadline) => {
        const percentage = (newDeadline / duration) * 100;
        setPercentual(percentage);
    };

    return (
        <div className="w-[98%] gap-3 rounded-md text-[#191F2F]
        flex flex-col justify-start items-center absolute bottom-3">

            <div className="w-full h-[60px] flex justify-between p-3 
            shadow-lg shadow-[#0000001d] overflow-hidden
            items-center rounded-md bg-[#e3e3e3] relative">

                {
                    !isFinishedLot && !isAuctionFinished ?
                        <>
                            <div ref={refBarDeadline} className="h-[60px] absolute bg-[#ff9800] ml-[-1.3vh] transition-all duration-[1.8s]"></div>

                            <FilledCircle percentage={percentual} />

                            <span className="text-[16px] font-bold z-10">R$ {initial_value && initial_value.toFixed(2)}</span>

                            <div className="flex gap-3 justify-center items-center z-10">
                                <span className="text-[16px] font-bold">{deadline}</span>
                            </div>
                        </> :
                        <div ref={refBarDeadline}
                            className="h-[60px] absolute bg-red-600 ml-[-1.3vh] w-full
                            flex justify-center items-center">
                            <span className="font-extrabold text-white">Lote Finalizado!</span>
                        </div>
                }
            </div>

            {!isAuctionFinished && (
                <div className="w-full h-[100%] flex justify-between items-center relative gap-2 text-[16px]">
                    <span className="flex flex-1 h-[40px] bg-[#e3e3e3] 
                    shadow-lg shadow-[#0000001d] transition-all duration-[.3s]
                    font-light justify-center items-center rounded-md">
                        R$ {initial_value && initial_value.toFixed(2)}
                    </span>

                    {clientSession && !isLoadingBid ?
                        <button
                            onClick={handleBidAuctionLive}
                            disabled={!canBid}
                            className={`flex flex-1 h-[40px] 
                            justify-center items-center ${canBid ? 'bg-[#159a29]' : 'bg-[#159a29]/50'} gap-2
                            rounded-md shadow-lg shadow-[#0000001d] font-bold 
                            text-white`}>
                            <Paid />
                            <span>+ R$ 20,00</span>
                        </button> :
                        clientSession &&
                        <span className="flex flex-1 h-[40px] 
                        justify-center items-center bg-[#159a29] gap-2
                        rounded-md shadow-lg shadow-[#0000001d] font-bold 
                        text-white">dando lance...</span>
                    }
                </div>
            )}
        </div>
    );
}

export default CronCard;