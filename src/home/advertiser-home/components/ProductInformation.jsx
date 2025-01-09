/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function ProductInformation({ currentProduct, currentClient, currentAuct, setCurrentProduct, setBidInformations, setIsModalOn }) {
    const [currentSession, setCurrentSession] = useState();
    const [bidValue, setBidValue] = useState(0);
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
    const [hasAutoBid, setHasAutoBid] = useState(false);
    const navigate = useNavigate();
    const messageRef = useRef(null);

    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
        setCurrentSession(currentSession);
    }, []);

    useEffect(() => {
        checkAutoBid();
    }, [currentProduct, currentClient]);

    const checkAutoBid = () => {
        if (currentProduct && currentProduct.Bid && currentClient) {
            const autoBid = currentProduct.Bid.find(bid =>
                bid.cover_auto === true && bid.client_id === currentClient.id
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
        if (messageRef.current) {
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
                        messageRef.current.classList.add('hidden');
                        messageRef.current.classList.remove('opacity-0', 'translate-y-[-20px]');
                    }, 300);
                }
            }, 3000);
        }
    };

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

            const bidPayload = {
                value: bidValue,
                client_id: currentClient.id,
                product_id: updatedProduct.id, // Usando o ID do produto atualizado
                auct_id: currentAuct.id,
                cover_auto: isAutoBidEnabled,
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
                    setBidInformations(prevBids => [newBid, ...prevBids]);
                    setCurrentProduct(prevProduct => ({
                        ...prevProduct,
                        real_value: newBid.value,
                        Bid: [newBid, ...(prevProduct.Bid || [])]
                    }));
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

                {!hasAutoBid && (
                    <button
                        onClick={handleBidConfirm}
                        className={`w-[150px] h-[40px] rounded-md transition-colors ${
                            isLoadingBid
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
        <div className='flex flex-col flex-1 max-w-[60%] h-full justify-start items-center px-[3vh]'>
            <div 
                ref={messageRef} 
                className="fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg hidden
                    text-white font-medium min-w-[300px] max-w-md z-50
                    transition-all duration-300 ease-in-out
                    flex items-center justify-between
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