/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import AssideAdvertiser from "../../_asside/AssideAdvertiser";
import NavAdvertiser from "../../_navigation/NavAdvertiser";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Timelapse, NoPhotography, EditNote } from "@mui/icons-material"
import axios from "axios"
import dayjs from "dayjs"
import "./StyleAuctDetails.css"
import { editAuct } from "../../../features/auct/AuctToEdit";
import { selectProduct } from "../../../features/product/ProductAddPhoto";
import AddProductMod from "../mod/AddProductMod";


function AdvertiserAuctDetails() {
    const [currentAuct, setCurrentAuct] = useState({ product_list: [] })
    const [resumeValues, setResumeValues] = useState({ value_balance: 0, initial_value_sum: 0 })
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
    const localAdvertiser = JSON.parse(currentLocalAdvertiser)

    useEffect(() => {

        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        }

        getCurrentAuctById(currentLocalAdvertiser)
    }, [state.selectedAuct, state.finishedUpload])

    useEffect(() => {

        setResumeValues(state.auctResume)

    }, [state.auctResume])

    const getCurrentAuctById = async () => {

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${state.selectedAuct}`, {
            headers: {
                'Authorization': `Bearer ${localAdvertiser.token}`
            }
        }).then(async response => {

            setCurrentAuct(response.data)

        }).catch(err => {
            console.log('err get auct >>', err.message)
            if (err.response.status === 404) {
                navigate('/advertiser/auctions')
            }
        })

    }


    async function editCurrentAuct() {
        dispatch(editAuct(currentAuct))
        navigate('/advertiser/edit-auct')
    }

    const redirectToProductDetails = (product_id) => {
        navigate(`/advertiser/product-details/${product_id}`)
    }

    const refAddProdut = useRef()

    const handleShowPhotoAdd = (product) => {
        document.querySelector(".mod-add-product").style.display = "flex";
        refAddProdut.current.style.display = "flex";
        refAddProdut.current.style.opacity = "0";
        setTimeout(() => {
            refAddProdut.current.style.opacity = "1";
            refAddProdut.current.style.transition = ".3s";
        }, 100);

        //redux set current product
        dispatch(selectProduct(product))
    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-3" />

            <section
                ref={refAddProdut}
                style={{ backdropFilter: "blur(3px)" }}
                className="absolute hidden justify-center items-center w-full h-[100vh] z-[999] section-add-product main-window-blur-add">
                <AddProductMod />
            </section>

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto relative">
                <NavAdvertiser path={"anunciante > leilões > detalhes"} />

                <div className="w-full h-[100vh] relative
               flex flex-col justify-start items-center bg-[#091925]">

                    {/* HEADER LEILÃO INFORMACIONAL */}
                    <section className="w-[97%] h-[27vh] bg-white rounded-md mt-3 relative flex flex-col justify-center gap-6 items-center overflow-hidden">
                        <img src={currentAuct.auct_cover_img} alt="auct-cover" className="object-cover cover-auct-image absolute opacity-20" />

                        <h1 style={{ textShadow: "2px 2px 12px black" }} className="text-[18px] font-bold absolute left-1 top-1">{currentAuct.nano_id}</h1>
                        <div className="absolute text-zinc-700 flex right-1 top-1 gap-2 z-[99]">
                            <button onClick={editCurrentAuct} className="w-[100px] h-[30px] flex justify-center items-center bg-zinc-700 rounded-md text-white text-[12px]">editar</button>
                            <button className="w-[100px] h-[30px] flex justify-center items-center bg-red-700 rounded-md text-white text-[12px]">excluir</button>
                        </div>

                        <div className="flex gap-2 z-[99] justify-start items-center">
                            <img src={currentAuct.Advertiser ? currentAuct.Advertiser.url_profile_cover : ''} alt="" className="rounded-full bg-zinc-600 w-[80px] h-[80px] object-cover" />
                            <div className="flex flex-col text-zinc-900 font-bold">
                                <span className="text-[18px]">{currentAuct.title}</span>
                                <div>
                                    Promotor:
                                    <span style={{ textShadow: '2px 2px 6px #0000003d' }} className="text-[#315fa3]">
                                        {currentAuct.Advertiser ? currentAuct.Advertiser.email : ''}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {currentAuct.auct_dates ?
                                        currentAuct.auct_dates.map((date, index) => (
                                            <div key={index}
                                                className="text-zinc-700 font-bold 
                                        flex justify-between items-center 
                                        gap-3 bg-zinc-100 p-2 text-[12px] 
                                        rounded-md shadow-md shadow-[#0e0e0e33]">
                                                <Timelapse style={{ fontSize: "12px" }} />
                                                {dayjs(date).format('DD/MM/YYYY - HH:mm')}
                                            </div>
                                        )) : ''
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 z-[99]">
                            <div className="flex flex-col justify-center items-center text-zinc-600
                            w-[308px] h-[80px] bg-[#E9EFFA] rounded-md shadow-lg shadow-[#1313131e]">
                                <span className="text-[12px]">Status</span>
                                <span className="text-[18px]">{currentAuct.status}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center text-zinc-600
                            w-[308px] h-[80px] bg-[#E9EFFA] rounded-md shadow-lg shadow-[#1313131e]">
                                <span className="text-[12px]">Valor Estimado</span>
                                <span className="text-[18px] font-bold">R$ {resumeValues.initial_value_sum && resumeValues.initial_value_sum.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center text-zinc-600
                            w-[308px] h-[80px] bg-[#E9EFFA] rounded-md shadow-lg shadow-[#1313131e]">
                                <span className="text-[12px]">Valor Vendido</span>
                                <span className="text-[18px] font-bold">R$ {resumeValues.initial_value_sum && resumeValues.value_balance}</span>
                            </div>
                        </div>

                    </section>

                    {/* 
                    
                    <div className="w-full h-[6vh] flex justify-start items-center p-6">
                        <h1 className="text-[30px] font-light" style={{ letterSpacing: "6px" }}></h1>
                    </div>

                     */}

                    {/* PRODUTOS */}

                    <section className="w-[97%] h-[60vh] text-zinc-700 flex flex-col justify-start items-center p-2 rounded-lg bg-white mt-3 overflow-y-auto">
                        <div className="w-full p-2 flex flex-col justify-between items-center gap-3">
                            {
                                currentAuct.product_list.map((product, index) => (

                                    <div className="w-full flex hover:border-[1px] border-zinc-300 cursor-pointer p-1 rounded-lg"
                                        key={index}>
                                        <span className="text-[16px] font-bold w-[20px] flex justify-center items-center overflow-hidden p-2">
                                            {index + 1}
                                        </span>
                                        <span className="text-[16px] font-bold w-screen flex justify-center items-center overflow-hidden p-2">
                                            {product.title}
                                        </span>
                                        {/* <span className="text-[16px] font-bold w-screen flex justify-start items-center overflow-hidden">
                                            R$ {product.initial_value.toFixed(2)}
                                        </span> */}
                                        <span
                                            onClick={() => handleShowPhotoAdd(product)}
                                            className="min-w-[40px] min-h-[40px] mr-1 flex justify-center items-center">
                                            {product.cover_img_url === "string" ?
                                                <NoPhotography /> :
                                                <img src={product.cover_img_url} alt=""
                                                    className="w-[40px] h-[40px] bg-[#474747] object-cover rounded-full" />
                                            }
                                        </span>

                                        <span
                                            onClick={() => redirectToProductDetails(product.id)}
                                            className="min-w-[40px] min-h-[40px] flex justify-center items-center">
                                            <EditNote style={{ fontSize: "30px" }} />
                                        </span>

                                    </div>

                                ))
                            }

                        </div>
                    </section>

                </div>

            </section>
        </div>
    )
}

export default AdvertiserAuctDetails;