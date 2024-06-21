/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

function ProductDetailAdv() {
    const [currentProduct, setCurrentProduct] = useState({})
    const [currentAuct, setCurrentAuct] = useState({})
    const [currentAdvertiser, setCurrentAdvertiser] = useState([])
    const [currentClient, setCurrentClient] = useState([])
    const [sessionClient, setSessionsClient] = useState()
    const [bidValue, setBidValue] = useState(0)
    const [successBid, setSuccessBid] = useState(false)

    const navigate = useNavigate()
    const messageRef = useRef()

    const { product_id } = useParams();

    useEffect(() => {
        getProductInformations()
        getClientSession()
    }, [successBid])

    const getProductInformations = async () => {
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
            .then((response) => {
                //console.log("product get: ", response.data)
                setCurrentProduct(response.data)
                setCurrentAuct(response.data.Auct)
                setCurrentAdvertiser(response.data.Advertiser)
            })
    }

    const handleBidproduct = async () => {
        console.log("observando produto -> ", currentProduct.id)

        if (bidValue <= 0 || typeof parseInt(bidValue) !== 'number' || !bidValue) {
            messageRef.current.style.transition = "1s"
            messageRef.current.style.marginTop = "0"
            messageRef.current.innerHTML = "O valor do lance deve ser maior que 0"
            messageRef.current.style.color = "red"

            setTimeout(() => {
                messageRef.current.style.marginTop = "-30px"
            }, 6000);

            return
        }

        if (bidValue <= currentProduct.initial_value) {
            messageRef.current.style.transition = "1s"
            messageRef.current.style.marginTop = "0"
            messageRef.current.innerHTML = "O valor do lance deve ser maior que o valor inicial"
            messageRef.current.style.color = "#bd9202"

            setTimeout(() => {
                messageRef.current.style.marginTop = "-30px"
            }, 6000);

            return
        }

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`, {
            value: parseFloat(bidValue),
            client_id: currentClient.id,
            auct_id: currentAuct.id,
            product_id: currentProduct.id
        }, {
            headers: {
                "Authorization": `Bearer ${sessionClient.token}`
            }
        }).then((response) => {

            //console.log("lance realizado com sucesso... ", response.data)
            setBidValue(response.data.value)
            setSuccessBid(!successBid)

            messageRef.current.style.transition = "1s"
            messageRef.current.style.marginTop = "0"
            messageRef.current.innerHTML = "Parabéns! seu lance foi registrado"
            messageRef.current.style.color = "#105500"

            setTimeout(() => {
                messageRef.current.style.marginTop = "-30px"
            }, 6000);

        }).catch(err => {
            console.log(err.message)
        })

    }

    const getClientSession = async () => {

        const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
        setSessionsClient(currentSessionClient)

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
            headers: {
                "Authorization": `Bearer ${currentSessionClient.token}`
            }
        }).then(result => {
            setCurrentClient(result.data)
        })

    }


    return (
        <div className="flex flex-col justify-start items-center w-full h-[132vh] bg-gradient-to-b from-[#94365D] to-[#6B4AB0] relative">

            <span ref={messageRef} className="flex h-[30px] w-full justify-center items-center mt-[-30px] bg-white">mensagens de span</span>

            <div className="flex w-full h-[32vh] relative overflow-hidden justify-center items-center">
                <button onClick={() => navigate(`/advertiser/home/${currentAdvertiser.id}`)}
                    className="flex absolute top-1 left-3 z-20">
                    voltar
                </button>

                <img src={currentAuct.auct_cover_img} alt="" className="object-cover w-full absolute blur-[3px]" />

                <section className="flex justify-center items-center 
                w-[80%] h-[200px] relative rounded-lg gap-3">
                    <img src={currentAdvertiser.url_profile_company_logo_cover}
                        className="object-cover w-[160px h-[160px] 
                        bg-white/20 rounded-full backdrop-blur-[12px] 
                        shadow-lg shadow-[#13131358] p-1" />

                    <div className="flex flex-col">
                        <h1 style={{ textShadow: "-2px 1px 1px #0a3e4c" }} className="text-[44px]">
                            {currentAuct.title}
                        </h1>
                        <span className="text-[27px]">{currentAuct.nano_id}</span>
                    </div>
                </section>

            </div>

            <section className="flex justify-center items-center gap-3
            w-[99%] h-[67vh] bg-white mt-1 shadow-lg shadow-[#15151589]">
                <img src={currentProduct.cover_img_url} className="object-cover h-[600px] rounded-md" />



                <div className="flex flex-col justify-start items-center p-2 
                w-[400px] h-[600px]  bg-zinc-200 rounded-md text-zinc-600">

                    <div className="flex w-full justify-between items-center">
                        <span>Lances</span>
                        <span>12</span>
                    </div>

                    <div className="flex w-full justify-between items-center">
                        <span>valor</span>
                        <span>R$ {(currentProduct.initial_value && currentProduct.initial_value.toFixed(2))}</span>
                    </div>

                    {
                        sessionClient ?
                            <div className="flex flex-col w-full mt-[6vh] gap-2">
                                <input onChange={(e) => setBidValue(e.target.value)} type="text"
                                    value={bidValue}
                                    placeholder="valor do lance" className="p-2 w-[99%] rounded-md text-zinc-300" />
                                <button
                                    onClick={handleBidproduct}
                                    className="bg-[#94365D] flex justify-center items-center w-[99%] p-2 text-[#fff] rounded-md">dar um lance</button>
                            </div>
                            :
                            <span
                                onClick={() => navigate("/client/login")}
                                className="bg-[#4c4c4c] flex justify-center items-center w-[99%] p-2 text-[#fff] rounded-md cursor-pointer mt-[6vh]">
                                Faça login para dar lances
                            </span>
                    }

                </div>

            </section>

            {/* RODAPÉ ------------------------------------------------------------------------------------------------------------------------- */}
            <footer className="w-full h-[300px] flex justify-center items-center bg-gradient-to-r from-[#262626] to-[#2f2036] bottom-0 absolute">
                <img src={currentAdvertiser.url_profile_cover}
                    className="w-[200px] h-[200px] border-[3px] border-[#fff] object-cover rounded-full bg-[#9c9c9c]" />
            </footer>

        </div>
    )

}

export default ProductDetailAdv;