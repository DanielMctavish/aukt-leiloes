/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import io from "socket.io-client";
import { useEffect, useState } from "react"
import BidCard from "./BidCard"
import CronCard from "./CronCard"
import { useSelector } from "react-redux";

function FloorBids({ timer, duration, auct_id, productId }) {
    const [currentProduct, setCurrentProduct] = useState({})
    const [bidMessageSocket, setBidMessageSocket] = useState([])
    const stateBid = useSelector(state => state.bidLive)
    const [bidsCards, setBidsCards] = useState([])
    const [isAuctionFinished, setIsAuctionFinished] = useState(false)

    useEffect(() => {
        if (productId)
            getCurrentProduct(productId)
        webSocketFlow()
    }, [stateBid, productId, bidMessageSocket])

    const getCurrentProduct = async (product_id) => {
        setBidsCards([])
        try {
            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
            setCurrentProduct(result.data)
            setBidsCards(result.data.Bid)
        } catch (error) {
            console.log("error ao tentar encontrar produto ", error.message)
        }
    }

    const webSocketFlow = () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`)
        // ouvindo mensagem de leilão finalizado
        socket.on(`${auct_id}-bid`, (message) => {
            setBidMessageSocket(message.data)
        })

        socket.on(`${auct_id}-auct-finished`, (message) => {
            console.log('leilão finalizado: ', message);
            setIsAuctionFinished(true)
        })

        // Limpar o WebSocket quando o componente for desmontado
        return () => {
            socket.disconnect()
        }
    }

    useEffect(() => { }, [isAuctionFinished])

    return (
        <div className="lg:w-[28%] w-[99%] lg:h-[94%] min-h-[60vh]
        flex flex-col justify-start items-center
        relative p-2 rounded-[22px] bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-[2px] border-[#e3e3e3] z-[2] gap-1 overflow-y-auto">
            {isAuctionFinished && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
                    <h2 className="text-white text-2xl font-bold">Leilão Finalizado</h2>
                </div>
            )}

            <div className="flex flex-col w-full h-[80%] overflow-y-auto">
                {bidsCards && [...bidsCards].reverse().map((bid, index) => (
                    <BidCard key={index} bid={bid} />
                ))}
            </div>

            <CronCard
                currentTime={timer ? timer : 0}
                duration={duration ? duration : 0}
                auct_id={auct_id ? auct_id : ""}
                initial_value={currentProduct.initial_value}
                currentProduct={currentProduct} />
        </div>
    )
}

export default FloorBids

