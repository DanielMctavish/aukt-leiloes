/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
//avatares import
import avatar_01 from "../../media/avatar-floor/avatar_01.png"
import avatar_02 from "../../media/avatar-floor/avatar_02.png"
import avatar_03 from "../../media/avatar-floor/avatar_03.png"
import avatar_04 from "../../media/avatar-floor/avatar_04.png"
import avatar_05 from "../../media/avatar-floor/avatar_05.png"
import avatar_06 from "../../media/avatar-floor/avatar_06.png"
import avatar_07 from "../../media/avatar-floor/avatar_07.png"
import avatar_08 from "../../media/avatar-floor/avatar_08.png"
import { handleBidproduct } from "./functions/handleBidproduct";
import { getProductInformations } from "./functions/getProductInformation";
import { getClientSession } from "./functions/getClientSession";


function ProductDetailAdv() {
    const [currentProduct, setCurrentProduct] = useState({})
    const [currentAuct, setCurrentAuct] = useState({})
    const [currentAdvertiser, setCurrentAdvertiser] = useState([])
    const [currentClient, setCurrentClient] = useState([])
    const [sessionClient, setSessionsClient] = useState()
    const [bidValue, setBidValue] = useState(0)
    const [successBid, setSuccessBid] = useState(false)
    const [bidInformations, setBidInformations] = useState([])
    const [displayBidWall, setDisplayBidWall] = useState(false)
    const [isWinner, setIsWinner] = useState(false)

    const navigate = useNavigate()
    const messageRef = useRef()
    const avatares_pessoas = [avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08]

    const { product_id } = useParams();

    useEffect(() => {
        getProductInformations(product_id, setBidInformations, setCurrentProduct, setCurrentAuct, setCurrentAdvertiser, setIsWinner)
        getClientSession(setSessionsClient, setCurrentClient)
    }, [successBid])

    useEffect(() => { console.log("produto atual -> ", currentProduct) }, [bidInformations])

    const refBidWall = useRef()

    const handleShowBids = () => {

        if (!displayBidWall) {
            refBidWall.current.style.transition = "1s"
            refBidWall.current.style.position = "relative"
            refBidWall.current.style.marginRight = "0vh"
            setDisplayBidWall(!displayBidWall)
        } else {
            refBidWall.current.style.transition = "0.6s"
            refBidWall.current.style.position = "absolute"
            refBidWall.current.style.marginRight = "-260vh"
            setDisplayBidWall(!displayBidWall)
        }

    }

    return (
        <div className="flex flex-col justify-start items-center w-full h-[170vh] bg-[#dddddd] relative">

            <span ref={messageRef} className="flex h-[30px] w-full justify-center items-center mt-[-30px] bg-white">mensagens de span</span>

            {/* HEADER */}
            <div className="flex w-full h-[30vh] relative overflow-hidden justify-center items-center">
                <button
                    style={{
                        textShadow: "1px 2px 1px #101010a2"
                    }}
                    onClick={() => navigate(`/advertiser/home/${currentAdvertiser.id}`)}
                    className="flex absolute top-1 left-3 z-20">
                    voltar
                </button>

                <img src={currentAuct.auct_cover_img} alt="" className="object-cover w-full absolute blur-[3px]" />

                <section className="flex justify-center items-center 
                    w-[80%] h-[200px] relative rounded-lg gap-3">
                    <img src={currentAdvertiser.url_profile_company_logo_cover}
                        className="object-cover w-[220px] h-[220px] 
                            bg-white/20 rounded-full backdrop-blur-[12px] 
                            shadow-lg shadow-[#13131358] p-1" />

                    <div className="flex flex-col">
                        <h1 style={{ textShadow: "-2px 1px 1px #0a3e4c" }} className="text-[44px]">
                            {currentAuct.title}
                        </h1>
                        <span style={{ textShadow: "2px 1px 2px #111111c1" }} className="text-[27px]">{currentAuct.nano_id}</span>
                    </div>
                </section>

            </div>

            {/* SESSION 01 */}
            {!isWinner ?
                <section className="flex justify-center items-center gap-3 p-1 overflow-hidden
                w-[99%] h-[57%] bg-white mt-1 shadow-lg shadow-[#15151589] relative">
                    <img src={currentProduct.cover_img_url} className="object-cover h-[600px] rounded-md" />


                    <div className="flex flex-col justify-start items-center p-2 overflow-x-auto
                    w-[400px] h-[600px]  bg-zinc-200 rounded-md text-zinc-600">

                        <div className="flex w-full justify-between items-center">
                            <span className="font-bold">Lances: </span>
                            <span onClick={handleShowBids}
                                className="p-2 bg-white rounded-md cursor-pointer">
                                {currentProduct.Bid ? currentProduct.Bid.length : 0}
                            </span>
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
                                        onClick={() => handleBidproduct(bidValue, messageRef, currentProduct,
                                            currentClient, currentAuct, sessionClient, setBidValue, setSuccessBid, successBid)}
                                        className="bg-[#94365D] flex justify-center items-center w-[99%] p-2 text-[#fff] rounded-md">
                                        dar um lance
                                    </button>
                                </div>
                                :
                                <span
                                    onClick={() => navigate("/client/login")}
                                    className="bg-[#4c4c4c] flex justify-center items-center w-[99%] p-2 text-[#fff] rounded-md cursor-pointer mt-[6vh]">
                                    Faça login para dar lances
                                </span>
                        }

                    </div>
                    {/* Mural de vencedores */}
                    {
                        sessionClient &&
                        <div ref={refBidWall} className="flex flex-col w-[400px] h-[600px] bg-[#e6e6e6] 
                    rounded-md gap-1 p-1 overflow-y-auto mr-[-260vh] absolute">
                            {
                                Array.isArray(bidInformations) &&
                                bidInformations.map((information, i) => {

                                    return (
                                        <div key={i} className="flex w-full justify-between items-center p-2 text-zinc-600 bg-white rounded-md">
                                            <img src={avatares_pessoas[information.client.client_avatar]} alt="" className="w-[40px] h-[40px] object-cover" />
                                            <span>{information.client.nickname}</span>
                                            <span>{information.value}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }

                </section> :
                <section className="flex flex-col justify-center items-center gap-3 p-1 overflow-hidden
                w-[99%] h-[57%] bg-white mt-1 shadow-lg shadow-[#15151589] relative">
                    <h1 className="text-[#3e3e3e] text-[44px]">Agradecemos por você estar aqui!</h1>
                    <span className="text-[#3e3e3e] text-[16px] w-[40%] text-center">
                        É com muita alegria que te damos boas-vindas! Infelizmente, este produto já encontrou
                        um novo destino, mas não fique desanimado. Em breve, teremos mais produtos como este em nosso catálogo.
                    </span>
                    <span className="text-[#3e3e3e] text-[16px] text-left font-bold w-[40%]">Por que não está mais disponível?</span>
                    <span className="text-[#3e3e3e] text-[16px] w-[40%] text-left">
                        Quando um produto é &quot;arrematado&quot; (ou seja, comprado), ele continua na nossa plataforma com o status de vencedor, 
                        indicando que outro cliente conseguiu dar um lance durante o pregão ou catálogo.
                    </span>
                </section>

            }

            {/* RODAPÉ ------------------------------------------------------------------------------------------------------------------------- */}
            <footer className="w-full h-[300px] flex justify-center items-center bg-gradient-to-r from-[#262626] to-[#2f2036] bottom-0 absolute">
                <img src={currentAdvertiser.url_profile_cover}
                    className="w-[200px] h-[200px] border-[3px] border-[#fff] object-cover rounded-full bg-[#9c9c9c]" />
            </footer>

        </div>
    )

}

export default ProductDetailAdv;