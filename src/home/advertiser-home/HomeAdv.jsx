/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeAdvSection01 from "./HomeAdvSection01";
import HomeAdvSection02 from "./HomeAdvSection02";
import HomeAdvSection03 from "./HomeAdvSection03";
import HomeAdvFooter from "./HomeAdvFooter";


function HomeAdvertiser() {
    const [currentAdvertiser, setAdvertiser] = useState({})
    const [displayAuct, setDisplayAuct] = useState({})
    const { advertiser_id } = useParams();

    const navigate = useNavigate()

    useEffect(() => { getAdvertiserInformations() }, [])

    const getAdvertiserInformations = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find?adv_id=${advertiser_id}`)
                .then(result => {
                    setAdvertiser(result.data)
                })

            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${advertiser_id}`)
                .then(result => {
                    result.data.forEach((auct) => {
                        if (auct.status === "cataloged") {
                            // console.log("AUK >> ", auct)
                            setDisplayAuct(auct)
                            return false
                        }
                    })
                })
        } catch (error) {
            navigate("/")
        }
    }


    return (
        <div className="w-full h-auto flex flex-col justify-start items-center relative roboto-condensed-advertiser">

            {/* SECTION 01 ------------------------------------------------------------------------------------------------------------------------- */}
            <HomeAdvSection01 currentAdvertiser={currentAdvertiser} displayAuct={displayAuct} />

            {/* SECTION 02 ------------------------------------------------------------------------------------------------------------------------- */}

            <HomeAdvSection02 currentAdvertiser={currentAdvertiser} />

            {/* SECTION 03 */}

            <HomeAdvSection03 currentAdvertiser={currentAdvertiser} />

            {/* <section className="flex w-full h-[100vh] bg-[#fff] relative flex-col justify-start items-center">
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
            </section> */}

            {/* RODAPÉ ------------------------------------------------------------------------------------------------------------------------- */}
            <HomeAdvFooter currentAdvertiser={currentAdvertiser} />
        </div>
    )
}

export default HomeAdvertiser;
