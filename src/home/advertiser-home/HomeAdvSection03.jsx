/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeAdvSection03({ currentAdvertiser, selectedAuction }) {
    const [firstAuction, setFirstAuction] = useState({})
    const [productList, setProductList] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getAdvertiserAuctions()
    }, [currentAdvertiser, selectedAuction])

    const getAdvertiserAuctions = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${currentAdvertiser.id}`)
                .then(response => {

                    for (let i = 0; i < response.data.length; i++) {
                        if (!response.data[i]) break
                        if (response.data[i].status === "cataloged") break;
                        setFirstAuction(response.data[i]);
                    }

                    setFirstAuction(response.data[0])
                    setProductList(response.data[0].product_list)
                    console.log("products ->> ", response.data[0].product_list)
                })

        } catch (error) {
            console.log("error -> ", error)
        }
    }

    useEffect(() => { }, [productList])

    return (
        <section className="flex flex-col justify-center items-center w-full h-[80vh] bg-gradient-to-r from-[#0D1733] to-[#030306] relative p-[26px] text-white">

            <h1 className='text-[48px] anton-regular-advertiser-title'>Leilão de {!selectedAuction ?
                firstAuction && firstAuction.categorie :
                selectedAuction.categorie}</h1>
            <p className="w-[60%] text-[16px] font-bold text-center">
                {!selectedAuction ? firstAuction && firstAuction.descriptions_informations : selectedAuction.descriptions_informations}
            </p>

            <div className='flex w-[80%] h-[380px] justify-center items-center'>
                <Swiper
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{ delay: 2400, disableOnInteraction: false }}
                    navigation
                    clickable={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 3,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 4,
                        },
                        1024: {
                            slidesPerView: 6,
                            spaceBetween: 14,
                        },
                    }}
                >
                    {
                        Array.isArray(productList) &&
                        productList.map((product) => {

                            return (
                                <SwiperSlide key={product.id}>
                                    <div onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                                        className="flex justify-center items-center slide-item-img 
                                        transition-all duration-[1s] z-[99] h-[300px] lg:max-w-[200px] w-full
                                        overflow-hidden rounded-[12px] shadow-lg shadow-[#0f0f0fbf] 
                                        cursor-pointer hover:brightness-[1.6]">
                                        <img src={product.cover_img_url} alt="" className="h-[380px] w-full object-cover" />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }

                </Swiper>
            </div>



            <button className='w-[200px] h-[60px] rounded-[20px] mt-[5vh]'>Ir para catálogo</button>
        </section>
    )
}

export default HomeAdvSection03;