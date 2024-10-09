/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { handleBidproduct } from "../functions/handleBidproduct";

function ProductInformation({ currentProduct, currentClient, currentAuct, setCurrentProduct, setBidInformations, setIsModalOn }) {
    const [currentSession, setCurrentSession] = useState();
    const [bidValue, setBidValue] = useState(0);
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
    const [hasAutoBid, setHasAutoBid] = useState(false);
    const navigate = useNavigate();
    const messageRef = useRef();

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
        console.log("produto atual -> ", currentProduct.lote + 1)

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find`, {
                params: {
                    lote: currentProduct.lote + 1,
                    auct_id: currentAuct.id
                }
            }).then(response => {
                setCurrentProduct(response.data);
                setBidInformations(response.data.Bid)
                navigate(`/advertiser/home/product/${response.data.id}`)
            })
        } catch (error) {
            console.log("Error ao encontrar próximo produto -> ", error.message)
        }
    }

    const handlePrevProduct = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find`, {
                params: {
                    lote: currentProduct.lote - 1,
                    auct_id: currentAuct.id
                }
            }).then(response => {
                setCurrentProduct(response.data);
                setBidInformations(response.data.Bid)
                navigate(`/advertiser/home/product/${response.data.id}`)
            })
        } catch (error) {
            console.log("Error ao encontrar próximo produto -> ", error.message)
        }
    }

    const handleSetBid = async (e) => {
        const value = e.target.value;
        if (isNaN(value) || value.trim() === '') return null;
        setBidValue(Number(value));
    }

    const toggleAutoBid = () => {
        setIsAutoBidEnabled(!isAutoBidEnabled);
    };

    const handleBidConfirm = async () => {
        const threshold = currentProduct.initial_value * 1.7;
        if (bidValue > threshold) {
            setWarningMessage(`Você está prestes a dar um lance de R$ ${bidValue}, que é 70% maior que o valor do produto. Tem certeza?`);
            setShowWarningModal(true);
            return;
        }

        setIsloadingBid(true);
        try {
            await handleBidproduct(
                bidValue,
                messageRef,
                currentProduct,
                currentClient,
                currentAuct,
                currentSession,
                setBidValue,
                setIsloadingBid,
                isAutoBidEnabled
            );

            const newBid = {
                client: currentClient,
                value: bidValue,
                cover_auto: isAutoBidEnabled
            };

            setBidInformations(prevBids => [...prevBids, newBid]);

            setCurrentProduct(prevProduct => ({
                ...prevProduct,
                Bid: [...prevProduct.Bid, newBid],
                initial_value: bidValue
            }));
        } catch (error) {
            console.error("Erro ao dar lance:", error);
        } finally {
            setIsloadingBid(false);
        }
    }

    const handleConfirmBid = () => {
        handleBidConfirm();
        setShowWarningModal(false);
    };

    const handleCancelBid = () => {
        setShowWarningModal(false);
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
        <div className='flex flex-col flex-1 max-w-[60%] h-full justify-start items-center p-[3vh]'>
            <span ref={messageRef} className="bg-[#fff] p-2 rounded-[6px] hidden">mensagem de lance</span>

            <div className='flex flex-col w-full h-full justify-start gap-3'>
                <div className='flex w-full justify-between items-center'>
                    <span className='font-semibold text-[22px]'>Lote: {currentProduct.lote}</span>
                    <div>
                        <span onClick={handlePrevProduct} className='hover:text-[#9f9f9f]'>
                            <ArrowLeft className='cursor-pointer' sx={{ fontSize: "43px" }} />
                        </span>
                        <span
                            onClick={handleNextProduct}
                            className='cursor-pointer animate-pulse text-[#145d79]'
                        >
                            <ArrowRight sx={{ fontSize: "70px" }} />
                        </span>
                    </div>
                </div>

                <span className='font-bold text-[36px]'>{currentProduct.title}</span>
                <span className='font-bold text-[16px]'>{currentProduct.description}</span>
                <span className='font-bold text-[16px]'>{currentProduct.Bid && currentProduct.Bid.length} lance(s)</span>
                <span className='font-bold text-[16px]'>valor atual:
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentProduct.initial_value)}
                </span>

                {renderBiddingInterface()}

                {/* Botão para Ver Catálogo Inteiro */}
                <button
                    onClick={() => navigate(`/advertiser/home/shop/${currentAuct.id}`)}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Ver Catálogo Inteiro
                </button>
            </div>

            {/* Modal de Aviso */}
            {showWarningModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99]">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <h2 className="font-bold text-lg">Aviso</h2>
                        <p>{warningMessage}</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleCancelBid} className="mr-2 p-2 bg-gray-300 rounded">Cancelar</button>
                            <button onClick={handleConfirmBid} className="p-2 bg-blue-500 text-white rounded">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductInformation;