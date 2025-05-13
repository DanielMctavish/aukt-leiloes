/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import ReceiveWebsocketOnFloor from "../class/ReceiveWebsocketOnFloor"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import CronCard from "./CronCard";
import BidCard from "./BidCard";
import WinnerCard from "./WinnerCard";
import AuctionFinishedCard from "./AuctionFinishedCard";

function FloorBids() {
    const { auct_id } = useParams();
    const websocketRef = useRef(null);
    const bidsContainerRef = useRef(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isEntireAuctionFinished, setIsEntireAuctionFinished] = useState(false);

    // Função auxiliar para mesclar lances sem duplicatas
    const mergeBidsWithoutDuplicates = (existingBids = [], newBids = []) => {
        const bidMap = new Map();

        // Adiciona os lances existentes ao Map
        existingBids.forEach(bid => {
            bidMap.set(bid.id, bid);
        });

        // Adiciona ou atualiza com novos lances
        newBids.forEach(bid => {
            bidMap.set(bid.id, bid);
        });

        // Converte o Map de volta para array
        return Array.from(bidMap.values());
    };

    useEffect(() => {
        // Criar instância do WebSocket
        websocketRef.current = new ReceiveWebsocketOnFloor(auct_id);

        // Configurar listeners
        websocketRef.current.receivePlayingAuction((message) => {
            const { body, cronTimer } = message.data;

            setCurrentProduct(prevProduct => {
                if (prevProduct && prevProduct.id === body.product.id) {
                    return {
                        ...body.product,
                        Bid: mergeBidsWithoutDuplicates(prevProduct.Bid, body.product.Bid)
                    };
                }
                return {
                    ...body.product,
                    Bid: body.product.Bid || []
                };
            });

            setCurrentTime(cronTimer);
            setIsAuctionFinished(false);
            setWinner(null);
        });

        websocketRef.current.receiveWinnerMessage((message) => {
            const { body } = message.data;

            setCurrentProduct(prevProduct => {
                if (prevProduct && prevProduct.id === body.product.id) {
                    return {
                        ...body.product,
                        Bid: mergeBidsWithoutDuplicates(prevProduct.Bid, body.product.Bid)
                    };
                }
                return {
                    ...body.product,
                    Bid: body.product.Bid || []
                };
            });

            setWinner(body.winner);
            setIsAuctionFinished(true);
        });

        websocketRef.current.receiveAuctionFinishedMessage(() => {
            setIsEntireAuctionFinished(true);
        });

        websocketRef.current.receiveBidMessage((message) => {
            const { body } = message.data;

            setCurrentProduct(prevProduct => {
                if (!prevProduct || prevProduct.id !== body.product.id) return prevProduct;

                return {
                    ...prevProduct,
                    real_value: body.currentBid.value,
                    Bid: mergeBidsWithoutDuplicates(prevProduct.Bid, [body.currentBid])
                };
            });
        });

        // Cleanup function
        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
                websocketRef.current = null;
            }
        };
    }, [auct_id]);

    // Efeito para rolar para o último lance quando o produto muda
    useEffect(() => {
        if (bidsContainerRef.current) {
            bidsContainerRef.current.scrollTop = bidsContainerRef.current.scrollHeight;
        }
    }, [currentProduct?.Bid]);

    return (
        <div className={`w-full rounded-xl h-[81vh] ${isEntireAuctionFinished ? 'bg-red-600' : 'bg-[#c9c9c9df]'} 
        flex flex-col items-center justify-start p-4 transition-colors duration-500`}>
            {isEntireAuctionFinished ? (
                <AuctionFinishedCard />
            ) : winner && isAuctionFinished ? (
                <WinnerCard winner={winner} product={currentProduct} />
            ) : (
                <div className="w-full max-w-2xl flex flex-col gap-4">
                    {currentProduct && currentProduct.Bid && currentProduct.Bid.length > 0 && (
                        <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="text-white font-bold mb-3">Últimos Lances</h3>
                            <div
                                ref={bidsContainerRef}
                                className="max-h-[60vh] overflow-y-auto pr-2"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'rgba(255,255,255,0.3) transparent'
                                }}
                            >
                                {[...currentProduct.Bid]
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .map((bid, index) => {
                                        // O maior lance é o primeiro após a ordenação por data
                                        const isHighestBid = index === 0;
                                        return (
                                            <BidCard 
                                                key={bid.id} 
                                                bid={bid} 
                                                isHighestBid={isHighestBid}
                                            />
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {currentProduct && (
                        <div className="w-full absolute bottom-2 left-0 p-2">
                            <CronCard
                                currentTime={currentTime}
                                currentProduct={currentProduct}
                                isAuctionFinished={isAuctionFinished}
                                auct_id={auct_id}
                            />
                        </div>
                    )}
                </div>
            )}

            <style>
                {`
                @keyframes scaleIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-scale-in {
                    animation: scaleIn 0.5s ease-out forwards;
                }

                /* Estilização da scrollbar para Webkit */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                ::-webkit-scrollbar-thumb {
                    background-color: rgba(255,255,255,0.3);
                    border-radius: 3px;
                }
                `}
            </style>
        </div>
    )
}

export default FloorBids
