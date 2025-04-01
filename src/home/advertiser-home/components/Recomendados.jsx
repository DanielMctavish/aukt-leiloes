/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Autoplay, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';

function Recomendados({ anotherProducts }) {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Adicionar uma pequena animação de entrada
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    if (!Array.isArray(anotherProducts) || anotherProducts.length === 0) {
        return null;
    }
    
    // Função para navegar para um novo produto
    const handleNavigateToProduct = (productId) => {
        navigate(`/advertiser/home/product/${productId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Formatar preço em reais
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <section className={`flex flex-col w-full bg-white rounded-xl mt-6 p-6 md:p-8 relative
            shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out 
            ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            
            {/* Header */}
            <div className='flex justify-between items-center mb-6 relative'>
                <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>
                    Produtos Semelhantes
                </h2>
                <div className="flex gap-2">
                    <button className="swiper-prev-custom w-8 h-8 bg-white rounded-full
                        flex items-center justify-center hover:bg-gray-50 
                        shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all">
                        <ArrowBack className="text-gray-600" fontSize="small" />
                    </button>
                    <button className="swiper-next-custom w-8 h-8 bg-white rounded-full
                        flex items-center justify-center hover:bg-gray-50
                        shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all">
                        <ArrowForward className="text-gray-600" fontSize="small" />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className='relative'>
                <Swiper 
                    spaceBetween={16}
                    slidesPerView={5}
                    modules={[FreeMode, Thumbs, Autoplay, Navigation]}
                    className="mySwiper"
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    navigation={{
                        prevEl: '.swiper-prev-custom',
                        nextEl: '.swiper-next-custom',
                    }}
                    loop={anotherProducts.length > 5}
                    breakpoints={{
                        320: { slidesPerView: 1.2, spaceBetween: 12 },
                        480: { slidesPerView: 2.2, spaceBetween: 14 },
                        768: { slidesPerView: 3, spaceBetween: 16 },
                        1024: { slidesPerView: 4, spaceBetween: 16 },
                        1280: { slidesPerView: 5, spaceBetween: 16 }
                    }}
                >
                    {anotherProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <div 
                                onClick={() => handleNavigateToProduct(product.id)}
                                className="group flex flex-col bg-white rounded-lg overflow-hidden cursor-pointer 
                                    shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]
                                    transition-all duration-300 transform hover:-translate-y-1"
                                style={{ height: '240px' }}
                            >
                                {/* Imagem */}
                                <div className="h-[140px] overflow-hidden bg-gray-50">
                                    <img
                                        src={product.cover_img_url}
                                        alt={product.title || "Produto"}
                                        className="w-full h-full object-contain transition-transform 
                                            duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* Informações */}
                                <div className="flex flex-col justify-between flex-grow p-3">
                                    {/* Badge de Lote */}
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="bg-gray-100 px-2 py-0.5 rounded-full">
                                            <span className="text-xs text-gray-600 font-medium">
                                                Lote {product.lote || "-"}
                                            </span>
                                        </div>
                                        
                                        {product.Winner && (
                                            <div className="bg-red-50 px-2 py-0.5 rounded-full">
                                                <span className="text-xs text-red-600 font-medium">
                                                    Finalizado
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Título */}
                                    <h3 className="text-sm text-gray-800 font-medium line-clamp-2 mb-1 flex-grow">
                                        {product.title || "Sem título"}
                                    </h3>
                                    
                                    {/* Preço */}
                                    <div className="mt-auto">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(product.real_value || product.initial_value || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Estilos para remover as setinhas padrão do Swiper */}
            <style>
                {`
                    .swiper-button-next::after,
                    .swiper-button-prev::after {
                        display: none;
                    }
                    
                    .swiper-slide {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        height: auto;
                    }
                    
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .swiper-slide {
                        animation: fadeIn 0.5s ease forwards;
                        animation-delay: calc(var(--swiper-slide-index) * 0.05s);
                        opacity: 0;
                    }
                `}
            </style>
        </section>
    );
}

export default Recomendados;