/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { Paid } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import axios from "axios"
import { addBidLive } from "../../features/Bids/BidLive";
import FilledCircle from "./FilledCircle";

function CronCard({ currentTime, duration, auct_id, initial_value, currentProduct }) {
    const [isLoadingBid, setIsloadingBid] = useState(false)
    const [clientSession, setClientSession] = useState()
    const [deadline, setDeadline] = useState(1);
    const [percentual, setPercentual] = useState(50)
    const [isFinishedLot,] = useState(false)
    const refBarDeadline = useRef();
    //refBarDeadline.current.style.width = `0%`;
    const dispatch = useDispatch()

    useEffect(() => {
        getClientSession()
    }, [])

    useEffect(() => {
        const newDeadline = duration - currentTime;
        setDeadline(newDeadline);
        setPercentage(newDeadline)

        // if (newDeadline <= 0 && auct_id) {
        //     setFinishLot(true);
        // }

        if (newDeadline <= 10) {
            refBarDeadline.current.style.transition = `10s`;
            refBarDeadline.current.style.width = `100%`;
            refBarDeadline.current.style.background = "#b70900"
            refBarDeadline.current.style.color = "#fbfbfb"
        } else {
            refBarDeadline.current.style.width = `0%`;
            refBarDeadline.current.style.transition = `1s`;
        }

    }, [currentTime, duration]);



    const getClientSession = async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        if (currentSession)
            try {
                await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSession.email}`, {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }).then((response) => {
                    setClientSession(response.data)
                })
            } catch (error) {
                console.log(error.message);
            }
    }

    const handleBidAuctionLive = async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        const bidValue = initial_value + 20
        setIsloadingBid(true)

        try {
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`, {
                value: parseFloat(bidValue),
                client_id: clientSession.id,
                auct_id: auct_id,
                product_id: currentProduct.id
            }, {
                headers: {
                    "Authorization": `Bearer ${currentSession.token}`
                }
            }).then((response) => {
                console.log("lance live dado com sucesso -> ", response.data)
                setIsloadingBid(false)
                dispatch(addBidLive({
                    value: bidValue,
                    product_id: currentProduct.id
                }))
            })



        } catch (error) {
            setIsloadingBid(false)
            console.log("error at try bid live: ", error.message)
        }

    }

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
                    !isFinishedLot ?
                        <>
                            <div ref={refBarDeadline} className="h-[60px] absolute bg-[#53e642] ml-[-1.3vh] transition-all duration-[1.8s]"></div>

                            <FilledCircle percentage={percentual} />

                            <span className="text-[16px] font-bold z-10">R$ {initial_value && initial_value.toFixed(2)}</span>

                            <div className="flex gap-3 justify-center items-center z-10">
                                <span className="text-[16px] font-bold">{deadline}</span>
                            </div>
                        </> :
                        <div ref={refBarDeadline}
                            className="h-[60px] absolute bg-red-600 ml-[-1.3vh]
                            flex justify-center items-center ">
                            <span className="font-extrabold text-white">Lote Finalizado!</span>
                        </div>
                }

            </div>

            <div className="w-full h-[100%] flex justify-between items-center relative gap-2 text-[16px]">

                <span className="flex flex-1 h-[40px] bg-[#e3e3e3] 
                shadow-lg shadow-[#0000001d] transition-all duration-[.3s]
                font-light justify-center items-center rounded-md">
                    R$ {initial_value && initial_value.toFixed(2)}
                </span>

                {clientSession && !isLoadingBid ?
                    <button
                        onClick={handleBidAuctionLive}
                        className="flex flex-1 h-[40px] 
                        justify-center items-center bg-[#159a29] gap-2
                        rounded-md shadow-lg shadow-[#0000001d] font-bold 
                        text-white">
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

        </div>
    );
}

export default CronCard;