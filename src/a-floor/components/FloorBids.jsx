/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import io from "socket.io-client";
import BidCard from "./BidCard"
import CronCard from "./CronCard"


function FloorBids({ timer, duration, auct_id, initial_value, currentProduct }) {
    const [bidsCards, setBidsCards] = useState([])

    useEffect(() => {
        webSocketFlow()
    }, [])

    useEffect(() => {
        getBidsByCurrentProduct()
    }, [currentProduct])


    const getBidsByCurrentProduct = () => {

        setBidsCards(currentProduct.Bid)

    }



    const webSocketFlow = () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

        // ouvindo mensagem de pregão ao vivo
        if (auct_id)
            socket.on(`${auct_id.toString()}-bid`, (message) => {

                if (message.data.body.auct_id === auct_id) {
                    console.log("observando mensagem do bid -> ", message.data)

                    // setSocketWinner(false);
                    // setSocketMessage(message);
                    // getCurrentProduct(message.data.body.current_product_id, setCurrentProduct);
                }
            });

        // ouvindo mensagem de leilão finalizado
        // socket.on(`${auct_id}-winner`, (message) => {
        //     console.log("lote vencedor - - - > ", message.data.body);
        //     setTimeout(() => {
        //         setSocketWinner(message);
        //     }, 1200);

        //     setTimeout(() => {
        //         setSocketWinner(false);
        //     }, 3100);
        // });

        // Limpar o WebSocket quando o componente for desmontado
        return () => {
            socket.disconnect();
        };

    }



    return (
        <div className="lg:w-[28%] w-[99%] lg:h-[94%] min-h-[60vh]
        flex flex-col justify-start items-center
        relative p-2 rounded-[22px] bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-[2px] border-[#e3e3e3] z-[2] gap-1 overflow-y-auto">

            <div className="flex flex-col w-full h-[80%] overflow-y-auto">
                {
                    bidsCards &&
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