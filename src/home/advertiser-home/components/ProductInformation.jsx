/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import { ArrowLeft, ArrowRight, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

function ProductInformation({ children, ...props }) {
    const [currentSession, setCurrentSession] = useState();
    const [bidValue, setBidValue] = useState(0);
    const [bidLimit, setBidLimit] = useState(0);
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
    const [hasAutoBid, setHasAutoBid] = useState(false);
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
            
            // Extrair o lance da estrutura correta
            const newBid = message.data.body;
            
            // Verificar se o lance é para o produto atual
            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === props.currentProduct.id) || 
                           (newBid.product_id === props.currentProduct.id))) {
                
                // Buscar informações atualizadas do produto
                fetchUpdatedProduct();
            }
        });
        
        // Também escutar o evento normal de lance
        socket.on(`${props.currentAuct.id}-bid`, (message) => {
            console.log('Evento de lance normal recebido:', message);
            
            // Extrair o lance da estrutura correta
            const newBid = message.data.body || message.data;
            
            // Verificar se o lance é para o produto atual
            if (newBid && newBid.product_id === props.currentProduct.id) {
                // Buscar informações atualizadas do produto
                fetchUpdatedProduct();
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
                
                // Atualizar o limite de lance automático se necessário
                if (!bidLimit || bidLimit < nextBidValue) {
                    setBidLimit(Math.round(nextBidValue * 1.5));
                }
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
            
            // Definir um valor padrão para o limite de lance automático
            setBidLimit(Math.round(nextBidValue * 1.5));
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

    const handleNextProduct = async () => {
        try {
            // Primeiro, buscar todos os produtos do leilão
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    auct_id: props.currentAuct.id,
                }
            });

            const products = response.data.products || response.data;
            const sortedProducts = products.sort((a, b) => a.lote - b.lote);
            const currentIndex = sortedProducts.findIndex(p => p.id === props.currentProduct.id);

            if (currentIndex < sortedProducts.length - 1) {
                const nextProduct = sortedProducts[currentIndex + 1];

                // Buscar informações atualizadas do próximo produto
                const updatedProductResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${nextProduct.id}`
                );

                const updatedProduct = updatedProductResponse.data;
                props.setCurrentProduct(updatedProduct);
                props.setBidInformations(updatedProduct.Bid || []);
                navigate(`/advertiser/home/product/${updatedProduct.id}`);
            }
        } catch (error) {
            console.error("Erro ao buscar próximo produto:", error);
        }
    };

    const handlePrevProduct = async () => {
        try {
            // Buscar todos os produtos do leilão
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    auct_id: props.currentAuct.id,
                    status: true // Adiciona filtro para garantir produtos ativos
                }
            });

            if (!response.data) {
                console.error("Nenhum dado retornado da API");
                return;
            }

            // Garantir que temos um array de produtos
            const products = Array.isArray(response.data) ? response.data : 
                           (response.data.products || []);

            // Ordenar produtos por número do lote e garantir que são números
            const sortedProducts = products
                .filter(p => p && typeof p.lote === 'number') // Garante que lote é número
                .sort((a, b) => a.lote - b.lote);

            // Encontrar índice do produto atual
            const currentIndex = sortedProducts.findIndex(p => p.id === props.currentProduct.id);

            if (currentIndex > 0) {
                const prevProduct = sortedProducts[currentIndex - 1];

                try {
                    // Buscar informações detalhadas do produto anterior
                    const updatedProductResponse = await axios.get(
                        `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${prevProduct.id}`
                    );

                    if (updatedProductResponse.data) {
                        props.setCurrentProduct(updatedProductResponse.data);
                        props.setBidInformations(updatedProductResponse.data.Bid || []);
                        navigate(`/advertiser/home/product/${updatedProductResponse.data.id}`);
                    }
                } catch (error) {
                    console.error("Erro ao buscar detalhes do produto anterior:", error);
                    showMessage("Erro ao carregar produto anterior", "error");
                }
            } else {
                showMessage("Este é o primeiro lote", "info");
            }
        } catch (error) {
            console.error("Erro ao buscar lista de produtos:", error);
            showMessage("Erro ao navegar entre produtos", "error");
        }
    };

    const handleSetBid = async (e) => {
        const value = e.target.value;
        if (isNaN(value) || value.trim() === '') return null;
        setBidValue(Number(value));
    }

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
                
                // Atualizar o produto para refletir a mudança
                fetchUpdatedProduct();
                
                showMessage('Lance automático desativado com sucesso!', 'success');
                
                // Disparar evento para notificar outros componentes
                const autoBidDisabledEvent = new CustomEvent('autoBidDisabled', { 
                    detail: { 
                        productId: props.currentProduct.id,
                        clientId: props.currentClient?.id || currentSession.id
                    } 
                });
                window.dispatchEvent(autoBidDisabledEvent);
            }
        } catch (error) {
            console.error('Erro ao desativar lance automático:', error);
            
            // Tratar as respostas específicas do backend
            const errorMessage = error.response?.data?.body || 'Erro ao desativar lance automático';
            
            if (errorMessage === 'Client has no bids on this product') {
                showMessage('Você não possui lances automáticos ativos neste produto', 'error');
            } else if (errorMessage === 'Product ID and Client ID are required') {
                showMessage('Dados incompletos para desativar o lance automático', 'error');
            } else {
                showMessage(errorMessage, 'error');
            }
            
            // Verificar o estado atual dos lances automáticos
            checkAutoBid();
        } finally {
            setIsloadingBid(false);
        }
    };

    const toggleAutoBid = async () => {
        if (isLoadingBid) return;
        
        // Se já está ativado, precisamos desativar
        if (isAutoBidEnabled || hasAutoBid) {
            await disableAutoBid();
        } else {
            setIsAutoBidEnabled(true);
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

    const handleBidConfirm = async () => {
        console.log("produto atual -> ", props.currentProduct)

        setIsloadingBid(true);
        try {
            // Buscar informações mais recentes do produto antes de dar o lance
            const updatedProductResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${props.currentProduct.id}`
            );
            const updatedProduct = updatedProductResponse.data;

            // Atualizar o estado com as informações mais recentes
            props.setCurrentProduct(updatedProduct);

            const session = JSON.parse(localStorage.getItem("client-auk-session-login"));
            if (!session?.token) {
                throw new Error("Sessão inválida");
            }

            // Validar o limite para lance automático
            if (isAutoBidEnabled && (!bidLimit || bidLimit <= bidValue)) {
                throw new Error("O limite para lances automáticos deve ser maior que o valor do lance atual");
            }

            const bidPayload = {
                value: bidValue,
                client_id: props.currentClient.id,
                product_id: updatedProduct.id,
                auct_id: props.currentAuct.id,
                cover_auto: isAutoBidEnabled,
                // Adicionar o limite para lance automático quando habilitado
                cover_auto_limit: isAutoBidEnabled ? bidLimit : null,
                Client: props.currentClient
            };

            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct?bidInCataloge=true`,
                bidPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${session.token}`
                    }
                }
            );

            if (response.status === 200) {
                const newBid = response.data?.body || response.data;

                if (newBid) {
                    // Adicionar o cliente ao novo lance se não estiver presente
                    if (!newBid.client && props.currentClient) {
                        newBid.client = props.currentClient;
                    }

                    // Criar a lista atualizada de lances
                    const updatedBids = [newBid, ...(updatedProduct.Bid || [])];
                    console.log('Atualizando bidInformations com', updatedBids.length, 'lances');

                    // Garantir que todos os lances tenham a informação do cliente
                    updatedBids.forEach(bid => {
                        if (!bid.client && props.currentClient) {
                            bid.client = { ...props.currentClient };
                        }
                    });

                    // Atualizar o estado com os lances
                    props.setBidInformations(updatedBids);

                    // Atualizar o produto atual
                    props.setCurrentProduct(prevProduct => ({
                        ...prevProduct,
                        real_value: newBid.value,
                        Bid: updatedBids
                    }));

                    console.log('Novo lance realizado:', newBid);
                    console.log('Lista atualizada de lances:', updatedBids);

                    // Disparar evento personalizado para notificar sobre o novo lance
                    try {
                        // Criar uma cópia segura dos dados para o evento
                        const bidCopy = JSON.parse(JSON.stringify(newBid));

                        // Garantir que o lance tenha as informações do cliente
                        if (!bidCopy.client && props.currentClient) {
                            bidCopy.client = JSON.parse(JSON.stringify(props.currentClient));
                        }

                        // Garantir que temos uma lista válida de lances
                        let allBidsCopy = [];

                        // Adicionar o novo lance no início da lista
                        allBidsCopy.push(bidCopy);

                        // Adicionar os lances existentes, excluindo duplicatas
                        if (updatedProduct.Bid && Array.isArray(updatedProduct.Bid)) {
                            updatedProduct.Bid.forEach(existingBid => {
                                // Evitar duplicatas
                                if (existingBid.id !== bidCopy.id) {
                                    const existingBidCopy = JSON.parse(JSON.stringify(existingBid));

                                    // Preservar as informações do cliente original
                                    if (!existingBidCopy.client && existingBidCopy.Client) {
                                        existingBidCopy.client = existingBidCopy.Client;
                                    }

                                    // Para lances automáticos, garantir que o cliente seja o dono do lance automático
                                    if (existingBidCopy.cover_auto === true && existingBidCopy.client_id) {
                                        // Se o lance automático tem um client_id diferente do cliente atual,
                                        // procurar o cliente correto em outros lances
                                        if (existingBidCopy.client_id !== props.currentClient.id) {
                                            const clientInfo = findClientForAutoBid(existingBidCopy, updatedProduct.Bid);
                                            if (clientInfo) {
                                                existingBidCopy.client = clientInfo;
                                                console.log('Cliente encontrado para lance automático:', clientInfo);
                                            }
                                        }
                                    }

                                    allBidsCopy.push(existingBidCopy);
                                }
                            });
                        }

                        // Ordenar os lances por data mais recente
                        allBidsCopy.sort((a, b) => {
                            const dateA = a.bidTime || a.created_at;
                            const dateB = b.bidTime || b.created_at;

                            if (!dateA && !dateB) return 0;
                            if (!dateA) return 1;
                            if (!dateB) return -1;

                            return new Date(dateB) - new Date(dateA);
                        });

                        console.log('Preparando para disparar evento com lances:', allBidsCopy.length);

                        // Usar setTimeout para garantir que o evento seja disparado após a atualização do estado
                        setTimeout(() => {
                            // Atualizar diretamente o estado do componente BidsAdvertiserHome
                            props.setBidInformations(allBidsCopy);

                            // Disparar o evento
                            const newBidEvent = new CustomEvent('newBidPlaced', {
                                detail: {
                                    bid: bidCopy,
                                    allBids: allBidsCopy
                                }
                            });
                            console.log('Disparando evento newBidPlaced');
                            window.dispatchEvent(newBidEvent);
                            console.log('Evento disparado com sucesso');
                        }, 10);
                    } catch (eventError) {
                        console.error('Erro ao disparar evento:', eventError);
                    }

                    setBidValue(0);
                    showMessage('Lance realizado com sucesso! 🎉');
                } else {
                    throw new Error("Resposta inválida do servidor");
                }
            }
        } catch (error) {
            console.error("Erro ao dar lance:", error);
            const errorMessage = error.response?.data?.body || error.message || "Erro ao realizar lance";
            showMessage(errorMessage, 'error');
        } finally {
            setIsloadingBid(false);
        }
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
                {!isAutoBidEnabled && !hasAutoBid && (
                    <input
                        onChange={handleSetBid}
                        type="text"
                        value={bidValue}
                        className="w-[150px] h-[40px] bg-white rounded-[6px] text-[#1f1f1f] p-2"
                        disabled={isLoadingBid}
                    />
                )}

                {isAutoBidEnabled && (
                    <div className="flex flex-col">
                        <input 
                            type="text"
                            onChange={(e) => setBidLimit(Number(e.target.value))}
                            value={bidLimit}
                            className="w-[150px] h-[40px] bg-white rounded-[6px] text-[#1f1f1f] p-2"
                            disabled={isLoadingBid} 
                            placeholder="Limite máximo"
                        />
                        <span className="text-xs text-gray-300 mt-1">
                            Limite máximo para lances automáticos
                        </span>
                    </div>
                )}

                {!hasAutoBid && (
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
                setBidLimit(0);
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
                                onClick={handlePrevProduct}
                                className={`p-2 rounded-full hover:bg-gray-100 transition-all duration-300
                                    ${props.currentProduct.lote <= 1
                                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                                        : 'text-gray-600 hover:text-gray-800'}`}
                                disabled={props.currentProduct.lote <= 1}
                            >
                                <ArrowLeft sx={{ fontSize: "32px" }} />
                            </button>
                            <button
                                onClick={handleNextProduct}
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