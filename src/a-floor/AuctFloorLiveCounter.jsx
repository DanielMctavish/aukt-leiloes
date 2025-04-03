/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AuctFloorLiveCounter({ socket, currentClient, auct_id }) {
    const [connectedUsers, setConnectedUsers] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Função para solicitar atualização da contagem
    const requestUserCount = useCallback(() => {
        if (socket && socket.connected && currentClient && auct_id) {
            console.log("Solicitando contagem de usuários...");
            socket.emit('request-user-count', { 
                auct_id, 
                clientId: currentClient.id 
            });
        }
    }, [socket, currentClient, auct_id]);

    // Handler para processamento da contagem de usuários
    const handleUserCount = useCallback((response) => {
        console.log("Resposta do websocket:", response);
        
        if (response?.data?.body?.instance_id === currentClient?.id) {
            const count = response.data.body.count;
            setConnectedUsers(count);
        }
    }, [currentClient]);

    // Configurar eventos ao montar o componente
    useEffect(() => {
        if (!socket || !currentClient || !auct_id) return;

        // Handler para quando o socket se conecta
        const handleConnect = () => {
            console.log("Socket conectado no contador");
            requestUserCount();
        };

        // Configurar ouvintes de eventos
        socket.on('auction-room-users', handleUserCount);
        socket.on('connect', handleConnect);
        
        // Solicitar contagem inicial se socket já estiver conectado
        if (socket.connected) {
            requestUserCount();
        }

        // Solicitar contagem periódica a cada 30 segundos
        const intervalId = setInterval(requestUserCount, 30000);

        // Limpar ouvintes ao desmontar
        return () => {
            socket.off('auction-room-users', handleUserCount);
            socket.off('connect', handleConnect);
            clearInterval(intervalId);
        };
    }, [socket, currentClient, auct_id, handleUserCount, requestUserCount]);

    // Permitir ao usuário esconder o contador
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-[1000] flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Pulse animation for "LIVE" indicator */}
                    <div className="relative flex items-center">
                        <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-white font-semibold text-sm">LIVE</span>
                    <div className="h-4 w-[1px] bg-gray-400/50"></div>
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-300"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-white font-medium">{connectedUsers}</span>
                    </div>
                    
                    {/* Botão de fechar/minimizar */}
                    <button 
                        onClick={toggleVisibility}
                        className="ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </motion.div>
            )}
            
            {/* Botão para mostrar o contador quando estiver escondido */}
            {!isVisible && (
                <motion.button
                    className="fixed top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg z-[1000]"
                    onClick={toggleVisibility}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}

export default AuctFloorLiveCounter;