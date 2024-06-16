/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import yellowCar from "../../media/backgrounds/carro_amarelo_bg.png"
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"
import { ArrowCircleLeft, ArrowCircleRight, Menu } from "@mui/icons-material"
import ClientNavigation from "./components/ClientNavigation";

function HomeAdvertiser() {
    const [isMenu, setIsmenu] = useState(false)
    const [cardSize, setCardSize] = useState("M")
    const [currentAdvertiser, setAdvertiser] = useState({})
    const [displayAuct, setDisplayAuct] = useState({})
    const [displayProduct, setDisplayProduct] = useState([])
    const { advertiser_id } = useParams();

    const menuRef = useRef()
    const navigate = useNavigate()

    useEffect(() => { getAdvertiserInformations() }, [])

    const getAdvertiserInformations = async () => {
        try {
            await axios.get(`/api/advertiser/find?adv_id=${advertiser_id}`)
                .then(result => {
                    setAdvertiser(result.data)
                })

            await axios.get(`/api/auct/list-auct?creator_id=${advertiser_id}`).then(result => {
                result.data.forEach((auct) => {
                    if (auct.status === "cataloged") {
                        console.log("AUK >> ", auct)
                        setDisplayAuct(auct)
                        setDisplayProduct(auct.product_list)
                        return false
                    }
                })
            })
        } catch (error) {
            navigate("/")
        }
    }

    const getCardStyle = (size) => {
        switch (size) {
            case "P":
                return "w-[80px] h-[80px] overflow-hidden bg-[#fff] rounded-md hover:shadow-lg hover:shadow-[#17171780]";
            case "M":
                return "flex flex-col justify-between items-center w-[220px] h-[460px] overflow-hidden bg-[#fff] rounded-md hover:shadow-lg hover:shadow-[#17171780]";
            case "G":
                return "flex justify-center w-full h-[600px] overflow-hidden bg-[#fff] rounded-md hover:shadow-lg hover:shadow-[#17171780]";
            default:
                return "w-[120px] h-[120px] overflow-hidden bg-[#fff] rounded-md hover:shadow-lg hover:shadow-[#17171780]";
        }
    }

    const getDescriptionsStyle = (size) => {
        switch (size) {
            case "P":
                return "none";
            case "M":
                return "flex flex-col w-full h-full text-zinc-600 bg-[#fff] justify-between items-center p-2";
            case "G":
                return "flex flex-col w-[42%] h-full text-zinc-600 bg-[#fff] justify-between items-center p-2";
            default:
                return "none";
        }
    }

    const getImageStyle = (size) => {
        switch (size) {
            case "P":
                return "w-full h-full object-cover cursor-pointer";
            case "M":
                return "w-full min-h-[200px] object-cover cursor-pointer";
            case "G":
                return "w-full h-full object-cover cursor-pointer";
            default:
                return "w-full h-full object-cover cursor-pointer";
        }
    }

    const showMenuHome = () => {
        menuRef.current.style.transition = "0.6s"
        if (!isMenu) {
            setIsmenu(!isMenu)
            menuRef.current.style.marginLeft = "0"
        } else {
            setIsmenu(!isMenu)
            menuRef.current.style.marginLeft = "-30vh"
        }
    }

    const handleShowProductDetails = (product_id) => {
        navigate(`/advertiser/home/product/${product_id}`)
    }

    return (
        <div className="w-full h-auto flex flex-col justify-start items-center relative">

            {/* MENU Home advertiser............................................................................................................................ */}
            <div ref={menuRef} className="fixed w-[30vh] h-[100vh] flex flex-col
            bg-white left-0 top-0 z-20 shadow-lg shadow-[#1118] ml-[-30vh] text-[#343434]">
                <ClientNavigation />
            </div>

            {/* SECTION 01 ------------------------------------------------------------------------------------------------------------------------- */}
            <section className="flex flex-col justify-start items-center w-full h-[100vh] bg-gradient-to-b from-[#94365D] to-[#6B4AB0] relative">
                <div className="w-[98%] h-[32vh] bg-white border-[#aaaaaaf5] 
                border-[1px] rounded-md top-2 flex justify-center items-center mt-3 
                relative overflow-hidden shadow-lg shadow-[#13131361]">
                    <span
                        onClick={() => showMenuHome()}
                        className="fixed top-1 left-1 z-20 cursor-pointer shadow-sm bg-[#252525cc] p-1 rounded-md"><Menu /></span>
                    <img src={yellowCar} className="object-cover w-full absolute blur-[7px] opacity-90" />
                    <img src={currentAdvertiser.url_profile_company_logo_cover} alt=""
                        className="w-[300px] object-cover rounded-full z-10" />
                </div>

                <div className="w-full h-[70vh] flex justify-center items-center gap-6">
                    <div className="md:w-[30%] w-full h-[70%] flex flex-col justify-center items-left text-left gap-2">
                        <span className="text-[16px] font-bold text-[#B695EC]">Grandes Oportunidades Esperam por Você</span>
                        <h1 style={{ textShadow: "1px 2px 4px #0e0e0e77" }} className="text-[26px] font-bold">NÃO PERCA OS PRÓXIMOS LEILÕES</h1>
                        <p className="text-[12px]">
                            Prepare-se para os leilões mais emocionantes da nossa plataforma! Fique ligado nas datas e não deixe passar a chance de arrematar itens exclusivos a preços incríveis. Cadastre-se agora e seja o primeiro a saber das novidades. Cada leilão é uma nova oportunidade, não perca!
                        </p>
                    </div>

                    <div className="md:w-[30%] w-full h-[70%] flex flex-col justify-center items-center gap-1 relative">
                        <div className="w-full h-full flex justify-between items-center absolute">
                            <span style={{ fontSize: "33px" }}><ArrowCircleLeft /></span>
                            <ArrowCircleRight />
                        </div>
                        <img src={displayAuct.auct_cover_img} alt="" className="w-[240px] h-[240px] object-cover rounded-[60px]" />
                    </div>
                </div>

                <img src={aukLogo}
                    onClick={() => navigate('/')}
                    className="absolute w-[60px] bottom-3 right-1 cursor-pointer hover:brightness-125" />
            </section>


            {/* SECTION 02 ------------------------------------------------------------------------------------------------------------------------- */}
            <section className="flex w-full h-[100vh] bg-[#fff] relative flex-col justify-start items-center">
                <div className="flex w-full h-[300px] overflow-x-hidden overflow-y-hidden">
                    {
                        Array.isArray(displayProduct) &&
                        displayProduct.map((product, i) => {
                            return (
                                <div key={i}
                                    className="min-w-[80px] h-[300px] hover:min-w-[200px] bg-[#fff] rounded-md hover:shadow-lg hover:shadow-[#17171780]">
                                    <img src={product.cover_img_url} alt="" className="w-full h-full object-cover" />
                                </div>
                            )
                        })
                    }
                </div>

                <div className="flex w-[98%] h-[40px] justify-between items-center bg-[#e2e2e2] mt-6 rounded-md p-1">

                    <select name="" id="" className="p-2 rounded-md text-[14px] bg-transparent text-zinc-600">
                        <option value="">selecione um filtro</option>
                        <option value="">filtro 01</option>
                        <option value="">filtro 02</option>
                        <option value="">filtro 03</option>
                        <option value="">filtro 04</option>
                    </select>

                    <div className="flex justify-center items-center gap-1 text-[12px] ">
                        <span onClick={() => { setCardSize("P") }}
                            className="w-[33px] h-[33px] flex justify-center items-center 
                            font-bold bg-[#2f413d27] rounded-md cursor-pointer">P</span>
                        <span onClick={() => { setCardSize("M") }}
                            className="w-[33px] h-[33px] flex justify-center items-center 
                            font-bold bg-[#2f413d27] rounded-md cursor-pointer">M</span>
                        <span onClick={() => { setCardSize("G") }}
                            className="w-[33px] h-[33px] flex justify-center items-center 
                            font-bold bg-[#2f413d27] rounded-md cursor-pointer">G</span>
                    </div>
                </div>

                <div className="flex flex-wrap w-[98%] h-[57%] 
                justify-start items-center border-[1px] border-zinc-100 mt-1 
                gap-3 overflow-y-auto transition-all duration-[1]">
                    {
                        Array.isArray(displayProduct) &&
                        displayProduct.map((product, i) => {
                            return (
                                <div key={i}
                                    className={getCardStyle(cardSize)}>

                                    <img onClick={() => handleShowProductDetails(product.id)}
                                        src={product.cover_img_url} alt=""
                                        className={getImageStyle(cardSize)} />

                                    <div className={getDescriptionsStyle(cardSize)}>
                                        <span className="font-bold">{product.title}</span>
                                        <span style={{ letterSpacing: "4px" }} className="text-[23px]">R$ {(product.initial_value.toFixed(2))}</span>
                                        <p className="text-[12px] w-[92%] text-justify">
                                            {product.description}
                                        </p>
                                        <button
                                            onClick={() => handleShowProductDetails(product.id)}
                                            className="w-[92%] h-[30px] text-white bg-[#6B4AB0] rounded-md text-[14px]">dar lance</button>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>

                <img src={aukLogo}
                    onClick={() => navigate('/')}
                    className="absolute w-[60px] bottom-3 right-1 cursor-pointer  hover:brightness-125" />
            </section>

            {/* RODAPÉ ------------------------------------------------------------------------------------------------------------------------- */}
            <footer className="w-full h-[300px] flex justify-center items-center bg-gradient-to-r from-[#262626] to-[#2f2036]">
                <img src={currentAdvertiser.url_profile_cover}
                    className="w-[200px] h-[200px] border-[3px] border-[#fff] object-cover rounded-full bg-[#9c9c9c]" />
            </footer>
        </div>
    )
}

export default HomeAdvertiser;
