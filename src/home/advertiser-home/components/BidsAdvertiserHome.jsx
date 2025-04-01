/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useCallback } from 'react';
import io from "socket.io-client";
import axios from 'axios';
import { SmartToy, Person, Close, FilterList } from '@mui/icons-material';

//avatares import
const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

const avatares_pessoas = importAllAvatars();

function BidsAdvertiserHome({ showBids, productId, auctId,setShowBids }) {
    const isMounted = useRef(true);
    const socketRef = useRef(null);
    const [localBids, setLocalBids] = useState([]);
    const [filteredBids, setFilteredBids] = useState([]);
    const [latestBidId, setLatestBidId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loggedClientId, setLoggedClientId] = useState(null);
    const [filterMyBids, setFilterMyBids] = useState(false);

    // Função para ordenar os lances por data mais recente
    const sortBidsByDate = useCallback((bids) => {
        if (!bids || !Array.isArray(bids) || bids.length === 0) return [];

        return [...bids].sort((a, b) => {
            const dateA = a.bidTime || a.created_at;
            const dateB = b.bidTime || b.created_at;

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return new Date(dateB) - new Date(dateA);
        });
    }, []);

    // Função para buscar os lances atualizados do produto
    const fetchProductBids = useCallback(async () => {
        if (!productId) return;

        try {
            setIsLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productId}`
            );

            if (response.data && response.data.Bid) {
                // Ordenar os lances por data mais recente
                const sortedBids = sortBidsByDate(response.data.Bid);
                setLocalBids(sortedBids);

                // Atualizar o ID do lance mais recente
                if (sortedBids.length > 0) {
                    setLatestBidId(sortedBids[0].id);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar lances do produto:', error);
        } finally {
            setIsLoading(false);
        }
    }, [productId, sortBidsByDate]);

    // Aplicar filtro de lances
    useEffect(() => {
        if (!localBids || !loggedClientId) {
            setFilteredBids(localBids);
            return;
        }

        if (filterMyBids) {
            const onlyMyBids = localBids.filter(bid => bid.client_id === loggedClientId);
            setFilteredBids(onlyMyBids);
        } else {
            setFilteredBids(localBids);
        }
    }, [localBids, loggedClientId, filterMyBids]);

    const toggleFilter = () => {
        setFilterMyBids(!filterMyBids);
    };

    const handleClose = () => {
        setShowBids(false);
    }

    // Inicializar com os lances fornecidos e configurar o WebSocket
    useEffect(() => {
        if (!auctId || !productId) {
            return;
        }

        // Pegar o ID do cliente logado
        try {
            const localStorageClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
            if (localStorageClient?.id) {
                setLoggedClientId(localStorageClient.id);
            }
        } catch (error) {
            console.error("Erro ao obter cliente logado:", error);
        }

        fetchProductBids();

        // Conectar ao servidor WebSocket
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socketRef.current = socket;

        // Escutar eventos de novos lances em catálogo
        socket.on(`${auctId}-bid-cataloged`, (message) => {
            const newBid = message.data.body;

            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === productId) ||
                (newBid.product_id === productId))) {
                fetchProductBids();
            }
        });

        // Escutar o evento normal de lance
        socket.on(`${auctId}-bid`, (message) => {
            const newBid = message.data.body || message.data;

            if (newBid && newBid.product_id === productId) {
                fetchProductBids();
            }
        });

        // Limpar ao desmontar
        return () => {
            isMounted.current = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [auctId, productId, fetchProductBids]);

    return (
        <div className={`
            w-full h-full bg-white
            flex flex-col z-[9999]
            transition-all duration-300 ease-in-out
            ${showBids ? 'opacity-100' : 'opacity-0'}
        `}>
            {/* Cabeçalho */}
            <div className="flex justify-between items-center sticky top-0 bg-white p-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Histórico de Lances</h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleFilter}
                        className={`p-2 rounded-full transition-colors ${filterMyBids ? 'bg-[#091a5b] text-[#fff]' : 'hover:bg-gray-100 text-gray-600'}`}
                        title={filterMyBids ? "Mostrar todos os lances" : "Mostrar apenas meus lances"}
                    >
                        <FilterList className="text-inherit" />
                        <span className="sr-only">Filtrar meus lances</span>
                    </button>
                    <button 
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Close className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Indicador de filtro */}
            {filterMyBids && (
                <div className="bg-[#091a5b] text-[#fff] text-sm py-2 px-3 text-center border-b border-purple-100">
                    Exibindo apenas seus lances
                </div>
            )}

            {/* Lista de lances */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 text-zinc-600">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012038]"></div>
                    </div>
                ) : !filteredBids || filteredBids.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-gray-500 p-4">
                        {filterMyBids ? (
                            <>
                                <p>Você não deu nenhum lance neste produto.</p>
                                <button
                                    onClick={toggleFilter}
                                    className="mt-2 text-sm text-purple-600 hover:text-purple-800 underline"
                                >
                                    Ver todos os lances
                                </button>
                            </>
                        ) : (
                            "Nenhum lance realizado ainda."
                        )}
                    </div>
                ) : (
                    filteredBids.map((bid) => {
                        if (!bid) return null;

                        // Verificar se o cliente tem as informações necessárias
                        let clientInfo = bid.client || bid.Client;

                        // Para lances automáticos sem cliente identificado
                        if (bid.cover_auto_limit > 0 && !clientInfo) {
                            clientInfo = {
                                nickname: "Lance Automático",
                                name: "Lance Automático",
                                client_avatar: 0
                            };
                        }

                        if (!clientInfo) return null;

                        // Verificar se o avatar do cliente existe
                        const avatarIndex = clientInfo.client_avatar || 0;
                        const avatarSrc = avatares_pessoas[avatarIndex] || avatares_pessoas[0];

                        // Determinar o nome a ser exibido
                        let clientName = clientInfo.nickname || clientInfo.name || 'Usuário';

                        // Para lances automáticos, adicionar um indicador visual
                        if (bid.cover_auto_limit > 0) {
                            clientName = `🤖 ${clientName}`;
                        }

                        const isLatestBid = bid.id === latestBidId;
                        const isAutoBid = bid.cover_auto_limit > 0;
                        const isLoggedClientBid = bid.client_id === loggedClientId;

                        return (
                            <div className={`
                                w-full 
                                ${isLoggedClientBid 
                                    ? 'bg-white shadow-md h-[40px]' 
                                    : isAutoBid 
                                        ? 'bg-blue-50 h-[35px]' 
                                        : (isLatestBid 
                                            ? 'animate-fadeIn bg-green-50 h-[35px]'  
                                            : 'bg-green-100 h-[35px]')} 
                                rounded-[12px] text-zinc-600 font-bold 
                                flex justify-between items-center p-1 mt-[2px] 
                                transition-all duration-300 text-sm
                                ${isLoggedClientBid 
                                    ? 'shadow-lg transform translate-y-[-2px]' 
                                    : 'shadow-sm'}
                            `}
                                key={bid.id || Math.random().toString()}>
                                <div className="flex items-center">
                                    <img src={avatarSrc} alt=""
                                        className='w-[33px] h-[33px] object-cover rounded-full mr-2' />
                                    {isAutoBid ?
                                        <SmartToy sx={{ fontSize: 20, color: isLoggedClientBid ? '#3B82F6' : (isLatestBid ? '#3B82F6' : '#2563EB') }} /> :
                                        <Person sx={{ 
                                            fontSize: 20, 
                                            color: isLoggedClientBid 
                                                ? '#22C55E' 
                                                : (isLatestBid ? '#22C55E' : '#16A34A') 
                                        }} />
                                    }
                                </div>
                                <span className={isLoggedClientBid ? 'text-green-700 font-bold' : ''}>{clientName}</span>
                                <span className={isLoggedClientBid ? 'text-green-700 font-bold' : (isLatestBid ? 'text-green-700' : 'text-green-600')}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                        .format(bid.value || 0)}
                                </span>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default BidsAdvertiserHome;