/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { AccessTime } from "@mui/icons-material";
import hamerIcon from "../../media/icons/Hammer.png";
import { useEffect, useRef, useState } from "react";
import axios from "axios"

function CronCard({ currentTime, duration, auct_id, initial_value }) {
    const [deadline, setDeadline] = useState(1);
    const [isFinishedLot, ] = useState(false)
    const [barPercent, setBarPercent] = useState(0);
    const refBarDeadline = useRef();
    //refBarDeadline.current.style.width = `0%`;

    useEffect(() => {
        const newDeadline = duration - currentTime;
        setDeadline(newDeadline);

        // if (newDeadline <= 0 && auct_id) {
        //     setFinishLot(true);
        // }

        if (newDeadline <= 10) {
            setBarPercent(((10 - newDeadline) / 10) * 100);
        } else {
            setBarPercent(0);
        }

    }, [currentTime, duration]);

    useEffect(() => {
        if (refBarDeadline.current) {
            refBarDeadline.current.style.width = `${barPercent}%`;
        } else {
            refBarDeadline.current.style.width = `0%`;
        }
    }, [barPercent]);

    useEffect(() => {

        if (isFinishedLot) {
            eventPauseAuction()
            setBarPercent(100);
            refBarDeadline.current.style.background = "#00b70f"

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



    return (
        <div className="w-[98%] gap-3 rounded-md text-[#191F2F]
        flex flex-col justify-start items-center absolute bottom-3">

            <div className="w-full h-[60px] flex justify-between p-3 
            shadow-lg shadow-[#0000001d] overflow-hidden
            items-center rounded-md bg-[#e3e3e3] relative">

                {
                    !isFinishedLot ?
                        <>
                            <div ref={refBarDeadline} className="h-[60px] absolute bg-[#b70000] ml-[-1.3vh] transition-all duration-[1.8s]"></div>

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
                            flex justify-center items-center 
                            transition-all duration-[1.8s]">
                            <span className="font-extrabold text-white">Lote Finalizado!</span>
                        </div>
                }

            </div>

            <div className="w-full h-[100%] flex justify-between items-center relative gap-2 text-[16px]">

                <span className="flex min-w-[60%] h-[40px] bg-[#e3e3e3] 
                shadow-lg shadow-[#0000001d]
                font-light justify-center items-center rounded-md">
                    R$ {initial_value && initial_value.toFixed(2)}
                </span>

                <button className="flex flex-1 h-[40px] 
                justify-center items-center bg-[#e3e3e3] 
                rounded-md shadow-lg shadow-[#0000001d]">
                    <img src={hamerIcon} alt="Ícone de martelo" className="w-[32px] object-cover" />
                </button>

            </div>

        </div>
    );
}

export default CronCard;
