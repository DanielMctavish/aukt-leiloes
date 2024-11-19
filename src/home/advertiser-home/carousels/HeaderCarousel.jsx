import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function HeaderCarousel({ config, advertiser_id }) {
    const [selectedAuct, setSelectedAuct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (config?.enabled && config?.selectedAuctId) {
            fetchAuction();
        }
    }, [config, advertiser_id]);

    const fetchAuction = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct`, {
                params: { auct_id: config.selectedAuctId }
            });
            if (response.data) {
                setSelectedAuct(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar leilão para o carrossel:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="text-white text-center">Carregando carrossel...</div>;
    }

    if (!config?.enabled || !selectedAuct || !selectedAuct.product_list?.length) return null;

    return (
        <div 
            className="absolute z-30"
            style={{
                top: config.positionTop,
                left: config.positionLeft,
                width: config.sizeWidth,
                height: config.sizeHeight
            }}
        >
            {config.showCarouselTitle && (
                <h2 className="text-2xl font-bold mb-4 text-white">
                    {config.title} - {selectedAuct.title}
                </h2>
            )}
            <Swiper
                modules={[FreeMode, Navigation, Autoplay]}
                spaceBetween={10}
                slidesPerView={Math.min(config.itemsToShow, selectedAuct.product_list.length)}
                navigation={config.showNavigation}
                autoplay={{
                    delay: config.speed,
                    disableOnInteraction: false,
                }}
                style={{
                    height: '100%',
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
            >
                {selectedAuct.product_list.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden group">
                            <img 
                                src={product.cover_img_url} 
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {(config.showTitle || config.showPrice) && (
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    {config.showTitle && (
                                        <h3 className="text-white text-sm font-semibold truncate">
                                            {product.title}
                                        </h3>
                                    )}
                                    {config.showPrice && (
                                        <p className="text-gray-200 text-xs mt-1">
                                            R$ {product.initial_value?.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default HeaderCarousel; 