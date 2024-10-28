/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';

function HeaderCarousel({ advertiser_id, config }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                    params: {
                        take: config.itemsToShow * 2 // Busca o dobro para ter mais opções
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error.message);
            }
        };

        if (advertiser_id) {
            fetchProducts();
        }
    }, [advertiser_id, config.itemsToShow]);

    if (!products.length) return null;

    return (
        <div 
            className="absolute z-20"
            style={{
                top: config.position.top,
                left: config.position.left,
                width: config.size.width
            }}
        >
            {config.showCarouselTitle !== false && (
                <h2 className="text-2xl font-bold mb-4 text-white">{config.title}</h2>
            )}
            <Swiper
                modules={[FreeMode, Navigation, Autoplay]}
                spaceBetween={10}
                slidesPerView={Math.min(config.itemsToShow, 7)}
                navigation={config.showNavigation !== false}
                autoplay={{
                    delay: config.speed,
                    disableOnInteraction: false,
                }}
                style={{
                    height: config.size.height,
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                    // Oculta as setas de navegação se showNavigation for false
                    ...(config.showNavigation === false && {
                        '--swiper-navigation-size': '0',
                    })
                }}
            >
                {products.slice(0, 7).map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                            <img 
                                src={product.cover_img_url} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                            {(config.showTitle !== false || config.showPrice !== false) && (
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50">
                                    {config.showTitle !== false && (
                                        <h3 className="text-white text-sm font-semibold truncate">
                                            {product.title}
                                        </h3>
                                    )}
                                    {config.showPrice !== false && (
                                        <p className="text-gray-300 text-xs">
                                            R$ {product.initial_price}
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
