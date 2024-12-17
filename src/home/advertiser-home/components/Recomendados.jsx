/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode,  Thumbs, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

function Recomendados({ anotherProducts }) {
    const navigate = useNavigate();

    if (!Array.isArray(anotherProducts) || anotherProducts.length === 0) {
        return null;
    }

    return (
        <section className='flex flex-col w-[80%] bg-white/5 backdrop-blur-sm 
            shadow-lg rounded-xl mt-8 p-6 relative'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h2 style={{
                        textShadow:"0px 2px 2px #0000004a"
                    }} className='text-2xl font-bold text-white mb-2'>
                        Produtos Recomendados
                    </h2>
                    <p className='text-gray-300 text-sm'>
                        Outros itens deste leilão que podem te interessar
                    </p>
                </div>
            </div>

            {/* Carousel */}
            <div className='relative'>
                <Swiper 
                    spaceBetween={20}
                    slidesPerView={5}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs, Autoplay]}
                    className="mySwiper"
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    loop={true}
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 10
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 15
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 20
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 20
                        }
                    }}
                >
                    {anotherProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <div 
                                onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                                className="group relative overflow-hidden rounded-xl cursor-pointer 
                                    bg-white/5 backdrop-blur-sm hover:bg-white/10 
                                    transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Imagem */}
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={product.cover_img_url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform 
                                            duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Overlay com informações */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white text-sm font-medium line-clamp-2 mb-2">
                                            {product.title}
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/80 text-xs">
                                                Lote: {product.lote}
                                            </span>
                                            <span className="text-white text-xs font-medium">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(product.initial_value)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Badge de Lote */}
                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm 
                                    px-2 py-1 rounded-full">
                                    <span className="text-white text-xs">
                                        Lote {product.lote}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Botões de Navegação */}
                <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 
                    w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full z-10 
                    flex items-center justify-center group hover:bg-white/20 transition-all">
                    <ArrowBack className="text-white text-xl group-hover:scale-110 transition-transform" />
                </button>
                <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 
                    w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full z-10 
                    flex items-center justify-center group hover:bg-white/20 transition-all">
                    <ArrowForward className="text-white text-xl group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Estilos para remover as setinhas padrão do Swiper */}
            <style>
                {`
                    .swiper-button-next::after,
                    .swiper-button-prev::after {
                        display: none;
                    }
                `}
            </style>
        </section>
    );
}

export default Recomendados;