/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useEffect, useState } from 'react';

function CarroselHomeAdvertiserDetails({ currentProduct }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [totalImages, setTotalImages] = useState(0);

    useEffect(() => {
        const imgsGroup = currentProduct?.group_imgs_url || [];
        setTotalImages(1 + imgsGroup.length); // cover + group images
    }, [currentProduct]);

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
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs]}
                >
                    <SwiperSlide>
                        <div className='flex w-auto h-[600px] object-cover justify-center bg-zinc-200'>
                            <img src={currentProduct?.cover_img_url} alt="foto-produto-leilão"
                                className='w-auto h-[600px] object-cover rounded-md' />
                        </div>
                    </SwiperSlide>
                    {currentProduct?.group_imgs_url?.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className='flex w-auto h-[600px] justify-center object-cover bg-zinc-200'>
                                <img src={img} alt="foto-produto-leilão"
                                    className='w-auto h-full object-cover rounded-md' />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="flex justify-start items-center w-[600px] mt-2 bg-zinc-200">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={totalImages < 4 ? totalImages : 4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbs-swiper"
                >
                    <SwiperSlide>
                        <img src={currentProduct?.cover_img_url} alt="thumb"
                            className="flex w-[140px] h-[100px] object-cover rounded-md cursor-pointer" />
                    </SwiperSlide>
                    {currentProduct?.group_imgs_url?.map((img, i) => (
                        <SwiperSlide key={i}>
                            <img src={img} alt="thumb" className="flex w-[140px] h-[100px] object-cover rounded-md cursor-pointer" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default CarroselHomeAdvertiserDetails