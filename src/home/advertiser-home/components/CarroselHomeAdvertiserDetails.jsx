/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useEffect, useState } from 'react';
import carimboImage from "../../../media/carimbo.png";

function CarroselHomeAdvertiserDetails({ currentProduct }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [totalImages, setTotalImages] = useState(0);

    useEffect(() => {
        if (currentProduct) {
            const imgsGroup = currentProduct.group_imgs_url || [];
            setTotalImages(1 + imgsGroup.length);
        }
    }, [currentProduct]);

    const renderCarimbo = () => {
        if (currentProduct?.Winner) {
            return (
                <img
                    src={carimboImage}
                    alt="Arrematado"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-[180px] h-[180px] md:w-[200px] md:h-[200px]
                        object-contain z-10 opacity-90"
                />
            );
        }
        return null;
    };

    if (!currentProduct) {
        return (
            <div className="flex justify-center items-center w-full h-[calc(100vh-180px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012038]"></div>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-full h-[calc(100vh-180px)] max-w-[600px] mx-auto overflow-hidden'>
            {/* Container principal do carrossel */}
            <div className="relative flex-1 mb-4">
                {renderCarimbo()}
                <Swiper
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                        height: '100%'
                    }}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="rounded-lg product-swiper"
                >
                    <SwiperSlide>
                        <div className='flex w-full h-full justify-center items-center bg-zinc-100 rounded-lg'>
                            <img 
                                src={currentProduct?.cover_img_url} 
                                alt="foto-produto-leilão"
                                className='w-full h-full object-contain rounded-lg' 
                            />
                        </div>
                    </SwiperSlide>
                    {currentProduct?.group_imgs_url?.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className='flex w-full h-full justify-center items-center bg-zinc-100 rounded-lg'>
                                <img 
                                    src={img} 
                                    alt={`foto-produto-leilão-${i + 1}`}
                                    className='w-full h-full object-contain rounded-lg' 
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Thumbnails */}
            <div className="h-[80px] bg-zinc-100 rounded-lg p-2">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={8}
                    slidesPerView={3}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="h-full thumbs-swiper"
                    breakpoints={{
                        320: { slidesPerView: 3 },
                        480: { slidesPerView: 4 },
                        768: { slidesPerView: Math.min(totalImages, 5) }
                    }}
                >
                    {/* Thumbnail da imagem de capa */}
                    <SwiperSlide>
                        <div className="h-full aspect-square">
                            <img 
                                src={currentProduct?.cover_img_url} 
                                alt="thumb"
                                className="h-full w-full object-cover rounded-md cursor-pointer" 
                            />
                        </div>
                    </SwiperSlide>
                    
                    {/* Thumbnails das imagens adicionais */}
                    {currentProduct?.group_imgs_url?.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className="h-full aspect-square">
                                <img 
                                    src={img} 
                                    alt={`thumb-${i + 1}`}
                                    className="h-full w-full object-cover rounded-md cursor-pointer" 
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default CarroselHomeAdvertiserDetails