/* eslint-disable react/prop-types */
import axios from "axios"
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { handleBidproduct } from "../functions/handleBidproduct";


function ProductInformation({ currentProduct, currentClient, currentAuct, setCurrentProduct, setBidInformations, setIsModalOn }) {
    const [currentSession, setCurrentSession] = useState()
    const [bidValue, setBidValue] = useState(0)
    const [isLoadingBid, setIsloadingBid] = useState(false)
    const navigate = useNavigate()

    const messageRef = useRef()

    useEffect(() => {

        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        setCurrentSession(currentSession)

    }, [])

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
                // console.log("produto encontrado -> ", response.data.id)
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
                // console.log("produto encontrado -> ", response.data)
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
        handleBidproduct(bidValue, messageRef, currentProduct, currentClient, currentAuct, currentSession, setBidValue, setIsloadingBid)
    }

    return (
        <div className='flex flex-col flex-1 max-w-[60%] h-full justify-start items-center p-[3vh]'>
            <span ref={messageRef}
                className="bg-[#fff] p-2 rounded-[6px] hidden">mensagem de lance</span>

            <div className='flex flex-col w-full h-full justify-start gap-3'>

                <div className='flex w-full justify-between items-center'>
                    <span className='font-semibold text-[22px]'>Lote: {currentProduct.lote}</span>
                    <div>
                        <span onClick={handlePrevProduct} className='hover:text-[#9f9f9f]'>
                            <ArrowLeft className='cursor-pointer' sx={{ fontSize: "33px" }} />
                        </span>
                        <span onClick={handleNextProduct} className='hover:text-[#9f9f9f]'>
                            <ArrowRight className='cursor-pointer' sx={{ fontSize: "33px" }} />
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

            </div>

        </div>
    )
}

export default ProductInformation;