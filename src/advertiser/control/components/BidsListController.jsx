/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from 'socket.io-client';
import BidDetailController from "./BidDetailController";
import ClientBidDetailsController from "./ClientBidDetailsController";
import { 
    Gavel, 
    Warning, 
    Timer, 
    People as Users 
} from "@mui/icons-material";

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

        if (generalAUK.currentTimer === 0) {
            setAllBids([]);
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
            <div className="flex flex-col justify-center items-center lg:w-[50%] w-full h-full 
                bg-white p-8 rounded-xl shadow-lg gap-4">
                <Gavel className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500 text-lg font-medium">Nenhum leilão em andamento</p>
                <p className="text-gray-400 text-sm text-center">
                    Aguarde o início do próximo leilão para visualizar os lances
                </p>
            </div>
        )
    }

    return (
        <div className="flex lg:w-[50%] w-full h-full bg-white p-3 rounded-xl shadow-lg">
            <div className="flex flex-col w-full h-full bg-gray-50 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#012038] text-white">
                    {/* Header Principal */}
                    <div className="flex justify-between items-center w-full p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Gavel sx={{ fontSize: 20 }} />
                            </div>
                            <div>
                                <h2 className="font-medium">Listagem de Lances</h2>
                                <p className="text-sm text-white/70">
                                    Lote {generalAUK.currentProduct?.lote || "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                                <Users sx={{ fontSize: 16 }} />
                                <span className="text-sm">{allBids?.length || 0} lances</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                                <Timer sx={{ fontSize: 16 }} />
                                <span className="text-sm">Ao vivo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Lances */}
                <div className="flex flex-col w-full h-[calc(100%-120px)] overflow-y-auto p-4 gap-3">
                    {allBids?.length > 0 ? (
                        allBids.map((bid, index) => (
                            bid && bid.Client ? (
                                <div
                                    key={bid.id || index}
                                    onClick={() => handleBidClick(bid)}
                                    className="cursor-pointer transform transition-all duration-200 
                                        hover:translate-x-1 hover:shadow-md"
                                >
                                    <BidDetailController bid={bid} />
                                </div>
                            ) : (
                                <div key={index} 
                                    className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 
                                        flex items-center gap-2 animate-fade-in"
                                >
                                    <Warning sx={{ fontSize: 20 }} />
                                    <span className="font-medium">Dados do lance inválidos</span>
                                </div>
                            )
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Gavel sx={{ fontSize: 32 }} />
                            </div>
                            <p className="font-medium">Nenhum lance registrado</p>
                            <p className="text-sm text-gray-400 text-center">
                                Os lances aparecerão aqui quando forem realizados
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalhes */}
            {selectedBid && (
                <ClientBidDetailsController
                    bid={selectedBid}
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
}

export default BidsListController;