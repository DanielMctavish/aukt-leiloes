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

function FloorBids({ timer, duration, auct_id, productId, winner, isMobile }) {
    const [currentProduct, setCurrentProduct] = useState({})
    const [bidsCards, setBidsCards] = useState([])
    const [showWinner, setShowWinner] = useState(false)
    const [isAuctionFinished, setIsAuctionFinished] = useState(false)
    const socketRef = useRef(null);
    const winnerTimeoutRef = useRef(null);
    const [highestBid, setHighestBid] = useState(null);

    const updateBidsCards = useCallback((newBid) => {
        if (newBid && newBid.Client) {
            setBidsCards(prevCards => {
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

    useEffect(() => {
        if (productId) {
            getCurrentProduct(productId)
            setShowWinner(false)
            setIsAuctionFinished(false)
        }
        webSocketFlow()

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
            if (winnerTimeoutRef.current) {
                clearTimeout(winnerTimeoutRef.current)
            }
        }
    }, [productId])

    useEffect(() => {
        if (winner) {
            setShowWinner(true)
            winnerTimeoutRef.current = setTimeout(() => {
                setShowWinner(false)
            }, 3000)
        }
    }, [winner])

    useEffect(() => { }, [bidsCards])

    const getCurrentProduct = async (product_id) => {
        setBidsCards([])
        const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
        setCurrentProduct(result.data)
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
        }
    }

    const webSocketFlow = () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`)
        socketRef.current = socket;

        socket.on(`${auct_id}-bid`, (message) => {
            const newBid = message.data;
            getCurrentProduct(productId)
            updateBidsCards(newBid);
        })

        socket.on(`${auct_id}-playing-auction`, (message) => {
            if (message.data.body.product.id !== productId) {
                setShowWinner(false)
                setIsAuctionFinished(false)
                getCurrentProduct(message.data.body.product.id)
            }
        })

        socket.on(`${auct_id}-auct-finished`, () => {
            setIsAuctionFinished(true)
        })
    }

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
                        {bidsCards.map((bid, index) => {
                            const isWinner = isAuctionFinished && winner && bid.Client.id === winner.id;
                            const isHighestBid = !isAuctionFinished && highestBid && bid.id === highestBid.id;
                            
                            return (
                                <div
                                    key={index}
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
                        })}
                    </div>

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
                </>
            )}
        </div>
    )
}

export default FloorBids