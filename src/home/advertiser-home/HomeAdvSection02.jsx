/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import "./styles/HomeAdvertiser.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios"
import { useEffect, useState } from "react";
import { ArrowCircleLeft } from "@mui/icons-material"
import { useNavigate } from "react-router-dom";

function HomeAdvSection02({ currentAdvertiser }) {
    const [auctionList, setAuctionList] = useState([])
    const [slidesPerView, setSlidesPerView] = useState(3)
    const navigate = useNavigate()

    useEffect(() => {
        getAdvertiserAuctions()
    }, [currentAdvertiser])

    const getAdvertiserAuctions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${currentAdvertiser.id}`);
            const catalogedAuctions = response.data.filter(auction => auction.status === 'cataloged');
            setAuctionList(catalogedAuctions)
            setSlidesPerView(Math.min(3, catalogedAuctions.length))
        } catch (error) {
            console.log("error -> ", error)
        }
    }

    return (
        <section className="flex flex-col justify-center items-center w-full h-[60vh] bg-[#0D1733] relative">
            <div className="flex w-full h-[80%] text-white justify-start items-center">
                <div className="flex flex-col w-[60%] ml-[12vh] gap-6">
                    <h1 className="text-[48px] font-bold anton-regular-advertiser-title">Leilões disponíveis</h1>
                    <p className="w-[60%] text-[16px] font-bold">
                        Explore nossa seleção de leilões ativos, com uma variedade de itens exclusivos 
                        esperando pelo seu lance. Cada leilão oferece uma oportunidade única de adquirir 
                        produtos de qualidade a preços competitivos. Não perca a chance de participar 
                        e garantir aquele item especial que você tanto deseja. Comece a navegar agora 
                        e descubra as melhores ofertas!
                    </p>
                </div>
            </div>

            <div className="flex justify-start items-center w-[50%] h-[60%] absolute right-0 bottom-[3vh] gap-1 overflow-hidden p-1">
                <div className="text-white mr-[2vh]">
                    <ArrowCircleLeft sx={{ fontSize: "30px" }} />
                </div>

                <div className="w-[calc(100%-40px)] h-full">
                    <Swiper
                        pagination={{ clickable: true }}
                        loop={auctionList.length > slidesPerView}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            640: {
                                slidesPerView: Math.min(1, auctionList.length),
                                spaceBetween: 10,
                            },
                            768: {
                                slidesPerView: Math.min(2, auctionList.length),
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: slidesPerView,
                                spaceBetween: 30,
                            },
                        }}
                        className="h-full"
                    >
                        {auctionList.map((auction) => (
                            <SwiperSlide key={auction.id} className="h-full">
                                <div 
                                    onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)} 
                                    className="flex justify-center items-center slide-item-img transition-all duration-[1s]
                                    overflow-hidden rounded-[2px] shadow-lg shadow-[#0f0f0fbf] cursor-pointer hover:brightness-[1.6]
                                    h-full"
                                >
                                    <img src={auction.auct_cover_img} alt="" className="w-full h-full object-cover" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <div className="flex w-full h-[20%] bg-[#efefef]"></div>
        </section>
    )
}

export default HomeAdvSection02;
