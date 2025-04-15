/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import formatCurrency from "../../../../utils/formatCurrency";
import axios from "axios";
// Importar ícones do MUI
import { 
    Gavel, // Ícone de martelo para lance
    AutoMode, // Ícone de modo automático
    Autorenew, // Ícone circular girando
    Login // Ícone de login
} from "@mui/icons-material";

// Componente com a interface de lances
const BidInterface = ({ 
    currentSession,
    productInfo,
    setIsModalOn
}) => {
    // Estados locais
    const [bidValue, setBidValue] = useState(0);
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
    const [hasAutoBid, setHasAutoBid] = useState(false);
    const [autoBidLimit, setAutoBidLimit] = useState(0);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    // Função para mostrar mensagens ao usuário
    const displayMessage = useCallback((message, type = 'success') => {
        setMessageText(message);
        setMessageType(type);
        setShowMessage(true);
        
        setTimeout(() => {
            setShowMessage(false);
        }, 3000);
    }, []);


    const handleConfirmLimite = async () => { //função INDEPENDENTE DE LANCE AUTOMATICO!
        if (!currentSession?.token || !productInfo?.id) {
            displayMessage("Sessão inválida ou produto não selecionado", "error");
            return;
        }

        setIsloadingBid(true);

        try {
            // Buscar informações atualizadas do produto
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productInfo.id}`
            );

            const product = response.data;
            const currentValue = product.real_value || product.initial_value;
            const increment = getIncrementValue(currentValue);
            const bidAmount = currentValue + increment;

            // Dar o lance automático com o limite definido
            await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`,
                {
                    value: parseFloat(bidAmount),
                    client_id: currentSession.id,
                    auct_id: productInfo.auct_id,
                    product_id: productInfo.id,
                    cover_auto: true,
                    cover_auto_limit: parseFloat(autoBidLimit)
                },
                {
                    params: {
                        bidInCataloge: true
                    },
                    headers: {
                        "Authorization": `Bearer ${currentSession.token}`
                    }
                }
            );

            // Atualizar a interface
            displayMessage("Lance automático ativado com sucesso!", "success");
            setHasAutoBid(true);
            updateProductInfo();

        } catch (error) {
            displayMessage(error.response?.data?.message || "Erro ao registrar lance automático", "error");
        } finally {
            setIsloadingBid(false);
        }
    };

    // Verificar se o cliente tem lance automático para este produto
    const checkAutoBid = useCallback(async () => {
        if (!currentSession?.id || !productInfo?.id) return;
        
        try {
            // Buscar o produto diretamente para ter as informações mais atualizadas
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productInfo.id}`
            );
            
            if (response.data && response.data.Bid) {
                const autoBid = response.data.Bid.find(bid =>
                    bid.cover_auto === true && bid.client_id === currentSession.id
                );
                
                setHasAutoBid(!!autoBid);
                setIsAutoBidEnabled(!!autoBid);
            }
        } catch (error) {
            // Erro ao verificar status de lance automático
        }
    }, [productInfo?.id, currentSession?.id]);

    // Função para calcular o incremento de lance com base no valor atual
    const getIncrementValue = useCallback((value) => {
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
    }, []);

    // Função para calcular o próximo valor de lance
    const calculateNextBidValue = useCallback(async () => {
        if (!productInfo?.id) return 0;
        
        try {
            // Buscar as informações atualizadas do produto
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productInfo.id}`
            );
            
            const product = response.data;
            
            // Se não houver lances, o valor é o valor inicial
            if (!product.Bid || product.Bid.length === 0) {
                return product.initial_value;
            }
            
            // Caso contrário, é o valor atual + incremento
            const currentValue = product.real_value || product.initial_value;
            return currentValue + getIncrementValue(currentValue);
        } catch (error) {
            return 0;
        }
    }, [productInfo?.id, getIncrementValue]);

    // Atualizar as informações quando o produto mudar
    const updateProductInfo = useCallback(async () => {
        const nextBidValue = await calculateNextBidValue();
        setBidValue(nextBidValue);
        checkAutoBid();
    }, [calculateNextBidValue, checkAutoBid]);

    // Efeito para atualizar o componente quando o produto mudar
    useEffect(() => {
        updateProductInfo();
    }, [productInfo?.id, updateProductInfo]);

    // Função para processar entrada do valor de lance
    const handleSetBid = (e) => {
        // Remove caracteres não numéricos, mantendo apenas números
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        
        // Converte para número considerando os centavos
        const value = numericValue ? parseFloat(numericValue) / 100 : 0;
        
        setBidValue(value);
    };

    // Função para processar entrada do valor limite de lance automático
    const handleSetAutoBidLimit = (e) => {
        // Remove caracteres não numéricos, mantendo apenas números
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        
        // Converte para número considerando os centavos
        const value = numericValue ? parseFloat(numericValue) / 100 : 0;
        
        setAutoBidLimit(value);
    };

    // Função para desativar o lance automático
    const disableAutoBid = async () => {
        if (!currentSession?.token || !productInfo?.id) {
            displayMessage('Sessão inválida ou produto não selecionado', 'error');
            return;
        }

        setIsloadingBid(true);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/disable-auto-bid`,
                {
                    product_id: productInfo.id,
                    client_id: currentSession.id
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
                displayMessage('Lance automático desativado com sucesso!', 'success');
                updateProductInfo();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.body || 'Erro ao desativar lance automático';
            displayMessage(errorMessage, 'error');
        } finally {
            setIsloadingBid(false);
        }
    };

    // Função para alternar o modo de lance automático
    const toggleAutoBid = async () => {
        if (isLoadingBid) return;
        
        const newState = !isAutoBidEnabled;
        
        // Se estiver ativando o lance automático
        if (newState) {
            try {
                // Buscar o valor atual do produto para garantir que temos os dados mais recentes
                await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productInfo.id}`
                );
                
                // Para lance automático, definimos o autoBidLimit como o valor atual do bid
                // Isso é apenas o valor inicial sugerido, o usuário pode alterar
                setAutoBidLimit(bidValue);
                
                // Exibir mensagem explicativa
                displayMessage("Defina o valor limite para seus lances automáticos", "info");
            } catch (error) {
                displayMessage("Erro ao buscar informações do produto", "error");
                return;
            }
        }
        
        setIsAutoBidEnabled(newState);
    };

    // Função para confirmar o lance
    const handleBidConfirm = async () => {
        if (!currentSession?.token) {
            setIsModalOn(true); // Abrir modal de login
            return;
        }

        if (isLoadingBid) {
            return;
        }

        setIsloadingBid(true);

        try {
            // Enviar o lance
            await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`,
                {
                    value: parseFloat(bidValue),
                    client_id: currentSession.id,
                    auct_id: productInfo.auct_id,
                    product_id: productInfo.id,
                    cover_auto: false,
                    cover_auto_limit: null
                },
                {
                    params: {
                        bidInCataloge: true
                    },
                    headers: {
                        "Authorization": `Bearer ${currentSession.token}`
                    }
                }
            );

            // Lance bem-sucedido
            displayMessage("Lance realizado com sucesso!", "success");
            updateProductInfo();
        } catch (error) {
            displayMessage(error.response?.data?.message || "Erro ao processar seu lance", "error");
        } finally {
            setIsloadingBid(false);
        }
    };

    // Verificar login do cliente via localStorage como fallback
    const clientIsLoggedIn = () => {
        try {
            // Se temos currentSession, usá-lo primeiro
            if (currentSession) return true;
            
            // Fallback para verificar diretamente o localStorage
            const storedSession = localStorage.getItem("client-auk-session-login");
            return !!storedSession && !!JSON.parse(storedSession)?.token;
        } catch (error) {
            return false;
        }
    };

    // Renderizar interfaces diferentes dependendo do estado do produto e do usuário
    const renderBiddingInterface = () => {
        if (productInfo.Winner) {
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

        // Verificar o login do cliente com o método aprimorado
        const isLoggedIn = clientIsLoggedIn();

        return isLoggedIn ? (
            <div className='flex flex-col gap-3'>
                {/* Indicador de lance automático ativo */}
                {hasAutoBid && (
                    <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded-md mb-2">
                        <div className="flex items-center">
                            <div className="mr-2">
                                <div className="relative flex items-center">
                                    <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-green-700 font-medium">Lance automático ativo</p>
                                <p className="text-sm text-green-600">
                                    Seus lances serão feitos automaticamente quando outros usuários derem lances.
                                </p>
                            </div>
                            <button 
                                onClick={disableAutoBid}
                                disabled={isLoadingBid}
                                className="bg-white border border-red-400 text-red-500 px-3 py-1 rounded-md 
                                    hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                                {isLoadingBid ? 'Desativando...' : 'Desativar'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Interface de lance */}
                <div className='flex flex-col gap-3 sm:flex-row sm:gap-2 text-white font-bold'>
                    {!hasAutoBid && (
                        <>
                            {/* Input de lance normal */}
                            {!isAutoBidEnabled && (
                                <input
                                    onChange={handleSetBid}
                                    type="text"
                                    value={formatCurrency(bidValue)}
                                    className="w-full sm:w-[150px] h-[45px] sm:h-[40px] bg-white rounded-[8px] sm:rounded-[6px] text-[#1f1f1f] p-3 sm:p-2 text-base sm:text-sm"
                                    disabled={isLoadingBid}
                                    placeholder="Valor do lance"
                                    inputMode="numeric"
                                />
                            )}

                            {/* Input de lance automático */}
                            {isAutoBidEnabled && (
                                <>
                                    <input
                                        onChange={handleSetAutoBidLimit}
                                        type="text"
                                        value={formatCurrency(autoBidLimit)}
                                        className="w-full sm:w-[150px] h-[45px] sm:h-[40px] bg-white rounded-[8px] sm:rounded-[6px] text-[#1f1f1f] p-3 sm:p-2 text-base sm:text-sm border-2 border-red-500"
                                        disabled={isLoadingBid}
                                        placeholder="Valor limite"
                                        inputMode="numeric"
                                    />
                                    
                                    <button
                                        onClick={handleConfirmLimite}
                                        disabled={isLoadingBid || !autoBidLimit}
                                        className={`w-full sm:w-[150px] h-[45px] sm:h-[40px] rounded-[8px] sm:rounded-md transition-colors 
                                            text-base sm:text-sm font-semibold flex items-center justify-center gap-2
                                            ${isLoadingBid || !autoBidLimit
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 active:bg-red-700 shadow-sm'
                                            }`}
                                    >
                                        {isLoadingBid ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            </div>
                                        ) : (
                                            <>
                                                <Autorenew className="w-5 h-5" />
                                                <span>Confirmar Auto</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* Botão de lance normal */}
                            {!isAutoBidEnabled && (
                                <button
                                    onClick={handleBidConfirm}
                                    disabled={isLoadingBid}
                                    className={`w-full sm:w-[150px] h-[45px] sm:h-[40px] rounded-[8px] sm:rounded-md transition-colors 
                                        text-base sm:text-sm font-semibold flex items-center justify-center gap-2
                                        ${isLoadingBid
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-[#141839] hover:bg-[#1e2456] active:bg-[#1e2456] shadow-sm'
                                        }`}
                                >
                                    {isLoadingBid ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <Gavel className="w-5 h-5" />
                                            <span>Fazer Lance</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}

                    {!hasAutoBid && (
                        <div
                            onClick={!isLoadingBid ? toggleAutoBid : undefined}
                            className={`flex w-full sm:w-[260px] h-[45px] sm:h-[40px] justify-center items-center gap-2 
                                rounded-[8px] sm:rounded-md cursor-pointer shadow-sm
                                text-base sm:text-sm font-semibold
                                transition-all duration-700 ease-in-out relative
                                ${isAutoBidEnabled 
                                    ? 'bg-red-600'
                                    : 'bg-[#1399CF] hover:bg-[#0d7eaa] active:bg-[#0d7eaa]'}
                                ${isLoadingBid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {isAutoBidEnabled ? (
                                    <>
                                        <Autorenew className="w-5 h-5 animate-spin" />
                                        <span className="hidden sm:inline">Lance Automático Ativado</span>
                                        <span className="sm:hidden">Auto Ativado</span>
                                    </>
                                ) : (
                                    <>
                                        <AutoMode className="w-5 h-5" />
                                        <span className="hidden sm:inline">Ativar Lances Automáticos</span>
                                        <span className="sm:hidden">Ativar Auto Lance</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Explicação do lance automático */}
                {isAutoBidEnabled && !hasAutoBid && (
                    <div className="bg-blue-50 p-4 sm:p-3 rounded-[8px] sm:rounded-md mt-3 sm:mt-2 text-sm text-blue-700">
                        <p className="flex items-start gap-2">
                            <AutoMode className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span>
                                <span className="font-medium">Lance Automático:</span> Defina um valor limite e o sistema 
                                dará lances por você automaticamente sempre que alguém superar seu lance, até o limite estabelecido.
                            </span>
                        </p>
                    </div>
                )}

                {/* Sistema de mensagens */}
                {showMessage && (
                    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-white shadow-lg z-50
                        ${messageType === 'success' ? 'bg-green-500' : 
                          messageType === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}
                    >
                        {messageText}
                    </div>
                )}
            </div>
        ) : (
            <button
                onClick={() => setIsModalOn(true)}
                className="w-full sm:w-auto h-[45px] sm:h-auto bg-[#9f9f9f] px-4 py-3 sm:p-2 rounded-[8px] sm:rounded-[6px] 
                    text-white hover:bg-[#8a8a8a] active:bg-[#8a8a8a] transition-colors text-base sm:text-sm font-semibold shadow-sm
                    flex items-center justify-center gap-2"
            >
                <Login className="w-5 h-5" />
                <span>Faça login para dar lances</span>
            </button>
        );
    };

    return renderBiddingInterface();
};

export default BidInterface; 