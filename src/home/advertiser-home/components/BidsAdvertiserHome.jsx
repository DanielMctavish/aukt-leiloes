/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useCallback } from 'react';
import io from "socket.io-client";
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

// Estilo para a animação de entrada dos lances
const fadeInAnimation = `
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
`;

function BidsAdvertiserHome({ bidInformations, showBids, productId, auctId }) {
    // Referência para o componente montado
    const isMounted = useRef(true);
    
    // Referência para o socket
    const socketRef = useRef(null);
    
    // Função para ordenar os lances por data mais recente (definida antes do estado para poder ser usada na inicialização)
    const sortBidsByInitialDate = (bids) => {
        if (!bids || !Array.isArray(bids) || bids.length === 0) return [];
        
        // Ordenar os lances pela data mais recente
        return [...bids].sort((a, b) => {
            // Usar bidTime se disponível, caso contrário usar created_at
            const dateA = a.bidTime || a.created_at;
            const dateB = b.bidTime || b.created_at;
            
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            
            return new Date(dateB) - new Date(dateA);
        });
    };
    
    // Estado local para armazenar os lances (já ordenados na inicialização)
    const [localBids, setLocalBids] = useState(
        bidInformations && Array.isArray(bidInformations) ? 
        sortBidsByInitialDate(bidInformations) : []
    );
    
    // Estado para rastrear o ID do lance mais recente
    const [latestBidId, setLatestBidId] = useState(
        bidInformations && Array.isArray(bidInformations) && bidInformations.length > 0 ? 
        sortBidsByInitialDate(bidInformations)[0]?.id : null
    );
    
    // Estado para forçar a atualização do componente
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // Função para ordenar os lances por data mais recente (versão memoizada para uso nos callbacks)
    const sortBidsByDate = useCallback((bids) => {
        if (!bids || !Array.isArray(bids) || bids.length === 0) return [];
        
        // Ordenar os lances pela data mais recente
        return [...bids].sort((a, b) => {
            // Usar bidTime se disponível, caso contrário usar created_at
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
        
        // Procurar em outros lances pelo mesmo client_id
        const clientBid = bids.find(
            otherBid => 
                (otherBid.client_id === autoBid.client_id || 
                 otherBid.client?.id === autoBid.client_id) && 
                (otherBid.client || otherBid.Client) &&
                !otherBid.cover_auto // Preferir lances não automáticos
        );
        
        if (clientBid) {
            return clientBid.client || clientBid.Client;
        }
        
        return null;
    }, []);

    // Função para atualizar os lances locais
    const updateLocalBids = useCallback((bids) => {
        if (!isMounted.current) return;
        
        if (!bids || !Array.isArray(bids)) {
            console.warn('Tentativa de atualizar com dados inválidos:', bids);
            return;
        }
        
        console.log('Atualizando lances locais:', bids);
        
        // Ordenar os lances por data mais recente
        const sortedBids = sortBidsByDate(bids);
        
        setLocalBids(sortedBids);
        
        // Atualizar o ID do lance mais recente
        if (sortedBids.length > 0 && sortedBids[0]?.id) {
            setLatestBidId(sortedBids[0].id);
        }
        
        // Forçar a atualização do componente
        setUpdateTrigger(prev => prev + 1);
    }, [sortBidsByDate]);

    // Função para adicionar um novo lance à lista
    const updateBidsCards = useCallback((newBid) => {
        if (!newBid) return;
        
        console.log('Novo lance recebido via WebSocket:', newBid);
        
        // Criar uma cópia segura do lance para evitar mutações indesejadas
        const bidCopy = JSON.parse(JSON.stringify(newBid));
        
        // Garantir que o lance tenha as informações do cliente corretas
        // Para lances automáticos, precisamos garantir que o cliente seja o dono do lance automático
        if (bidCopy.cover_auto === true) {
            console.log('Lance automático detectado:', bidCopy);
            // Se o lance automático tem Client mas não client, usar Client
            if (bidCopy.Client && !bidCopy.client) {
                bidCopy.client = bidCopy.Client;
                console.log('Usando Client para o lance automático:', bidCopy.client);
            }
            
            // Se o lance tem client_id mas não tem client completo, tentar encontrar o cliente correto
            if (!bidCopy.client && bidCopy.client_id) {
                setLocalBids(prevBids => {
                    const clientInfo = findClientForAutoBid(bidCopy, prevBids);
                    if (clientInfo) {
                        bidCopy.client = clientInfo;
                        console.log('Cliente encontrado para lance automático:', clientInfo);
                    }
                    
                    // Verificar se o lance já existe na lista
                    const bidExists = prevBids.some(bid => bid.id === bidCopy.id);
                    
                    if (bidExists) {
                        console.log('Lance já existe na lista, ignorando');
                        return prevBids;
                    }
                    
                    // Adicionar o novo lance e ordenar por data mais recente
                    const updatedBids = sortBidsByDate([bidCopy, ...prevBids]);
                    
                    // Atualizar o ID do lance mais recente
                    if (updatedBids.length > 0 && updatedBids[0]?.id) {
                        setLatestBidId(updatedBids[0].id);
                    }
                    
                    // Forçar a atualização do componente
                    setUpdateTrigger(prev => prev + 1);
                    
                    return updatedBids;
                });
                
                return; // Retornar aqui para evitar a chamada duplicada de setLocalBids
            }
        } else {
            // Para lances normais, apenas garantir que client esteja presente
            if (bidCopy.Client && !bidCopy.client) {
                bidCopy.client = bidCopy.Client;
            }
        }
        
        setLocalBids(prevBids => {
            // Verificar se o lance já existe na lista
            const bidExists = prevBids.some(bid => bid.id === bidCopy.id);
            
            if (bidExists) {
                console.log('Lance já existe na lista, ignorando');
                return prevBids;
            }
            
            // Adicionar o novo lance e ordenar por data mais recente
            const updatedBids = sortBidsByDate([bidCopy, ...prevBids]);
            
            // Atualizar o ID do lance mais recente
            if (updatedBids.length > 0 && updatedBids[0]?.id) {
                setLatestBidId(updatedBids[0].id);
            }
            
            // Forçar a atualização do componente
            setUpdateTrigger(prev => prev + 1);
            
            return updatedBids;
        });
    }, [sortBidsByDate, findClientForAutoBid]);

    // Efeito para limpar os lances e reconectar o WebSocket quando o produto ou leilão mudar
    useEffect(() => {
        console.log('Produto ou leilão mudou, limpando lances e reconectando WebSocket');
        console.log('Novo productId:', productId);
        console.log('Novo auctId:', auctId);
        
        // Limpar os lances antigos
        setLocalBids([]);
        setLatestBidId(null);
        
        // Forçar a atualização do componente
        setUpdateTrigger(prev => prev + 1);
        
        // Desconectar o WebSocket antigo
        if (socketRef.current) {
            console.log('Desconectando WebSocket antigo');
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        
        // A reconexão será feita pelo outro useEffect que observa productId e auctId
    }, [productId, auctId]);

    // Inicializar e atualizar quando bidInformations mudar
    useEffect(() => {
        console.log('bidInformations atualizado:', bidInformations);
        if (bidInformations && Array.isArray(bidInformations) && bidInformations.length > 0) {
            console.log('Atualizando com', bidInformations.length, 'lances');
            
            // Ordenar os lances por data mais recente
            const sortedBids = sortBidsByDate(bidInformations);
            setLocalBids(sortedBids);
            
            // Atualizar o ID do lance mais recente
            if (sortedBids.length > 0 && sortedBids[0]?.id) {
                setLatestBidId(sortedBids[0].id);
            }
            
            // Forçar a atualização do componente
            setUpdateTrigger(prev => prev + 1);
        }
    }, [bidInformations, sortBidsByDate]);

    // Configurar WebSocket para receber lances em tempo real
    useEffect(() => {
        console.log('Verificando parâmetros para WebSocket:');
        console.log('- productId:', productId);
        console.log('- auctId:', auctId);
        
        if (!auctId || !productId) {
            console.log('auctId ou productId não fornecidos, WebSocket não inicializado');
            return;
        }
        
        console.log('Inicializando WebSocket para auctId:', auctId, 'e productId:', productId);
        
        // Conectar ao servidor WebSocket
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socketRef.current = socket;
        
        console.log('Socket conectado:', socket.connected);
        
        // Escutar eventos de novos lances
        socket.on(`${auctId}-bid`, (message) => {
            console.log('Evento de lance recebido via WebSocket:', message);
            const newBid = message.data;
            
            // Verificar se o lance é para o produto atual
            if (newBid && newBid.product_id === productId) {
                console.log('Lance é para o produto atual, atualizando...');
                updateBidsCards(newBid);
            } else {
                console.log('Lance não é para o produto atual, ignorando');
            }
        });
        
        // Evento de conexão
        socket.on('connect', () => {
            console.log('WebSocket conectado com sucesso!');
        });
        
        // Evento de erro
        socket.on('error', (error) => {
            console.error('Erro no WebSocket:', error);
        });
        
        // Evento de desconexão
        socket.on('disconnect', (reason) => {
            console.log('WebSocket desconectado:', reason);
        });
        
        // Limpar ao desmontar
        return () => {
            console.log('Desconectando WebSocket');
            isMounted.current = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [auctId, productId, updateBidsCards]);

    // Escutar o evento personalizado 'newBidPlaced'
    useEffect(() => {
        const handleNewBid = (event) => {
            console.log('Evento newBidPlaced recebido:', event.detail);
            const { allBids } = event.detail;
            
            if (allBids && Array.isArray(allBids) && allBids.length > 0) {
                // Garantir que todos os lances tenham as informações do cliente
                const processedBids = allBids.map(bid => {
                    const bidCopy = JSON.parse(JSON.stringify(bid));
                    
                    // Para lances automáticos, precisamos garantir que o cliente seja o dono do lance automático
                    if (bidCopy.cover_auto === true) {
                        console.log('Lance automático detectado no evento:', bidCopy);
                        
                        // Se o lance automático tem Client mas não client, usar Client
                        if (bidCopy.Client && !bidCopy.client) {
                            bidCopy.client = bidCopy.Client;
                            console.log('Usando Client para o lance automático:', bidCopy.client);
                        }
                        
                        // Se ainda não temos informações do cliente, mas temos client_id, procurar nos outros lances
                        if (!bidCopy.client && !bidCopy.Client && bidCopy.client_id) {
                            const clientInfo = findClientForAutoBid(bidCopy, allBids);
                            if (clientInfo) {
                                bidCopy.client = clientInfo;
                                console.log('Cliente encontrado para lance automático:', clientInfo);
                            }
                        }
                    } else {
                        // Para lances normais, apenas garantir que client esteja presente
                        if (bidCopy.Client && !bidCopy.client) {
                            bidCopy.client = bidCopy.Client;
                        }
                    }
                    
                    return bidCopy;
                });
                
                updateLocalBids(processedBids);
            }
        };

        console.log('Adicionando listener para newBidPlaced');
        window.addEventListener('newBidPlaced', handleNewBid);

        // Limpar ao desmontar
        return () => {
            console.log('Removendo listener para newBidPlaced');
            window.removeEventListener('newBidPlaced', handleNewBid);
        };
    }, [updateLocalBids, findClientForAutoBid]);

    // Escutar o evento personalizado 'productChanged'
    useEffect(() => {
        const handleProductChanged = (event) => {
            console.log('Evento productChanged recebido:', event.detail);
            const { productId } = event.detail;
            
            if (productId) {
                console.log('Produto mudou para:', productId);
                
                // Limpar os lances antigos
                setLocalBids([]);
                setLatestBidId(null);
                
                // Forçar a atualização do componente
                setUpdateTrigger(prev => prev + 1);
            }
        };

        console.log('Adicionando listener para productChanged');
        window.addEventListener('productChanged', handleProductChanged);

        // Limpar ao desmontar
        return () => {
            console.log('Removendo listener para productChanged');
            window.removeEventListener('productChanged', handleProductChanged);
        };
    }, []);

    const avatares_pessoas = [
        avatar_01,
        avatar_02,
        avatar_03,
        avatar_04,
        avatar_05,
        avatar_06,
        avatar_07,
        avatar_08,
        avatar_09,
        avatar_10,
        avatar_11,
        avatar_12,
        avatar_13,
        avatar_14,
        avatar_15,
        avatar_16,
        avatar_17,
        avatar_18,
        avatar_19,
        avatar_20,
        avatar_21,
        avatar_22,
        avatar_23,
        avatar_24,
        avatar_25,
        avatar_26,
        avatar_27,
        avatar_28,
        avatar_29,
        avatar_30,
        avatar_31,
        avatar_32,
        avatar_33,
        avatar_34,
        avatar_35,
        avatar_36,
        avatar_37,
        avatar_38,
        avatar_39,
        avatar_40,
        avatar_41,
        avatar_42,
        avatar_43,
        avatar_44,
        avatar_45,
        avatar_46,
        avatar_47,
        avatar_48,
        avatar_49,
        avatar_50,
        avatar_51,
        avatar_52,
        avatar_53,
        avatar_54,
        avatar_55,
        avatar_56,
        avatar_57,
        avatar_58
    ];

    // Renderização condicional para depuração
    console.log('Renderizando com lances:', localBids.length, 'Trigger:', updateTrigger);
    console.log('Lance mais recente ID:', latestBidId);
    console.log('bidInformations recebido:', bidInformations?.length || 0);

    return (
        <>
            <style>{fadeInAnimation}</style>
            <div className={`${!showBids ? 'mr-[-160vh] opacity-0' : 'mr-[1vh] opacity-100'} flex-col min-w-[370px] h-[700px] 
            justify-start items-center  p-3 bg-[#f9f9f9] rounded-[12px] shadow-lg shadow-[#1616162f] overflow-y-auto 
            transition-all duration-[1s]`}>
                {!localBids || localBids.length === 0 ? (
                    <div className="w-full p-4 text-center text-gray-500">
                        Nenhum lance realizado ainda.
                    </div>
                ) : (
                    localBids.map((bid) => {
                        if (!bid) {
                            console.warn('Lance inválido encontrado:', bid);
                            return null;
                        }
                        
                        // Verificar se o cliente tem as informações necessárias
                        let clientInfo = bid.client || bid.Client;
                        
                        // Para lances automáticos, verificar se temos as informações corretas do cliente
                        if (bid.cover_auto === true) {
                            console.log('Renderizando lance automático:', bid);
                            // Se não temos informações do cliente, mas temos client_id, procurar nos outros lances
                            if (!clientInfo && bid.client_id) {
                                const foundClient = findClientForAutoBid(bid, localBids);
                                if (foundClient) {
                                    clientInfo = foundClient;
                                    console.log('Cliente encontrado em outro lance:', clientInfo);
                                }
                            }
                        }
                        
                        if (!clientInfo) {
                            console.warn('Informações do cliente não encontradas no lance:', bid);
                            // Usar um cliente genérico para lances automáticos sem cliente identificado
                            if (bid.cover_auto === true) {
                                clientInfo = {
                                    nickname: "Lance Automático",
                                    name: "Lance Automático",
                                    client_avatar: 0
                                };
                            } else {
                                return null;
                            }
                        }
                        
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
                        return (
                            <div className={`w-full ${isLatestBid ? 'bg-[#2e4a6e] animate-fadeIn' : 'bg-[#233751]'} rounded-[12px] h-[40px] text-white font-bold 
                                        flex justify-between items-center p-1 mt-[2px] transition-colors duration-300`}
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
        </>
    )
}

export default BidsAdvertiserHome;