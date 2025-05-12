/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import { useEffect, useState, useRef, useCallback } from "react"
import CronCard from "./CronCard"
import { useDispatch } from "react-redux"
import { addBidLive } from "../../features/Bids/BidLive"
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls"
import ReceiveWebsocketMessages from "../../advertiser/control/control-usecases/receiveWebsocketMessages"

// Convertendo o objeto de URLs em um array
const avatarIndex = Object.values(avatarClientsUrls);

function FloorBids({ timer, duration, auct_id, productId, winner, isMobile, isAuctionFinished: parentIsAuctionFinished }) {
    const [currentProduct, setCurrentProduct] = useState({})
    const [bidsCards, setBidsCards] = useState([])
    const [showWinner, setShowWinner] = useState(false)
    const [isAuctionFinished, setIsAuctionFinished] = useState(false)
    const [highestBid, setHighestBid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);
    const dispatch = useDispatch();

    // Atualizar o estado local quando a prop do pai mudar
    useEffect(() => {
        if (parentIsAuctionFinished) {
            setIsAuctionFinished(true);
        }
    }, [parentIsAuctionFinished]);

    // Ouvir evento de login bem-sucedido
    useEffect(() => {
        const handleLoginSuccess = () => {
            // Recarregar os dados do produto atual
            if (productId) {
                getCurrentProduct(productId);
            }
        };

        window.addEventListener('clientLoginSuccess', handleLoginSuccess);

        return () => {
            window.removeEventListener('clientLoginSuccess', handleLoginSuccess);
        };
    }, [productId]);

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
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, []);

    // Função para processar um novo lance
    const processNewBid = useCallback((message) => {
        if (!message?.body) return;
        
        const { currentBid, product } = message.body;
        
        // Verificar se o lance é para o produto atual
        if (product?.id === productId) {
            // Criar objeto de lance formatado
            const formattedBid = {
                ...currentBid,
                Client: currentBid.Client,
                Product: [product],
                value: currentBid.value
            };
            
            // Atualizar os cards de lance
            setBidsCards(prevCards => {
                // Verificar se o lance já existe
                const bidExists = prevCards.some(bid => bid.id === formattedBid.id);
                if (bidExists) return prevCards;
                
                const updatedCards = [formattedBid, ...prevCards].slice(0, 10);
                const highest = updatedCards.reduce((max, bid) => 
                    parseFloat(bid.value) > parseFloat(max.value) ? bid : max, 
                    updatedCards[0]
                );
                setHighestBid(highest);
                return updatedCards;
            });

            // Atualizar o produto atual com o novo valor
            setCurrentProduct(prevProduct => ({
                ...prevProduct,
                real_value: currentBid.value
            }));

            // Dispatch para o Redux se necessário
            dispatch(addBidLive({
                value: currentBid.value,
                product_id: product.id
            }));
        }
    }, [productId, dispatch]);

    // Setup do WebSocket usando ReceiveWebsocketMessages
    useEffect(() => {
        isMounted.current = true;
        
        if (!auct_id || !productId) return;

        const generalAUK = { auct: { id: auct_id } };
        const receiveWebsocketMessages = new ReceiveWebsocketMessages(generalAUK);

        // Configurar receptor de mensagens de lance
        receiveWebsocketMessages.receiveBidMessage((message) => {
            processNewBid(message);
        });

        // Configurar receptor de mensagens de lance catalogado
        receiveWebsocketMessages.receiveBidCatalogedMessage((message) => {
            processNewBid(message);
        });

        // Configurar receptor de mensagens de fim de leilão
        receiveWebsocketMessages.receiveAuctionFinishedMessage(() => {
            if (isMounted.current) {
                setIsAuctionFinished(true);
                setTimeout(() => {
                    if (isMounted.current) {
                        setShowWinner(false);
                    }
                }, 5000);
            }
        });
        
        // Carregar informações iniciais
        if (productId) {
            getCurrentProduct(productId);
            setShowWinner(false);
        }
        
        return () => {
            isMounted.current = false;
            receiveWebsocketMessages.disconnect();
        };
    }, [auct_id, productId, getCurrentProduct, processNewBid]);

    // Lidar com a exibição do vencedor
    useEffect(() => {
        if (winner) {
            setShowWinner(true);
            
            const timeoutId = setTimeout(() => {
                if (isMounted.current) {
                    setShowWinner(false);
                }
            }, 3000);
            
            return () => clearTimeout(timeoutId);
        }
    }, [winner]);

    const handleNewBid = (newBid) => {
        processNewBid(newBid);
    };

    // Ouvir o evento quickBid para dar lance rápido
    useEffect(() => {
        const handleQuickBid = async (event) => {
            const { product_id, auction_id } = event.detail;
            
            if (product_id !== currentProduct.id || auction_id !== auct_id) {
                return; // Ignora se não for para este produto/leilão
            }
            
            // Buscar a versão mais atualizada do produto antes de dar o lance
            try {
                const productResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`
                );
                
                const updatedProduct = productResponse.data;
                const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
                
                if (!currentSession) {
                    console.error("Usuário não está logado");
                    window.dispatchEvent(new CustomEvent('quickBidError'));
                    return;
                }
                
                // Calcular valor do próximo lance
                const currentValue = updatedProduct.real_value || updatedProduct.initial_value;
                const incrementValue = getIncrementValue(currentValue);
                const bidValue = currentValue + incrementValue;
                
                const bidPayload = {
                    value: parseFloat(bidValue),
                    client_id: currentSession.id,
                    product_id: updatedProduct.id,
                    auct_id: auct_id,
                    Client: currentSession,
                    Product: updatedProduct
                };
                
                // Realizar o lance
                const response = await axios.post(
                    `${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct?bidInCataloge=false`,
                    bidPayload,
                    {
                        headers: {
                            'Authorization': `Bearer ${currentSession.token}`
                        }
                    }
                );
                
                if (response.status === 200) {
                    const newBid = response.data?.body || response.data;
                    
                    if (newBid) {
                        dispatch(addBidLive({
                            value: bidValue,
                            product_id: updatedProduct.id
                        }));
                        
                        handleNewBid(newBid);
                        
                        // Disparar evento de sucesso
                        window.dispatchEvent(new CustomEvent('quickBidSuccess'));
                    } else {
                        window.dispatchEvent(new CustomEvent('quickBidError'));
                    }
                } else {
                    window.dispatchEvent(new CustomEvent('quickBidError'));
                }
            } catch (error) {
                console.error("Erro ao dar lance rápido:", error);
                window.dispatchEvent(new CustomEvent('quickBidError'));
            }
        };
        
        window.addEventListener('quickBid', handleQuickBid);
        
        return () => {
            window.removeEventListener('quickBid', handleQuickBid);
        };
    }, [auct_id, currentProduct.id, dispatch, handleNewBid]);
    
    // Função para calcular o incremento do lance
    const getIncrementValue = (value) => {
        const baseValue = value || currentProduct.initial_value;
        
        if (baseValue <= 600) {
            return 20;
        } else if (baseValue <= 1200) {
            return 24; // 20% a mais que 20
        } else if (baseValue <= 3000) {
            return 30; // 50% a mais que 20
        } else if (baseValue <= 6000) {
            return 40; // 100% a mais que 20
        } else if (baseValue <= 12000) {
            return 60; // 200% a mais que 20
        } else {
            return Math.ceil(baseValue * 0.01); // 1% do valor para valores muito altos
        }
    };

    return (
        <div className={`            ${isMobile 
                ? 'w-full h-full flex flex-col bg-[#012038]/90' // Mobile: layout vertical com fundo escuro
                : 'min-w-[45vh] lg:h-[94%] min-h-[80vh] flex flex-col lg:mr-4' // Adicionado margin-right na versão desktop
            }
            justify-start items-center relative p-3 lg:p-4 
            rounded-2xl backdrop-blur-lg 
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
            border border-white/20 z-[2] gap-3
        `}>
            {/* Se for mobile, mostra CronCard no topo e lista de lances embaixo */}
            {isMobile ? (
                <>
                    <div className="w-full">
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
                    </div>

                    <div className="w-full flex-1 overflow-y-auto space-y-2 
                        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        ) : bidsCards.length > 0 ? (
                            bidsCards.map((bid, index) => {
                                const isWinner = isAuctionFinished && winner && bid.Client.id === winner.id;
                                const isHighestBid = !isAuctionFinished && highestBid && bid.id === highestBid.id;
                                
                                return (
                                    <div
                                        key={bid.id || index}
                                        className={`
                                            w-full flex items-center justify-between p-2 rounded-xl text-sm
                                            transition-all duration-300 relative overflow-hidden
                                            ${isWinner 
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/20' 
                                                : isHighestBid
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20'
                                                    : 'bg-white/10 hover:bg-white/20'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`
                                                w-8 h-8 rounded-full overflow-hidden border-2
                                                ${isWinner 
                                                    ? 'border-white shadow-lg' 
                                                    : isHighestBid
                                                        ? 'border-white'
                                                        : 'border-white/50'
                                                }
                                            `}>
                                                <img
                                                    src={avatarIndex[bid.Client.client_avatar]}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">
                                                    {bid.Client.nickname}
                                                </span>
                                                <span className="text-xs text-white/70">
                                                    {new Date(bid.created_at).toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-base font-bold text-white">
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
                </>
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
