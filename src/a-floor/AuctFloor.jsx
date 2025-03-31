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
import { motion } from "framer-motion";

function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [socketMessage, setSocketMessage] = useState();
    const [socketWinner, setSocketWinner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [connectedUsers, setConnectedUsers] = useState(0);
    const [instanceId] = useState(() => crypto.randomUUID()); // ID único para esta instância
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);

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

        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`, {
            transports: ['websocket'],
            upgrade: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            query: {
                instance_id: instanceId,
                client_type: "floor_viewer",
                auct_id: auct_id
            }
        });
        
        socketRef.current = socket;
        await getCurrentAuction();

        // Join the auction room with the specific auction ID
        socket.emit('join-auction-room', { 
            auct_id,
            instance_id: instanceId,
            client_type: "floor_viewer"
        });

        // Listen for connected users count
        socket.on('auction-room-users', (data) => {
            if (data.auct_id === auct_id) {
                // Atualizar o contador apenas se o número for diferente
                if (data.count !== connectedUsers) {
                    setConnectedUsers(data.count);
                }
            }
        });

        // Adicionar listener para desconexão de usuários
        socket.on('user-disconnected', (data) => {
            if (data.auct_id === auct_id) {
                setConnectedUsers(prev => Math.max(0, prev - 1));
            }
        });

        socket.on(`${auct_id}-playing-auction`, (message) => {
            // Processar mensagem apenas se for para este leilão
            if (message.data && message.data.body && message.data.body.auct_id === auct_id) {
                processMessageOnce(`${auct_id}-playing-auction`, message, (msg) => {
                    console.log("Recebendo mensagem do leilão:", msg);
                    setSocketMessage(msg);
                    
                    // Atualizar o produto apenas se não houver um atual ou se os IDs forem diferentes
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
        
        // Evento de finalização do leilão
        socket.on(`${auct_id}-auct-finished`, (message) => {
            console.log("AuctFloor - Auction finished event received:", message);
            
            // Processar a mensagem de finalização usando o mesmo mecanismo de deduplicação
            processMessageOnce(`${auct_id}-auct-finished`, message, (msg) => {
                console.log("Leilão finalizado:", msg);
                setIsAuctionFinished(true);
                
                // Opcionalmente, podemos atualizar outros estados ou fazer chamadas API aqui
                // para refletir o estado de leilão finalizado na interface
                
                // Atualizar o leilão para ter as informações mais recentes
                getCurrentAuction();
            });
        });
        
        // Detector de reconexão
        socket.on('reconnect', () => {
            console.log("Reconectado ao servidor WebSocket. Rejuntando-se à sala do leilão.");
            socket.emit('join-auction-room', { 
                auct_id,
                instance_id: instanceId,
                client_type: "floor_viewer"
            });
        });

        // Cleanup function
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
            <motion.div 
                className="z-[999] w-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FloorNavigation auction={currentAuct} group={currentProduct ? currentProduct.group : null} />
            </motion.div>

            {/* Display connected users count with modern live indicator */}
            <motion.div 
                className="fixed top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-[1000] flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {/* Pulse animation for "LIVE" indicator */}
                <div className="relative flex items-center">
                    <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-white font-semibold text-sm">LIVE</span>
                <div className="h-4 w-[1px] bg-gray-400/50"></div>
                <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-white font-medium">{connectedUsers}</span>
                </div>
            </motion.div>

            <ModalTerms />

            {/* Versão Mobile do CronCard */}
            <div className="lg:hidden fixed top-[80px] left-0 right-0 z-[999] px-4 py-2 bg-white/80 backdrop-blur-md shadow-lg">
                <FloorBids
                    timer={socketMessage ? socketMessage.data.cronTimer : 0}
                    duration={currentAuct.product_timer_seconds}
                    auct_id={currentAuct.id}
                    productId={currentProduct ? currentProduct.id : null}
                    winner={socketWinner}
                    isMobile={true}
                    isAuctionFinished={isAuctionFinished}
                />
            </div>

            <div className="flex lg:flex-row flex-col w-full 
                lg:h-full h-[200vh] justify-between items-center gap-[2vh] z-[2] overflow-y-auto
                pt-[120px] lg:pt-0"> {/* Adicionado padding-top para mobile */}
                <motion.section 
                    className="lg:w-[70%] w-[99%] lg:h-[80vh] flex flex-col justify-between items-center relative gap-[2vh] z-[999]"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
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
                </motion.section>
                
                {/* Versão Desktop do FloorBids */}
                <motion.div
                    className="hidden lg:block"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <FloorBids
                        timer={socketMessage ? socketMessage.data.cronTimer : 0}
                        duration={currentAuct.product_timer_seconds}
                        auct_id={currentAuct.id}
                        productId={currentProduct ? currentProduct.id : null}
                        winner={socketWinner}
                        isMobile={false}
                        isAuctionFinished={isAuctionFinished}
                    />
                </motion.div>
            </div>
        </div>
    );
}

export default AuctFloor;