/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { WhatsApp } from '@mui/icons-material';
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
    const [loading, setLoading] = useState(true);
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
                setLoading(true);
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
            } finally {
                setLoading(false);
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

    // Função auxiliar para determinar a cor do texto baseado na paleta
    const getTextColor = (defaultColor) => {
        return headerData.colorPalette === "dark" ? "#ffffff" : defaultColor;
    };

    const renderGallerySection = (section) => {
        const products = advertiserAucts.find(auct => auct.id === section.config.selectedAuctId)?.product_list || [];
        
        if (loading) {
            return (
                <div className="w-full flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#144366]/20 border-t-[#144366]"></div>
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <div className="w-full text-center py-12 text-gray-500">
                    Nenhum produto encontrado neste leilão.
                </div>
            );
        }
        
        // Cálculo da paginação
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentProducts = products.slice(startIndex, endIndex);

        return (
            <div className="w-full min-h-[50vh] flex flex-col items-center py-8"
                style={{ backgroundColor: section.color }}>
                {/* Container principal com largura máxima e padding */}
                <div className="w-full max-w-7xl px-4 md:px-8">
                    {/* Grid de produtos */}
                    <div className={`w-full grid gap-4 md:gap-6
                        grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${section.config.itemsPerRow || 5}`}>
                        {currentProducts.map((product) => (
                            <div key={product.id} 
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                {/* Container da imagem com aspect ratio fixo */}
                                <div className="aspect-square w-full">
                                    <img 
                                        src={product.cover_img_url} 
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Informações do produto */}
                                {(section.config.showTitle || section.config.showPrice) && (
                                    <div className="p-3">
                                        {section.config.showTitle && (
                                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                                                {product.title}
                                            </h3>
                                        )}
                                        {section.config.showPrice && (
                                            <p className="text-[#036982] text-sm font-medium">
                                                R$ {product.initial_value?.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Paginação centralizada */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200
                                    ${currentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#144366] text-white hover:bg-[#144366]/90'}`}
                            >
                                Anterior
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200
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
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200
                                    ${currentPage === totalPages 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#144366] text-white hover:bg-[#144366]/90'}`}
                            >
                                Próximo
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
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return (
            <div className="h-full overflow-y-auto p-8">
                <div className={`grid gap-6`}
                    style={{
                        gridTemplateColumns: `repeat(${section.config.itemsPerRow}, 1fr)`
                    }}>
                    {advertiserAucts.map((auct, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img
                                src={auct.cover_img_url || auct.product_list?.[0]?.cover_img_url}
                                alt={auct.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4" style={{ fontFamily: headerData.fontStyle }}>
                                <h3 className="font-bold text-lg mb-2"
                                    style={{ 
                                        color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[0])
                                    }}>
                                    {auct.title}
                                </h3>

                                {section.config.showProductCount && (
                                    <p className="text-sm mb-2"
                                        style={{ 
                                            color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[1])
                                        }}>
                                        {auct.product_list?.length || 0} produtos
                                    </p>
                                )}

                                {section.config.showStartDate && (
                                    <p className="text-sm"
                                        style={{ 
                                            color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[2])
                                        }}>
                                        Início: {formatDate(auct.start_date)}
                                    </p>
                                )}

                                {section.config.showEndDate && (
                                    <p className="text-sm"
                                        style={{ 
                                            color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[2])
                                        }}>
                                        Término: {formatDate(auct.end_date)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAuctCarouselSection = (section) => {
        if (!advertiserAucts?.length) return null;

        return (
            <div className="h-full overflow-hidden">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={section.config.layout === "full" ? 0 : 20}
                    slidesPerView={section.config.itemsPerRow}
                    navigation
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="h-full"
                >
                    {advertiserAucts.map((auct, idx) => (
                        <SwiperSlide key={idx} className="h-full">
                            <div className="h-full bg-white">
                                <div className="aspect-square w-full">
                                    <img
                                        src={auct.auct_cover_img}
                                        alt={auct.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {section.config.showTitle && (
                                    <div className="p-4" style={{ fontFamily: headerData.fontStyle }}>
                                        <h3 className="font-bold text-lg" 
                                            style={{ 
                                                color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[0])
                                            }}>
                                            {auct.title}
                                        </h3>
                                        {section.config.showDates && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm" 
                                                    style={{ 
                                                        color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[1])
                                                    }}>
                                                    Início: {new Date(auct.start_date).toLocaleDateString('pt-BR')}
                                                </p>
                                                <p className="text-sm" 
                                                    style={{ 
                                                        color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[1])
                                                    }}>
                                                    Término: {new Date(auct.end_date).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        )}
                                        {section.config.showProductCount && (
                                            <p className="mt-2 text-sm font-medium" 
                                                style={{ 
                                                    color: getTextColor(Object.values(headerData.palettes[headerData.colorPalette])[2])
                                                }}>
                                                {auct.product_list?.length || 0} produtos
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
    };

    const renderCarouselSection = (section) => {
        const products = advertiserAucts.find(auct => auct.id === section.config.selectedAuctId)?.product_list || [];
        
        if (!products?.length) return null;

        return (
            <div className="h-full overflow-hidden flex flex-col justify-center">
                {/* Cabeçalho do Carrossel */}
                <div className="text-center mb-12 px-4">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#144366] to-[#1a5c8c] bg-clip-text text-transparent">
                        Produtos em Destaque
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Confira nossa seleção especial de produtos. Cada item foi cuidadosamente escolhido para oferecer as melhores oportunidades.
                    </p>
                </div>

                {/* Container do Carrossel */}
                <div className="w-[90%] mx-auto relative group">
                    {/* Decoração de fundo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#144366]/5 to-[#1a5c8c]/5 -m-8 rounded-3xl transform -skew-y-2"></div>
                    
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={section.config.layout === "full" ? 0 : 30}
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
                        className="h-full py-8"
                    >
                        {products.map((product, idx) => (
                            <SwiperSlide key={idx} className="h-full">
                                <div className="h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="aspect-square w-full relative group">
                                        <img
                                            src={product.cover_img_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        {/* Overlay gradiente */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    {section.config.showTitle && (
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg mb-2 text-[#144366] line-clamp-2">
                                                {product.title}
                                            </h3>
                                            {section.config.showPrice && (
                                                <div className="flex items-center justify-between mt-4">
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
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Botões de navegação customizados */}
                    <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#144366] hover:bg-[#144366] hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 group-hover:-translate-x-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#144366] hover:bg-[#144366] hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col">
            {sectionsData.sections.map((section, index) => {
                const sectionType = section.type.toLowerCase();

                return (
                    <section
                        key={index}
                        className={`w-full relative transition-all duration-1000 ease-in-out`}
                        style={{
                            backgroundColor: section.color,
                            minHeight: section.sizeType === "SMALL" ? "25vh" :
                                section.sizeType === "MEDIUM" ? "50vh" :
                                    section.sizeType === "FULL" ? "100vh" : "50vh",
                            transitionDelay: `${index * 200}ms`,
                            fontFamily: headerData.fontStyle
                        }}
                    >
                        <div className="w-full h-full">
                            {sectionType === 'product_carousel' && renderCarouselSection(section)}
                            {sectionType === 'auctcarousel' && renderAuctCarouselSection(section)}
                            {sectionType === 'gallery' && renderGallerySection(section)}
                            {sectionType === 'text' && renderTextSection(section)}
                            {sectionType === 'form' && renderFormSection(section)}
                            {sectionType === 'auct_list' && renderAuctListSection(section)}
                            {/* {sectionType === 'testimonials' && renderTestimonialsSection(section)} */}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

export default TemplateSections;