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

                <section className="flex flex-col justify-start items-center w-full h-full relative bg-zinc-900 p-1 gap-1">

                    <div className="flex justify-around items-center w-full h-[100px] bg-white rounded-lg gap-3">

                        <h1 className="text-zinc-600 font-bold text-[26px] bg-zinc-50 p-1 rounded-md">
                            {currentProduct.title}
                        </h1>
                        <h1 className="text-zinc-600 font-bold text-[26px] bg-zinc-50 p-1 rounded-md">
                            R$ {currentProduct.initial_value && currentProduct.initial_value.toFixed(2)}
                        </h1>
                        <h1 className="text-zinc-600 font-bold text-[26px] bg-zinc-50 p-1 rounded-md relative">
                            <span className="absolute top-0 right-0 bg-[#104d64] text-[10px] p-[1px] font-bold text-white rounded-full">R</span>
                            R$ {currentProduct.reserve_value && currentProduct.reserve_value.toFixed(2)}
                        </h1>
                        <h1 className="text-zinc-900 font-bold text-[26px] bg-zinc-50 p-1 rounded-md">
                            {currentProduct && currentProduct.group}
                        </h1>

                    </div>

                    <div className="flex justify-center items-center w-full h-[200px] bg-white rounded-lg text-zinc-600">
                        <p>
                            {currentProduct.description}
                        </p>
                    </div>

                    <section className="w-full h-[40vh] bg-white rounded-lg flex justify-start items-center gap-3 p-2">
                        <div className="flex justify-center w-[300px] h-[300px] overflow-hidden bg-zinc-300 rounded-lg">
                            <img src={currentProduct.cover_img_url} alt="" className="w-full h-full object-cover" />
                        </div>

                        <div className="grid grid-cols-2 gap-1">
                            {
                                Array.isArray(currentProduct.group_imgs_url) && currentProduct.group_imgs_url.map((url, key) => {
                                    return (
                                        <img src={url} key={key} className="w-[200px] object-cover rounded-lg" />
                                    )
                                })
                            }
                        </div>
                    </section>

                </section>

            </section>

        </div>
    )
}

export default AdvertiserProductDetails;