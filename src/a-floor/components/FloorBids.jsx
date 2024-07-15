/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import BidCard from "./BidCard"
import CronCard from "./CronCard"

function FloorBids({ timer, duration, auct_id, initial_value, currentProduct }) {
    const [bidsCards, setBidsCards] = useState([1])

    useEffect(() => {
        console.log('observando produto -> ', currentProduct);
        setBidsCards([1, 2, 3])
    }, [])

    return (
        <div className="lg:w-[28%] w-[99%] lg:h-[94%] min-h-[60vh]
        flex flex-col justify-start items-center
        relative p-2 rounded-[22px] bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-[2px] border-[#e3e3e3] z-[2] gap-1">

            {
                bidsCards.map((card, index) => {
                    return (
                        <BidCard key={index} username={'usuario'} value={120} />
                    )
                })
            }

            <CronCard
                currentTime={timer ? timer : 0}
                duration={duration ? duration : 0}
                auct_id={auct_id ? auct_id : ""}
                initial_value={initial_value} />

        </div>
    )
}

export default FloorBids