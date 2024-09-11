/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from 'socket.io-client';
import BidDetailController from "./BidDetailController";
import ClientBidDetailsController from "./ClientBidDetailsController";
import { setCurrentProduct } from "../../../features/auct/generalAUKSlice";

function BidsListController() {
    const [localBids, setLocalBids] = useState([]);
    const [selectedBid, setSelectedBid] = useState(null);
    const generalAUK = useSelector(state => state.generalAUK);
    const dispatch = useDispatch();
    const newBidsRef = useRef([]);

    const updateBids = useCallback((newBid) => {
        newBidsRef.current = [newBid, ...newBidsRef.current];
        
        setLocalBids(prevBids => {
            const updatedBids = [newBid, ...prevBids];
            // Remove duplicates based on bid ID or another unique identifier
            return updatedBids.filter((bid, index, self) =>
                index === self.findIndex((t) => t.id === bid.id)
            );
        });
        
        if (generalAUK.currentProduct) {
            const updatedProduct = {
                ...generalAUK.currentProduct,
                Bid: [newBid, ...(generalAUK.currentProduct.Bid || [])]
            };
            dispatch(setCurrentProduct(updatedProduct));
        }
    }, [generalAUK.currentProduct, dispatch]);

    useEffect(() => {
        let socket;
        if (generalAUK.auct && generalAUK.status === 'live') {
            socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

            socket.on(`${generalAUK.auct.id}-bid`, (message) => {
                console.log("Received bid:", message);
                if (message && message.data) {
                    updateBids(message.data);
                }
            });

            socket.on(`${generalAUK.auct.id}-auct-finished`, () => {
                console.log("Auction finished");
                // Adicione aqui a lógica para lidar com o fim do leilão
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [generalAUK.auct, generalAUK.status, updateBids]);

    useEffect(() => {
        // Atualizar localBids quando currentProduct mudar
        if (generalAUK.currentProduct && generalAUK.currentProduct.Bid) {
            setLocalBids(prevBids => {
                const combinedBids = [...newBidsRef.current, ...generalAUK.currentProduct.Bid];
                // Remove duplicates and sort by timestamp (assuming there's a timestamp field)
                const uniqueBids = combinedBids.filter((bid, index, self) =>
                    index === self.findIndex((t) => t.id === bid.id)
                ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                newBidsRef.current = []; // Clear the new bids reference
                return uniqueBids;
            });
        }
    }, [generalAUK.currentProduct]);

    const handleBidClick = (bid) => {
        setSelectedBid(bid);
    };

    const handleCloseModal = () => {
        setSelectedBid(null);
    };

    if (!generalAUK.auct || generalAUK.status !== 'live') {
        return <div className="flex items-center justify-center h-full">Nenhum leilão em andamento</div>;
    }

    return (
        <div className="flex lg:w-[50%] w-full h-full bg-white p-3 rounded-md">
            <div className="flex flex-col w-full h-full bg-[#eaeaea] rounded-md overflow-hidden shadow-lg shadow-[#12121244]">
                <span className="flex justify-start items-center w-full h-[46px] bg-[#012038] text-white p-2 font-bold text-[14px]">
                    Listagem de lances - Lote {generalAUK.currentProduct?.lote || "N/A"}
                </span>
                <div className="flex flex-col w-full h-[80%] overflow-y-auto p-2">
                    {localBids.length > 0 ? (
                        localBids.map((bid, index) => (
                            bid && bid.Client ? (
                                <div key={bid.id || index} onClick={() => handleBidClick(bid)}>
                                    <BidDetailController bid={bid} />
                                </div>
                            ) : (
                                <div key={index}>Invalid bid data</div>
                            )
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">Nenhum lance registrado ainda.</div>
                    )}
                </div>
            </div>
            {selectedBid && (
                <ClientBidDetailsController bid={selectedBid} onClose={handleCloseModal} />
            )}
        </div>
    );
}

export default BidsListController;