import axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import videoSource from '../../media/videos/auk_display_video2.mp4';
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Gavel, TrendingUp, Visibility } from "@mui/icons-material"
import { useNavigate } from "react-router-dom";
import FeaturedProductsModal from './modals/FeaturedProductsModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Section02() {
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
        params: {
          take: 12,
          bid_count_order: 'true'
        }
      });
      setProducts(result.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  return (
    <section className="bg-gradient-to-b from-[#ececec] to-white w-full min-h-screen flex flex-col justify-center items-center overflow-x-hidden overflow-y-hidden py-12 sm:py-20">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-[200px] w-full max-w-[1400px]">
            {/* Seção de Vídeo e Features */}
            <div className="w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-8 lg:mb-16">
                {/* Lado Esquerdo - Features */}
                <div className="w-full lg:w-5/12 space-y-6 lg:space-y-8 order-2 lg:order-1">
                    <div className="flex items-start gap-4 p-4 lg:p-0 bg-white lg:bg-transparent rounded-xl lg:rounded-none shadow-sm lg:shadow-none">
                        <div className="p-3 bg-[#012038] rounded-xl shrink-0">
                            <Gavel className="text-white text-[20px] lg:text-[24px]" />
                        </div>
                        <div>
                            <h3 className="text-base lg:text-lg font-semibold text-[#012038] mb-1 lg:mb-2">
                                Lances em Tempo Real
                            </h3>
                            <p className="text-sm lg:text-base text-gray-600">
                                Acompanhe e faça seus lances em tempo real com nossa plataforma 
                                de alta performance.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 lg:p-0 bg-white lg:bg-transparent rounded-xl lg:rounded-none shadow-sm lg:shadow-none">
                        <div className="p-3 bg-[#012038] rounded-xl shrink-0">
                            <TrendingUp className="text-white text-[20px] lg:text-[24px]" />
                        </div>
                        <div>
                            <h3 className="text-base lg:text-lg font-semibold text-[#012038] mb-1 lg:mb-2">
                                Análise de Mercado
                            </h3>
                            <p className="text-sm lg:text-base text-gray-600">
                                Acesso a dados e estatísticas para tomar as melhores decisões 
                                em seus lances.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 lg:p-0 bg-white lg:bg-transparent rounded-xl lg:rounded-none shadow-sm lg:shadow-none">
                        <div className="p-3 bg-[#012038] rounded-xl shrink-0">
                            <Visibility className="text-white text-[20px] lg:text-[24px]" />
                        </div>
                        <div>
                            <h3 className="text-base lg:text-lg font-semibold text-[#012038] mb-1 lg:mb-2">
                                Transparência Total
                            </h3>
                            <p className="text-sm lg:text-base text-gray-600">
                                Processo transparente e seguro, do início ao fim do leilão.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lado Direito - Vídeo */}
                <div className="w-full lg:w-7/12 order-1 lg:order-2">
                    <div className="relative aspect-video rounded-xl lg:rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl">
                        <video 
                            className='w-full h-full object-cover brightness-[1.2]' 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                        >
                            <source src={videoSource} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <h2 className="absolute bottom-6 left-6 text-2xl font-bold text-white">
                            Tecnologia e Inovação em Leilões
                        </h2>
                    </div>
                </div>
            </div>

            {/* Seção de Produtos em Destaque */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-4 lg:p-8 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-[#012038]">
                            Produtos em Destaque
                        </h2>
                        <p className="text-sm lg:text-base text-gray-500 mt-1">
                            Os itens mais disputados da semana
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-[#012038] text-white text-sm lg:text-base 
                            rounded-full hover:bg-[#023161] transition-colors duration-300"
                    >
                        Ver todos
                    </button>
                </div>

                <div className="relative px-4">
                    <Swiper
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                        }}
                        className="px-4"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={index}>
                                <div 
                                    onClick={() => navigate(`/advertiser/home/product/${product.id}`)} 
                                    className="group relative bg-white rounded-xl overflow-hidden cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img 
                                            src={product.cover_img_url} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover transform transition-transform duration-500 
                                                group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 group-hover:text-[#012038] 
                                            transition-colors duration-300 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-sm font-medium text-[#012038]">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(product.initial_value)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Lote: {product.lote}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button className="swiper-button-prev text-[#012038] hidden lg:flex -left-2">
                        <ArrowLeft sx={{ fontSize: "40px" }} />
                    </button>
                    <button className="swiper-button-next text-[#012038] hidden lg:flex -right-2">
                        <ArrowRight sx={{ fontSize: "40px" }} />
                    </button>
                </div>
            </div>
        </div>

        {/* Modal de Produtos em Destaque */}
        <FeaturedProductsModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            products={products}
        />
    </section>
  );
}

export default Section02;
