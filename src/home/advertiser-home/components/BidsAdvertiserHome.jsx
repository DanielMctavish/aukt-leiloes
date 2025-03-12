/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useCallback } from 'react';
import io from "socket.io-client";
import axios from 'axios';
//avatares import
import avatar_01 from '../../../media/avatar-floor/avatar_01.png'
import avatar_02 from '../../../media/avatar-floor/avatar_02.png'
import avatar_03 from '../../../media/avatar-floor/avatar_03.png'
import avatar_04 from '../../../media/avatar-floor/avatar_04.png'
import avatar_05 from '../../../media/avatar-floor/avatar_05.png'
import avatar_06 from '../../../media/avatar-floor/avatar_06.png'
import avatar_07 from '../../../media/avatar-floor/avatar_07.png'
import avatar_08 from '../../../media/avatar-floor/avatar_08.png'
import avatar_09 from '../../../media/avatar-floor/Avatar_09.png'
import avatar_10 from '../../../media/avatar-floor/Avatar_10.png'
import avatar_11 from '../../../media/avatar-floor/Avatar_11.png'
import avatar_12 from '../../../media/avatar-floor/Avatar_12.png'
import avatar_13 from '../../../media/avatar-floor/Avatar_13.png'
import avatar_14 from '../../../media/avatar-floor/Avatar_14.png'
import avatar_15 from '../../../media/avatar-floor/Avatar_15.png'
import avatar_16 from '../../../media/avatar-floor/Avatar_16.png'
import avatar_17 from '../../../media/avatar-floor/Avatar_17.png'
import avatar_18 from '../../../media/avatar-floor/Avatar_18.png'
import avatar_19 from '../../../media/avatar-floor/Avatar_19.png'
import avatar_20 from '../../../media/avatar-floor/Avatar_20.png'
import avatar_21 from '../../../media/avatar-floor/Avatar_21.png'
import avatar_22 from '../../../media/avatar-floor/Avatar_22.png'
import avatar_23 from '../../../media/avatar-floor/Avatar_23.png'
import avatar_24 from '../../../media/avatar-floor/Avatar_24.png'
import avatar_25 from '../../../media/avatar-floor/Avatar_25.png'
import avatar_26 from '../../../media/avatar-floor/Avatar_26.png'
import avatar_27 from '../../../media/avatar-floor/Avatar_27.png'
import avatar_28 from '../../../media/avatar-floor/Avatar_28.png'
import avatar_29 from '../../../media/avatar-floor/Avatar_29.png'
import avatar_30 from '../../../media/avatar-floor/Avatar_30.png'
import avatar_31 from '../../../media/avatar-floor/Avatar_31.png'
import avatar_32 from '../../../media/avatar-floor/Avatar_32.png'
import avatar_33 from '../../../media/avatar-floor/Avatar_33.png'
import avatar_34 from '../../../media/avatar-floor/Avatar_34.png'
import avatar_35 from '../../../media/avatar-floor/Avatar_35.png'
import avatar_36 from '../../../media/avatar-floor/Avatar_36.png'
import avatar_37 from '../../../media/avatar-floor/Avatar_37.png'
import avatar_38 from '../../../media/avatar-floor/Avatar_38.png'
import avatar_39 from '../../../media/avatar-floor/Avatar_39.png'
import avatar_40 from '../../../media/avatar-floor/Avatar_40.png'
import avatar_41 from '../../../media/avatar-floor/Avatar_41.png'
import avatar_42 from '../../../media/avatar-floor/Avatar_42.png'
import avatar_43 from '../../../media/avatar-floor/Avatar_43.png'
import avatar_44 from '../../../media/avatar-floor/Avatar_44.png'
import avatar_45 from '../../../media/avatar-floor/Avatar_45.png'
import avatar_46 from '../../../media/avatar-floor/Avatar_46.png'
import avatar_47 from '../../../media/avatar-floor/Avatar_47.png'
import avatar_48 from '../../../media/avatar-floor/Avatar_48.png'
import avatar_49 from '../../../media/avatar-floor/Avatar_49.png'
import avatar_50 from '../../../media/avatar-floor/Avatar_50.png'
import avatar_51 from '../../../media/avatar-floor/Avatar_51.png'
import avatar_52 from '../../../media/avatar-floor/Avatar_52.png'
import avatar_53 from '../../../media/avatar-floor/Avatar_53.png'
import avatar_54 from '../../../media/avatar-floor/Avatar_54.png'
import avatar_55 from '../../../media/avatar-floor/Avatar_55.png'
import avatar_56 from '../../../media/avatar-floor/Avatar_56.png'
import avatar_57 from '../../../media/avatar-floor/Avatar_57.png'
import avatar_58 from '../../../media/avatar-floor/Avatar_58.png'

import { SmartToy, Person } from '@mui/icons-material';

