/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useSelector } from "react-redux";
import CenterFloor from "./components/CenterFloor";
import FloorBids from "./components/FloorBids";
import FloorLots from "./components/FloorLots";
import FloorNavigation from "./components/FloorNavigation";
import LoginClientModal from "../home/advertiser-home/modal/LoginClientModal";
import backgroundFloor from "../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg";
import auk_logo from "../media/logos/logos-auk/logo_model01_white.png"
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import MobileElements from "./MobileElements";
import ReceiveWebsocketOnFloor from "./class/ReceiveWebsocketOnFloor";

// import AuctFloorLiveCounter from "./AuctFloorLiveCounter";


function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { auct_id } = useParams();
    const stateBid = useSelector(state => state.bidLive);
    const websocketRef = useRef(null);

    // Loading visual de 1.5 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Inicializa o websocket
        websocketRef.current = new ReceiveWebsocketOnFloor(auct_id);

        // Configura os listeners
        websocketRef.current.receivePlayingAuction((message) => {
            const { body } = message.data;
            setCurrentAuct(body.auction);
            setCurrentProduct(body.product);
        });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auct_id]);

    useEffect(() => {
        if (stateBid && stateBid.bidLive && stateBid.bidLive.product_id) {
            getCurrentProduct(stateBid.bidLive.product_id);
        }
    }, [stateBid]);


    const getCurrentProduct = async (product_id) => {
        if (!product_id) return;
        try {
            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`);
            setCurrentProduct(result.data);
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            return error
        }
    }


    if (isLoading) {
        return (
            <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-gradient-to-b from-[#012038] to-[#144E7B] text-white relative overflow-hidden">
                {/* Elementos decorativos de fundo */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-[10%] left-[5%] w-[20vw] h-[20vw] rounded-full bg-white/20 blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-[15%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-white/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-[30%] right-[20%] w-[15vw] h-[15vw] rounded-full bg-white/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                </div>
                
                {/* Conteúdo centralizado */}
                <div className="z-10 flex flex-col items-center justify-center p-8 max-w-xl text-center">
                    {/* Logo com animação */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full blur-md bg-white/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                        <img 
                            src={auk_logo} 
                            alt="Logo Auk" 
                            className="w-[130px] h-[130px] relative z-10 animate-pulse drop-shadow-2xl object-cover rounded-full" 
                            style={{ animationDuration: '3s' }}
                        />
                    </div>
                    
                    {/* Texto de carregamento */}
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        {!currentAuct ? "Carregando informações do leilão..." : "Preparando o ambiente do leilão"}
                    </h2>
                    
                    {/* Barra de progresso animada */}
                    <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-white rounded-full animate-loadingBar"></div>
                    </div>
                    
                    <p className="text-white/80 mb-8 max-w-sm">
                        {!currentAuct 
                            ? "Estamos buscando os dados do leilão. Por favor, aguarde um momento." 
                            : "Estamos configurando tudo para você. Isso levará apenas alguns segundos."}
                    </p>
                    
                    {!currentAuct && (
                        <div className="text-sm text-white/60 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Se o problema persistir, verifique sua conexão ou atualize a página.</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Estilo para animação da barra de progresso */}
                <style>
                    {`
                    @keyframes loadingBar {
                        0% { width: 0%; }
                        20% { width: 20%; }
                        40% { width: 40%; }
                        60% { width: 70%; }
                        80% { width: 90%; }
                        100% { width: 100%; }
                    }
                    .animate-loadingBar {
                        animation: loadingBar 2s ease-in-out infinite;
                    }
                    `}
                </style>
            </div>
        );
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
                                {currentAuct?.terms_conditions || 'Termos e condições não disponíveis no momento.'}
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
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-hidden">
            <img src={backgroundFloor} alt="" className="flex absolute top-0 h-full w-[100%] object-cover z-[1]" />

            {/* Modal de Login */}
            <LoginClientModal
                modalOn={showLoginModal}
                setIsModalOn={setShowLoginModal}
            />

            <motion.div
                className="z-[999] w-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FloorNavigation
                    auction={currentAuct || {}}
                    group={currentProduct ? currentProduct.group : null}
                    setShowLoginModal={setShowLoginModal}
                />
            </motion.div>


            <ModalTerms />

            {/* Container Principal */}
            <div className="flex lg:flex-row flex-col w-full max-w-[1920px] h-[calc(100vh-220px)] lg:h-[calc(100vh-100px)]
                justify-center items-center gap-4 z-[2] px-4 mt-2 mx-auto">

                {/* Coluna Esquerda (CenterFloor e FloorLots Desktop) */}
                <motion.section
                    className="lg:w-[70%] w-full flex flex-col justify-between items-center gap-3 h-[80vh]
                        lg:overflow-visible overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="w-full h-[60vh] mt-0">
                        <CenterFloor
                            title={currentProduct ? currentProduct.title : ''}
                            cover={currentProduct ? currentProduct.cover_img_url : ''}
                            description={currentProduct ? currentProduct.description : ''}
                            auction={currentAuct || {}}
                            currentProduct={currentProduct}
                        />
                    </div>

                    {/* FloorLots Desktop */}
                    <div className="w-full h-[20vh]  hidden lg:block">
                        <FloorLots
                            currentProduct={currentProduct}
                        />
                    </div>
                </motion.section>

                {/* FloorBids Desktop */}
                <motion.div
                    className="hidden lg:block lg:w-[28%] h-[80vh]"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <div className="sticky">
                        <FloorBids/>
                    </div>
                </motion.div>
            </div>


            <MobileElements 
                currentAuct={currentAuct}
                currentProduct={currentProduct}
            />

           
        </div>
    );
}

export default AuctFloor;