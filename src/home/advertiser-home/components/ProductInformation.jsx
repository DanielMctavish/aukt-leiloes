/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import { ArrowLeft, ArrowRight, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import { handleNextProduct, handlePrevProduct } from '../functions/productNavigation';
import { handleBidproduct } from '../functions/handleBidproduct';

function ProductInformation({ children, ...props }) {
    const [currentSession, setCurrentSession] = useState();
    const [bidValue, setBidValue] = useState(0);
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
    const [hasAutoBid, setHasAutoBid] = useState(false);
    const [autoBidLimit, setAutoBidLimit] = useState(0);
    const socketRef = useRef(null);
    const navigate = useNavigate();
    const messageRef = useRef(null);

    // Função para calcular o incremento de lance com base no valor atual
    const getIncrementValue = (value) => {
        const baseValue = value || 0;
        
        if (baseValue <= 600) {
            return 20;
        } else if (baseValue <= 1200) {
            return 24; // 20% a mais que 20
        } else if (baseValue <= 3000) {
            return 30; // 50% a mais que 20
        } else if (baseValue <= 6000) {
            return 40; // 100% a mais que 20
        } else if (baseValue <= 12000) {
            return 60; // 200% a mais que 20
        } else {
            return Math.ceil(baseValue * 0.01); // 1% do valor para valores muito altos
        }
    };

    // Função para calcular o próximo valor de lance
    const calculateNextBidValue = useCallback((product) => {
        if (!product) return 0;
        
        // Se não houver lances, o valor é o valor inicial
        if (!product.Bid || product.Bid.length === 0) {
            return product.initial_value;
        }
        
        // Caso contrário, é o valor atual + incremento
        const currentValue = product.real_value || product.initial_value;
        return currentValue + getIncrementValue(currentValue);
    }, []);

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
            
            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === props.currentProduct.id) || 
                           (newBid.product_id === props.currentProduct.id))) {
                
                // Atualizar o valor do próximo lance
                const nextBidValue = calculateNextBidValue({
                    ...props.currentProduct,
                    real_value: newBid.value
                });
                setBidValue(nextBidValue);
            }
        });
        
        // Também escutar o evento normal de lance
        socket.on(`${props.currentAuct.id}-bid`, (message) => {
            console.log('Evento de lance normal recebido:', message);
            
            const newBid = message.data.body || message.data;
            
            if (newBid && newBid.product_id === props.currentProduct.id) {
                // Atualizar o valor do próximo lance
                const nextBidValue = calculateNextBidValue({
                    ...props.currentProduct,
                    real_value: newBid.value
                });
                setBidValue(nextBidValue);
            }
        });
        
        // Limpar ao desmontar
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [props.currentAuct?.id, props.currentProduct?.id]);

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

    // Efeito para atualizar o componente quando o produto mudar
    useEffect(() => {
        console.log("Produto mudou, atualizando interface:", props.currentProduct?.id);

        if (props.currentProduct) {
            // Calcular o próximo valor de lance
            const nextBidValue = calculateNextBidValue(props.currentProduct);
            setBidValue(nextBidValue);
        }

        // Verificar se o cliente tem lance automático para este produto
        checkAutoBid();
    }, [props.currentProduct?.id, calculateNextBidValue]);

    useEffect(() => {
        checkAutoBid();
        if (props.currentProduct) {
            const baseValue = props.currentProduct.real_value || props.currentProduct.initial_value;
            setBidValue(baseValue + 20);
        }
    }, [props.currentClient]);

    // Escutar o evento personalizado 'productChanged'
    useEffect(() => {
        const handleProductChanged = (event) => {
            console.log('Evento productChanged recebido em ProductInformation:', event.detail);

            // Resetar estados relacionados a lances
            setIsAutoBidEnabled(false);
            setHasAutoBid(false);

            // Verificar se o cliente tem lance automático para o novo produto
            setTimeout(() => {
                checkAutoBid();
            }, 500); // Pequeno delay para garantir que currentProduct já foi atualizado
        };

        console.log('Adicionando listener para productChanged em ProductInformation');
        window.addEventListener('productChanged', handleProductChanged);

        // Limpar ao desmontar
        return () => {
            console.log('Removendo listener para productChanged de ProductInformation');
            window.removeEventListener('productChanged', handleProductChanged);
        };
    }, []);

    const checkAutoBid = () => {
        // Usar currentSession se currentClient não estiver disponível
        const clientId = props.currentClient?.id || currentSession?.id;

        if (props.currentProduct && props.currentProduct.Bid && clientId) {
            const autoBid = props.currentProduct.Bid.find(bid =>
                bid.cover_auto === true && bid.client_id === clientId
            );
            setHasAutoBid(!!autoBid);
            setIsAutoBidEnabled(!!autoBid);
        } else {
            setHasAutoBid(false);
            setIsAutoBidEnabled(false);
        }
    };

    const disableAutoBid = async () => {
        if (!currentSession?.token || !props.currentProduct?.id) {
            showMessage('Sessão inválida ou produto não selecionado', 'error');
            return;
        }

        setIsloadingBid(true);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/disable-auto-bid`,
                {
                    product_id: props.currentProduct.id,
                    client_id: props.currentClient?.id || currentSession.id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }
            );

            if (response.status === 200) {
                setIsAutoBidEnabled(false);
                setHasAutoBid(false);
                fetchUpdatedProduct();
                showMessage('Lance automático desativado com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Erro ao desativar lance automático:', error);
            const errorMessage = error.response?.data?.body || 'Erro ao desativar lance automático';
            showMessage(errorMessage, 'error');
            checkAutoBid();
        } finally {
            setIsloadingBid(false);
        }
    };

    const toggleAutoBid = async () => {
        if (isLoadingBid) return;
        
        if (isAutoBidEnabled || hasAutoBid) {
            await disableAutoBid();
        } else {
            setIsAutoBidEnabled(true);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handleSetBid = async (e) => {
        const value = e.target.value.replace(/\D/g, '') / 100; // Remove não-dígitos e converte para decimal
        setBidValue(value);
    }

    const handleSetAutoBidLimit = (e) => {
        const value = e.target.value.replace(/\D/g, '') / 100; // Remove não-dígitos e converte para decimal
        setAutoBidLimit(value);
    };

    const handleBidConfirm = async () => {
        try {
            const session = JSON.parse(localStorage.getItem("client-auk-session-login"));
            if (!session?.token) {
                throw new Error("Sessão inválida");
            }

            // Validar limite do lance automático
            if (isAutoBidEnabled && (!autoBidLimit || autoBidLimit <= bidValue)) {
                showMessage("O valor limite do lance automático deve ser maior que o valor do lance atual", "warning");
                return;
            }

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
                // Atualizar a lista de lances e o produto
                const updatedBids = [result, ...(props.currentProduct.Bid || [])];
                props.setBidInformations(updatedBids);
                
                // Atualizar o produto com o novo valor
                const updatedProduct = {
                    ...props.currentProduct,
                    real_value: result.value,
                    Bid: updatedBids
                };
                props.setCurrentProduct(updatedProduct);

                // Calcular e definir o próximo valor de lance
                const nextBidValue = calculateNextBidValue(updatedProduct);
                setBidValue(nextBidValue);

                // Resetar o limite do lance automático se necessário
                if (isAutoBidEnabled) {
                    setAutoBidLimit(0);
                }
            }
        } catch (error) {
            console.error("Erro ao dar lance:", error);
        }
    };

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

    const renderBiddingInterface = () => {
        if (props.currentProduct.Winner) {
            return (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Este produto já foi arrematado!</h3>
                    <p className="text-lg text-gray-600 mb-4">
                        Não se preocupe, temos muitos outros itens incríveis esperando por você.
                        Continue explorando nosso catálogo para encontrar sua próxima aquisição especial!
                    </p>
                    <p className="text-md text-gray-500">
                        Dica: Fique de olho em nossos leilões futuros para não perder oportunidades únicas.
                    </p>
                </div>
            );
        }

        return currentSession ? (
            <div className='flex gap-2 text-white font-bold'>
                {!hasAutoBid && (
                    <>
                        {!isAutoBidEnabled ? (
                            <input
                                onChange={handleSetBid}
                                type="text"
                                value={formatCurrency(bidValue)}
                                className="w-[150px] h-[40px] bg-white rounded-[6px] text-[#1f1f1f] p-2"
                                disabled={isLoadingBid}
                                placeholder="Valor do lance"
                            />
                        ) : (
                            <input
                                onChange={handleSetAutoBidLimit}
                                type="text"
                                value={formatCurrency(autoBidLimit)}
                                className="w-[150px] h-[40px] bg-white rounded-[6px] text-[#1f1f1f] p-2"
                                disabled={isLoadingBid}
                                placeholder="Valor limite"
                            />
                        )}
                        <button
                            onClick={handleBidConfirm}
                            className={`w-[150px] h-[40px] rounded-md transition-colors ${isLoadingBid
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-[#141839] hover:bg-[#1e2456]'
                                }`}
                            disabled={isLoadingBid}
                        >
                            {isLoadingBid ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                'Fazer Lance'
                            )}
                        </button>
                    </>
                )}

                <div
                    onClick={!isLoadingBid ? toggleAutoBid : undefined}
                    className={`flex w-[260px] h-[40px] justify-center items-center gap-2 rounded-md cursor-pointer 
                    transition-all duration-300 ease-in-out
                    ${isAutoBidEnabled || hasAutoBid
                            ? 'bg-[#13a664] hover:bg-[#0a943d]'
                            : 'bg-[#1399CF] hover:bg-[#0d7eaa]'}
                    ${isLoadingBid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span>
                        {isAutoBidEnabled || hasAutoBid ? 'Desativar' : 'Ativar'} Lances Automáticos
                    </span>
                </div>
            </div>
        ) : (
            <button
                onClick={() => props.setIsModalOn(true)}
                className="bg-[#9f9f9f] p-2 rounded-[6px] text-white hover:bg-[#8a8a8a] transition-colors"
            >
                Faça login para dar lances
            </button>
        );
    };

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
    }, []);

    return (
        <div className={`
            flex w-full h-full
            transition-all duration-300 ease-in-out
            ${props.showBids ? 'mr-[300px]' : 'mr-0'}
        `}>
            {/* Container principal */}
            <div className='flex-1 flex flex-col bg-white rounded-2xl shadow-lg relative'>
                {/* Cabeçalho com título e botão de ver lances */}
                <div className='sticky top-0 z-10 bg-white p-6 border-b border-gray-100'>
                    <div className='flex justify-between items-center'>
                        <div className="flex flex-col">
                            <span className='text-gray-500 text-sm'>Lote</span>
                            <span className='font-semibold text-2xl text-gray-800'>{props.currentProduct.lote}</span>
                        </div>

                        {/* Botão de ver/ocultar lances */}
                        <button
                            onClick={() => props.setShowBids(!props.showBids)}
                            className="flex items-center gap-2 px-4 py-2 
                                bg-gradient-to-r from-[#143247] to-blue-600 
                                hover:from-blue-600 hover:to-blue-700
                                text-white rounded-full shadow-md hover:shadow-lg 
                                transition-all duration-300 text-sm font-medium"
                        >
                            <Visibility sx={{ fontSize: 18 }} />
                            <span>{props.showBids ? 'Ocultar Lances' : 'Ver Lances'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePrevProduct(
                                    props.currentAuct,
                                    props.currentProduct,
                                    props.setCurrentProduct,
                                    props.setBidInformations,
                                    navigate,
                                    showMessage
                                )}
                                className={`p-2 rounded-full hover:bg-gray-100 transition-all duration-300
                                    ${props.currentProduct.lote <= 1
                                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                                        : 'text-gray-600 hover:text-gray-800'}`}
                                disabled={props.currentProduct.lote <= 1}
                            >
                                <ArrowLeft sx={{ fontSize: "32px" }} />
                            </button>
                            <button
                                onClick={() => handleNextProduct(
                                    props.currentAuct,
                                    props.currentProduct,
                                    props.setCurrentProduct,
                                    props.setBidInformations,
                                    navigate,
                                    showMessage
                                )}
                                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300
                                    text-gray-600 hover:text-gray-800"
                            >
                                <ArrowRight sx={{ fontSize: "32px" }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conteúdo principal com scroll */}
                <div className='flex-1 overflow-y-auto'>
                    <div className='flex flex-col w-full h-full max-h-[calc(100vh-200px)] bg-white rounded-2xl shadow-lg relative'>
                        <div className='p-6 space-y-6'>
                            <div className='space-y-4'>
                                <h1 className='font-bold text-3xl text-gray-800 leading-tight'>
                                    {props.currentProduct.title}
                                </h1>
                                <p className='text-gray-600 text-lg'>
                                    {props.currentProduct.description}
                                </p>
                                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                    <span className='text-sm font-medium'>
                                        {props.currentProduct.Bid && props.currentProduct.Bid.length} lance(s)
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 my-6">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <span className='text-gray-500 text-sm block mb-1'>Valor inicial</span>
                                    <span className='text-xl font-semibold text-gray-800'>
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(props.currentProduct.initial_value)}
                                    </span>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <span className='text-blue-600 text-sm block mb-1'>Valor atual</span>
                                    <span className='text-xl font-semibold text-blue-800'>
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(props.currentProduct.real_value)}
                                    </span>
                                </div>
                            </div>

                            <div className='sticky bottom-0 bg-white pt-4'>
                                {renderBiddingInterface()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Container dos lances */}
            <div className={`
                fixed right-0 top-0 h-full
                w-[300px]
                transform transition-all duration-300 ease-in-out
                ${props.showBids ? 'translate-x-0' : 'translate-x-[100%]'}
                z-20 bg-white shadow-2xl
            `}>
                {children}
            </div>
        </div>
    );
}

export default ProductInformation;