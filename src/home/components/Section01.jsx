/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import { useNavigate } from "react-router-dom"
import aukWhite from "../../media/logos/logos-auk/logo_model01_white.png"
import { Gavel, LiveTv, ShoppingCart, AttachMoney, LibraryBooks, CheckCircle } from "@mui/icons-material"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

function Section01() {
  const [cardsSelecteds, setCardsSelecteds] = useState([]);
  const [counters, setCounters] = useState({});
  const [productCounters, setProductCounters] = useState({ count: 0, countWithBid: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    getCountersAuct();
    getProductCounters();
  }, []);

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/get-all-auctions/2-products`);

      if (response.data?.data) {
        // Extrair todos os produtos de todos os leilões
        const allProducts = response.data.data.reduce((acc, auction) => {
          if (auction.product_list && auction.product_list.length > 0) {
            // Adiciona informações do leilão em cada produto
            const productsWithAuctionInfo = auction.product_list.map(product => ({
              ...product,
              auction_title: auction.title,
              auction_id: auction.id
            }));
            return [...acc, ...productsWithAuctionInfo];
          }
          return acc;
        }, []);

        // Embaralha a lista de produtos usando o algoritmo Fisher-Yates
        const shuffledProducts = [...allProducts];
        for (let i = shuffledProducts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
        }

        setCardsSelecteds(shuffledProducts);
      } else {
        setCardsSelecteds([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setCardsSelecteds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCountersAuct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/counter`);
      if (response.data) {
        setCounters(prevCounters => ({ ...prevCounters, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching auction counters:', error);
      setCounters({});
    }
  };

  const getProductCounters = async () => {
    try {
      const [countProducts, countProductsWithBids] = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/count-products`),
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/count-products-with-bids`)
      ]);

      setProductCounters({
        count: countProducts.data?.countAll || 0,
        countWithBid: countProductsWithBids.data?.countAll || 0
      });
    } catch (error) {
      console.error('Error fetching product counters:', error);
      setProductCounters({ count: 0, countWithBid: 0 });
    }
  };

  useEffect(() => { }, [counters]);

  const counterItems = [
    { icon: <Gavel sx={{ fontSize: "33px" }} />, label: "Leilões Registrados", value: counters.countAll },
    {
      icon: <LiveTv sx={{ fontSize: "33px" }} />,
      label: "Ao vivo",
      value: counters.countLive,
      color: "#ff5050",
      onClick: () => navigate("/floor/hub"),
      isClickable: true
    },
    { icon: <LibraryBooks sx={{ fontSize: "33px" }} />, label: "Catalogado", value: counters.countCataloged, color: "#1c7ea4" },
    { icon: <CheckCircle sx={{ fontSize: "33px" }} />, label: "Realizados", value: counters.countFinished, color: "#2ada2f" },
    { icon: <ShoppingCart sx={{ fontSize: "33px" }} />, label: "Produtos criados", value: productCounters.count },
    { icon: <AttachMoney sx={{ fontSize: "33px" }} />, label: "Produtos com Lances", value: productCounters.countWithBid },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background que cobre toda a largura */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#012038] to-[#0D1733]">
          {/* Efeito de particulas para mobile */}
          <div className="absolute inset-0 opacity-30 hidden sm:hidden">
            <div className="particles-container"></div>
          </div>
        </div>
        
        {/* Container do conteúdo - mantém as margens */}
        <div className="relative z-10 pt-20 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1480px]">
                {/* Hero Section - com animação melhorada para mobile */}
                <div className="flex flex-col items-center text-center mb-10 md:mb-16">
                    <div className="relative mb-6 animate-pulse-slow">
                        <img 
                            src={aukWhite} 
                            alt="AUK Leilões" 
                            className="h-24 sm:h-32 object-contain animate-float"
                        />
                        {/* Efeito de brilho sob o logo para mobile */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#012038]/0 via-[#012038]/30 to-[#012038]/0 rounded-full filter blur-xl opacity-50 animate-glow"></div>
                    </div>
                    
                    <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 
                        tracking-tight leading-tight animate-fade-in">
                        AUK Leilões
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
                        Grandes Oportunidades Esperam por Você
                    </p>

                    {/* Botão de CTA mobile */}
                    <div className="mt-6 mb-2 sm:hidden animate-bounce-subtle">
                      <button 
                        onClick={() => navigate('/floor/hub')}
                        className="px-6 py-3 bg-gradient-to-r from-[#0d4e8e] to-[#012038] rounded-full text-white font-medium shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[#012038]/30 flex items-center space-x-2">
                        <Gavel fontSize="small" />
                        <span>Participar de Leilões</span>
                      </button>
                    </div>
                </div>

                {/* Carrossel de Produtos - otimizado para mobile */}
                <div className="mb-14 md:mb-20">
                    {isLoading ? (
                      <div className="flex justify-center items-center min-h-[300px]">
                        <div className="w-16 h-16 relative">
                          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#247557] border-r-transparent border-b-[#012038] border-l-transparent rounded-full animate-spin"></div>
                          <div className="absolute top-1 left-1 right-1 bottom-1 border-4 border-t-transparent border-r-[#012038] border-b-transparent border-l-[#247557] rounded-full animate-spin-reverse"></div>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="text-center text-white py-8">
                        <p>Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>
                      </div>
                    ) : cardsSelecteds.length === 0 ? (
                      <div className="text-center text-white py-8">
                        <p>Nenhum produto encontrado.</p>
                      </div>
                    ) : (
                      <Swiper
                        pagination={{ 
                          clickable: true,
                          dynamicBullets: true 
                        }}
                        loop={true}
                        autoplay={{ 
                          delay: 3000, 
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true
                        }}
                        breakpoints={{
                          320: { slidesPerView: 1.2, spaceBetween: 10 },
                          480: { slidesPerView: 1.5, spaceBetween: 15 },
                          640: { slidesPerView: 2, spaceBetween: 20 },
                          768: { slidesPerView: 3, spaceBetween: 24 },
                          1024: { slidesPerView: 4, spaceBetween: 32 },
                          1280: { slidesPerView: 5, spaceBetween: 32 },
                        }}
                        className="product-carousel"
                      >
                        {cardsSelecteds.map((card, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    onClick={() => navigate(`/advertiser/home/product/${card.id}`)}
                                    className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden 
                                        cursor-pointer transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]
                                        transform-gpu animate-card-reveal border border-white/10"
                                    style={{animationDelay: `${index * 150}ms`}}
                                >
                                    <div className="aspect-[4/5] overflow-hidden">
                                        <img
                                            src={card?.cover_img_url}
                                            alt={card?.title}
                                            className="w-full h-full object-cover transition-transform duration-500 
                                                group-hover:scale-110"
                                        />
                                    </div>
                                    
                                    {/* Sobreposição de informação para visibilidade em mobile */}
                                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                                      <h3 className="text-sm font-bold text-white">
                                          {card?.title}
                                      </h3>
                                    </div>
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <div className="text-sm text-[#4ECDC4] mb-1">
                                                {card?.auction_title}
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                                                {card?.title}
                                            </h3>
                                            <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                                                {card?.description}
                                            </p>
                                            <button
                                                className="w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white 
                                                    text-sm font-medium hover:bg-white/30 transition-colors duration-300
                                                    border border-white/10"
                                            >
                                                Ver este lote
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                </div>

                {/* Estatísticas - redesenhado para mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                    {counterItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={item.onClick}
                            className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center 
                                transition-all duration-300 group shadow-lg shadow-black/5
                                ${item.isClickable ? 'cursor-pointer hover:bg-white/10 hover:scale-[1.02]' : ''}
                                animate-fade-in-up`}
                            style={{animationDelay: `${index * 100}ms`}}
                        >
                            {/* Efeito de destaque para mobile */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#012038]/0 via-[#247557]/10 to-[#012038]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            {/* Ícone com efeito de brilho */}
                            <div className="relative inline-flex p-3 rounded-full bg-white/10 mb-3 md:mb-4 group-hover:scale-110 
                                transition-transform duration-300">
                                {React.cloneElement(item.icon, {
                                    style: {
                                        color: item.color || '#fff',
                                        fontSize: '24px'
                                    }
                                })}
                                {/* Efeito de brilho no ícone */}
                                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-[#247557]/30 to-white/0 opacity-0 group-hover:opacity-100 animate-rotate-glow transition-opacity duration-300"></span>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-white mb-1 md:mb-2">
                                {item.value}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-400">
                                {item.label}
                            </p>

                            {/* Efeito de borda brilhante */}
                            <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 
                                transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Estilos CSS para animações */}
        <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            @keyframes shine {
                from { transform: translateX(-100%); }
                to { transform: translateX(100%); }
            }

            @keyframes pulse-slow {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes fade-in-delay {
                0% { opacity: 0; transform: translateY(10px); }
                50% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
            }

            @keyframes bounce-subtle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }

            @keyframes card-reveal {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes rotate-glow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes glow {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 0.8; }
            }

            @keyframes spin-reverse {
                from { transform: rotate(0deg); }
                to { transform: rotate(-360deg); }
            }

            .animate-float {
                animation: float 3s ease-in-out infinite;
            }

            .animate-pulse-slow {
                animation: pulse-slow 3s ease-in-out infinite;
            }

            .animate-fade-in {
                animation: fade-in 0.8s ease-out forwards;
            }

            .animate-fade-in-delay {
                animation: fade-in-delay 1.2s ease-out forwards;
            }

            .animate-bounce-subtle {
                animation: bounce-subtle 2s ease-in-out infinite;
            }

            .animate-card-reveal {
                opacity: 0;
                animation: card-reveal 0.5s ease-out forwards;
            }

            .animate-fade-in-up {
                opacity: 0;
                animation: fade-in-up 0.5s ease-out forwards;
            }

            .animate-glow {
                animation: glow 3s ease-in-out infinite;
            }

            .animate-rotate-glow {
                animation: rotate-glow 4s linear infinite;
            }

            .animate-shine {
                animation: shine 2s infinite;
            }

            .product-carousel .swiper-pagination-bullet {
                background: white;
                opacity: 0.5;
            }

            .product-carousel .swiper-pagination-bullet-active {
                opacity: 1;
                transform: scale(1.2);
            }

            /* Media queries para ajustes em telas pequenas */
            @media (max-width: 640px) {
                .product-carousel {
                    margin: 0 -8px;
                    padding: 0 8px;
                }
                
                .product-carousel .swiper-pagination {
                    bottom: -5px !important;
                }
            }
        `}</style>
    </section>
  );
}

export default Section01;