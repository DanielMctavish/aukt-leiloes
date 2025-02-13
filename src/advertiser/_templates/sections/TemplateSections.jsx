/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { WhatsApp, CalendarMonth, AccessTime, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { fetchTemplate } from '../../../features/template/SectionsSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function TemplateSections() {
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const { headerData } = useSelector(state => state.header);
    const { advertiser_id } = useParams();
    const [advertiserAucts, setAdvertiserAucts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        if (advertiser_id) {
            dispatch(fetchTemplate(advertiser_id));
        }
    }, [advertiser_id, dispatch]);

    useEffect(() => {
        const fetchAucts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`,
                    {
                        params: { creator_id: advertiser_id },
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`
                        }
                    }
                );

                setAdvertiserAucts(response.data);
            } catch (error) {
                console.error("Erro ao buscar leilões:", error);
            }
        };

        if (advertiser_id) {
            fetchAucts();
        }
    }, [advertiser_id]);

    // Reset da página quando mudar de seção
    useEffect(() => {
        setCurrentPage(1);
    }, [sectionsData.sections]);


    const getGridColumns = (itemsPerRow) => {
        const baseClasses = "grid-cols-1";
        if (itemsPerRow === 1) return baseClasses;
        
        return `${baseClasses} sm:grid-cols-${Math.min(2, itemsPerRow)} md:grid-cols-${Math.min(3, itemsPerRow)} lg:grid-cols-${Math.min(4, itemsPerRow)} xl:grid-cols-${Math.min(itemsPerRow, 6)}`;
    };

    const renderGallerySection = (section) => {
        const products = advertiserAucts.find(auct => auct.id === section.config.selectedAuctId)?.product_list || [];
        
        if (!products?.length) return null;

        // Configuração da paginação
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentProducts = products.slice(startIndex, endIndex);

        return (
            <div className="h-full overflow-hidden flex flex-col justify-center py-12">
                {/* Cabeçalho da Galeria */}
                <div className="w-[80%] mx-auto text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#144366] to-[#1a5c8c] bg-clip-text text-transparent">
                        Produtos em Destaque
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Confira nossa seleção especial de produtos. Cada item foi cuidadosamente escolhido para oferecer as melhores oportunidades.
                    </p>
                </div>

                {/* Container da Galeria */}
                <div className="w-[80%] mx-auto">
                    <div className={`grid ${getGridColumns(section.config.itemsPerRow)} gap-6`}>
                        {currentProducts.map((product) => (
                            <div key={product.id} 
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl 
                                    transition-all duration-300 transform hover:-translate-y-1">
                                <div className="aspect-square overflow-hidden">
                                    <img 
                                        src={product.cover_img_url} 
                                        alt={product.title}
                                        className="w-full h-full object-cover transform transition-transform 
                                            duration-300 group-hover:scale-110"
                                    />
                                </div>
                                {(section.config.showTitle || section.config.showPrice) && (
                                    <div className="p-6">
                                        {section.config.showTitle && (
                                            <h4 className="text-xl font-semibold text-[#144366] mb-3 
                                                line-clamp-2 hover:line-clamp-none transition-all">
                                                {product.title}
                                            </h4>
                                        )}
                                        {section.config.showPrice && (
                                            <div className="flex justify-between items-center mt-3 pt-3 
                                                border-t border-gray-100">
                                                <span className="text-sm text-gray-500">Valor Inicial</span>
                                                <p className="text-xl font-bold text-[#1a5c8c]">
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
                        ))}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                                    ${currentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#144366] text-white hover:bg-[#144366]/90'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Anterior
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all duration-200
                                            ${currentPage === index + 1
                                                ? 'bg-[#144366] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                                    ${currentPage === totalPages 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#144366] text-white hover:bg-[#144366]/90'}`}
                            >
                                Próximo
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

    const renderTextSection = (section) => (
        <div className="h-full overflow-y-auto flex items-center justify-center">
            <div className={`p-8 w-full max-w-4xl`}
                style={{
                    color: section.config.textColor,
                    fontSize: `${section.config.fontSize}px`,
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                    textAlign: section.config.alignment?.toLowerCase() || 'left',
                    fontFamily: section.config.fontFamily || headerData.fontStyle
                }}
            >
                {section.config.content}
            </div>
        </div>
    );

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
            <div className="h-full overflow-y-auto flex items-center justify-center p-8">
                <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Área de Conteúdo Explicativo */}
                    <div className="flex flex-col gap-6 p-8">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#144366] to-[#1a5c8c] bg-clip-text text-transparent">
                            Entre em Contato
                        </h2>
                        
                        <p className="text-lg leading-relaxed text-gray-700">
                            Estamos aqui para ajudar você a encontrar as melhores oportunidades em leilões. 
                            Preencha o formulário ao lado e nossa equipe entrará em contato o mais breve possível.
                        </p>

                        <div className="space-y-4 mt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#144366]/10 flex items-center justify-center">
                                    <WhatsApp className="text-[#144366]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#144366]">Atendimento Rápido</h3>
                                    <p className="text-sm text-gray-600">Resposta em até 24 horas</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#144366]/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#144366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#144366]">Segurança Garantida</h3>
                                    <p className="text-sm text-gray-600">Seus dados estão protegidos</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="bg-white shadow-2xl rounded-2xl p-8 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {section.config.fields?.map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-2 text-[#144366]">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#144366] focus:border-transparent transition-all outline-none resize-none bg-gray-50/50"
                                            rows={4}
                                            placeholder={`Digite ${field.label.toLowerCase()}...`}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#144366] focus:border-transparent transition-all outline-none bg-gray-50/50"
                                            placeholder={`Digite ${field.label.toLowerCase()}...`}
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#144366] to-[#1a5c8c] text-white rounded-lg hover:opacity-90 transition-all w-full justify-center group hover:scale-[1.02] active:scale-[0.98]"
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

    const renderAuctListSection = (section) => {
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };

        const formatHour = (hour) => {
            if (!hour) return '';
            return hour.slice(0, 5); // Pega apenas HH:mm
        };

        const getNextDate = (dates) => {
            if (!dates || dates.length === 0) return null;
            
            const now = new Date();
            const futureDates = dates.filter(d => new Date(d.date_auct) >= now);
            
            if (futureDates.length === 0) return dates[dates.length - 1];
            return futureDates[0];
        };

        // Função para determinar a altura baseada no sizeType
        const getSectionHeight = () => {
            switch (section.sizeType) {
                case 'SMALL':
                    return 'h-[20vh]';
                case 'MEDIUM':
                    return 'h-[49vh]';
                case 'FULL':
                    return 'h-screen';
                default:
                    return 'h-[49vh]';
            }
        };

        // Se itemsPerRow for 1, usar carrossel
        if (section.config.itemsPerRow === 1) {
            return (
                <div className={`${getSectionHeight()} w-full flex items-center justify-center`}>
                    <div className={`${section.config.layout === "full" ? "w-full" : "w-[90%]"} h-[90%] relative group`}>
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
                                            
                                            <div className={`absolute bottom-0 left-0 right-0 p-8 text-white
                                                ${section.config.layout === "full" ? "w-[80%] mx-auto" : ""}`}>
                                                <h3 className={`font-bold mb-4 ${
                                                    section.sizeType === 'SMALL' ? 'text-xl' :
                                                    section.sizeType === 'FULL' ? 'text-4xl' : 'text-2xl'
                                                }`}>
                                                    {auct.title}
                                                </h3>

                                                {auct.descriptions_informations && (
                                                    <p className="text-white/90 mb-6 line-clamp-3 text-lg">
                                                        {auct.descriptions_informations}
                                                    </p>
                                                )}
                                                
                                                {nextDate && (
                                                    <div className="flex items-center gap-6 text-white/90">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarMonth />
                                                            <span>{formatDate(nextDate.date_auct)}</span>
                                                        </div>
                                                        {nextDate.hour_auct && (
                                                            <div className="flex items-center gap-2">
                                                                <AccessTime />
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

                        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm
                            flex items-center justify-center transition-all duration-300
                            opacity-0 group-hover:opacity-100">
                            <ChevronLeft className="text-white" />
                        </button>

                        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm
                            flex items-center justify-center transition-all duration-300
                            opacity-0 group-hover:opacity-100">
                            <ChevronRight className="text-white" />
                        </button>
                    </div>
                </div>
            );
        }

        // Para múltiplos itens por linha
        return (
            <div className={`${getSectionHeight()} w-full flex items-center justify-center overflow-hidden`}>
                <div className={`${section.config.layout === "full" ? "w-full px-8" : "w-[90%]"} h-[90%]`}>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={section.config.itemsPerRow}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },
                            480: { slidesPerView: Math.min(2, section.config.itemsPerRow), spaceBetween: 15 },
                            768: { slidesPerView: Math.min(3, section.config.itemsPerRow), spaceBetween: 15 },
                            1024: { slidesPerView: Math.min(4, section.config.itemsPerRow), spaceBetween: 20 },
                            1280: { slidesPerView: section.config.itemsPerRow, spaceBetween: 20 }
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

                                        <div className="p-4 h-[40%] flex flex-col justify-between">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:line-clamp-none
                                                    transition-all duration-300">
                                                    {auct.title}
                                                </h3>

                                                {auct.descriptions_informations && (
                                                    <p className="text-gray-600/90 text-sm line-clamp-2 group-hover:line-clamp-none">
                                                        {auct.descriptions_informations}
                                                    </p>
                                                )}
                                            </div>

                                            {nextDate && (
                                                <div className="flex flex-col gap-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarMonth className="text-[#036982]" />
                                                        <span>{formatDate(nextDate.date_auct)}</span>
                                                    </div>
                                                    {nextDate.hour_auct && (
                                                        <div className="flex items-center gap-2">
                                                            <AccessTime className="text-[#036982]" />
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

    const renderCarouselSection = (section) => {
        const products = advertiserAucts.find(auct => auct.id === section.config.selectedAuctId)?.product_list || [];
        
        if (!products?.length) return null;

        const getSectionHeight = () => {
            switch (section.sizeType) {
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

        return (
            <section id="product_carousel" 
                className={`w-full ${getSectionHeight()} flex flex-col justify-start items-center gap-2 md:gap-4 py-2 md:py-4 transition-all duration-300 overflow-hidden relative`}
                style={{ backgroundColor: section.color }}
            >
                {/* Shape Decorativo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/4 w-[80%] h-[150%] bg-gradient-to-br from-[#144366]/5 to-transparent rounded-full blur-3xl transform rotate-12" />
                    <div className="absolute -bottom-1/2 -left-1/4 w-[80%] h-[150%] bg-gradient-to-tr from-[#036982]/5 to-transparent rounded-full blur-3xl transform -rotate-12" />
                </div>

                {/* Título e Descrição */}
                <div className="w-[90%] mx-auto text-center">
                    <h2 className={`${section.sizeType === 'SMALL' ? 'text-xl' : section.sizeType === 'FULL' ? 'text-3xl' : 'text-2xl'} 
                        font-bold text-[#144366] mb-1 md:mb-2`}>
                        Produtos em Destaque
                    </h2>
                    <p className="text-gray-600/90 text-xs md:text-sm lg:text-base max-w-3xl mx-auto line-clamp-2">
                        Confira nossa seleção especial de produtos. Cada item foi cuidadosamente escolhido para oferecer as melhores oportunidades.
                    </p>
                </div>

                {/* Container do Carrossel */}
                <div className={`${section.config.layout === "FULL" ? "w-full px-4 md:px-8" : "w-[90%]"} flex-1 relative group min-h-0`}>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={section.config.layout === "FULL" ? 20 : 30}
                        slidesPerView={section.config.itemsPerRow}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        autoplay={{
                            delay: section.config.speed || 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="w-full h-full"
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },
                            480: { slidesPerView: Math.min(2, section.config.itemsPerRow), spaceBetween: 15 },
                            768: { slidesPerView: Math.min(3, section.config.itemsPerRow), spaceBetween: 15 },
                            1024: { slidesPerView: Math.min(4, section.config.itemsPerRow), spaceBetween: 20 },
                            1280: { slidesPerView: section.config.itemsPerRow, spaceBetween: 20 }
                        }}
                    >
                        {products.map((product, idx) => (
                            <SwiperSlide key={idx} className="h-full p-1">
                                <div className="h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                                    transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                                    <div className={`relative ${
                                        section.sizeType === 'SMALL' ? 'h-[10vh]' : 
                                        section.sizeType === 'FULL' ? 'h-[50vh]' : 
                                        'h-[25vh]'} overflow-hidden`}>
                                        <img
                                            src={product.cover_img_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                    </div>
                                    <div className="p-2 md:p-3 flex flex-col justify-between gap-1 md:gap-2 flex-1">
                                        {section.config.showTitle && (
                                            <h3 className={`font-bold ${
                                                section.sizeType === 'SMALL' ? 'text-xs line-clamp-1' : 
                                                section.sizeType === 'FULL' ? 'text-base md:text-lg line-clamp-2' : 
                                                'text-sm md:text-base line-clamp-2'} 
                                                text-[#144366]`}>
                                                {product.title}
                                            </h3>
                                        )}
                                        {section.config.showPrice && (
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className={`${
                                                    section.sizeType === 'SMALL' ? 'text-[10px]' : 
                                                    'text-xs md:text-sm'} text-gray-500`}>
                                                    Valor Inicial
                                                </span>
                                                <p className={`${
                                                    section.sizeType === 'SMALL' ? 'text-xs' : 
                                                    section.sizeType === 'FULL' ? 'text-base md:text-lg' : 
                                                    'text-sm md:text-base'} 
                                                    font-bold text-[#036982]`}>
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(product.initial_value)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Botões de navegação customizados */}
                    <button className="swiper-button-prev-custom absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10
                        w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl
                        flex items-center justify-center transition-all duration-300 group">
                        <ChevronLeft className="text-[#144366] text-xl md:text-2xl group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="swiper-button-next-custom absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10
                        w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl
                        flex items-center justify-center transition-all duration-300 group">
                        <ChevronRight className="text-[#144366] text-xl md:text-2xl group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </section>
        );
    };

    const renderTestimonialsSection = ()=>{}

    return (
        <div className="w-full flex flex-col gap-8">
            {sectionsData.sections.map((section, index) => {
                const sectionType = section.type?.toLowerCase();
                const validTypes = ['product_carousel', 'auct_list', 'gallery', 'text', 'form', 'testimonials'];
                const normalizedType = validTypes.includes(sectionType) ? sectionType : 'text';

                return (
                    <div
                        key={index}
                        id={normalizedType}
                        className="w-full"
                        style={{
                            backgroundColor: section.color || '#ffffff',
                            fontFamily: headerData.fontStyle
                        }}
                    >
                        {normalizedType === 'product_carousel' && renderCarouselSection(section)}
                        {normalizedType === 'auct_list' && renderAuctListSection(section)}
                        {normalizedType === 'gallery' && renderGallerySection(section)}
                        {normalizedType === 'text' && renderTextSection(section)}
                        {normalizedType === 'form' && renderFormSection(section)}
                        {normalizedType === 'testimonials' && renderTestimonialsSection(section)}
                    </div>
                );
            })}
        </div>
    );
}

export default TemplateSections;