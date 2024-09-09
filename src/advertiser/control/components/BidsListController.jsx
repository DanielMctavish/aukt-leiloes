/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BidDetailController from "./BidDetailController";
import ClientBidDetailsController from "./ClientBidDetailsController";

function BidsListController() {
    const [bidMessageSocket, setBidMessageSocket] = useState([]);
    const [selectedBid, setSelectedBid] = useState(null);
    const currentProduct = useSelector(state => state.currentProduct.product);
    const selectedAuction = useSelector(state => state.live.auction);

    useEffect(() => {
        if (currentProduct) {
            getCurrentProduct(currentProduct.id);
        }
    }, [currentProduct, bidMessageSocket]);

    const getCurrentProduct = async (product_id) => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`);
            setBidMessageSocket(result.data.Bid);
        } catch (error) {
            console.log("Error ao tentar encontrar produto: ", error.message);
        }
    };

    useEffect(() => { webSocketFlow() }, [])

    const webSocketFlow = () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        if (selectedAuction) {
            socket.on(`${selectedAuction.id}-bid`, (message) => {
                setBidMessageSocket(message.data);
            });
        }

        // Limpar o WebSocket quando o componente for desmontado
        return () => {
            socket.disconnect();
        };
    };

    const handleBidClick = (bid) => {
        setSelectedBid(bid);
    };

    const handleCloseModal = () => {
        setSelectedBid(null);
    };

    return (
        <div className="flex lg:w-[50%] w-full h-full bg-white p-3 rounded-md">
            <div className="flex flex-col w-full h-full bg-[#eaeaea] rounded-md overflow-hidden shadow-lg shadow-[#12121244]">
                <span className="flex justify-start items-center w-full h-[46px] bg-[#012038] text-white p-2 font-bold text-[14px]">
                    Listagem de lances
                </span>
                <div className="flex flex-col w-full h-[80%] overflow-y-auto p-2">
                    {bidMessageSocket && [...bidMessageSocket].reverse().map((bid, index) => (
                        <div key={index} onClick={() => handleBidClick(bid)}>
                            <BidDetailController bid={bid} />
                        </div>
                    ))}
                </div>
            </div>
            {selectedBid && (
                <ClientBidDetailsController bid={selectedBid} onClose={handleCloseModal} />
            )}
        </div>
    );
}

export default BidsListController;