// Estilo para a animação de entrada dos lances e padrão quadriculado para lances automáticos
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
      background-color: #4CAF50;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      background-color: #233751;
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .auto-bid-pattern {
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent);
    background-size: 10px 10px;
  }
`;

function BidsAdvertiserHome({ bidInformations, showBids, productId, auctId }) {
    const isMounted = useRef(true);
    const socketRef = useRef(null);
    const [localBids, setLocalBids] = useState([]);
    const [latestBidId, setLatestBidId] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{

    },[forceUpdate])

    // Função para ordenar os lances por data mais recente
    const sortBidsByDate = useCallback((bids) => {
        if (!bids || !Array.isArray(bids) || bids.length === 0) return [];
        
        return [...bids].sort((a, b) => {
            const dateA = a.bidTime || a.created_at;
            const dateB = b.bidTime || b.created_at;
            
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            
            return new Date(dateB) - new Date(dateA);
        });
    }, []);

    // Função para encontrar o cliente correto para um lance automático
    const findClientForAutoBid = useCallback((autoBid, bids) => {
        if (!autoBid || !autoBid.client_id || !bids || !Array.isArray(bids)) {
            return null;
        }
        
        const clientBid = bids.find(
            otherBid => 
                (otherBid.client_id === autoBid.client_id || 
                 otherBid.client?.id === autoBid.client_id) && 
                (otherBid.client || otherBid.Client) &&
                !otherBid.cover_auto
        );
        
        if (clientBid) {
            return clientBid.client || clientBid.Client;
        }
        
        return null;
    }, []);

    // Função para atualizar os lances locais
    const updateLocalBids = useCallback((newBid) => {
        if (!isMounted.current) return;
        
        
        setLocalBids(prevBids => {
            // Verificar se o lance já existe na lista
            const bidExists = prevBids.some(bid => bid.id === newBid.id);
            
            if (bidExists) {
                return prevBids;
            }
            
            // Criar uma cópia segura do lance
            const bidCopy = JSON.parse(JSON.stringify(newBid));
            
            // Garantir que o lance tenha as informações do cliente
            if (bidCopy.Client && !bidCopy.client) {
                bidCopy.client = bidCopy.Client;
            }
            
            // Para lances automáticos, garantir que o cliente seja o correto
            if (bidCopy.cover_auto === true && !bidCopy.client && bidCopy.client_id) {
                const clientInfo = findClientForAutoBid(bidCopy, prevBids);
                if (clientInfo) {
                    bidCopy.client = clientInfo;
                }
            }
            
            // Adicionar o novo lance e ordenar
            const updatedBids = sortBidsByDate([bidCopy, ...prevBids]);
            
            // Atualizar o ID do lance mais recente
            if (updatedBids.length > 0 && updatedBids[0]?.id) {
                setLatestBidId(updatedBids[0].id);
            }
            
            return updatedBids;
        });
        
        // Forçar a atualização do componente
        setForceUpdate(prev => prev + 1);
    }, [findClientForAutoBid, sortBidsByDate]);

    // Função para buscar os lances atualizados do produto
    const fetchProductBids = useCallback(async () => {
        if (!productId) return;
        
        try {
            setIsLoading(true);
            
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productId}`
            );
            
            if (response.data && response.data.Bid) {
                
                // Ordenar os lances por data mais recente
                const sortedBids = sortBidsByDate(response.data.Bid);
                setLocalBids(sortedBids);
                
                // Atualizar o ID do lance mais recente
                if (sortedBids.length > 0) {
                    setLatestBidId(sortedBids[0].id);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar lances do produto:', error);
        } finally {
            setIsLoading(false);
        }
    }, [productId, sortBidsByDate]);

    // Inicializar com os lances fornecidos e configurar o WebSocket
    useEffect(() => {
        if (!auctId || !productId) {
            return;
        }
    
        fetchProductBids();
        
        // Conectar ao servidor WebSocket
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socketRef.current = socket;
        
        // Escutar eventos de novos lances em catálogo
        socket.on(`${auctId}-bid-cataloged`, (message) => {
            // Extrair o lance da estrutura correta
            const newBid = message.data.body;
            
            // Verificar se o lance é para o produto atual
            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === productId) || 
                           (newBid.product_id === productId))) {
                fetchProductBids(); // Buscar todos os lances atualizados
            }
        });
        
        // Também escutar o evento normal de lance (para compatibilidade)
        socket.on(`${auctId}-bid`, (message) => {
            
            // Extrair o lance da estrutura correta
            const newBid = message.data.body || message.data;
            
            // Verificar se o lance é para o produto atual
            if (newBid && newBid.product_id === productId) {
                fetchProductBids(); // Buscar todos os lances atualizados
            }
        });
        
        // Evento de conexão
        socket.on('connect', () => {
           
        });
        
        // Limpar ao desmontar
        return () => {
            isMounted.current = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [auctId, productId, fetchProductBids]);

    // Atualizar quando bidInformations mudar (para compatibilidade)
    useEffect(() => {
        if (bidInformations && Array.isArray(bidInformations) && bidInformations.length > 0) {
            const sortedBids = sortBidsByDate(bidInformations);
            setLocalBids(sortedBids);
            
            if (sortedBids.length > 0) {
                setLatestBidId(sortedBids[0].id);
            }
        }
    }, [bidInformations, sortBidsByDate]);

    // Escutar o evento personalizado 'newBidPlaced'
    useEffect(() => {
        const handleNewBid = (event) => {
            const { bid } = event.detail;
            
            if (bid && bid.product_id === productId) {
                updateLocalBids(bid);
            }
        };

        window.addEventListener('newBidPlaced', handleNewBid);

        return () => {
            window.removeEventListener('newBidPlaced', handleNewBid);
        };
    }, [productId, updateLocalBids]);

    // Adicionando os estilos ao componente
    useEffect(() => {
        // Criar elemento de estilo
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Limpar ao desmontar
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const avatares_pessoas = [
        avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08, avatar_09, avatar_10, avatar_11, avatar_12, avatar_13, avatar_14, avatar_15, avatar_16, avatar_17, avatar_18, avatar_19, avatar_20, avatar_21, avatar_22, avatar_23, avatar_24, avatar_25, avatar_26, avatar_27, avatar_28, avatar_29, avatar_30, avatar_31, avatar_32, avatar_33, avatar_34, avatar_35, avatar_36, avatar_37, avatar_38, avatar_39, avatar_40, avatar_41, avatar_42, avatar_43, avatar_44, avatar_45, avatar_46, avatar_47, avatar_48, avatar_49, avatar_50, avatar_51, avatar_52, avatar_53, avatar_54, avatar_55, avatar_56, avatar_57, avatar_58
    ];

    return (
        <div className={`
            w-full h-full bg-white
            flex flex-col z-[9999]
            transition-all duration-300 ease-in-out
            ${showBids ? 'opacity-100' : 'opacity-0'}
        `}>
            {/* Cabeçalho */}
            <div className="sticky top-0 bg-white p-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Histórico de Lances</h2>
            </div>

            {/* Lista de lances */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012038]"></div>
                    </div>
                ) : !localBids || localBids.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        Nenhum lance realizado ainda.
                    </div>
                ) : (
                    localBids.map((bid) => {
                        if (!bid) return null;
                        
                        // Verificar se o cliente tem as informações necessárias
                        let clientInfo = bid.client || bid.Client;
                        
                        // Para lances automáticos sem cliente identificado
                        if (bid.cover_auto === true && !clientInfo) {
                            clientInfo = {
                                nickname: "Lance Automático",
                                name: "Lance Automático",
                                client_avatar: 0
                            };
                        }
                        
                        if (!clientInfo) return null;
                        
                        // Verificar se o avatar do cliente existe
                        const avatarIndex = clientInfo.client_avatar || 0;
                        const avatarSrc = avatares_pessoas[avatarIndex] || avatares_pessoas[0];
                        
                        // Determinar o nome a ser exibido
                        let clientName = clientInfo.nickname || clientInfo.name || 'Usuário';
                        
                        // Para lances automáticos, adicionar um indicador visual
                        if (bid.cover_auto === true) {
                            clientName = `🤖 ${clientName}`;
                        }
                        
                        const isLatestBid = bid.id === latestBidId;
                        const isAutoBid = bid.cover_auto === true;
                        
                        return (
                            <div className={`
                                w-full 
                                ${isLatestBid ? 'animate-fadeIn' : 'bg-[#233751]'} 
                                ${isAutoBid ? 'auto-bid-pattern' : ''} 
                                rounded-[12px] h-[35px] text-white font-bold 
                                flex justify-between items-center p-1 mt-[2px] 
                                transition-colors duration-300 text-sm
                            `}
                            key={bid.id || Math.random().toString()}>
                                <div className="flex items-center">
                                    <img src={avatarSrc} alt=""
                                        className='w-[33px] h-[33px] object-cover rounded-full mr-2' />
                                    {bid.cover_auto ? 
                                        <SmartToy sx={{ fontSize: 20, color: isLatestBid ? '#6AE16F' : '#4CAF50' }} /> : 
                                        <Person sx={{ fontSize: 20, color: isLatestBid ? '#64B5F6' : '#2196F3' }} />
                                    }
                                </div>
                                <span>{clientName}</span>
                                <span className={isLatestBid ? 'text-[#FFD700]' : ''}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                        .format(bid.value || 0)}
                                </span>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default BidsAdvertiserHome;