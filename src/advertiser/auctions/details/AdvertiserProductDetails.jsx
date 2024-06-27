/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import AssideAdvertiser from "../../_asside/AssideAdvertiser";
import NavAdvertiser from "../../_navigation/NavAdvertiser";
import { useEffect, useState } from "react";

function AdvertiserProductDetails() {
    const [currentProduct, setCurrentProduct] = useState({})
    const navigate = useNavigate()
    const { product_id } = useParams();

    useEffect(() => {
        getCurrentProduct()
    }, [])

    const getCurrentProduct = async () => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        const localAdvertiser = JSON.parse(currentLocalAdvertiser)

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`, {
            headers: {
                'Authorization': `Bearer ${localAdvertiser.token}`
            }
        }).then(async response => {

            setCurrentProduct(response.data)
            console.log('produto: ', response.data);

        }).catch(err => {
            console.log('err get auct >>', err.message)
            if (err.response.status === 404) {
                navigate('/advertiser/auctions')
            }
        })

    }
    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <AssideAdvertiser MenuSelected="menu-3" />
            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
                <NavAdvertiser path='anunciante > leilões > detalhes > produtos' />

                <section className="flex md:flex-row flex-col justify-start items-center w-full h-[99vh] relative bg-zinc-100 p-1 gap-1 text-zinc-600 overflow-hidden">

                    <div className="md:w-[60%] w-full md:h-[100%] h-[50%] bg-[#4e91c4]/20 flex justify-center items-center">
                        <img src={currentProduct.cover_img_url} alt="" className="max-h-[92%] object-cover rounded-md shadow-md shadow-[#07070738]" />
                        <div className="flex flex-col w-[16%] justify-start items-center gap-2">
                            {
                                Array.isArray(currentProduct.group_imgs_url) && currentProduct.group_imgs_url.map((url, key) => {
                                    return (
                                        <img src={url} key={key} className="w-[100px] h-[100px] object-cover rounded-[4px] shadow-[#1010106a] shadow-lg" />
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="md:w-[40%] w-full md:h-[100%] h-[50%] bg-[#86bbe3]/10 flex flex-col justify-start items-start">
                        <h1 className="text-zinc-600 font-bold text-[22px] p-1 rounded-md">
                            {currentProduct.title}
                        </h1>
                        <div className="w-full flex justify-between items-center">
                            <span className="text-zinc-600 font-bold text-[18px] p-1 rounded-md">
                                R$ {currentProduct.initial_value && currentProduct.initial_value.toFixed(2)}
                            </span>

                            <span className="text-[#b91313] font-bold text-[22px]  p-1 rounded-md relative">
                                <span className="absolute top-0 right-0 text-[10px] p-[1px] font-bold text-[#d36464] rounded-full">R</span>
                                R$ {currentProduct.reserve_value && currentProduct.reserve_value.toFixed(2)}
                            </span>

                            <span className="text-zinc-900 font-bold text-[26px]  p-1 rounded-md">
                                {currentProduct && currentProduct.group}
                            </span>

                        </div>
                        <div className="flex w-[98%] bg-zinc-300 h-[1px]"></div>
                        <div className="flex justify-center items-center w-full h-[200px] text-[12px] rounded-lg text-zinc-600">
                            <p>
                                {currentProduct.description}
                            </p>
                        </div>

                        <button className="w-[97%] h-[40px] text-center bg-[#b91313] text-white rounded-md">editar produto</button>
                    </div>

                </section>

            </section>
        </div>
    )

}

export default AdvertiserProductDetails;