/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import ReceiveWebsocketMessages from "../control-usecases/receiveWebsocketMessages";
import BidDetailController from "./BidDetailController";
import ClientBidDetailsController from "./ClientBidDetailsController";
import {
    Gavel,
    Warning,
    Timer,
    People as Users
} from "@mui/icons-material";
import axios from "axios";

function BidsListController() {
    const [allBids, setAllBids] = useState([]);
    const [selectedBid, setSelectedBid] = useState(null);
    const generalAUK = useSelector(state => state.generalAUK);
    const isMounted = useRef(true);

    // Função para buscar os lances atuais do produto
    const fetchCurrentProductBids = async (productId) => {
        if (!productId) return;

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productId}`
            );

            if (response.data && response.data.Bid && isMounted.current) {
                // Ordenar os lances do mais recente para o mais antigo
                const sortedBids = [...response.data.Bid].sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                );
                setAllBids(sortedBids);
            }
        } catch (error) {
            console.error("Erro ao buscar lances do produto:", error);
        }
    };

    // Atualiza quando o produto atual mudar no Redux
    useEffect(() => {
        if (generalAUK.currentProduct?.id) {
            fetchCurrentProductBids(generalAUK.currentProduct.id);
        }

        if (generalAUK.currentTimer === 0) {
            setAllBids([]);
        }
    }, [generalAUK.currentProduct]);

    // Configurar websocket quando o leilão estiver ativo
    useEffect(() => {
        isMounted.current = true;

        if (generalAUK.auct && generalAUK.auct.id) {
            const receiveWebsocketMessages = new ReceiveWebsocketMessages(generalAUK);

            receiveWebsocketMessages.receiveBidMessage((message) => {
                if (message.data?.body && generalAUK.currentProduct &&
                    message.data.body.product_id === generalAUK.currentProduct.id) {
                    fetchCurrentProductBids(generalAUK.currentProduct.id);
                }
            });

            receiveWebsocketMessages.receiveBidCatalogedMessage((message) => {
                if (message.data?.body && generalAUK.currentProduct &&
                    message.data.body.product_id === generalAUK.currentProduct.id) {
                    fetchCurrentProductBids(generalAUK.currentProduct.id);
                }
            });

            receiveWebsocketMessages.receiveAuctionFinishedMessage((message) => {
                if (message.data) {
                    setAllBids([]);
                }
            });

            // Cleanup function
            return () => {
                isMounted.current = false;
                receiveWebsocketMessages.disconnect();
            };
        }
    }, [generalAUK.auct]);

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