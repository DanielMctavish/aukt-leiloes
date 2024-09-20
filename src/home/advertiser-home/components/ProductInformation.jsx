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
    const [showWarningModal, setShowWarningModal] = useState(false); // Estado para o modal de aviso
    const [warningMessage, setWarningMessage] = useState(""); // Mensagem de aviso
    const navigate = useNavigate();
    const messageRef = useRef();

    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
        setCurrentSession(currentSession);
    }, []);

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

    const handleBidConfirm = async () => {
        const threshold = currentProduct.initial_value * 1.7; // 70% acima do valor atual
        if (bidValue > threshold) {
            setWarningMessage(`Você está prestes a dar um lance de R$ ${bidValue}, que é 70% maior que o valor do produto. Tem certeza?`);
            setShowWarningModal(true); // Exibe o modal de aviso
            return;
        }

        await handleBidproduct(bidValue, messageRef, currentProduct, currentClient, currentAuct, currentSession, setBidValue, setIsloadingBid);
        
        // Adicionar o novo lance ao array de lances do currentProduct
        const newBid = {
            client: currentClient,
            value: bidValue,
        };

        // Atualizar o estado de bidInformations
        setBidInformations(prevBids => [...prevBids, newBid]);

        // Atualizar o currentProduct com o novo lance e o valor atual
        setCurrentProduct(prevProduct => ({
            ...prevProduct,
            Bid: [...prevProduct.Bid, newBid],
            initial_value: bidValue
        }));
    }

    const handleConfirmBid = () => {
        // Lógica para confirmar o lance após o aviso
        handleBidproduct(bidValue, messageRef, currentProduct, currentClient, currentAuct, currentSession, setBidValue, setIsloadingBid);
        setShowWarningModal(false); // Fecha o modal
    };

    const handleCancelBid = () => {
        setShowWarningModal(false); // Fecha o modal
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
                            <ArrowRight sx={{fontSize: "70px" }}/>
                        </span>
                    </div>
                </div>

                <span className='font-bold text-[36px]'>{currentProduct.title}</span>
                <span className='font-bold text-[16px]'>{currentProduct.description}</span>
                <span className='font-bold text-[16px]'>{currentProduct.Bid && currentProduct.Bid.length} lance(s)</span>
                <span className='font-bold text-[16px]'>valor atual:
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentProduct.initial_value)}
                </span>

                {currentSession ?
                    <div className='flex gap-1 text-white font-bold'>
                        <input onChange={handleSetBid} type="text" value={bidValue} className="w-[150px] h-[40px] bg-white rounded-[6px] text-[#1f1f1f] p-2" />

                        {!isLoadingBid ?
                            <button onClick={handleBidConfirm} className='w-[150px] h-[40px] bg-[#141839] rounded-md'>Fazer Lance</button> :
                            <span>dando lance...</span>
                        }

                        <div className='flex w-[210px] h-[40px] bg-[#1399CF] justify-center items-center gap-2 rounded-md'>
                            <input type="checkbox" name="" id="" className='w-[20px] h-[20px]' />
                            <span>Lances Automáticos</span>
                        </div>
                    </div> :
                    <button onClick={() => setIsModalOn(true)} className="bg-[#9f9f9f] p-2 rounded-[6px] text-white">faça login para dar lances</button>
                }

                {/* Botão para Ver Catálogo Inteiro */}
                <button 
                    onClick={() => navigate(`/advertiser/home/shop/${currentAuct.id}`)} // Redireciona para a rota do catálogo
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