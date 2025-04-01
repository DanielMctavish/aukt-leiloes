/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination, Zoom } from 'swiper/modules';
import { useEffect, useState } from 'react';
import carimboImage from "../../../media/carimbo.png";
// Importações explícitas do CSS do Swiper
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
// CSS personalizado para corrigir problemas específicos
import './fix-swiper.css';

function CarroselHomeAdvertiserDetails({ currentProduct }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [totalImages, setTotalImages] = useState(0);
    const [groupImages, setGroupImages] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Detectar se é mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (currentProduct) {
            // Garantir que group_imgs_url seja sempre um array
            const imgsGroup = Array.isArray(currentProduct.group_imgs_url) 
                ? currentProduct.group_imgs_url 
                : [];
            
            setGroupImages(imgsGroup);
            setTotalImages(1 + imgsGroup.length);
        }
    }, [currentProduct]);

    // Força a recriação do thumbsSwiper quando as imagens mudam
    useEffect(() => {
        // Se temos um thumbsSwiper e as imagens mudaram, devemos recriar o swiper
        if (thumbsSwiper) {
            thumbsSwiper.update();
        }
    }, [groupImages]);

    const renderCarimbo = () => {
        if (currentProduct?.Winner) {
            return (
                <img
                    src={carimboImage}
                    alt="Arrematado"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-[150px] h-[150px] md:w-[200px] md:h-[200px]
                        object-contain z-10 opacity-90"
                />
            );
        }
        return null;
    };

    if (!currentProduct) {
        return (
            <div className="flex justify-center items-center w-full h-[50vh] md:h-[calc(100vh-180px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012038]"></div>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-full h-auto md:h-[calc(100vh-180px)] max-w-[600px] mx-auto overflow-hidden'>
            {/* Container principal do carrossel */}
            <div className="relative flex-1 mb-3 md:mb-4 aspect-square md:aspect-auto">
                {renderCarimbo()}
                <Swiper
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                        height: '100%'
                    }}
                    spaceBetween={10}
                    navigation={!isMobile}
                    pagination={isMobile ? { dynamicBullets: true } : false}
                    zoom={isMobile}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs, Pagination, Zoom]}
                    className="rounded-lg product-swiper aspect-square md:aspect-auto"
                >
                    <SwiperSlide>
                        <div className='flex w-full h-full justify-center items-center bg-zinc-100 rounded-lg swiper-zoom-container'>
                            <img 
                                src={currentProduct?.cover_img_url} 
                                alt="foto-produto-leilão"
                                className='w-full h-full object-contain rounded-lg' 
                            />
                        </div>
                    </SwiperSlide>
                    {groupImages.map((img, i) => (
                        <SwiperSlide key={`main-slide-${i}`}>
                            <div className='flex w-full h-full justify-center items-center bg-zinc-100 rounded-lg swiper-zoom-container'>
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

            {/* Thumbnails - ocultado em telas muito pequenas */}
            <div className={`h-[60px] md:h-[80px] bg-zinc-100 rounded-lg p-2 mb-2 md:mb-4 ${window.innerWidth < 360 ? 'hidden' : ''}`}>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={4}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="h-full thumbs-swiper"
                    style={{
                        '--swiper-navigation-color': '#012038',
                        '--swiper-pagination-color': '#012038',
                    }}
                    breakpoints={{
                        320: { slidesPerView: 4, spaceBetween: 4 },
                        480: { slidesPerView: 5, spaceBetween: 6 },
                        640: { slidesPerView: 6, spaceBetween: 8 },
                        768: { slidesPerView: Math.min(totalImages, 5) }
                    }}
                >
                    {/* Thumbnail da imagem de capa */}
                    <SwiperSlide>
                        <div className="h-full aspect-square bg-white border border-gray-200 rounded-md overflow-hidden">
                            <img 
                                src={currentProduct?.cover_img_url} 
                                alt="thumb"
                                className="h-full w-full object-cover rounded-md cursor-pointer" 
                            />
                        </div>
                    </SwiperSlide>
                    
                    {/* Thumbnails das imagens adicionais */}
                    {groupImages.length > 0 ? (
                        groupImages.map((img, i) => (
                            <SwiperSlide key={`thumb-slide-${i}`}>
                                <div className="h-full aspect-square bg-white border border-gray-200 rounded-md overflow-hidden">
                                    <img 
                                        src={img} 
                                        alt={`thumb-${i + 1}`}
                                        className="h-full w-full object-cover rounded-md cursor-pointer" 
                                    />
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <></>
                    )}
                </Swiper>
            </div>
            
         
        </div>
    );
}

export default CarroselHomeAdvertiserDetails