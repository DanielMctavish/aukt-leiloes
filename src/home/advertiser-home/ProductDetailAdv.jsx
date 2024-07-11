/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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


function ProductDetailAdv() {
    const [currentProduct, setCurrentProduct] = useState({})
    const [currentAuct, setCurrentAuct] = useState({})
    const [currentAdvertiser, setCurrentAdvertiser] = useState([])
    const [currentClient, setCurrentClient] = useState([])
    const [sessionClient, setSessionsClient] = useState()
    const [bidValue, setBidValue] = useState(0)
    const [successBid, setSuccessBid] = useState(false)

    const [bidInformations, setBidInformations] = useState([])

    const navigate = useNavigate()
    const messageRef = useRef()
    const avatares_pessoas = [avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08]

    const { product_id } = useParams();

    useEffect(() => {
        getProductInformations()
        getClientSession()
    }, [successBid])

    const getProductInformations = async () => {
        const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`);
            const currentBids = response.data.Bid;

            const bidPromises = currentBids.map(async (bid) => {
                try {
                    const currentClient = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-client?client_id=${bid.client_id}`, {
                        headers: {
                            "Authorization": `Bearer ${currentSessionClient.token}`
                        }
                    });
                    return {
                        value: bid.value,
                        client: currentClient.data,
                        bidTime: bid.created_at // Supondo que há um campo 'created_at' para data do lance
                    };
                } catch (error) {
                    console.log("Error at get client -> ", error.message);
                    return null; // Retorne null em caso de erro para filtrar posteriormente
                }
            });

            const bidResults = await Promise.all(bidPromises);
            const validBids = bidResults.filter(bid => bid !== null);

            // Ordenar os lances de forma que o mais recente esteja no topo
            const sortedBids = validBids.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime));

            setBidInformations(sortedBids);
            setCurrentProduct(response.data);
            setCurrentAuct(response.data.Auct);
            setCurrentAdvertiser(response.data.Advertiser);
        } catch (error) {
            console.log("Error at get product information -> ", error.message);
        }
    };



    useEffect(() => { }, [bidInformations])

    const handleBidproduct = async () => {
        //console.log("observando produto -> ", currentProduct.id)

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
        <div className="flex flex-col justify-start items-center w-full h-[170vh] bg-gradient-to-b from-[#94365D] to-[#6B4AB0] relative">

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

            {/* SESSION 01 */}
            <section className="flex justify-center items-center gap-3 p-1
                w-[99%] h-[57%] bg-white mt-1 shadow-lg shadow-[#15151589]">
                <img src={currentProduct.cover_img_url} className="object-cover h-[600px] rounded-md" />


                <div className="flex flex-col justify-start items-center p-2 overflow-x-auto
                    w-[400px] h-[600px]  bg-zinc-200 rounded-md text-zinc-600">

                    <div className="flex w-full justify-between items-center">
                        <span className="font-bold">Lances: </span>
                        <span>{currentProduct.Bid ? currentProduct.Bid.length : 0}</span>
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
                {/* Mural de vencedores */}
                <div className="flex flex-col w-[400px] h-[600px] bg-[#e6e6e6] rounded-md gap-1 p-1 overflow-y-auto">
                    {
                        Array.isArray(bidInformations) &&
                        bidInformations.map((information, i) => {

                            return (
                                <div key={i} className="flex w-full justify-between items-center p-2 text-zinc-600 bg-white rounded-md">
                                    <img src={avatares_pessoas[information.client.client_avatar]} alt="" className="w-[40px] h-[40px] object-cover" />
                                    <span>{information.client.name}</span>
                                    <span>{information.value}</span>
                                </div>
                            )
                        })
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