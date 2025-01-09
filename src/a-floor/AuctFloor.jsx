/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import CenterFloor from "./components/CenterFloor";
import FloorBids from "./components/FloorBids";
import FloorLots from "./components/FloorLots";
import FloorNavigation from "./components/FloorNavigation";
import backgroundFloor from "../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [socketMessage, setSocketMessage] = useState();
    const [socketWinner, setSocketWinner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { auct_id } = useParams();
    const stateBid = useSelector(state => state.bidLive);

    const socketRef = useRef(null);

    useEffect(() => {
        webSocketFlow();
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [auct_id]);

    useEffect(() => {
        if (stateBid && stateBid.bidLive && stateBid.bidLive.product_id) {
            getCurrentProduct(stateBid.bidLive.product_id);
        }
    }, [stateBid]);

    const webSocketFlow = async () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socketRef.current = socket;
        await getCurrentAuction();

        socket.on(`${auct_id}-playing-auction`, (message) => {
            if (message.data.body.auct_id === auct_id) {
                setSocketMessage(message);
                if (!currentProduct) {
                    setCurrentProduct(message.data.body.product);
                }
            }
        });

        socket.on(`${auct_id}-winner`, (message) => {
            getCurrentClientWinner(message.data.winner);
        });
    }

    const getCurrentAuction = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auct_id}`);
            setCurrentAuct(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const getCurrentProduct = async (product_id) => {
        if (!product_id) return;
        try {
            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`);
            setCurrentProduct(result.data);
        } catch (error) {
            return error
        }
    }

    const getCurrentClientWinner = async (client_id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-client?client_id=${client_id}`);
            setSocketWinner(response.data);
        } catch (error) {
            return error
        }
    }

    if (isLoading) {
        return <div>Carregando...</div>;
    }


    const ModalTerms = () => {
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
            const checkTermsAcceptance = () => {
                const termsData = localStorage.getItem(`terms-acceptance-${auct_id}`);
                
                if (!termsData) {
                    setIsOpen(true);
                    return;
                }

                const { timestamp } = JSON.parse(termsData);
                const oneHour = 60 * 60 * 1000; // 1 hora em milissegundos
                const now = new Date().getTime();

                if (now - timestamp > oneHour) {
                    setIsOpen(true);
                }
            };

            checkTermsAcceptance();
        }, [auct_id]);

        const handleAcceptTerms = () => {
            const termsData = {
                timestamp: new Date().getTime(),
                accepted: true
            };
            localStorage.setItem(`terms-acceptance-${auct_id}`, JSON.stringify(termsData));
            setIsOpen(false);
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-[#012038] bg-opacity-70 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#012038] px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            Termos e Condições do Leilão
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="prose max-w-none">
                            <div className="bg-[#F4F4F4] rounded-lg p-4 mb-6">
                                <h3 className="text-[#012038] font-semibold mb-2">
                                    Importante
                                </h3>
                                <p className="text-[#144E7B]">
                                    Por favor, leia atentamente os termos e condições antes de participar do leilão.
                                </p>
                            </div>
                            
                            <div className="text-[#012038] whitespace-pre-wrap">
                                {currentAuct.terms_conditions}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-[#F4F4F4] flex justify-end">
                        <button
                            onClick={handleAcceptTerms}
                            className="px-4 py-2 bg-[#012038] text-white rounded-lg 
                                hover:bg-[#144E7B] transition-colors duration-200 
                                flex items-center gap-2 shadow-md"
                        >
                            <span>Entendi e Aceito</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-hidden p-[2vh] gap-[2vh]">
            <img src={backgroundFloor} alt="" className="flex absolute top-0 h-full w-[100%] object-cover z-[1]" />
            <FloorNavigation auction={currentAuct} group={currentProduct ? currentProduct.group : null} />

            <ModalTerms/>

            <div className="flex lg:flex-row flex-col w-full h-full justify-between items-center gap-[2vh] z-[2] overflow-y-auto">
                <section className="lg:w-[70%] w-[99%] lg:h-[80vh] flex flex-col justify-between items-center relative gap-[2vh] z-[999]">
                    <CenterFloor
                        title={currentProduct ? currentProduct.title : ''}
                        cover={currentProduct ? currentProduct.cover_img_url : ''}
                        description={currentProduct ? currentProduct.description : ''}
                        auction={currentAuct}
                        currentProduct={currentProduct}
                    />
                    <FloorLots
                        products={currentAuct.product_list}
                        currentProduct={currentProduct}
                    />
                </section>
                <FloorBids
                    timer={socketMessage ? socketMessage.data.cronTimer : 0}
                    duration={currentAuct.product_timer_seconds}
                    auct_id={currentAuct.id}
                    productId={currentProduct ? currentProduct.id : null}
                    winner={socketWinner}
                />
            </div>
        </div>
    );
}

export default AuctFloor;