/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, ArrowBack, LocalOffer } from '@mui/icons-material';
import { useEffect, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

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
        console.log('Navegando para o produto:', productId);
        navigate(`/advertiser/home/product/${productId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className={`flex flex-col w-[80%] bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm 
            shadow-lg rounded-xl mt-6 p-5 relative border border-white/10 overflow-hidden
            transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            
            {/* Elemento de brilho decorativo */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[80px] -top-[150px] -right-[150px] pointer-events-none"></div>
            <div className="absolute w-[200px] h-[200px] rounded-full bg-purple-500/10 blur-[60px] -bottom-[100px] -left-[100px] pointer-events-none"></div>
            
            {/* Header */}
            <div className='flex justify-between items-center mb-4 relative z-10'>
                <div className="flex items-center gap-2">
                    <LocalOffer className="text-white/80" fontSize="small" />
                    <h2 className='text-xl font-bold text-white' style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.3)" }}>
                        Produtos Recomendados
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button className="swiper-prev-custom w-7 h-7 bg-black/30 backdrop-blur-sm rounded-full
                        flex items-center justify-center hover:bg-black/50 transition-all">
                        <ArrowBack className="text-white text-sm" />
                    </button>
                    <button className="swiper-next-custom w-7 h-7 bg-black/30 backdrop-blur-sm rounded-full
                        flex items-center justify-center hover:bg-black/50 transition-all">
                        <ArrowForward className="text-white text-sm" />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className='relative z-10'>
                <Swiper 
                    spaceBetween={10}
                    slidesPerView={5}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={false}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    modules={[FreeMode, Thumbs, Autoplay, Navigation, EffectCoverflow]}
                    className="mySwiper"
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    navigation={{
                        prevEl: '.swiper-prev-custom',
                        nextEl: '.swiper-next-custom',
                    }}
                    loop={true}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 10 },
                        640: { slidesPerView: 2, spaceBetween: 10 },
                        768: { slidesPerView: 3, spaceBetween: 10 },
                        1024: { slidesPerView: 4, spaceBetween: 10 },
                        1280: { slidesPerView: 5, spaceBetween: 10 }
                    }}
                >
                    {anotherProducts.map((product, index) => (
                        <SwiperSlide key={product.id}>
                            <div 
                                onClick={() => handleNavigateToProduct(product.id)}
                                className="group relative overflow-hidden rounded-lg cursor-pointer 
                                    bg-white/5 hover:bg-white/10 
                                    transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                                    border border-white/10"
                                style={{ 
                                    animationDelay: `${index * 100}ms`,
                                    height: '220px' // Altura fixa para todos os cards
                                }}
                            >
                                {/* Imagem */}
                                <div className="h-full overflow-hidden">
                                    <img
                                        src={product.cover_img_url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform 
                                            duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Badge de Lote */}
                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm 
                                    px-2 py-1 rounded-full text-white text-xs">
                                    Lote {product.lote}
                                </div>

                                {/* Overlay com informações */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                    <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                                        {product.title}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-medium text-xs">
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(product.initial_value)}
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
                    
                    .swiper-slide-active {
                        transform: scale(1.02);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    }
                    
                    .swiper-slide img {
                        filter: brightness(0.9);
                    }
                    
                    .swiper-slide:hover img {
                        filter: brightness(1);
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .swiper-slide {
                        animation: fadeInUp 0.5s ease forwards;
                        animation-delay: calc(var(--swiper-slide-index) * 0.1s);
                        opacity: 0;
                    }
                `}
            </style>
        </section>
    );
}

export default Recomendados;