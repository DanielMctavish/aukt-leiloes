/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import AssideAdvertiser from "../../_asside/AssideAdvertiser";
import NavAdvertiser from "../../_navigation/NavAdvertiser";
import { useEffect, useState } from "react";
import { DeleteForever, ImageNotSupported } from "@mui/icons-material"
import AdvertiserProductDetailsUpdate from "./AdvertiserProductDetailsUpdate"; // Import the update modal

function AdvertiserProductDetails() {
    const [currentProduct, setCurrentProduct] = useState({})
    const [deleteIsLoading, setDeleteIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false) // State to control the edit modal
    const navigate = useNavigate()
    const { product_id } = useParams();

    useEffect(() => {
        getCurrentProduct()
    }, [deleteIsLoading])

    const getCurrentProduct = async () => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        const localAdvertiser = JSON.parse(currentLocalAdvertiser)

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`, {
            headers: {
                'Authorization': `Bearer ${localAdvertiser.token}`
            }
        }).then(async response => {
            setCurrentProduct(response.data)
        }).catch(err => {
            if (err.response.status === 404) {
                navigate('/advertiser/auctions')
            }
        })
    }

    const handleDeleteProductImage = async (url, product_id) => {
        setDeleteIsLoading(true)
        try {
            await axios.delete(`${import.meta.env.VITE_APP_BACKEND_API}/products/delete-product-img`, {
                params: {
                    url_product: url,
                    product_id: product_id
                }
            });
            setDeleteIsLoading(false)
        } catch (error) {
            setDeleteIsLoading(false)
        }
    }

    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#091925]">
            <AssideAdvertiser MenuSelected="menu-3" />
            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
                <NavAdvertiser path='anunciante > leilões > detalhes > produtos' />

                <section className="flex md:flex-row flex-col justify-start items-center w-full h-[99vh] relative bg-[#1c2b3a] p-4 gap-4 text-zinc-200 overflow-hidden rounded-lg shadow-lg">

                    {!deleteIsLoading ? (
                        <div className="md:w-[60%] w-full md:h-[100%] h-[50%] bg-[#2e3b4e] flex justify-center items-center rounded-lg shadow-md">
                            <div className="w-[90%] relative">
                                {currentProduct.cover_img_url ? (
                                    <>
                                        <span onClick={() => handleDeleteProductImage(currentProduct.cover_img_url, currentProduct.id)}
                                            className="absolute top-[3vh] right-2 cursor-pointer">
                                            <DeleteForever sx={{ color: "#c20000" }} />
                                        </span>
                                        <img src={currentProduct.cover_img_url} alt="" className="max-h-[92%] w-full object-cover rounded-md shadow-md" />
                                    </>
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        <ImageNotSupported sx={{ fontSize: 100, color: "#c20000" }} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col w-[16%] justify-start items-center gap-2">
                                {Array.isArray(currentProduct.group_imgs_url) && currentProduct.group_imgs_url.map((url, key) => (
                                    <div key={key} className="relative">
                                        <span onClick={() => handleDeleteProductImage(url, currentProduct.id)} className="absolute top-1 right-2 cursor-pointer">
                                            <DeleteForever sx={{ color: "#c20000" }} />
                                        </span>
                                        <img src={url} className="w-[100px] h-[100px] object-cover rounded-[4px] shadow-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="md:w-[60%] w-full md:h-[100%] h-[50%] bg-[#2e3b4e] flex justify-center items-center rounded-lg shadow-md">
                            excluindo imagem...
                        </div>
                    )}

                    <div className="md:w-[40%] w-full md:h-[100%] h-[50%] bg-[#2e3b4e] flex flex-col justify-start items-start p-4 rounded-lg shadow-md">
                        <h1 className="text-zinc-200 font-bold text-[22px] p-1 rounded-md">
                            {currentProduct.title}
                        </h1>
                        <div className="w-full flex justify-between items-center">
                            <span className="text-zinc-200 font-bold text-[18px] p-1 rounded-md">
                                {formatCurrency(currentProduct.initial_value)}
                            </span>

                            <span className="text-[#b5f8ff] font-bold text-[22px] p-1 rounded-md relative">
                                <span className="absolute top-0 right-0 text-[10px] p-[1px] font-bold text-[#ffffff] rounded-full">R</span>
                                {formatCurrency(currentProduct.reserve_value)}
                            </span>

                            <span className="text-zinc-200 font-bold text-[26px] p-1 rounded-md">
                                {currentProduct.group}
                            </span>
                        </div>
                        <div className="flex w-[98%] bg-zinc-300 h-[1px] my-2"></div>
                        <div className="flex justify-center items-center w-full h-[200px] text-[16px] rounded-lg text-zinc-200">
                            <p>
                                {currentProduct.description}
                            </p>
                        </div>

                        <button onClick={() => setIsEditing(true)} className="w-[97%] h-[40px] text-center bg-[#072338] text-white rounded-md">Editar Produto</button>
                    </div>

                </section>
            </section>

            {isEditing && (
                <AdvertiserProductDetailsUpdate
                    product={currentProduct}
                    onClose={() => setIsEditing(false)}
                    onUpdate={getCurrentProduct}
                />
            )}
        </div>
    )
}

export default AdvertiserProductDetails;