/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCarouselConfig } from '../../../features/template/HeaderSlice';
import 'swiper/css';
import 'swiper/css/navigation';

function HeaderCarousel({ config }) {
    const [selectedAuct, setSelectedAuct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { advertiser_id } = useParams();
    const dispatch = useDispatch();
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Função para iniciar o arrasto
    const handleMouseDown = (e) => {
        if (config.isDraggable) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.left,
                y: e.clientY - position.top
            });
        }
    };

    // Função para atualizar a posição durante o arrasto
    const handleMouseMove = (e) => {
        if (isDragging && config.isDraggable) {
            const newLeft = e.clientX - dragStart.x;
            const newTop = e.clientY - dragStart.y;
            
            setPosition({ top: newTop, left: newLeft });
            
            // Atualiza o Redux com as novas posições em porcentagem
            const containerRect = carouselRef.current.parentElement.getBoundingClientRect();
            const topPercentage = `${(newTop / containerRect.height) * 100}%`;
            const leftPercentage = `${(newLeft / containerRect.width) * 100}%`;
            
            dispatch(setCarouselConfig({
                ...config,
                positionTop: topPercentage,
                positionLeft: leftPercentage
            }));
        }
    };

    // Função para finalizar o arrasto
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Adiciona e remove os event listeners
    useEffect(() => {
        if (config.isDraggable) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart, config.isDraggable]);

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
            ref={carouselRef}
            className={`absolute z-20 ${config.isDraggable ? 'cursor-move' : ''}`}
            style={{
                top: config.positionTop || '60%',
                left: config.positionLeft || '10%',
                width: config.sizeWidth || '100%',
                height: config.sizeHeight || '40%',
                userSelect: isDragging ? 'none' : 'auto'
            }}
            onMouseDown={handleMouseDown}
        >
            {config.showCarouselTitle !== false && (
                <h2 className="text-2xl font-bold mb-4 text-white">
                    {config.title} - {selectedAuct.title}
                </h2>
            )}
            <div className="w-full h-full">
                <Swiper
                    modules={[FreeMode, Navigation, Autoplay]}
                    spaceBetween={config.spaceBetween}
                    slidesPerView={Math.min(config.itemsToShow || 3, selectedAuct.product_list.length)}
                    navigation={config.showNavigation !== false}
                    autoplay={{
                        delay: config.speed || 3000,
                        disableOnInteraction: false,
                    }}
                    className="w-full h-full"
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                        '--swiper-navigation-size': '24px',
                        ...(config.showNavigation === false && {
                            '--swiper-navigation-size': '0',
                        })
                    }}
                >
                    {selectedAuct.product_list.map((product, index) => (
                        <SwiperSlide key={index} className="!h-full p-2">
                            <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden 
                                group relative transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                                <div className="w-full h-full relative">
                                    <img
                                        src={product.cover_img_url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-500 
                                            group-hover:scale-110"
                                    />
                                    {/* Gradiente de sobreposição */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                                    
                                    {/* Informações do produto */}
                                    {(config.showTitle !== false || config.showPrice !== false) && (
                                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 
                                            group-hover:translate-y-0 transition-transform duration-500">
                                            {config.showTitle !== false && (
                                                <h3 className="text-white text-lg font-bold mb-3 opacity-0 
                                                    group-hover:opacity-100 transition-opacity duration-500 delay-100
                                                    line-clamp-2 hover:line-clamp-none">
                                                    {product.title}
                                                </h3>
                                            )}
                                            {config.showPrice !== false && (
                                                <div className="flex justify-between items-center opacity-0 
                                                    group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                                    <span className="text-white/80 text-sm">Valor Inicial</span>
                                                    <p className="text-white font-bold text-lg">
                                                        {new Intl.NumberFormat('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        }).format(product.initial_value)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default HeaderCarousel;
