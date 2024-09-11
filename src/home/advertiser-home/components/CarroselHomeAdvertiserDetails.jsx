/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useEffect, useState } from 'react';

function CarroselHomeAdvertiserDetails({ currentProduct }) {
    const [emptySlot, setEmptySlot] = useState([])

    useEffect(() => {
        const imgsGroup = currentProduct && currentProduct.group_imgs_url

        if (imgsGroup && imgsGroup.length < 3) {
            const emptySlots = Array(3 - imgsGroup.length).fill(null);
            setEmptySlot(emptySlots);
        }

    }, []);

    return (
        <div className='flex flex-col w-[600px] overflow-hidden transition-none'>
            <div className="flex w-[600px] h-[600px] justify-center items-center bg-transparent">
                <Swiper
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                    }}
                    spaceBetween={2}
                    navigation={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                >
                    <SwiperSlide>
                        <div className='flex w-auto h-[600px] object-cover justify-center bg-zinc-200'>
                            <img src={currentProduct && currentProduct.cover_img_url} alt="foto-produto-leilão"
                                className='w-auto h-[600px] object-cover rounded-md' />
                        </div>
                    </SwiperSlide>
                    {currentProduct && currentProduct.group_imgs_url &&
                        currentProduct.group_imgs_url.map((img, i) => (
                            <SwiperSlide key={i}>
                                <div className='flex w-auto h-[600px] justify-center object-cover bg-zinc-200'>
                                    <img src={img} alt="foto-produto-leilão"
                                        className='w-auto h-full object-cover rounded-md' />
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>

            <div className="flex justify-start items-center w-[600px] mt-2 bg-zinc-200">
                <Swiper
                    spaceBetween={2}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                >
                    <SwiperSlide>
                        <img src={currentProduct && currentProduct.cover_img_url && currentProduct.cover_img_url} alt="thumb"
                            className="flex min-w-[140px] h-[100px] object-cover rounded-md" />
                    </SwiperSlide>
                    {
                        currentProduct && currentProduct.group_imgs_url &&
                        currentProduct && currentProduct.group_imgs_url.map((img, i) => (
                            <SwiperSlide key={i}>
                                <img src={img} alt="thumb" className="flex min-w-[140px] h-[100px] object-cover rounded-md" />
                            </SwiperSlide>
                        ))
                    }
                    {
                        emptySlot &&
                        emptySlot.map((_, i) => (
                            <SwiperSlide key={i}>
                                <div className="flex min-w-[140px] h-[100px] object-cover rounded-md bg-slate-300"></div>
                            </SwiperSlide>
                        ))
                    }

                </Swiper>
            </div>
        </div>
    )
}

export default CarroselHomeAdvertiserDetails