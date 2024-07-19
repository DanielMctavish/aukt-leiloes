/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import BidCard from "./BidCard"
import CronCard from "./CronCard"


function FloorBids({ timer, duration, auct_id, initial_value, currentProduct }) {
    const [bidsCards, setBidsCards] = useState([])

    useEffect(() => { setBidsCards([]) }, [])

    useEffect(() => {
        //console.log('observando product -> ', currentProduct);
        if (currentProduct) {

            currentProduct.Bid.forEach((bid) => {
                const currentItem = bidsCards.find((item) => item.id === bid.id)
                if (!currentItem) {
                    setBidsCards(prevItem => [...prevItem, bid])
                }
            })

        }

    }, [currentProduct])


    return (
        <div className="lg:w-[28%] w-[99%] lg:h-[94%] min-h-[60vh]
        flex flex-col justify-start items-center
        relative p-2 rounded-[22px] bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-[2px] border-[#e3e3e3] z-[2] gap-1 overflow-y-auto">

            <div className="flex flex-col w-full h-[80%] overflow-y-auto">
                {
                    bidsCards.map((bid, index) => {
                        return (
                            <BidCard key={index} bid={bid} />
                        )
                    })
                }
            </div>

            <CronCard
                currentTime={timer ? timer : 0}
                duration={duration ? duration : 0}
                auct_id={auct_id ? auct_id : ""}
                initial_value={initial_value}
                currentProduct={currentProduct} />

        </div>
    )
}

export default FloorBids