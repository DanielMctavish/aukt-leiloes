/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import ReceiveWebsocketOnFloor from "../../../../a-floor/class/ReceiveWebsocketOnFloor";
import formatCurrency from "../../../../utils/formatCurrency";
import avatarClientsUrls from '../../../../media/avatar-floor/AvatarclientsUrls';

// Convertendo o objeto de URLs em um array
const avatares_pessoas = Object.values(avatarClientsUrls);

// Componente para mostrar a lista de lances
const BidsList = ({ showBids, children, currentProduct, auctionId }) => {
    const [bids, setBids] = useState([]);
    const websocketRef = useRef(null);
    const bidsContainerRef = useRef(null);

    useEffect(() => {
        if (!auctionId) return;

        // Inicializar WebSocket
        websocketRef.current = new ReceiveWebsocketOnFloor(auctionId);

        // Configurar listener para lances em catálogo
        websocketRef.current.receiveBidCatalogedMessage((message) => {
            const { body } = message.data;
            if (body?.currentBid && body?.product?.id === currentProduct?.id) {
                updateBidsList(body.currentBid);
            }
        });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auctionId, currentProduct?.id]);

    useEffect(() => {
        // Atualizar lista de lances quando o produto mudar
        if (currentProduct?.Bid) {
            setBids(currentProduct.Bid.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } else {
            setBids([]); // Limpar lances se não houver produto
        }
    }, [currentProduct]);

    useEffect(() => {
        // Scroll para o último lance quando novos lances forem adicionados
        if (bidsContainerRef.current && showBids) {
            bidsContainerRef.current.scrollTop = 0;
        }
    }, [bids, showBids]);

    const updateBidsList = (newBid) => {
        setBids(prevBids => {
            // Verificar se o lance já existe
            const bidExists = prevBids.some(bid => bid.id === newBid.id);
            if (bidExists) return prevBids;

            // Adicionar o novo lance e ordenar por data
            const updatedBids = [newBid, ...prevBids];
            return updatedBids.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className={`
            fixed right-0 top-0 h-full
            w-[400px]
            transform transition-all duration-300 ease-in-out
            ${showBids ? 'translate-x-0' : 'translate-x-[100%]'}
            z-20 bg-white shadow-2xl flex flex-col
        `}>
            {children}
            
            <div 
                ref={bidsContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
                {bids.map((bid, index) => {
                    const client = bid.client || bid.Client;
                    const avatarIndex = client?.client_avatar || 0;
                    
                    return (
                        <div 
                            key={bid.id || index}
                            className="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100 
                                hover:border-blue-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <img 
                                    src={avatares_pessoas[avatarIndex]} 
                                    alt="" 
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-gray-800">
                                            {client?.nickname || client?.name || 'Usuário'}
                                        </span>
                                        <span className="text-sm font-bold text-green-600">
                                            {formatCurrency(bid.value)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-500">
                                            {formatDate(bid.created_at)}
                                        </span>
                                        {bid.cover_auto && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                Lance Automático
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {bids.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">
                            Nenhum lance registrado ainda
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BidsList; 