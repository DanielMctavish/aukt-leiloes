/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Star } from "@mui/icons-material";
import dayjs from 'dayjs';
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Importação do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
// Estilos do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import ReceiveWebsocketOnFloor from "../class/ReceiveWebsocketOnFloor";

function CenterFloor({ title, description, auction, currentProduct, isAuctionFinished: parentIsAuctionFinished }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);
    const [sortedAuctions, setSortedAuctions] = useState([]);
    const websocketRef = useRef(null);
    const navigate = useNavigate();

    // Garantir que imagens é sempre um array válido
    const images = currentProduct ? 
        [currentProduct.cover_img_url, ...(currentProduct.group_imgs_url?.filter(img => img) || [])]
            .filter(img => img) // Filtrar valores nulos ou undefined
        : [];
    
    // Verificar se há imagens suficientes para navegação
    const hasMultipleImages = images.length > 1;

    useEffect(() => {
        if (parentIsAuctionFinished) {
            setIsAuctionFinished(true);
            listAuctions();
        }
    }, [parentIsAuctionFinished]);

    // Configurar WebSocket
    useEffect(() => {
        // Criar instância do WebSocket
        websocketRef.current = new ReceiveWebsocketOnFloor(auction.id);

        // Configurar listener para mensagem de leilão finalizado
        websocketRef.current.receiveAuctionFinishedMessage(() => {
            setIsAuctionFinished(true);
            listAuctions();
        });

        // Cleanup
        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auction.id]);

    const handleToggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const listAuctions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                params: {
                    status: "cataloged",
                }
            });
            getSortedAuctions(response.data);
        } catch (error) {
            return error
        }
    }

    const getSortedAuctions = (auctions) => {
        const shuffled = auctions.sort(() => 0.5 - Math.random());
        setSortedAuctions(shuffled.slice(0, 6));
    };

    const renderStars = () => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 text-sm" />
                ))}
            </div>
        );
    };

    const isDatePassed = (date) => {
        return dayjs(date).isBefore(dayjs());
    };

    return (
        <section className="w-full lg:h-[60vh] flex lg:flex-row flex-col 
            bg-[#d2d2d2ad] backdrop-blur-lg rounded-2xl shadow-xl shadow-[#1414143a] 
            border-t-[2px] border-[#e3e3e3] relative z-[2] p-4 lg:p-6 gap-6"
        >
            {/* Tela de Leilão Finalizado */}
            {isAuctionFinished && (
                <div className="absolute inset-0 bg-[#d2d2d2ad] backdrop-blur-lg
                    flex flex-col items-center z-30 overflow-y-auto"
                >
                    {/* Header */}
                    <div className="w-full bg-[#012038] py-4 lg:py-8 px-4 mb-4 lg:mb-8">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-3 text-center">
                                Leilão Finalizado
                            </h2>
                            <p className="text-lg lg:text-xl text-white/80 text-center">
                                Obrigado pela sua participação!
                            </p>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="max-w-6xl w-full px-3 lg:px-4">
                        <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-8">
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
                                Próximos Leilões em Destaque
                            </h3>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 w-full">
                            {sortedAuctions.map(auction => (
                                auction && (
                                    <div key={auction.id} 
                                        className="bg-white/80 backdrop-blur-sm flex flex-col h-80 overflow-hidden
                                        rounded-xl border border-white shadow-lg
                                        transition-all duration-300 hover:transform hover:scale-[1.02]
                                        hover:shadow-xl"
                                    >
                                        {/* Card Header */}
                                        <div className="p-4 flex-shrink-0 border-b border-gray-200">
                                            <span className="text-sm text-gray-500 font-medium">
                                                {auction.Advertiser.name}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                                                {auction.title}
                                            </h3>
                                        </div>

                                        {/* Grid de Produtos */}
                                        <div className="flex-grow p-4 grid grid-cols-2 gap-2 overflow-hidden">
                                            {auction.product_list && auction.product_list.slice(0, 4).map(product => (
                                                <div key={product.id}
                                                    className="aspect-square rounded-lg overflow-hidden relative group
                                                        bg-gray-100 shadow-sm"
                                                >
                                                    <img
                                                        src={product.cover_img_url}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 
                                                            group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent 
                                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                                        flex flex-col justify-end p-2"
                                                    >
                                                        {renderStars()}
                                                        <p className="text-xs font-semibold text-white truncate">
                                                            {product.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Card Footer */}
                                        <div className="p-4 flex-shrink-0 bg-gray-50">
                                            <button
                                                onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)}
                                                className="w-full py-2 px-4 bg-[#012038] text-white rounded-lg
                                                    hover:bg-[#023161] transition-all duration-300 font-medium
                                                    focus:ring-2 focus:ring-[#012038] focus:ring-offset-2"
                                            >
                                                Ver mais
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tela de Descanso */}
            {auction.status === "cataloged" && !isAuctionFinished && !currentProduct && (
                <div className="w-full h-full flex lg:flex-row flex-col items-center justify-between gap-6 overflow-y-auto">
                    <div className="lg:w-1/2 w-full lg:h-full min-h-[50vh] relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0">
                            <img 
                                src={auction.auct_cover_img} 
                                alt="background" 
                                className="w-full lg:h-full min-h-[50vh] object-cover filter blur-sm opacity-30"
                            />
                        </div>
                        <img 
                            src={auction.auct_cover_img} 
                            alt="capa do leilão" 
                            className="relative z-10 w-full lg:h-full min-h-[50vh] object-contain p-4"
                        />
                    </div>
                    <div className="lg:w-1/2 w-full h-full flex flex-col justify-center items-start p-8 
                        bg-white/80 backdrop-blur-md rounded-xl border border-white">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {auction.title}
                        </h1>
                        <p className="text-gray-600 mb-6 leading-relaxed h-[70%] overflow-y-auto">
                            {auction.descriptions_informations}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {auction.auct_dates?.map((date, i) => {
                                const isPassed = isDatePassed(date.date_auct);
                                
                                return (
                                    <div 
                                        key={i} 
                                        className={`flex items-center px-4 py-2 rounded-lg shadow-md
                                            transition-all duration-300 
                                            ${isPassed 
                                                ? 'bg-gray-300/50 text-gray-500' 
                                                : 'bg-[#012038] text-white'
                                            }`}
                                    >
                                        <CalendarTodayIcon 
                                            className={`mr-2 ${isPassed 
                                                ? 'text-gray-400' 
                                                : 'text-cyan-400'
                                            }`} 
                                        />
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium ${isPassed && 'line-through'}`}>
                                                {dayjs(date.date_auct).format('DD/MM/YYYY HH:mm')}
                                            </span>
                                            {isPassed && (
                                                <span className="text-xs text-gray-500">
                                                    Encerrado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Visualização do Produto */}
            {description && images.length > 0 && (
                <div className="flex lg:flex-row flex-col w-full h-full gap-3 lg:gap-6">
                    {/* Lado Esquerdo - Imagens */}
                    <div className="lg:w-1/2 w-full h-[50vh] lg:h-full">
                        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg 
                            bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <Swiper
                                modules={hasMultipleImages ? [Navigation, Pagination, Zoom] : [Navigation, Pagination, Zoom]}
                                spaceBetween={0}
                                slidesPerView={1}
                                navigation={hasMultipleImages}
                                pagination={hasMultipleImages ? { clickable: true } : false}
                                zoom={{ maxRatio: 3 }}
                                className="w-full h-full"
                                onSwiper={(swiper) => {
                                    if (currentImageIndex > 0 && currentImageIndex < images.length) {
                                        swiper.slideTo(currentImageIndex);
                                    }
                                }}
                                onSlideChange={(swiper) => {
                                    setCurrentImageIndex(swiper.activeIndex);
                                }}
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="swiper-zoom-container w-full h-full flex items-center justify-center p-4">
                                            <img
                                                src={image}
                                                alt={`Produto ${index + 1}`}
                                                className="max-w-full max-h-full object-contain cursor-pointer"
                                                onClick={handleToggleFullscreen}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    {/* Lado Direito - Informações */}
                    <div className="lg:w-1/2 w-full h-full flex flex-col 
                        bg-white/90 backdrop-blur-md rounded-xl border border-white shadow-lg"
                    >
                        {/* Header */}
                        <div className="p-3 lg:p-6 border-b border-gray-200">
                            {currentProduct && currentProduct.lote && (
                                <div className="flex items-center mb-2">
                                    <span className="px-3 py-1 bg-[#012038] text-white text-sm font-bold rounded-lg">
                                        Lote {currentProduct.lote}
                                    </span>
                                </div>
                            )}
                            <h1 className="font-bold text-2xl lg:text-3xl text-gray-800">
                                {title}
                            </h1>
                        </div>

                        {/* Descrição com Scroll */}
                        <div className="flex-1 p-3 lg:p-6 overflow-y-auto custom-scrollbar">
                            <p className="text-base lg:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Fullscreen */}
            {isFullscreen && images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center">
                    <button
                        onClick={handleToggleFullscreen}
                        className="absolute top-4 right-4 text-white bg-white/10 rounded-full p-1 lg:p-2 
                            hover:bg-white/20 transition-colors z-10"
                    >
                        <CloseIcon sx={{ fontSize: { xs: '20px', lg: '24px' } }} />
                    </button>
                    
                    <Swiper
                        modules={[Navigation, Pagination, Zoom]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={hasMultipleImages}
                        pagination={hasMultipleImages ? { clickable: true } : false}
                        zoom={{ maxRatio: 5 }}
                        initialSlide={Math.min(currentImageIndex, images.length - 1)}
                        className="w-full h-full"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                                    <img
                                        src={image}
                                        alt={`Produto ${index + 1}`}
                                        className="max-w-full max-h-[90vh] object-contain"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </section>
    );
}

export default CenterFloor;