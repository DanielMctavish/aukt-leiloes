/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';

function HeaderCarousel({ config }) {
    const [selectedAuct, setSelectedAuct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { advertiser_id } = useParams();

    // Primeiro useEffect para carregar o leilão inicial
    useEffect(() => {
        const fetchInitialAuct = async () => {
            if (!advertiser_id) return;

            try {
                const advertiserSession = localStorage.getItem('advertiser-session-aukt');
                if (!advertiserSession) return;

                const { token } = JSON.parse(advertiserSession);
                
                // Primeiro, buscar todos os leilões do anunciante
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`,
                    {
                        params: { creator_id: advertiser_id },
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                // Se temos um leilão específico configurado, use-o
                if (config.selectedAuctId) {
                    const auct = response.data.find(a => a.id === config.selectedAuctId);
                    if (auct) {
                        setSelectedAuct(auct);
                    }
                } 
                // Caso contrário, use o primeiro leilão disponível
                else if (response.data.length > 0) {
                    setSelectedAuct(response.data[0]);
                }
            } catch (error) {
                console.error("Erro ao buscar leilões:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialAuct();
    }, [advertiser_id]); // Executar apenas quando o advertiser_id mudar

    // Segundo useEffect para atualizar quando o selectedAuctId mudar
    useEffect(() => {
        if (!config.selectedAuctId || !advertiser_id) return;

        const fetchSelectedAuct = async () => {
            try {
                const advertiserSession = localStorage.getItem('advertiser-session-aukt');
                if (!advertiserSession) return;

                const { token } = JSON.parse(advertiserSession);
                
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`,
                    {
                        params: {
                            creator_id: advertiser_id,
                            id: config.selectedAuctId
                        },
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                
                const auct = response.data.find(a => a.id === config.selectedAuctId);
                if (auct) {
                    setSelectedAuct(auct);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes do leilão:", error);
            }
        };

        fetchSelectedAuct();
    }, [config.selectedAuctId, advertiser_id]);

    if (isLoading) {
        return <div className="text-white text-center">Carregando carrossel...</div>;
    }

    if (!selectedAuct || !selectedAuct.product_list?.length) return null;

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
                <h2 className="text-2xl font-bold mb-4 text-white">
                    {config.title} - {selectedAuct.title}
                </h2>
            )}
            <Swiper
                modules={[FreeMode, Navigation, Autoplay]}
                spaceBetween={10}
                slidesPerView={Math.min(config.itemsToShow, selectedAuct.product_list.length)}
                navigation={config.showNavigation !== false}
                autoplay={{
                    delay: config.speed,
                    disableOnInteraction: false,
                }}
                style={{
                    height: config.size.height,
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                    ...(config.showNavigation === false && {
                        '--swiper-navigation-size': '0',
                    })
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
                            {(config.showTitle !== false || config.showPrice !== false) && (
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    {config.showTitle !== false && (
                                        <h3 className="text-white text-sm font-semibold truncate mb-1">
                                            {product.title}
                                        </h3>
                                    )}
                                    {config.showPrice !== false && (
                                        <p className="text-gray-200 text-xs">
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
