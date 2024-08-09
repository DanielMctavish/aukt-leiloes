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
    const navigate = useNavigate()

    useEffect(() => {
        getAdvertiserAuctions()
    }, [currentAdvertiser])

    const getAdvertiserAuctions = async () => {

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${currentAdvertiser.id}`);
            setAuctionList(response.data)
        } catch (error) {
            console.log("error -> ", error)
        }

    }

    useEffect(() => { }, [auctionList])

    return (
        <section className="flex flex-col justify-center items-center w-full h-[60vh] bg-[#0D1733] relative">
            <div className="flex w-full h-[80%] text-white justify-start items-center">
                <div className="flex flex-col w-[60%] ml-[12vh] gap-6">
                    <h1 className="text-[48px] font-bold anton-regular-advertiser-title">Leilões disponíveis</h1>
                    <p className="w-[60%] text-[16px] font-bold">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>

            <div className="flex justify-start items-center w-[50%] h-[60%] absolute right-0 bottom-[3vh] gap-1 overflow-hidden p-1">
                <div className="text-white mr-[2vh]">
                    <ArrowCircleLeft sx={{ fontSize: "30px" }} />
                </div>

                <Swiper
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                            slidesPerView: 3,
                            spaceBetween: 6,
                        },
                    }}
                >
                    {
                        Array.isArray(auctionList) &&
                        auctionList.map((auction) => {
                            if (auction.status !== 'cataloged') return null;
                            return (
                                <SwiperSlide key={auction.id}>
                                    <div onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)} className="flex justify-center items-center slide-item-img transition-all duration-[1s]
                                    overflow-hidden rounded-[2px] shadow-lg shadow-[#0f0f0fbf] cursor-pointer hover:brightness-[1.6]">
                                        <img src={auction.auct_cover_img} alt="" className="h-[360px] w-full object-cover" />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>

            <div className="flex w-full h-[20%] bg-[#efefef]"></div>
        </section>
    )
}

export default HomeAdvSection02;
