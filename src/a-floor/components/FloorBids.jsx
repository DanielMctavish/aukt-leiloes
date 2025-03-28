/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import io from "socket.io-client";
import { useEffect, useState, useRef, useCallback } from "react"
import CronCard from "./CronCard"
const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

const avatarIndex = importAllAvatars()

function FloorBids({ timer, duration, auct_id, productId, winner, isMobile, isAuctionFinished: parentIsAuctionFinished }) {
    const [currentProduct, setCurrentProduct] = useState({})
    const [bidsCards, setBidsCards] = useState([])
    const [showWinner, setShowWinner] = useState(false)
    const [isAuctionFinished, setIsAuctionFinished] = useState(false)
    const socketRef = useRef(null);
    const winnerTimeoutRef = useRef(null);
    const [highestBid, setHighestBid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);
    const messagesProcessedRef = useRef(new Set());
    const instanceId = useRef(`floor_client_${Math.random().toString(36).substring(2, 9)}`);

    // Atualizar o estado local quando a prop do pai mudar
    useEffect(() => {
        if (parentIsAuctionFinished) {
            setIsAuctionFinished(true);
        }
    }, [parentIsAuctionFinished]);

    // Função para evitar processamento duplicado de mensagens
    const processMessageOnce = (messageKey, message, handler) => {
        // Se a mensagem já tiver um timestamp, use-o como parte da chave
        const timestamp = message?.data?.body?.timestamp || "";
        const fullKey = `${messageKey}-${timestamp}`;
        
        if (!messagesProcessedRef.current.has(fullKey)) {
            messagesProcessedRef.current.add(fullKey);
            // Limitar o tamanho do conjunto para evitar vazamentos de memória
            if (messagesProcessedRef.current.size > 1000) {
                // Converter para array, remover os primeiros 500 itens, e voltar para conjunto
                const messagesArray = Array.from(messagesProcessedRef.current);
                messagesProcessedRef.current = new Set(messagesArray.slice(500));
            }
            handler(message);
        }
    };

    // Função para obter informações do produto atual
    const getCurrentProduct = useCallback(async (product_id) => {
        if (!product_id || !isMounted.current) return;
        
        setIsLoading(true);
        try {
            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`);
            
            if (isMounted.current) {
                setCurrentProduct(result.data);
                
                if (result.data.Bid) {
                    const initialBids = result.data.Bid.slice(-10).reverse();
                    setBidsCards(initialBids);
                    
                    // Encontra o maior lance entre os lances iniciais
                    if (initialBids.length > 0) {
                        const highest = initialBids.reduce((max, bid) => 
                            parseFloat(bid.value) > parseFloat(max.value) ? bid : max,
                            initialBids[0]
                        );
                        setHighestBid(highest);
                    }
                } else {
                    setBidsCards([]);
                    setHighestBid(null);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Função para atualizar os cards de lances com um novo lance
    const updateBidsCards = useCallback((newBid) => {
        if (!isMounted.current) return;
        
        if (newBid && newBid.Client) {
            setBidsCards(prevCards => {
                // Verificar se o lance já existe
                const bidExists = prevCards.some(bid => bid.id === newBid.id);
                if (bidExists) return prevCards;
                
                const updatedCards = [newBid, ...prevCards].slice(0, 10);
                const highest = updatedCards.reduce((max, bid) => 
                    parseFloat(bid.value) > parseFloat(max.value) ? bid : max, 
                    updatedCards[0]
                );
                setHighestBid(highest);
                return updatedCards;
            });
        }
    }, []);

    // Setup do WebSocket
    const setupWebSocket = useCallback(() => {
        if (!auct_id || !productId || !isMounted.current) return;
        
        // Limpar conexão anterior se existir
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        
        // Conectar ao servidor WebSocket com configurações avançadas
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`, {
            transports: ['websocket'],
            upgrade: false,
            reconnection: true, 
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            query: {
                instance_id: instanceId.current,
                client_type: "floor_bids",
                auct_id: auct_id
            }
        });
        
        socketRef.current = socket;
        
        // Entrar explicitamente na sala do leilão
        socket.emit('join-auction-room', { 
            auct_id: auct_id,
            instance_id: instanceId.current,
            client_type: "floor_bids"
        });
        
        // Evento de conexão para debug
        socket.on('connect', () => {
            console.log('WebSocket connected for floor bids');
        });

        // 1. Evento principal de lance
        socket.on(`${auct_id}-bid`, (message) => {
            console.log("Floor Bids - Bid event received:", message);
            
            processMessageOnce(`${auct_id}-bid`, message, (msg) => {
                // Extrair o lance da estrutura correta
                const newBid = msg.data.body || msg.data;
                
                // Verificar se o lance é para o produto atual
                if (newBid && (newBid.product_id === productId || 
                    (newBid.Product && newBid.Product[0] && newBid.Product[0].id === productId))) {
                    // Buscar todos os lances atualizados do produto
                    getCurrentProduct(productId);
                }
            });
        });
        
        // 2. Evento de lance catalogado (para compatibilidade)
        socket.on(`${auct_id}-bid-cataloged`, (message) => {
            console.log("Floor Bids - Cataloged bid event received:", message);
            
            processMessageOnce(`${auct_id}-bid-cataloged`, message, (msg) => {
                // Extrair o lance da estrutura correta
                const newBid = msg.data.body;
                
                // Verificar se o lance é para o produto atual
                if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === productId) || 
                    (newBid.product_id === productId))) {
                    // Buscar todos os lances atualizados do produto
                    getCurrentProduct(productId);
                }
            });
        });
        
        // 3. Evento de novo produto no leilão
        socket.on(`${auct_id}-playing-auction`, (message) => {
            console.log("Floor Bids - New product event received:", message);
            
            processMessageOnce(`${auct_id}-playing-auction`, message, (msg) => {
                if (msg.data.body.product.id !== productId) {
                    setShowWinner(false);
                    setIsAuctionFinished(false);
                    getCurrentProduct(msg.data.body.product.id);
                }
            });
        });
        
        // 4. Evento de fim de leilão
        socket.on(`${auct_id}-auct-finished`, () => {
            console.log("Floor Bids - Auction finished event received");
            if (isMounted.current) {
                setIsAuctionFinished(true);
            }
        });
        
        // 5. Evento de reconexão
        socket.on('reconnect', () => {
            console.log("Floor Bids - Reconnected to server");
            socket.emit('join-auction-room', { 
                auct_id: auct_id,
                instance_id: instanceId.current,
                client_type: "floor_bids"
            });
        });
        
    }, [auct_id, productId, getCurrentProduct]);

    // Inicializar ao montar o componente
    useEffect(() => {
        isMounted.current = true;
        
        return () => {
            isMounted.current = false;
            
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            
            if (winnerTimeoutRef.current) {
                clearTimeout(winnerTimeoutRef.current);
            }
        };
    }, []);

    // Atualizar quando o produto ou leilão mudarem
    useEffect(() => {
        if (productId) {
            getCurrentProduct(productId);
            setShowWinner(false);
            setIsAuctionFinished(false);
            setupWebSocket();
        }
    }, [productId, auct_id, getCurrentProduct, setupWebSocket]);

    // Lidar com a exibição do vencedor
    useEffect(() => {
        if (winner) {
            setShowWinner(true);
            
            if (winnerTimeoutRef.current) {
                clearTimeout(winnerTimeoutRef.current);
            }
            
            winnerTimeoutRef.current = setTimeout(() => {
                if (isMounted.current) {
                    setShowWinner(false);
                }
            }, 3000);
        }
    }, [winner]);

    const handleNewBid = (newBid) => {
        updateBidsCards(newBid);
    };

    return (
        <div className={`
            ${isMobile 
                ? 'w-full flex-col-reverse' // Mobile: inverte a ordem dos elementos
                : 'min-w-[49vh] lg:h-[94%] min-h-[80vh] flex flex-col'
            }
            justify-start items-center relative p-4 
            rounded-[22px] bg-white/10 backdrop-blur-lg 
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
            border border-white/20 z-[2] gap-3
        `}>
            {/* Se for mobile, mostra apenas o CronCard */}
            {isMobile ? (
                <CronCard
                    currentTime={timer ? timer : 0}
                    duration={duration ? duration : 0}
                    auct_id={auct_id ? auct_id : ""}
                    initial_value={currentProduct.initial_value}
                    real_value={currentProduct.real_value}
                    currentProduct={currentProduct}
                    onNewBid={handleNewBid}
                    isAuctionFinished={isAuctionFinished}
                />
            ) : (
                // Versão desktop mantém todo o conteúdo original
                <>
                    {isAuctionFinished && (
                        <div className="w-full p-4 bg-gradient-to-r from-red-600 to-red-700 
                            rounded-xl mb-4 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                            <h2 className="text-xl font-bold text-white mb-2">
                                Leilão Finalizado
                            </h2>
                            <p className="text-lg text-white/90">
                                Obrigado pela sua participação!
                            </p>
                        </div>
                    )}

                    {showWinner && winner && (
                        <div className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 
                            rounded-xl mb-4 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                            <h2 className="text-xl font-bold text-white mb-3">
                                Produto Arrematado
                            </h2>
                            <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                <img
                                    src={avatarIndex[winner.client_avatar]}
                                    alt="Winner avatar"
                                    className="w-14 h-14 rounded-full mr-4 border-2 border-white/50 shadow-md"
                                />
                                <p className="text-lg text-white font-medium">
                                    {winner.nickname}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="w-full flex-grow overflow-y-auto space-y-2 max-h-[60vh]
                        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent 
                        pr-2">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                            </div>
                        ) : bidsCards.length > 0 ? (
                            bidsCards.map((bid, index) => {
                                const isWinner = isAuctionFinished && winner && bid.Client.id === winner.id;
                                const isHighestBid = !isAuctionFinished && highestBid && bid.id === highestBid.id;
                                
                                return (
                                    <div
                                        key={bid.id || index}
                                        className={`
                                            w-full flex items-center justify-between p-3 rounded-xl
                                            transition-all duration-300 relative overflow-hidden
                                            ${isWinner 
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/20' 
                                                : isHighestBid
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20'
                                                    : 'bg-white hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {(isWinner || isHighestBid) && (
                                            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium
                                                bg-white/20 backdrop-blur-sm rounded-bl-xl text-white">
                                                {isWinner ? 'Vencedor' : 'Maior Lance'}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-12 h-12 rounded-full overflow-hidden border-2
                                                ${isWinner 
                                                    ? 'border-white shadow-lg' 
                                                    : isHighestBid
                                                        ? 'border-white'
                                                        : 'border-gray-200'
                                                }
                                            `}>
                                                <img
                                                    src={avatarIndex[bid.Client.client_avatar]}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`
                                                    font-medium
                                                    ${isWinner || isHighestBid ? 'text-white' : 'text-gray-800'}
                                                `}>
                                                    {bid.Client.nickname}
                                                </span>
                                                <span className={`
                                                    text-sm
                                                    ${isWinner || isHighestBid ? 'text-white/80' : 'text-gray-500'}
                                                `}>
                                                    {new Date(bid.created_at).toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`
                                            text-lg font-bold
                                            ${isWinner || isHighestBid 
                                                ? 'text-white' 
                                                : 'text-gray-800'
                                            }
                                        `}>
                                            R$ {parseInt(bid.value).toFixed(2)}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-white/70">
                                <p>Nenhum lance registrado ainda</p>
                            </div>
                        )}
                    </div>

                    <CronCard
                        currentTime={timer ? timer : 0}
                        duration={duration ? duration : 0}
                        auct_id={auct_id ? auct_id : ""}
                        initial_value={currentProduct.initial_value}
                        real_value={currentProduct.real_value}
                        reserve_value = {currentProduct.reserve_value}
                        currentProduct={currentProduct}
                        onNewBid={handleNewBid}
                        isAuctionFinished={isAuctionFinished}
                    />
                </>
            )}
        </div>
    )
}

export default FloorBids