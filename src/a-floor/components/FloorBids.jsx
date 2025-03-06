/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import io from "socket.io-client";
import { useEffect, useState, useRef, useCallback } from "react"
import CronCard from "./CronCard"
import avatar_01 from "../../media/avatar-floor/avatar_01.png"
import avatar_02 from "../../media/avatar-floor/avatar_02.png"
import avatar_03 from "../../media/avatar-floor/avatar_03.png"
import avatar_04 from "../../media/avatar-floor/avatar_04.png"
import avatar_05 from "../../media/avatar-floor/avatar_05.png"
import avatar_06 from "../../media/avatar-floor/avatar_06.png"
import avatar_07 from "../../media/avatar-floor/avatar_07.png"
import avatar_08 from "../../media/avatar-floor/avatar_08.png"
import avatar_09 from "../../media/avatar-floor/Avatar_09.png";
import avatar_10 from "../../media/avatar-floor/Avatar_10.png";
import avatar_11 from "../../media/avatar-floor/Avatar_11.png";
import avatar_12 from "../../media/avatar-floor/Avatar_12.png";
import avatar_13 from "../../media/avatar-floor/Avatar_13.png";
import avatar_14 from "../../media/avatar-floor/Avatar_14.png";
import avatar_15 from "../../media/avatar-floor/Avatar_15.png";
import avatar_16 from "../../media/avatar-floor/Avatar_16.png";
import avatar_17 from "../../media/avatar-floor/Avatar_17.png";
import avatar_18 from "../../media/avatar-floor/Avatar_18.png";
import avatar_19 from "../../media/avatar-floor/Avatar_19.png";
import avatar_20 from "../../media/avatar-floor/Avatar_20.png";
import avatar_21 from "../../media/avatar-floor/Avatar_21.png";
import avatar_22 from "../../media/avatar-floor/Avatar_22.png";
import avatar_23 from "../../media/avatar-floor/Avatar_23.png";
import avatar_24 from "../../media/avatar-floor/Avatar_24.png";
import avatar_25 from "../../media/avatar-floor/Avatar_25.png";
import avatar_26 from "../../media/avatar-floor/Avatar_26.png";
import avatar_27 from "../../media/avatar-floor/Avatar_27.png";
import avatar_28 from "../../media/avatar-floor/Avatar_28.png";
import avatar_29 from "../../media/avatar-floor/Avatar_29.png";
import avatar_30 from "../../media/avatar-floor/Avatar_30.png";
import avatar_31 from "../../media/avatar-floor/Avatar_31.png";
import avatar_32 from "../../media/avatar-floor/Avatar_32.png";
import avatar_33 from "../../media/avatar-floor/Avatar_33.png";
import avatar_34 from "../../media/avatar-floor/Avatar_34.png";
import avatar_35 from "../../media/avatar-floor/Avatar_35.png";
import avatar_36 from "../../media/avatar-floor/Avatar_36.png";
import avatar_37 from "../../media/avatar-floor/Avatar_37.png";
import avatar_38 from "../../media/avatar-floor/Avatar_38.png";
import avatar_39 from "../../media/avatar-floor/Avatar_39.png";
import avatar_40 from "../../media/avatar-floor/Avatar_40.png";
import avatar_41 from "../../media/avatar-floor/Avatar_41.png";
import avatar_42 from "../../media/avatar-floor/Avatar_42.png";
import avatar_43 from "../../media/avatar-floor/Avatar_43.png";
import avatar_44 from "../../media/avatar-floor/Avatar_44.png";
import avatar_45 from "../../media/avatar-floor/Avatar_45.png";
import avatar_46 from "../../media/avatar-floor/Avatar_46.png";
import avatar_47 from "../../media/avatar-floor/Avatar_47.png";
import avatar_48 from "../../media/avatar-floor/Avatar_48.png";
import avatar_49 from "../../media/avatar-floor/Avatar_49.png";
import avatar_50 from "../../media/avatar-floor/Avatar_50.png";
import avatar_51 from "../../media/avatar-floor/Avatar_51.png";
import avatar_52 from "../../media/avatar-floor/Avatar_52.png";
import avatar_53 from "../../media/avatar-floor/Avatar_53.png";
import avatar_54 from "../../media/avatar-floor/Avatar_54.png";
import avatar_55 from "../../media/avatar-floor/Avatar_55.png";
import avatar_56 from "../../media/avatar-floor/Avatar_56.png";
import avatar_57 from "../../media/avatar-floor/Avatar_57.png";
import avatar_58 from "../../media/avatar-floor/Avatar_58.png";

const avatarIndex = [
    avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08,
    avatar_09, avatar_10, avatar_11, avatar_12, avatar_13, avatar_14, avatar_15, avatar_16,
    avatar_17, avatar_18, avatar_19, avatar_20, avatar_21, avatar_22, avatar_23, avatar_24,
    avatar_25, avatar_26, avatar_27, avatar_28, avatar_29, avatar_30, avatar_31, avatar_32,
    avatar_33, avatar_34, avatar_35, avatar_36, avatar_37, avatar_38, avatar_39, avatar_40,
    avatar_41, avatar_42, avatar_43, avatar_44, avatar_45, avatar_46, avatar_47, avatar_48,
    avatar_49, avatar_50, avatar_51, avatar_52, avatar_53, avatar_54, avatar_55, avatar_56,
    avatar_57, avatar_58
];

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