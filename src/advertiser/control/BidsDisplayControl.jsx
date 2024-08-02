/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import BidCard from "../../a-floor/components/BidCard";

function BidsDisplayControl({ auct_id, currentProduct }) {
    const [bidsCards, setBidsCards] = useState([])
    const [localProduct, setLocalProduct] = useState({})

    useEffect(() => {
        //setBidsCards([])
        if (auct_id)
            webSocketFlow()

        if (!localProduct) {
            setLocalProduct(currentProduct)
            setBidsCards(currentProduct.Bid)
            getCurrentProduct(currentProduct.id)
        }

    }, [auct_id, currentProduct])

    useEffect(() => { }, [bidsCards])

    const webSocketFlow = () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

        socket.on(`${auct_id}-bid`, (message) => {
            console.log("mensagem de lance recebida ->", message.data.body.product_id)
            getCurrentProduct(message.data.body.product_id)
        });

        // Limpar o WebSocket quando o componente for desmontado
        return () => {
            socket.disconnect();
        };
    }
    const getCurrentProduct = async (product_id) => {
        setBidsCards([])
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
                .then(result => {
                    setBidsCards(result.data.Bid);
                })
        } catch (error) {
            console.log("error ao tentar encontrar produto ", error.message);
        }
    }

    return (
        <section className="w-[60%] h-full bg-[#E9E9E9] 
                        rounded-md shadow-lg shadow-[#15151532]">
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
        </section>
    )
}

export default BidsDisplayControl;