/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { AccessTime, Paid } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import axios from "axios"
import { handleBidproduct } from "../../home/advertiser-home/functions/handleBidproduct";

function CronCard({ currentTime, duration, auct_id, initial_value, currentProduct }) {
    const [clientSession, setClientSession] = useState()
    const [deadline, setDeadline] = useState(1);
    const [isFinishedLot,] = useState(false)
    const refBarDeadline = useRef();
    //refBarDeadline.current.style.width = `0%`;

    useEffect(() => {
        getClientSession()
    }, [])

    useEffect(() => {
        const newDeadline = duration - currentTime;
        setDeadline(newDeadline);

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


    useEffect(() => {

        if (isFinishedLot) {
            eventPauseAuction()
            
            setTimeout(() => {
                console.log("resuming........ ")
                eventContinueAuction()
            }, 2000);
        }

    }, [isFinishedLot])


    const eventPauseAuction = async () => {
        try {

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/pause-product-time`);

        } catch (error) {
            console.log(error);
        }
    }

    const eventContinueAuction = async () => {
        try {

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/resume-floor?auct_id=${auct_id}`);

        } catch (error) {
            console.log(error);
        }
    }

    const getClientSession = async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))

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

    const bidAuctionLive = async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        const bidValue = initial_value + 20
        handleBidproduct(bidValue, null, currentProduct, clientSession, { id: auct_id }, currentSession, null, null, null)
    }

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

                            <div className="w-[40px] h-[40px] border-[1px] z-10 
                                border-zinc-800 rounded-full flex justify-center items-center">
                                <AccessTime />
                            </div>

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

                {clientSession &&
                    <button
                        onClick={bidAuctionLive}
                        className="flex flex-1 h-[40px] 
                        justify-center items-center bg-[#159a29] gap-2
                        rounded-md shadow-lg shadow-[#0000001d] font-bold 
                        text-white">
                        <Paid />
                        <span>+ R$ 20,00</span>
                    </button>
                }

            </div>

        </div>
    );
}

export default CronCard;