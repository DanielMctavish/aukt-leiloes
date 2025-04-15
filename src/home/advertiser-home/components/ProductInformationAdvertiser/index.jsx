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
import useProductSession from "./hooks/useProductSession";
import useBidding from "./hooks/useBidding";
import useNotifications from "./hooks/useNotifications";
import handleBidConfirm from "./functions/handleBidConfirm";
import fetchAndUpdateProduct from "./functions/fetchAndUpdateProduct";

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
                fetchAndUpdateProduct({
                    productId: props.currentProduct.id,
                    props,
                    currentSession,
                    setLastBidClient,
                    setBidValue,
                    calculateNextBidValue,
                    notificationTimeoutRef,
                    lastNotifiedBidRef,
                    setShowOutbidNotification,
                    showMessage
                });
            }
        });
        
        // Também escutar o evento normal de lance
        socket.on(`${props.currentAuct.id}-bid`, (message) => {
            console.log('Evento de lance normal recebido:', message);
            
            const newBid = message.data.body || message.data;
            
            if (newBid && newBid.product_id === props.currentProduct.id) {
                console.log('Lance normal corresponde ao produto atual, buscando produto atualizado');
                fetchAndUpdateProduct({
                    productId: props.currentProduct.id,
                    props,
                    currentSession,
                    setLastBidClient,
                    setBidValue,
                    calculateNextBidValue,
                    notificationTimeoutRef,
                    lastNotifiedBidRef,
                    setShowOutbidNotification,
                    showMessage
                });
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
                checkAutoBid();
            }
        };

        window.addEventListener('clientStateChanged', handleClientStateChanged);

        return () => {
            window.removeEventListener('clientStateChanged', handleClientStateChanged);
        };
    }, [checkAutoBid, setCurrentSession, setBidValue, setIsAutoBidEnabled, setHasAutoBid]);

    // Efeito para limpar timeouts quando o componente é desmontado
    useEffect(() => {
        return () => {
            // Limpar timeout de notificação
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full max-w-full overflow-hidden">
            {/* Cabeçalho com navegação e controles */}
            <ProductHeader
                productId={props.currentProduct?.id}
                auctId={props.currentAuct?.id}
                setShowBids={props.setShowBids}
                showBids={props.showBids}
                handlePrevProduct={() => handlePrevProduct(props.currentProduct, props.currentAuct, navigate)}
                handleNextProduct={() => handleNextProduct(props.currentProduct, props.currentAuct, navigate)}
            />

            {/* Corpo principal - agora com limitador de largura e scroll horizontal oculto */}
            <div className="w-full max-w-full overflow-x-hidden">
                {/* Conteúdo do produto */}
                <ProductContent 
                    currentProduct={props.currentProduct} 
                    formatCurrency={formatCurrency}
                />
                
                {/* Interface de lances */}
                <div className="w-full mt-2 md:mt-4">
                    <div className="w-full max-w-full">
                        <BidInterface
                            bidValue={bidValue}
                            isLoadingBid={isLoadingBid}
                            currentProduct={props.currentProduct}
                            currentClient={props.currentClient}
                            handleSetBid={handleSetBid}
                            handleBidConfirm={() => handleBidConfirm({
                                bidValue,
                                productId: props.currentProduct?.id,
                                clientId: props.currentClient?.id,
                                isLoadingBid,
                                setIsloadingBid,
                                currentSession,
                                navigate,
                                setIsModalOn: props.setIsModalOn,
                                fetchProduct: () => fetchAndUpdateProduct({
                                    productId: props.currentProduct.id,
                                    props,
                                    currentSession,
                                    setLastBidClient,
                                    setBidValue,
                                    calculateNextBidValue,
                                }),
                                checkAutoBid,
                                setAutoBidLimit,
                                showMessage
                            })}
                            toggleAutoBid={toggleAutoBid}
                            props={props}
                        />
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