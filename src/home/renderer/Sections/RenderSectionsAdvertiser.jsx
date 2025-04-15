/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { WhatsApp, CalendarMonth, AccessTime, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useNavigate, useParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';

function RenderSectionsAdvertiser({ sections, fontStyle }) {
    const navigate = useNavigate();
    const [advertiserAucts, setAdvertiserAucts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const {advertiser_id} = useParams();

    useEffect(() => {
        const fetchAucts = async () => {
            try {
                if (!sections?.length) return;

                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`,
                    {
                        params: { creator_id: advertiser_id }
                    }
                );

                // Ordenar os leilões por data mais próxima
                const sortedAucts = response.data.sort((a, b) => {
                    const aNextDate = getNextDate(a.auct_dates);
                    const bNextDate = getNextDate(b.auct_dates);
                    
                    if (!aNextDate || !bNextDate) return 0;
                    return new Date(aNextDate.date_auct) - new Date(bNextDate.date_auct);
                });

                setAdvertiserAucts(sortedAucts);
            } catch (error) {
                console.error("Erro ao buscar leilões:", error);
                setAdvertiserAucts([]);
            }
        };

        fetchAucts();
    }, [sections]);

    // Função auxiliar para pegar a próxima data
    const getNextDate = (dates) => {
        if (!dates || dates.length === 0) return null;
        
        const now = new Date();
        const futureDates = dates.filter(d => new Date(d.date_auct) >= now);
        
        if (futureDates.length === 0) return dates[dates.length - 1];
        return futureDates[0];
    };

    // Função para formatar data
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Função para formatar hora
    const formatHour = (hour) => {
        if (!hour) return '';
        return hour.slice(0, 5); // Pega apenas HH:mm
    };

    // Função para determinar a altura baseada no sizeType
    const getSectionHeight = (sizeType) => {
        switch (sizeType) {
            case 'SMALL':
                return 'h-[40vh]';
            case 'MEDIUM':
                return 'h-[60vh]';
            case 'FULL':
                return 'h-[100vh]';
            default:
                return 'h-[60vh]';
        }
    };

    const renderFormSection = (section) => {
        const handleSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = {};

            section.config.fields.forEach(field => {
                data[field.label] = formData.get(field.label.toLowerCase().replace(/\s+/g, '-'));
            });

            const text = Object.entries(data)
                .map(([key, value]) => `*${key}:* ${value}`)
                .join('%0A');

            const phone = section.config.whatsappNumber.replace(/\D/g, '');
            window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        };

        return (
            <div className="h-full overflow-y-auto flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-[1300px] mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-20">
                    {/* Área de Conteúdo Explicativo */}
                    <div className="flex-1 flex flex-col gap-6">
                        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#144366] to-[#1a5c8c] bg-clip-text text-transparent">
                            Entre em Contato
                        </h2>
                        
                        <p className="text-base lg:text-lg leading-relaxed text-gray-700">
                            Estamos aqui para ajudar você a encontrar as melhores oportunidades em leilões. 
                            Preencha o formulário e nossa equipe entrará em contato o mais breve possível.
                        </p>

                        <div className="space-y-4 mt-2 lg:mt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#144366]/10 flex items-center justify-center">
                                    <WhatsApp className="text-[#144366] text-xl lg:text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#144366] text-sm lg:text-base">Atendimento Rápido</h3>
                                    <p className="text-xs lg:text-sm text-gray-600">Resposta em até 24 horas</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#144366]/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6 text-[#144366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#144366] text-sm lg:text-base">Segurança Garantida</h3>
                                    <p className="text-xs lg:text-sm text-gray-600">Seus dados estão protegidos</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="flex-1 w-full bg-white shadow-2xl rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            {section.config.fields?.map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-1.5 text-[#144366]">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-2.5 lg:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#144366] focus:border-transparent transition-all outline-none resize-none bg-gray-50/50"
                                            rows={4}
                                            placeholder={`Digite ${field.label.toLowerCase()}...`}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-2.5 lg:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#144366] focus:border-transparent transition-all outline-none bg-gray-50/50"
                                            placeholder={`Digite ${field.label.toLowerCase()}...`}
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#144366] to-[#1a5c8c] text-white rounded-lg hover:opacity-90 transition-all w-full justify-center group hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <WhatsApp className="group-hover:rotate-12 transition-transform" />
                                {section.config.buttonText || 'Enviar Mensagem'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    const renderCarouselSection = (section) => {
        const products = advertiserAucts.find(auct => auct.id === section.config.selectedAuctId)?.product_list || [];
        
        if (!products?.length) return null;

        return (
            <div className="h-full overflow-hidden flex flex-col justify-center">
                {/* Cabeçalho do Carrossel */}
                <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#144366] to-[#1a5c8c] bg-clip-text text-transparent">
                        Produtos em Destaque
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Confira nossa seleção especial de produtos. Cada item foi cuidadosamente escolhido para oferecer as melhores oportunidades.
                    </p>
                </div>

                {/* Container do Carrossel */}
                <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 relative group">
                    {/* Decoração de fundo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#144366]/5 to-[#1a5c8c]/5 -m-8 rounded-3xl transform -skew-y-2"></div>
                    
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                                spaceBetween: 12
                            },
                            640: {
                                slidesPerView: Math.min(3, section.config.itemsPerRow),
                                spaceBetween: 16
                            },
                            768: {
                                slidesPerView: Math.min(3, section.config.itemsPerRow),
                                spaceBetween: 20
                            },
                            1024: {
                                slidesPerView: Math.min(4, section.config.itemsPerRow),
                                spaceBetween: 24
                            }
                        }}
                        autoplay={{
                            delay: section.config.speed || 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="w-full h-full py-8"
                    >
                        {products.map((product, idx) => (
                            <SwiperSlide key={idx} className="h-full">
                                <div 
                                    onClick={() => handleProductClick(product.id)}
                                    className="h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                                        transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                                    <div className="aspect-square w-full relative group">
                                        <img
                                            src={product.cover_img_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        {/* Overlay gradiente */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    {section.config.showTitle && (
                                        <div className="p-3 sm:p-6">
                                            <h3 className="font-bold text-sm sm:text-lg mb-2 text-[#144366] line-clamp-2">
                                                {product.title}
                                            </h3>
                                            {section.config.showPrice && (
                                                <div className="flex items-center justify-between mt-2 sm:mt-4">
                                                    <span className="text-xs sm:text-sm text-gray-500">Valor Inicial</span>
                                                    <p className="text-sm sm:text-xl font-bold text-[#1a5c8c]">
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
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Botões de navegação customizados */}
                    <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 
                        w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center 
                        text-[#144366] hover:bg-[#144366] hover:text-white transition-all z-10 
                        opacity-0 group-hover:opacity-100 group-hover:-translate-x-6">
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 
                        w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center 
                        text-[#144366] hover:bg-[#144366] hover:text-white transition-all z-10 
                        opacity-0 group-hover:opacity-100 group-hover:translate-x-6">
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>
            </div>
        );
    };

    const renderTextSection = (section) => (
        <div className="h-full overflow-y-auto flex items-center justify-center">
            <div className={`p-8 w-[80%] mx-auto max-w-4xl`}
                style={{
                    color: section.config.textColor,
                    fontSize: `${section.config.fontSize}px`,
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                    textAlign: section.config.alignment?.toLowerCase() || 'left',
                    fontFamily: section.config.fontFamily || fontStyle
                }}
            >
                {section.config.content}
            </div>
        </div>
    );

    const handleProductClick = (productId) => {
        navigate(`/advertiser/home/product/${productId}`);
    };

    const renderGallerySection = (section) => {
        const products = advertiserAucts.find(auct => auct.id === section.config.selectedAuctId)?.product_list || [];
        
        if (!products?.length) return null;

        const totalPages = Math.ceil(products.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentProducts = products.slice(startIndex, endIndex);

        const handlePageChange = (newPage) => {
            if (newPage >= 1 && newPage <= totalPages) {
                setCurrentPage(newPage);
                // Scroll suave para o topo da galeria
                document.getElementById('gallery-top')?.scrollIntoView({ behavior: 'smooth' });
            }
        };

        return (
            <div className="h-full overflow-y-auto py-4 sm:py-6 lg:py-8">
                <div id="gallery-top" className="w-full max-w-[1300px] mx-auto px-4 sm:px-6">
                    {/* Título da seção */}
                    <div className="text-center mb-6 lg:mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 
                            bg-gradient-to-r from-[#144366] to-[#1a5c8c] bg-clip-text text-transparent">
                            Produtos em Destaque
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
                            Confira nossa seleção especial de produtos
                        </p>
                    </div>

                    {/* Grid de produtos */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                        {currentProducts.map((product, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleProductClick(product.id)}
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer 
                                    transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                            >
                                {/* Imagem do produto */}
                                <div className="relative">
                                    <div className="aspect-square w-full">
                                        <img
                                            src={product.cover_img_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    {/* Overlay hover */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 
                                        transition-opacity flex items-center justify-center">
                                        <span className="text-white bg-black/50 px-2 py-1 rounded-full 
                                            text-xs sm:text-sm whitespace-nowrap">
                                            Ver detalhes
                                        </span>
                                    </div>
                                </div>

                                {/* Informações do produto */}
                                {section.config.showTitle && (
                                    <div className="p-2 sm:p-3">
                                        <h3 className="font-bold text-xs sm:text-sm lg:text-base truncate">
                                            {product.title}
                                        </h3>
                                        {section.config.showPrice && (
                                            <p className="text-gray-600 text-xs sm:text-sm font-semibold mt-1">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(product.initial_value)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Controles de Paginação */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition-all ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#144366] text-white hover:bg-[#1a5c8c] active:scale-95'
                                }`}
                                aria-label="Página anterior"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`min-w-[32px] h-8 rounded-lg transition-all text-sm font-medium ${
                                            currentPage === page
                                                ? 'bg-[#144366] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition-all ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#144366] text-white hover:bg-[#1a5c8c] active:scale-95'
                                }`}
                                aria-label="Próxima página"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderAuctListSection = (section) => {
        // Se itemsPerRow for 1, usar carrossel
        if (section.config.itemsPerRow === 1) {
            return (
                <div className={`${getSectionHeight(section.sizeType)} w-full flex items-center justify-center`}>
                    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 h-[90%] relative group">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            className="w-full h-full"
                        >
                            {advertiserAucts.map((auct) => {
                                const nextDate = getNextDate(auct.auct_dates);
                                return (
                                    <SwiperSlide key={auct.id} className="relative">
                                        <div className="w-full h-full relative">
                                            <img
                                                src={auct.auct_cover_img}
                                                alt={auct.title}
                                                className={`w-full h-full object-cover ${section.sizeType === 'SMALL' ? 'aspect-video' : 'h-[60vh]'}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
                                                <div className="w-full max-w-[1300px] mx-auto">
                                                    <h3 className={`font-bold mb-4 ${
                                                        section.sizeType === 'SMALL' ? 'text-xl' :
                                                        section.sizeType === 'FULL' ? 'text-3xl lg:text-4xl' : 'text-2xl'
                                                    }`}>
                                                        {auct.title}
                                                    </h3>

                                                    {auct.descriptions_informations && (
                                                        <p className="text-white/90 mb-6 line-clamp-3 text-base lg:text-lg">
                                                            {auct.descriptions_informations}
                                                        </p>
                                                    )}
                                                    
                                                    {nextDate && (
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-white/90">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarMonth className="text-base lg:text-xl" />
                                                                <span className="text-sm lg:text-base">{formatDate(nextDate.date_auct)}</span>
                                                            </div>
                                                            {nextDate.hour_auct && (
                                                                <div className="flex items-center gap-2">
                                                                    <AccessTime className="text-base lg:text-xl" />
                                                                    <span className="text-sm lg:text-base">{formatHour(nextDate.hour_auct)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            );
        }

        // Para múltiplos itens por linha
        return (
            <div className={`${getSectionHeight(section.sizeType)} w-full flex items-center justify-center overflow-hidden`}>
                <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 h-[90%]">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        breakpoints={{
                            320: { slidesPerView: 2, spaceBetween: 12 },
                            640: { slidesPerView: Math.min(3, section.config.itemsPerRow), spaceBetween: 16 },
                            768: { slidesPerView: Math.min(3, section.config.itemsPerRow), spaceBetween: 20 },
                            1024: { slidesPerView: Math.min(4, section.config.itemsPerRow), spaceBetween: 24 }
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="w-full h-full"
                    >
                        {advertiserAucts.map((auct) => {
                            const nextDate = getNextDate(auct.auct_dates);
                            return (
                                <SwiperSlide key={auct.id} className="h-full">
                                    <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-lg
                                        hover:shadow-xl transition-all duration-300 group">
                                        <div className="relative h-[60%]">
                                            <img
                                                src={auct.auct_cover_img}
                                                alt={auct.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        <div className="p-3 sm:p-4 h-[40%] flex flex-col justify-between">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 group-hover:line-clamp-none
                                                    transition-all duration-300">
                                                    {auct.title}
                                                </h3>

                                                {auct.descriptions_informations && (
                                                    <p className="text-gray-600/90 text-xs sm:text-sm line-clamp-2 group-hover:line-clamp-none">
                                                        {auct.descriptions_informations}
                                                    </p>
                                                )}
                                            </div>

                                            {nextDate && (
                                                <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarMonth className="text-[#036982] text-base" />
                                                        <span>{formatDate(nextDate.date_auct)}</span>
                                                    </div>
                                                    {nextDate.hour_auct && (
                                                        <div className="flex items-center gap-2">
                                                            <AccessTime className="text-[#036982] text-base" />
                                                            <span>{formatHour(nextDate.hour_auct)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col">
            {sections?.map((section, index) => {
                const sectionType = section.type.toLowerCase();

                return (
                    <section
                        key={index}
                        id={sectionType}
                        className={`w-full relative transition-all duration-1000 ease-in-out`}
                        style={{
                            backgroundColor: section.color,
                            minHeight: getSectionHeight(section.sizeType),
                            transitionDelay: `${index * 200}ms`,
                            fontFamily: fontStyle
                        }}
                    >
                        <div className="w-full h-full">
                            {sectionType === 'product_carousel' && renderCarouselSection(section)}
                            {sectionType === 'text' && renderTextSection(section)}
                            {sectionType === 'form' && renderFormSection(section)}
                            {sectionType === 'gallery' && renderGallerySection(section)}
                            {sectionType === 'auct_list' && renderAuctListSection(section)}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

export default RenderSectionsAdvertiser;