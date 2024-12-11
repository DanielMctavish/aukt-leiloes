/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from 'socket.io-client';
import BidDetailController from "./BidDetailController";
import ClientBidDetailsController from "./ClientBidDetailsController";

function BidsListController() {
    const [allBids, setAllBids] = useState([]);
    const [selectedBid, setSelectedBid] = useState(null);
    // const [currentProduct, setCurrentProduct] = useState(null);
    const generalAUK = useSelector(state => state.generalAUK);
    const socketRef = useRef(null);

    // Atualiza o produto atual quando o Redux mudar (de 1 em 1 segundo)
    useEffect(() => {
        if (generalAUK.currentProduct?.id) {
            
            if (generalAUK.currentProduct.Bid && allBids.length === 0) {
                setAllBids(generalAUK.currentProduct.Bid);
            }

        }
    }, [generalAUK.currentProduct]);

    // Configurar websocket apenas quando tivermos o produto atual
    useEffect(() => {
        const setupSocket = () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }

            socketRef.current = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

            socketRef.current.on(`${generalAUK.auct.id}-bid`, async (message) => {
                try {
                    setAllBids(message.data.body.Product[0].Bid)
                } catch (error) {
                    // console.error("Erro ao buscar lances:", error);
                }
            });

            socketRef.current.on(`${generalAUK.auct.id}-auct-finished`, () => {
                // Adicione aqui a lógica para lidar com o fim do leilão
            });
        };

        if (generalAUK.auct && generalAUK.status === 'live') {
            // console.log("Configurando socket com produto:", currentProduct);
            setupSocket();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [generalAUK.auct, generalAUK.status]);


    const handleBidClick = (bid) => {
        setSelectedBid(bid);
    };

    const handleCloseModal = () => {
        setSelectedBid(null);
    };

    if (!generalAUK.auct || generalAUK.status !== 'live') {
        return (
            <div className="flex justify-center items-center lg:w-[50%] w-full h-full bg-white p-3 rounded-md">
                Nenhum leilão em andamento
            </div>
        )
    }

    return (
        <div className="flex lg:w-[50%] w-full h-full bg-white p-3 rounded-md">
            <div className="flex flex-col w-full h-full bg-[#eaeaea] rounded-md overflow-hidden shadow-lg shadow-[#12121244]">
                <span className="flex justify-start items-center w-full h-[46px] bg-[#012038] text-white p-2 font-bold text-[14px]">
                    Listagem de lances - Lote {generalAUK.currentProduct?.lote || "N/A"}
                </span>
                <div className="flex flex-col w-full h-[80%] overflow-y-auto p-2 gap-2">
                    {allBids?.length > 0 ? (
                        allBids.map((bid, index) => (
                            bid && bid.Client ? (
                                <div
                                    key={bid.id || index}
                                    onClick={() => handleBidClick(bid)}
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    <BidDetailController bid={bid} />
                                </div>
                            ) : (
                                <div key={index} className="p-2 bg-red-50 text-red-600 rounded">
                                    Dados do lance inválidos
                                </div>
                            )
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">Nenhum lance registrado ainda.</div>
                    )}
                </div>
            </div>
            {selectedBid && (
                <ClientBidDetailsController
                    bid={selectedBid}
                    onClose={handleCloseModal} />
            )}
        </div>
    );
}

export default BidsListController;