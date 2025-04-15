/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, memo } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Autoplay, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Componente de slide memoizado para evitar renderizações desnecessárias
const CarouselSlide = memo(({ product, showTitle, showPrice }) => (
    <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden group">
        <img 
            src={product.cover_img_url} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
        />
        {(showTitle || showPrice) && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                {showTitle && (
                    <h3 className="text-white text-sm font-semibold truncate">
                        {product.title}
                    </h3>
                )}
                {showPrice && (
                    <p className="text-gray-200 text-xs mt-1">
                        R$ {product.initial_value?.toFixed(2)}
                    </p>
                )}
            </div>
        )}
    </div>
));

CarouselSlide.displayName = 'CarouselSlide';

function HeaderCarousel({ config, advertiser_id }) {
    const [selectedAuct, setSelectedAuct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (config?.enabled && config?.selectedAuctId) {
            fetchAuction();
        }
    }, [config, advertiser_id]);

    useEffect(() => {
        // Função para atualizar o estado da largura da janela
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Adicionar listener para redimensionamento
        window.addEventListener('resize', handleResize);

        // Remover listener quando o componente for desmontado
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    // Função para calcular o número de slides com base na largura da tela
    const getSlidesPerView = () => {
        if (windowWidth <= 640) return 1;
        if (windowWidth <= 768) return Math.min(2, config.itemsToShow, selectedAuct.product_list.length);
        if (windowWidth <= 1024) return Math.min(3, config.itemsToShow, selectedAuct.product_list.length);
        return Math.min(config.itemsToShow, selectedAuct.product_list.length);
    };

    // Memoizando as configurações do Swiper para evitar recálculos desnecessários
    const swiperConfig = useMemo(() => ({
        modules: [FreeMode, Navigation, Autoplay, Pagination, Keyboard],
        spaceBetween: 10,
        slidesPerView: getSlidesPerView(),
        navigation: windowWidth > 640 && config.showNavigation,
        pagination: config.showPagination && { clickable: true },
        keyboard: { enabled: true },
        grabCursor: true,
        autoplay: {
            delay: config.speed,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            640: {
                slidesPerView: Math.min(2, config.itemsToShow, selectedAuct?.product_list?.length || 1),
                spaceBetween: 15
            },
            768: {
                slidesPerView: Math.min(3, config.itemsToShow, selectedAuct?.product_list?.length || 1),
                spaceBetween: 15
            },
            1024: {
                slidesPerView: Math.min(config.itemsToShow, selectedAuct?.product_list?.length || 1),
                spaceBetween: 20
            }
        },
        style: {
            height: '100%',
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
            '--swiper-navigation-size': windowWidth <= 768 ? '24px' : '44px',
        }
    }), [windowWidth, config, selectedAuct?.product_list?.length]);

    if (isLoading) {
        return <div className="text-white text-center">Carregando carrossel...</div>;
    }

    if (!config?.enabled || !selectedAuct || !selectedAuct.product_list?.length) return null;

    // Se tiver apenas um item, não precisa de carrossel
    const isSingleItem = selectedAuct.product_list.length === 1;

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
                <h2 className={`font-bold mb-4 text-white ${windowWidth <= 640 ? 'text-lg' : 'text-2xl'}`}>
                    {config.title} - {selectedAuct.title}
                </h2>
            )}
            {isSingleItem ? (
                // Renderização para um único item
                <CarouselSlide 
                    product={selectedAuct.product_list[0]} 
                    showTitle={config.showTitle} 
                    showPrice={config.showPrice} 
                />
            ) : (
                // Carrossel para múltiplos itens
                <Swiper {...swiperConfig}>
                    {selectedAuct.product_list.map((product, index) => (
                        <SwiperSlide key={index}>
                            <CarouselSlide 
                                product={product} 
                                showTitle={config.showTitle} 
                                showPrice={config.showPrice} 
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}

export default memo(HeaderCarousel); 