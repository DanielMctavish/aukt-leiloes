/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";

function ProductInformation({ currentProduct, currentClient, currentAuct, setCurrentProduct, setBidInformations, setIsModalOn }) {
    const [currentSession, setCurrentSession] = useState();
    const [bidValue, setBidValue] = useState(0);
    const [bidLimit, setBidLimit] = useState(0);
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
    const [hasAutoBid, setHasAutoBid] = useState(false);
    const navigate = useNavigate();
    const messageRef = useRef(null);

    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
        setCurrentSession(currentSession);

        // Adicionar listener para o evento de login bem-sucedido
        const handleLoginSuccess = (event) => {
            setCurrentSession(event.detail);
            // Atualizar a interface após login bem-sucedido
            checkAutoBid();
            // Mostrar mensagem de boas-vindas
            showMessage(`Bem-vindo, ${event.detail.name}! Você está pronto para dar lances.`, 'success');
        };

        window.addEventListener('clientLoginSuccess', handleLoginSuccess);

        // Limpar o listener quando o componente for desmontado
        return () => {
            window.removeEventListener('clientLoginSuccess', handleLoginSuccess);
        };
    }, []);

    // Efeito para atualizar o componente quando o produto mudar
    useEffect(() => {
        console.log("Produto mudou, atualizando interface:", currentProduct?.id);

        // Resetar o valor do lance quando o produto mudar
        if (currentProduct) {
            const baseValue = currentProduct.real_value || currentProduct.initial_value;
            setBidValue(baseValue + 20);
            // Definir um valor padrão para o limite de lance automático (ex: 50% acima do valor atual)
            setBidLimit(Math.round(baseValue * 1.5));
        }

        // Verificar se o cliente tem lance automático para este produto
        checkAutoBid();
    }, [currentProduct?.id]);

    useEffect(() => {
        checkAutoBid();
        if (currentProduct) {
            const baseValue = currentProduct.real_value || currentProduct.initial_value;
            setBidValue(baseValue + 20);
        }
    }, [currentClient]);

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
        const clientId = currentClient?.id || currentSession?.id;

        if (currentProduct && currentProduct.Bid && clientId) {
            const autoBid = currentProduct.Bid.find(bid =>
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
                    auct_id: currentAuct.id,
                }
            });

            const products = response.data.products || response.data;
            const sortedProducts = products.sort((a, b) => a.lote - b.lote);
            const currentIndex = sortedProducts.findIndex(p => p.id === currentProduct.id);

            if (currentIndex < sortedProducts.length - 1) {
                const nextProduct = sortedProducts[currentIndex + 1];

                // Buscar informações atualizadas do próximo produto
                const updatedProductResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${nextProduct.id}`
                );

                const updatedProduct = updatedProductResponse.data;
                setCurrentProduct(updatedProduct);
                setBidInformations(updatedProduct.Bid || []);
                navigate(`/advertiser/home/product/${updatedProduct.id}`);
            }
        } catch (error) {
            console.error("Erro ao buscar próximo produto:", error);
        }
    };

    const handlePrevProduct = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    auct_id: currentAuct.id,
                }
            });

            const products = response.data.products || response.data;
            const sortedProducts = products.sort((a, b) => a.lote - b.lote);
            const currentIndex = sortedProducts.findIndex(p => p.id === currentProduct.id);

            if (currentIndex > 0) {
                const prevProduct = sortedProducts[currentIndex - 1];

                // Buscar informações atualizadas do produto anterior
                const updatedProductResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${prevProduct.id}`
                );

                const updatedProduct = updatedProductResponse.data;
                setCurrentProduct(updatedProduct);
                setBidInformations(updatedProduct.Bid || []);
                navigate(`/advertiser/home/product/${updatedProduct.id}`);
            }
        } catch (error) {
            console.error("Erro ao buscar produto anterior:", error);
        }
    };

    const handleSetBid = async (e) => {
        const value = e.target.value;
        if (isNaN(value) || value.trim() === '') return null;
        setBidValue(Number(value));
    }

    const toggleAutoBid = () => {
        setIsAutoBidEnabled(!isAutoBidEnabled);
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
        console.log("produto atual -> ", currentProduct)

        setIsloadingBid(true);
        try {
            // Buscar informações mais recentes do produto antes de dar o lance
            const updatedProductResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${currentProduct.id}`
            );
            const updatedProduct = updatedProductResponse.data;

            // Atualizar o estado com as informações mais recentes
            setCurrentProduct(updatedProduct);

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
                client_id: currentClient.id,
                product_id: updatedProduct.id,
                auct_id: currentAuct.id,
                cover_auto: isAutoBidEnabled,
                // Adicionar o limite para lance automático quando habilitado
                cover_auto_limit: isAutoBidEnabled ? bidLimit : null,
                Client: currentClient
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
                    if (!newBid.client && currentClient) {
                        newBid.client = currentClient;
                    }

                    // Criar a lista atualizada de lances
                    const updatedBids = [newBid, ...(updatedProduct.Bid || [])];
                    console.log('Atualizando bidInformations com', updatedBids.length, 'lances');

                    // Garantir que todos os lances tenham a informação do cliente
                    updatedBids.forEach(bid => {
                        if (!bid.client && currentClient) {
                            bid.client = { ...currentClient };
                        }
                    });

                    // Atualizar o estado com os lances
                    setBidInformations(updatedBids);

                    // Atualizar o produto atual
                    setCurrentProduct(prevProduct => ({
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
                        if (!bidCopy.client && currentClient) {
                            bidCopy.client = JSON.parse(JSON.stringify(currentClient));
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
                                        if (existingBidCopy.client_id !== currentClient.id) {
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
                            setBidInformations(allBidsCopy);

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
        if (currentProduct.Winner) {
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
                    ${isAutoBidEnabled
                            ? 'bg-[#13a664] hover:bg-[#0a943d]'
                            : 'bg-[#1399CF] hover:bg-[#0d7eaa]'}
                    ${isLoadingBid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span>
                        {isAutoBidEnabled ? 'Desativar' : 'Ativar'} Lances Automáticos
                    </span>
                </div>
            </div>
        ) : (
            <button
                onClick={() => setIsModalOn(true)}
                className="bg-[#9f9f9f] p-2 rounded-[6px] text-white hover:bg-[#8a8a8a] transition-colors"
            >
                Faça login para dar lances
            </button>
        );
    };

    return (
        <div className='flex flex-col flex-1 max-w-[60%] h-[700px] justify-start items-center px-[3vh]'>
            <div
                ref={messageRef}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg hidden
                    text-white font-medium min-w-[300px] max-w-md z-50
                    transition-all duration-300 ease-in-out
                    items-center justify-between
                    backdrop-blur-sm bg-opacity-95"
            >
                <span className="flex-1 text-center">mensagem de lance</span>
                <button
                    onClick={() => messageRef.current?.classList.add('hidden')}
                    className="ml-3 text-white hover:text-gray-200 transition-colors"
                >
                    ×
                </button>
            </div>

            <div className='flex flex-col w-full h-full justify-start gap-4 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto'>
                <div className='flex w-full justify-between items-center border-b border-gray-100 pb-4'>
                    <div className="flex flex-col">
                        <span className='text-gray-500 text-sm'>Lote</span>
                        <span className='font-semibold text-2xl text-gray-800'>{currentProduct.lote}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevProduct}
                            className={`p-2 rounded-full hover:bg-gray-100 transition-all duration-300
                                ${currentProduct.lote <= 1
                                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                                    : 'text-gray-600 hover:text-gray-800'}`}
                            disabled={currentProduct.lote <= 1}
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

                <div className="space-y-4">
                    <h1 className='font-bold text-3xl text-gray-800 leading-tight'>
                        {currentProduct.title}
                    </h1>
                    <p className='text-gray-600 text-lg'>
                        {currentProduct.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        <span className='text-sm font-medium'>
                            {currentProduct.Bid && currentProduct.Bid.length} lance(s)
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
                            }).format(currentProduct.initial_value)}
                        </span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <span className='text-blue-600 text-sm block mb-1'>Valor atual</span>
                        <span className='text-xl font-semibold text-blue-800'>
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(currentProduct.real_value)}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    {renderBiddingInterface()}
                </div>

                <button
                    onClick={() => navigate(`/advertiser/home/shop/${currentAuct.id}`)}
                    className="mt-6 w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 
                        text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 
                        transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Ver Catálogo Completo
                </button>
            </div>
        </div>
    )
}

export default ProductInformation;