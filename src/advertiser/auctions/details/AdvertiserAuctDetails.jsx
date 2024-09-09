/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AssideAdvertiser from "../../_asside/AssideAdvertiser";
import NavAdvertiser from "../../_navigation/NavAdvertiser";
import { useSelector, useDispatch } from "react-redux";
import { NoPhotography, EditNote } from "@mui/icons-material"
import axios from "axios"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"; // Import the plugin
import "./StyleAuctDetails.css"
import { editAuct } from "../../../features/auct/AuctToEdit";
import { selectProduct } from "../../../features/product/ProductAddPhoto";
import AddProductMod from "../mod/AddProductMod";
import AuctionHeader from "./AuctionHeader"; // Import the new component

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

function AdvertiserAuctDetails() {
    const { auct_id } = useParams(); // Get parameters from URL
    const [currentAuct, setCurrentAuct] = useState({ product_list: [] })
    const [isDeleting, setIsDeleting] = useState(false)
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
    const localAdvertiser = JSON.parse(currentLocalAdvertiser)

    useEffect(() => {
        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        }

        getCurrentAuctById(auct_id)
    }, [auct_id, state.finishedUpload])

    useEffect(() => {
        console.log("observando datas -> ", currentAuct.auct_dates)
    }, [currentAuct.auct_dates])

    const getCurrentAuctById = async (auctId) => {
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auctId}`, {
            headers: {
                'Authorization': `Bearer ${localAdvertiser.token}`
            }
        }).then(async response => {
            setCurrentAuct(response.data)
            console.log('Received dates:', response.data.auct_dates); // Log the received dates
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

    const handleDeleteAuction = async (auct_id) => {
        setIsDeleting(true)

        try {
            await axios.delete(`${import.meta.env.VITE_APP_BACKEND_API}/auct/delete-auct?auct_id=${auct_id}`, {
                headers: {
                    'Authorization': `Bearer ${localAdvertiser.token}`
                }
            }).then(response => {
                console.log(response.data)
                setIsDeleting(false)
            })
        } catch (error) {
            setIsDeleting(false)
            console.log(error)
        }
    }

    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

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
                    <AuctionHeader
                        currentAuct={currentAuct}
                        editCurrentAuct={editCurrentAuct}
                        handleDeleteAuction={handleDeleteAuction}
                        isDeleting={isDeleting}
                    />

                    {/* PRODUTOS */}
                    <section className="w-[97%] h-[60vh] text-zinc-700 flex flex-col justify-start items-center p-2 rounded-lg bg-white mt-3 overflow-y-auto">
                        <div className="w-full p-2 flex flex-col justify-between items-center gap-3">
                            {
                                currentAuct.product_list
                                    .sort((a, b) => a.lote - b.lote) // Ordenar pela propriedade 'lote'
                                    .map((product, index) => (
                                        <div className="w-full flex hover:border-[1px] border-zinc-300 cursor-pointer p-1 rounded-lg"
                                            key={index}>
                                            <span className="text-[16px] font-bold w-[20px] flex justify-center items-center overflow-hidden p-2">
                                                {index + 1}
                                            </span>
                                            <span className="text-[16px] font-bold w-screen flex justify-center items-center overflow-hidden p-2">
                                                {product.title}
                                            </span>
                                            <span className="text-[16px] w-[300px] font-bold flex justify-start items-center overflow-hidden">
                                                {formatCurrency(product.initial_value)}
                                            </span>
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