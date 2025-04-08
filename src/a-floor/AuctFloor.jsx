/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import io from "socket.io-client";
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
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import AuctFloorLiveCounter from "./AuctFloorLiveCounter";

function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [socketMessage, setSocketMessage] = useState();
    const [socketWinner, setSocketWinner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);
    const [currentSocketInstance, setCurrentSocketInstance] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLotsVisible, setIsLotsVisible] = useState(false);
    const [isBidsVisible, setIsBidsVisible] = useState(false);

    const { auct_id } = useParams();
    const stateBid = useSelector(state => state.bidLive);

    const socketRef = useRef(null);
    const messagesProcessedRef = useRef(new Set()); // Conjunto para rastrear mensagens processadas

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

    const webSocketFlow = async () => {
        // Desconectar socket anterior se existir
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const getLocalStorageClient = localStorage.getItem('client-auk-session-login');
        // Verifica se existe dado na localStorage e se pode ser parseado
        const currentClient = getLocalStorageClient ? JSON.parse(getLocalStorageClient) : null;
        // Gera um ID único para o cliente se ele não estiver logado
        const clientId = currentClient?.id || `anonymous-${uuidv4()}`;

        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`, {
            transports: ['websocket'],
            upgrade: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            forceNew: true,
            query: {
                instance_id: uuidv4(),
                client_type: "floor_viewer",
                auct_id: auct_id
            }
        });

        setCurrentSocketInstance(socket);
        socketRef.current = socket;

        // Adicionar listener para erros de conexão
        socket.on('connect_error', (error) => {
            console.error('Erro na conexão WebSocket:', error);
            setIsLoading(true);
        });

        // Adicionar listener para sucesso na conexão
        socket.on('connect', () => {
            // console.log("Socket conectado com sucesso!");
            setIsLoading(false);
        });

        // Adicionar listener para desconexão
        socket.on('disconnect', (reason) => {
            console.log('Socket desconectado:', reason);
            if (reason === 'io server disconnect') {
                socket.connect();
            }
        });

        try {
            await getCurrentAuction();

            // Join the auction room with the specific auction ID
            socket.emit('join-auction-room', {
                auct_id,
                instance_id: clientId, // Usando o clientId que é seguro mesmo quando não há cliente logado
                client_type: "floor_viewer",
            });

            socket.on(`${auct_id}-playing-auction`, (message) => {
                if (message.data && message.data.body && message.data.body.auct_id === auct_id) {
                    processMessageOnce(`${auct_id}-playing-auction`, message, (msg) => {
                        // console.log("Recebendo mensagem do leilão:", msg);
                        setSocketMessage(msg);

                        if (!currentProduct || (msg.data.body.product && currentProduct.id !== msg.data.body.product.id)) {
                            setCurrentProduct(msg.data.body.product);
                        }
                    });
                }
            });

            socket.on(`${auct_id}-winner`, (message) => {
                if (message.data && message.data.body) {
                    processMessageOnce(`${auct_id}-winner`, message, (msg) => {
                        getCurrentClientWinner(msg.data.body.winner);
                    });
                }
            });

            socket.on(`${auct_id}-auct-finished`, (message) => {
                // console.log("AuctFloor - Auction finished event received:", message);
                processMessageOnce(`${auct_id}-auct-finished`, message, () => {
                    // console.log("Leilão finalizado:", msg);
                    setIsAuctionFinished(true);
                    getCurrentAuction();
                });
            });

            // Detector de reconexão
            socket.on('reconnect', () => {
                console.log("Reconectado ao servidor WebSocket. Rejuntando-se à sala do leilão.");
                socket.emit('join-auction-room', {
                    auct_id,
                    instance_id: clientId, // Usando o clientId seguro
                    client_type: "floor_viewer"
                });
            });

        } catch (error) {
            console.error("Erro ao configurar WebSocket:", error);
            setIsLoading(false);
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }

    const getCurrentAuction = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auct_id}`);
            setCurrentAuct(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao buscar leilão:", error);
            setIsLoading(false);
        }
    };

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

    const getCurrentClientWinner = async (client_id) => {
        if (!client_id) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-client?client_id=${client_id}`);
            setSocketWinner(response.data);
        } catch (error) {
            console.error("Erro ao buscar cliente vencedor:", error);
            return error
        }
    }

    if (isLoading) {
        return (
            <div className="w-full h-[100vh] flex flex-col justify-center items-center">
                <img src={auk_logo} alt="Logo Auk" className="w-[100px] h-[100px]" />
            </div>
        )
    }

    if (!currentAuct) {
        return (
            <div className="w-full h-[100vh] flex flex-col justify-center items-center">
                <img src={auk_logo} alt="Logo Auk" className="w-[100px] h-[100px] mb-4" />
                <p className="text-lg text-[#012038]">Carregando informações do leilão...</p>
                <p className="text-sm text-gray-500 mt-2">Se o problema persistir, verifique sua conexão ou atualize a página.</p>
            </div>
        )
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

            {/* Display connected users count with modern live indicator */}
            <div className="w-full px-4 mt-2">
                <AuctFloorLiveCounter 
                    socket={currentSocketInstance} 
                    currentClient={JSON.parse(localStorage.getItem('client-auk-session-login')) || {}}
                    auct_id={auct_id}
                />
            </div>

            <ModalTerms />

            {/* Container Principal */}
            <div className="flex lg:flex-row flex-col w-full max-w-[1920px] h-[calc(100vh-220px)] lg:h-[calc(100vh-100px)]
                justify-between items-start gap-4 z-[2] px-4 mt-2 mx-auto">
                
                {/* Coluna Esquerda (CenterFloor e FloorLots Desktop) */}
                <motion.section
                    className="lg:w-[70%] w-full h-full flex flex-col justify-start items-center gap-3 
                        lg:overflow-visible overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="w-full min-h-[75vh] lg:min-h-[70%] mt-0">
                        <CenterFloor
                            title={currentProduct ? currentProduct.title : ''}
                            cover={currentProduct ? currentProduct.cover_img_url : ''}
                            description={currentProduct ? currentProduct.description : ''}
                            auction={currentAuct || {}}
                            currentProduct={currentProduct}
                        />
                    </div>
                    
                    {/* FloorLots Desktop */}
                    <div className="w-full min-h-[25vh] lg:min-h-[30%] hidden lg:block">
                        <FloorLots
                            products={currentAuct?.product_list || []}
                            currentProduct={currentProduct}
                        />
                    </div>
                </motion.section>

                {/* FloorBids Desktop */}
                <motion.div
                    className="hidden lg:block lg:w-[28%] h-full"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <div className="sticky top-4">
                        <FloorBids
                            timer={socketMessage ? socketMessage.data.cronTimer : 0}
                            duration={currentAuct?.product_timer_seconds || 0}
                            auct_id={currentAuct?.id}
                            productId={currentProduct ? currentProduct.id : null}
                            winner={socketWinner}
                            isMobile={false}
                            isAuctionFinished={isAuctionFinished}
                        />
                    </div>
                </motion.div>
            </div>

            {/* FloorBids Mobile */}
            <AnimatePresence>
                {isBidsVisible && (
                    <motion.div 
                        className="lg:hidden fixed right-0 bottom-0 z-[999] h-[85vh] w-[77%]"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(event, info) => {
                            if (info.offset.x > 50) {
                                setIsBidsVisible(false);
                            }
                        }}
                    >
                        <FloorBids
                            timer={socketMessage ? socketMessage.data.cronTimer : 0}
                            duration={currentAuct?.product_timer_seconds || 0}
                            auct_id={currentAuct?.id}
                            productId={currentProduct ? currentProduct.id : null}
                            winner={socketWinner}
                            isMobile={true}
                            isAuctionFinished={isAuctionFinished}
                        />
                        
                        {/* Indicador de arraste */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 
                            bg-white/20 backdrop-blur-sm rounded-l-lg p-1 
                            border-l border-y border-white/20"
                        >
                            <div className="w-1 h-16 rounded-full bg-white/40"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botão para mostrar FloorBids quando estiver escondido */}
            <AnimatePresence>
                {!isBidsVisible && (
                    <motion.button
                        className="lg:hidden fixed right-4 bottom-4 z-[999] bg-[#012038] 
                            backdrop-blur-sm text-white p-3 rounded-full
                            shadow-lg border border-white/20
                            hover:bg-[#012038]/90 transition-all
                            hover:scale-110 active:scale-95"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        onClick={() => setIsBidsVisible(true)}
                        title="Ver Lances"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* FloorLots Mobile */}
            <AnimatePresence>
                {isLotsVisible && (
                    <motion.div 
                        className="lg:hidden fixed left-0 bottom-0 z-[998] h-[70vh] w-[100px]"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(event, info) => {
                            if (info.offset.x < -50) {
                                setIsLotsVisible(false);
                            }
                        }}
                    >
                        <FloorLots
                            products={currentAuct?.product_list || []}
                            currentProduct={currentProduct}
                        />
                        
                        {/* Indicador de arraste */}
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 
                            bg-white/20 backdrop-blur-sm rounded-r-lg p-1 
                            border-r border-y border-white/20"
                        >
                            <div className="w-1 h-16 rounded-full bg-white/40"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botão para mostrar FloorLots quando estiver escondido */}
            <AnimatePresence>
                {!isLotsVisible && (
                    <motion.button
                        className="lg:hidden fixed left-4 bottom-4 z-[998] bg-[#012038] 
                            backdrop-blur-sm text-white p-3 rounded-full
                            shadow-lg border border-white/20
                            hover:bg-[#012038]/90 transition-all
                            hover:scale-110 active:scale-95"
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        onClick={() => setIsLotsVisible(true)}
                        title="Ver Lotes"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AuctFloor;