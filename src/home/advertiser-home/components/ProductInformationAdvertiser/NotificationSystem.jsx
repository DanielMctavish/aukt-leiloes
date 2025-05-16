/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import avatarClientsUrls from '../../../../media/avatar-floor/AvatarclientsUrls';
import ReceiveWebsocketOnFloor from "../../../../a-floor/class/ReceiveWebsocketOnFloor";

// Convertendo o objeto de URLs em um array
const avatares_pessoas = Object.values(avatarClientsUrls);

const NotificationSystem = ({ 
    showOutbidNotification, 
    setShowOutbidNotification, 
    currentProduct,
    auctionId
}) => {
    const [isCurrentWinner, setIsCurrentWinner] = useState(false);
    const [hasPlacedBid, setHasPlacedBid] = useState(false);
    const websocketRef = useRef(null);

    useEffect(() => {
        if (!auctionId) return;

        // Inicializar WebSocket
        websocketRef.current = new ReceiveWebsocketOnFloor(auctionId);

        // Configurar listeners
        websocketRef.current.receiveBidMessage((message) => {
            const newBid = message.data.body || message.data;
            if (newBid && newBid.product_id === currentProduct?.id) {
                checkWinnerStatus();
            }
        });

        websocketRef.current.receiveBidCatalogedMessage((message) => {
            const newBid = message.data.body;
            if (newBid && newBid.product_id === currentProduct?.id) {
                checkWinnerStatus();
            }
        });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auctionId, currentProduct?.id]);

    const checkWinnerStatus = () => {
        setShowOutbidNotification(true);
        if (!currentProduct?.Bid?.length) return;

        try {
            const localStorageClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
            if (!localStorageClient?.id) return;

            // Verificar se o cliente já deu algum lance
            const hasClientBid = currentProduct.Bid.some(bid => bid.client_id === localStorageClient.id);
            setHasPlacedBid(hasClientBid);

            // Ordenar os lances por valor (maior para menor)
            const sortedBids = [...currentProduct.Bid].sort((a, b) => b.value - a.value);
            const highestBid = sortedBids[0];
            
            setIsCurrentWinner(highestBid.client_id === localStorageClient.id);
        } catch (error) {
            console.error("Erro ao verificar vencedor:", error);
        }
    };

    useEffect(() => {
        checkWinnerStatus();
    }, [currentProduct]);

    if (!showOutbidNotification || !currentProduct?.Bid?.length) return null;

    // Pegar o maior lance
    const sortedBids = [...currentProduct.Bid].sort((a, b) => b.value - a.value);
    const highestBid = sortedBids[0];
    const highestBidValue = highestBid.value;
    const highestBidClient = highestBid.client || highestBid.Client;
    const clientAvatar = highestBidClient?.client_avatar || 0;
    const clientNickname = highestBidClient?.nickname || highestBidClient?.name || 'Usuário';

    return (
        <div className={`fixed bottom-4 right-4 z-50 max-w-md w-full bg-[#ffffff88] border-l-4 
            ${isCurrentWinner ? 'border-green-500' : 'border-red-500'} 
            shadow-lg rounded-lg p-4 transform transition-all duration-300 ease-in-out backdrop-blur-[6px]`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="relative">
                        <div className={`absolute -top-1 -left-1 w-3 h-3 ${isCurrentWinner ? 'bg-green-500' : 'bg-red-500'} 
                            rounded-full animate-ping opacity-75`} 
                            style={{ animationDuration: '2s' }}></div>
                        <svg className={`w-6 h-6 ${isCurrentWinner ? 'text-green-500' : 'text-red-500'} relative`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isCurrentWinner ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            )}
                        </svg>
                    </div>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${isCurrentWinner ? 'text-green-800' : 'text-red-800'}`}>
                        {isCurrentWinner ? 'Você está vencendo o leilão!' : 'Seu lance foi superado!'}
                    </h3>
                    <div className={`mt-2 text-sm ${isCurrentWinner ? 'text-green-700' : 'text-red-700'}`}>
                        <div className="flex items-center gap-2">
                            {!isCurrentWinner && (
                                <>
                                    <img 
                                        src={avatares_pessoas[clientAvatar]} 
                                        alt="" 
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="font-medium">{clientNickname}</span>
                                </>
                            )}
                            <p>
                                {isCurrentWinner 
                                    ? `Seu lance de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                        .format(highestBidValue)} está na frente!`
                                    : hasPlacedBid
                                        ? `fez um lance de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                            .format(highestBidValue)}`
                                        : `está vencendo a disputa com ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                            .format(highestBidValue)}`
                                }
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                        <button
                            onClick={() => setShowOutbidNotification(false)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 
                                shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white 
                                hover:bg-gray-50 focus:outline-none"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSystem; 