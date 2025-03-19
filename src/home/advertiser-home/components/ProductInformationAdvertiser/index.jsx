/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

// Componentes
import BidInterface from "./BidInterface";
import NotificationSystem from "./NotificationSystem";
import ProductHeader from "./ProductHeader";
import ProductContent from "./ProductContent";
import BidsList from "./BidsList";

// Funções
import { handleNextProduct, handlePrevProduct } from '../../functions/productNavigation';
import { handleBidproduct } from '../../functions/handleBidproduct';
import useProductSession from "./hooks/useProductSession";
import useBidding from "./hooks/useBidding";
import useNotifications from "./hooks/useNotifications";

function ProductInformation({ children, ...props }) {
    const navigate = useNavigate();
    const messageRef = useRef(null);
    const socketRef = useRef(null);
    
    // Hooks personalizados
    const { currentSession, setCurrentSession } = useProductSession();
    
    const { 
        bidValue, setBidValue, isLoadingBid, setIsloadingBid,
        isAutoBidEnabled, setIsAutoBidEnabled, hasAutoBid, setHasAutoBid,
        autoBidLimit, setAutoBidLimit, calculateNextBidValue, getIncrementValue,
        handleSetBid, handleSetAutoBidLimit, toggleAutoBid, disableAutoBid
    } = useBidding(props, currentSession);
    
    const { showOutbidNotification, setShowOutbidNotification, lastBidClient, setLastBidClient } = useNotifications();
    
    // Refs para os timeouts e úteis para evitar atualizações duplicadas
    const notificationTimeoutRef = useRef(null);
    const lastNotifiedBidRef = useRef(null);

    // Função para mostrar mensagens ao usuário
    const showMessage = (message, type = 'success') => {
        // Verificar se o componente ainda está montado
        if (!messageRef.current) return;

        messageRef.current.textContent = message;
        messageRef.current.classList.remove('hidden', 'bg-green-500', 'bg-red-500', 'bg-yellow-500');
        messageRef.current.classList.add(
            'transform', 'translate-y-0', 'opacity-100',
            type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        );

        setTimeout(() => {
            if (messageRef.current) {
                messageRef.current.classList.add('opacity-0', 'translate-y-[-20px]');
                setTimeout(() => {
                    if (messageRef.current) {
                        messageRef.current.classList.add('hidden');
                        messageRef.current.classList.remove('opacity-0', 'translate-y-[-20px]');
                    }
                }, 300);
            }
        }, 3000);
    };

    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Função para buscar informações atualizadas do produto
    const fetchUpdatedProduct = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${props.currentProduct.id}`
            );
            
            if (response.data) {
                // Atualizar o produto no estado
                props.setCurrentProduct(response.data);
                
                // Atualizar o valor do lance sugerido
                const nextBidValue = calculateNextBidValue(response.data);
                setBidValue(nextBidValue);
            }
        } catch (error) {
            console.error('Erro ao buscar produto atualizado:', error);
        }
    };

    // Efeito para verificar se o cliente tem lance automático para este produto
    const checkAutoBid = useCallback(async () => {
        // Usar currentSession se currentClient não estiver disponível
        const clientId = props.currentClient?.id || currentSession?.id;

        if (!clientId || !props.currentProduct?.id) return;
        
        try {
            // Buscar o produto diretamente para ter as informações mais atualizadas
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${props.currentProduct.id}`
            );
            
            if (response.data && response.data.Bid) {
                const autoBid = response.data.Bid.find(bid =>
                    bid.cover_auto === true && bid.client_id === clientId
                );
                
                setHasAutoBid(!!autoBid);
                setIsAutoBidEnabled(!!autoBid);
            }
        } catch (error) {
            console.error('Erro ao verificar status de lance automático:', error);
        }
    }, [props.currentProduct?.id, props.currentClient?.id, currentSession?.id, setHasAutoBid, setIsAutoBidEnabled]);

    // Função para lidar com notificações de lance superado
    const handleOutbidNotification = useCallback((shouldShow, lastBid = null, message = null) => {
        // Limpar qualquer timeout existente
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }
        
        // Se não devemos mostrar a notificação ou já estamos mostrando para o mesmo lance, sair
        if (!shouldShow || (lastNotifiedBidRef.current && lastBid && lastNotifiedBidRef.current === lastBid.id)) {
            return;
        }
        
        // Armazenar o ID do lance para evitar notificações duplicadas
        if (lastBid) {
            lastNotifiedBidRef.current = lastBid.id;
        }
        
        // Atualizar o cliente do último lance
        if (lastBid?.Client) {
            setLastBidClient(lastBid.Client);
        }
        
        // Mostrar a notificação
        setShowOutbidNotification(true);
        
        // Mostrar mensagem se fornecida
        if (message) {
            showMessage(message, "warning");
        }
        
        // Reproduzir som de alerta se disponível
        try {
            const audio = new Audio('/sounds/outbid.mp3');
            audio.play();
        } catch (error) {
            console.log('Som de notificação não disponível');
        }
        
        // Configurar o timeout para esconder a notificação
        notificationTimeoutRef.current = setTimeout(() => {
            setShowOutbidNotification(false);
            notificationTimeoutRef.current = null;
        }, 15000);
    }, [showMessage, setShowOutbidNotification, setLastBidClient]);

    // Função para buscar e atualizar o produto completo após um novo lance
    const fetchAndUpdateProduct = async (productId) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productId}`
            );
            
            if (response.data) {
                // console.log('Produto atualizado após evento de lance:', response.data);
                
                // Verificar se o usuário foi superado
                const clientId = props.currentClient?.id || currentSession?.id;
                
                // Se temos um usuário logado, produto teve lance e o último lance não é do usuário atual
                if (clientId && response.data.Bid && response.data.Bid.length > 0) {
                    const lastBid = response.data.Bid[0]; // Último lance
                    
                    // Guardar o último cliente que deu lance
                    setLastBidClient(lastBid.Client || null);
                    
                    // Verificar se o usuário tinha o último lance anteriormente
                    const hadLastBid = props.currentProduct.Bid && 
                                      props.currentProduct.Bid.length > 0 && 
                                      props.currentProduct.Bid[0].client_id === clientId;
                    
                    // Se o usuário tinha o último lance e agora não tem mais, ele foi superado
                    if (hadLastBid && lastBid.client_id !== clientId) {
                        // Mostrar notificação quando o lance do usuário for superado
                        handleOutbidNotification(true, lastBid);
                    }
                }
                
                // Atualizar o produto no estado
                props.setCurrentProduct(response.data);
                
                // Atualizar o valor do lance sugerido
                const nextBidValue = calculateNextBidValue(response.data);
                setBidValue(nextBidValue);
                
                // Disparar evento personalizado para notificar outros componentes
                const event = new CustomEvent('productUpdated', {
                    detail: { product: response.data }
                });
                window.dispatchEvent(event);
                
                // Atualizar lista de lances se necessário
                if (response.data.Bid) {
                    props.setBidInformations(response.data.Bid);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar produto atualizado após lance:', error);
        }
    };

   

    // Função para verificar o status do leilão quando a página carrega
    const checkAuctionStatusOnLoad = useCallback(async () => {
        const clientId = props.currentClient?.id || currentSession?.id;
        
        // Se não há usuário logado ou produto selecionado, não faz nada
        if (!clientId || !props.currentProduct?.id) return;
        
        try {
            // Buscar o produto atualizado para ter os dados mais recentes
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${props.currentProduct.id}`
            );
            
            if (response.data && response.data.Bid && response.data.Bid.length > 0) {
                const latestBid = response.data.Bid[0]; // O lance mais recente
                const myLastBid = response.data.Bid.find(bid => bid.client_id === clientId); // Meu último lance
                
                // Logar informações para debug
                console.log("Status do leilão verificado:", {
                    clientId,
                    latestBidClientId: latestBid.client_id,
                    amILeading: latestBid.client_id === clientId,
                    latestBidValue: latestBid.value,
                    hasMyBids: !!myLastBid
                });
                
                // Se não tenho lance, não mostrar nada
                if (!myLastBid) return;
                
                // IMPORTANTE: Se eu sou o último a dar lance, significa que estou ganhando, não mostrar notificação
                if (latestBid.client_id === clientId) {
                    console.log('Você está ganhando este lote!');
                    // Esconder qualquer notificação de lance superado que possa estar aparecendo
                    setShowOutbidNotification(false);
                    return;
                }
                
                // Se eu não sou o último a dar lance e tenho um lance, verificar a situação
                if (latestBid.client_id !== clientId) {
                    // Verificar se o usuário tem lance automático ativo
                    const hasActiveBid = response.data.Bid.some(bid => 
                        bid.client_id === clientId && bid.cover_auto === true
                    );
                    
                    // Se tem lance automático mas está perdendo, é porque o valor limite foi ultrapassado
                    if (hasActiveBid) {
                        const message = "Seu lance automático foi superado! O limite definido foi ultrapassado.";
                        handleOutbidNotification(true, latestBid, message);
                    } 
                    // Se não tem lance automático e não está liderando, mostrar que foi superado
                    else if (myLastBid.value < latestBid.value) {
                        handleOutbidNotification(true, latestBid);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao verificar status do leilão:', error);
        }
    }, [props.currentProduct?.id, props.currentClient?.id, currentSession?.id, handleOutbidNotification, setShowOutbidNotification]);

    // Configurar WebSocket para atualizações em tempo real
    useEffect(() => {
        if (!props.currentAuct?.id || !props.currentProduct?.id) return;
        
        // Conectar ao servidor WebSocket
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socketRef.current = socket;
        
        // Escutar eventos de novos lances em catálogo
        socket.on(`${props.currentAuct.id}-bid-cataloged`, (message) => {
            console.log('Evento de lance em catálogo recebido:', message);
            
            const newBid = message.data.body;
            console.log('Valor do novo lance:', newBid?.value);
            console.log('Produto atual:', props.currentProduct.id);
            console.log('Produto do lance:', newBid?.product_id);
            
            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === props.currentProduct.id) || 
                           (newBid.product_id === props.currentProduct.id))) {
                
                console.log('Lance corresponde ao produto atual, buscando produto atualizado');
                fetchAndUpdateProduct(props.currentProduct.id);
            }
        });
        
        // Também escutar o evento normal de lance
        socket.on(`${props.currentAuct.id}-bid`, (message) => {
            console.log('Evento de lance normal recebido:', message);
            
            const newBid = message.data.body || message.data;
            
            if (newBid && newBid.product_id === props.currentProduct.id) {
                console.log('Lance normal corresponde ao produto atual, buscando produto atualizado');
                fetchAndUpdateProduct(props.currentProduct.id);
            }
        });
        
        // Escutar eventos de novos lances não catalogados
        socket.on(`${props.currentAuct.id}-bid-uncataloged`, (message) => {
            console.log('Evento de lance não catalogado recebido:', message);
            
            const newBid = message.data.body;
            
            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === props.currentProduct.id) || 
                           (newBid.product_id === props.currentProduct.id))) {
                
                console.log('Lance não catalogado corresponde ao produto atual, buscando produto atualizado');
                fetchAndUpdateProduct(props.currentProduct.id);
            }
        });
        
        // Limpar ao desmontar
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [props.currentAuct?.id, props.currentProduct?.id]);

    // Efeito para atualizar o componente quando o produto mudar
    useEffect(() => {
        console.log("Produto mudou, atualizando interface:", props.currentProduct?.id);

        if (props.currentProduct) {
            // Calcular o próximo valor de lance
            const nextBidValue = calculateNextBidValue(props.currentProduct);
            setBidValue(nextBidValue);
            
            // Buscar informações atualizadas do produto
            fetchUpdatedProduct();
        }

        // Verificar se o cliente tem lance automático para este produto
        checkAutoBid();
    }, [props.currentProduct?.id, calculateNextBidValue, checkAutoBid]);

    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
        setCurrentSession(currentSession);

        console.log("observando todos os lances", props.currentProduct.Bid)

        // Adicionar listener para o evento de login bem-sucedido
        const handleLoginSuccess = (event) => {
            setCurrentSession(event.detail);
            checkAutoBid();
            showMessage(`Bem-vindo, ${event.detail.name}! Você está pronto para dar lances.`, 'success');
        };

        window.addEventListener('clientLoginSuccess', handleLoginSuccess);

        return () => {
            window.removeEventListener('clientLoginSuccess', handleLoginSuccess);
        };
    }, []);

    useEffect(() => {
        checkAutoBid();
        if (props.currentProduct) {
            const baseValue = props.currentProduct.real_value || props.currentProduct.initial_value;
            setBidValue(baseValue + 20);
        }
    }, [props.currentClient]);

    // Escutar o evento personalizado 'productChanged'
    useEffect(() => {
        const handleProductChanged = () => {
            // Resetar estados relacionados a lances
            setIsAutoBidEnabled(false);
            setHasAutoBid(false);

            // Verificar se o cliente tem lance automático para o novo produto
            setTimeout(() => {
                checkAutoBid();
            }, 500); // Pequeno delay para garantir que currentProduct já foi atualizado
        };

        window.addEventListener('productChanged', handleProductChanged);

        // Limpar ao desmontar
        return () => {
            window.removeEventListener('productChanged', handleProductChanged);
        };
    }, [checkAutoBid, setIsAutoBidEnabled, setHasAutoBid]);

    useEffect(() => {
        const handleClientStateChanged = (event) => {
            const { type, data } = event.detail;
            
            if (type === 'logout') {
                // Resetar estados relacionados ao cliente
                setCurrentSession(null);
                setBidValue(0);
                setIsAutoBidEnabled(false);
                setHasAutoBid(false);
                
                // Atualizar interface conforme necessário
                showMessage("Você foi desconectado", "info");
            } else if (type === 'login') {
                // Atualizar sessão do cliente
                setCurrentSession(data);
                
                // Recarregar dados do produto e lances
                fetchUpdatedProduct();
                checkAutoBid();
            }
        };

        window.addEventListener('clientStateChanged', handleClientStateChanged);

        return () => {
            window.removeEventListener('clientStateChanged', handleClientStateChanged);
        };
    }, [checkAutoBid, setCurrentSession, setBidValue, setIsAutoBidEnabled, setHasAutoBid]);

    // Efeito para verificar o status do leilão quando a página carrega
    useEffect(() => {
        checkAuctionStatusOnLoad();
        
    }, [checkAuctionStatusOnLoad]);
    
    // Adicionar listener para eventos de visibilidade da página
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkAuctionStatusOnLoad();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [checkAuctionStatusOnLoad]);

    // Efeito para limpar timeouts quando o componente é desmontado
    useEffect(() => {
        return () => {
            // Limpar timeout de notificação
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }
        };
    }, []);

    // Função para realizar um lance
    const handleBidConfirm = async () => {
        try {
            const session = JSON.parse(localStorage.getItem("client-auk-session-login"));
            if (!session?.token) {
                showMessage("Sessão inválida. Faça login novamente.", "error");
                return;
            }

            // Validar limite do lance automático
            if (isAutoBidEnabled && (!autoBidLimit || autoBidLimit <= bidValue)) {
                showMessage("O valor limite do lance automático deve ser maior que o valor do lance atual", "warning");
                return;
            }

            setIsloadingBid(true);

            const result = await handleBidproduct(
                bidValue,
                messageRef,
                props.currentProduct,
                props.currentClient,
                props.currentAuct,
                session,
                setBidValue,
                setIsloadingBid,
                isAutoBidEnabled,
                true, // bidInCataloge
                showMessage,
                autoBidLimit // Passando o limite do lance automático
            );

            if (result) {
                // Lance bem-sucedido - buscar produto atualizado
                await fetchUpdatedProduct();
                
                // Resetar o limite do lance automático se necessário
                if (isAutoBidEnabled) {
                    setAutoBidLimit(0);
                }
                
                // Verificar o status do lance automático
                await checkAutoBid();
            }
        } catch (error) {
            console.error("Erro ao dar lance:", error);
            showMessage("Ocorreu um erro ao processar seu lance. Tente novamente.", "error");
        } finally {
            setIsloadingBid(false);
        }
    };

    return (
        <div className={`
            flex w-full h-full
            transition-all duration-300 ease-in-out
            ${props.showBids ? 'mr-[300px]' : 'mr-0'}
        `}>
            {/* Sistema de notificações */}
            <NotificationSystem 
                showOutbidNotification={showOutbidNotification}
                setShowOutbidNotification={setShowOutbidNotification}
                lastBidClient={lastBidClient}
                hasAutoBid={hasAutoBid}
                getIncrementValue={getIncrementValue}
                props={props}
                setIsAutoBidEnabled={setIsAutoBidEnabled}
                setAutoBidLimit={setAutoBidLimit}
                handleBidConfirm={handleBidConfirm}
            />

            {/* Container principal */}
            <div className='flex-1 flex flex-col bg-white rounded-2xl shadow-lg relative'>
                {/* Cabeçalho com título e botão de ver lances */}
                <ProductHeader 
                    props={props}
                    navigate={navigate}
                    handlePrevProduct={handlePrevProduct}
                    handleNextProduct={handleNextProduct}
                    showMessage={showMessage}
                />

                {/* Conteúdo principal com scroll */}
                <div className='flex-1 overflow-y-auto'>
                    <div className='flex flex-col w-full h-full max-h-[calc(100vh-200px)] bg-white rounded-2xl shadow-lg relative'>
                        <div className='p-6 space-y-6'>
                            <ProductContent 
                                currentProduct={props.currentProduct}
                                formatCurrency={formatCurrency}
                            />

                            <div className='sticky bottom-0 bg-white pt-4'>
                                <BidInterface 
                                    currentSession={currentSession}
                                    hasAutoBid={hasAutoBid}
                                    isAutoBidEnabled={isAutoBidEnabled}
                                    disableAutoBid={disableAutoBid}
                                    isLoadingBid={isLoadingBid}
                                    handleSetBid={handleSetBid}
                                    bidValue={bidValue}
                                    formatCurrency={formatCurrency}
                                    handleSetAutoBidLimit={handleSetAutoBidLimit}
                                    autoBidLimit={autoBidLimit}
                                    handleBidConfirm={handleBidConfirm}
                                    toggleAutoBid={toggleAutoBid}
                                    props={props}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Container dos lances */}
            <BidsList showBids={props.showBids}>
                {children}
            </BidsList>
            
            {/* Mensagem de feedback */}
            <div 
                ref={messageRef}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 -translate-y-20 
                    transition-all duration-300 opacity-0 px-6 py-3 rounded-md text-white hidden shadow-lg"
            ></div>
        </div>
    );
}

export default ProductInformation; 