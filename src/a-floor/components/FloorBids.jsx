/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import io from "socket.io-client";
import { useEffect, useState, useRef, useCallback } from "react"
import BidCard from "./BidCard"
import CronCard from "./CronCard"
import av01 from "../../media/avatar-floor/avatar_01.png"
import av02 from "../../media/avatar-floor/avatar_02.png"
import av03 from "../../media/avatar-floor/avatar_03.png"
import av04 from "../../media/avatar-floor/avatar_04.png"
import av05 from "../../media/avatar-floor/avatar_05.png"
import av06 from "../../media/avatar-floor/avatar_06.png"
import av07 from "../../media/avatar-floor/avatar_07.png"
import av08 from "../../media/avatar-floor/avatar_08.png"

const avatarIndex = [av01, av02, av03, av04, av05, av06, av07, av08]

function FloorBids({ timer, duration, auct_id, productId, winner }) {
    const [currentProduct, setCurrentProduct] = useState({})
    const [bidsCards, setBidsCards] = useState([])
    const [showWinner, setShowWinner] = useState(false)
    const [isAuctionFinished, setIsAuctionFinished] = useState(false)
    const socketRef = useRef(null);
    const winnerTimeoutRef = useRef(null);

    const updateBidsCards = useCallback((newBid) => {
        if (newBid && newBid.Client) {
            setBidsCards(prevCards => {
                const updatedCards = [newBid, ...prevCards].slice(0, 10);
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
        try {
            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
            setCurrentProduct(result.data)
            if (result.data.Bid) {
                setBidsCards(result.data.Bid.slice(-10).reverse())
            }
        } catch (error) {
            console.log("error ao tentar encontrar produto ", error.message)
        }
    }

    const webSocketFlow = () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`)
        socketRef.current = socket;

        socket.on(`${auct_id}-bid`, (message) => {
            console.log("Novo lance recebido via socket:", message);
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
        console.log("Novo lance feito localmente:", newBid);
        updateBidsCards(newBid);
    };

    return (
        <div className="lg:w-[28%] w-[99%] lg:h-[94%] min-h-[60vh] flex flex-col justify-start items-center relative p-2 rounded-[22px] bg-[#d2d2d2ad] backdrop-blur-lg shadow-xl shadow-[#1414143a] border-[2px] border-[#e3e3e3] z-[2] gap-1 overflow-y-auto">
            {isAuctionFinished && (
                <div className="w-full p-4 bg-red-600 rounded-lg mb-4">
                    <h2 className="text-xl font-bold text-white mb-2">Leilão Finalizado</h2>
                    <p className="text-lg text-white">Obrigado pela sua participação!</p>
                </div>
            )}
            {showWinner && winner && (
                <div className="w-full p-4 bg-[#88ca9bad] rounded-lg mb-4">
                    <h2 className="text-xl font-bold text-white mb-2">Produto Arrematado</h2>
                    <div className="flex items-center">
                        <img
                            src={avatarIndex[winner.client_avatar]}
                            alt="Winner avatar"
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <p className="text-lg text-white">{winner.nickname}</p>
                    </div>
                </div>
            )}
            <div className="w-full flex-grow overflow-y-auto">
                {bidsCards.map((bid, index) => (
                    <BidCard key={bid.id || index} bid={bid} />
                ))}
            </div>

            <CronCard
                currentTime={timer ? timer : 0}
                duration={duration ? duration : 0}
                auct_id={auct_id ? auct_id : ""}
                initial_value={currentProduct.initial_value}
                currentProduct={currentProduct}
                onNewBid={handleNewBid}
                isAuctionFinished={isAuctionFinished}
            />
        </div>
    )
}

export default FloorBids