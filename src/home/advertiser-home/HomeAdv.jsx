/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WhatsApp } from '@mui/icons-material';
import {
    HeaderModel1, HeaderModel2, HeaderModel3, HeaderModel4,
    HeaderModel5, HeaderModel6, HeaderModel7, HeaderModel8
} from "./decorations";
import HeaderTexts from "./texts/HeaderTexts";
import HeaderCarousel from "./carousels/HeaderCarousel";
import HomeNav from './components/HomeNav';
import FooterAdvHome from './components/FooterAdvHome';
import LoginClientModalAdv from './modal/LoginClientModalAdv';

function HomeAdvertiser() {
    const [header, setHeader] = useState(null);
    const [sections, setSections] = useState(null);
    const [footer, setFooter] = useState(null);
    const [fontStyle, setFontStyle] = useState(null);
    const [aucts, setAucts] = useState([]);
    const [selectedAuct, setSelectedAuct] = useState(null);
    const { advertiser_id } = useParams();
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        getSiteTemplate();
        getAucts();

        // Adicionar listener para redimensionamento da janela
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const gallerySection = sections?.find(section =>
            section.type.toLowerCase() === 'gallery' &&
            section.config.selectedAuctId
        );

        if (gallerySection?.config.selectedAuctId) {
            getSelectedAuct(gallerySection.config.selectedAuctId);
        }
    }, [sections]);

    const getSiteTemplate = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/template/find`, {
                params: { advertiserId: advertiser_id }
            });

            if (response.data && response.data[0]) {
                const templateData = response.data[0];
                setHeader({
                    ...templateData.header,
                    elements: templateData.header.elements || {},
                    colorPalette: templateData.colorPalette || 'clean'
                });
                setSections(templateData.sections);
                setFooter(templateData.footer);
                setFontStyle(templateData.fontStyle);
            }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    }

    const getAucts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                params: { creator_id: advertiser_id }
            });
            setAucts(response.data);
        } catch (error) {
            console.error('Error fetching auctions:', error);
        }
    }

    const getSelectedAuct = async (auctId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct`, {
                params: { auct_id: auctId }
            });
            setSelectedAuct(response.data);
        } catch (error) {
            console.error('Error fetching selected auction:', error);
        }
    };

    const getBackgroundImageStyle = () => {
        if (!header?.backgroundImage) return {};

        return {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${header.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: header.backgroundImageOpacity || 1,
            filter: `blur(${header.backgroundImageBlur || 0}px) brightness(${(header.backgroundImageBrightness || 1) * 100}%)`,
            zIndex: 0,
            maxHeight: '100%',
            height: '100%'
        };
    };

    const renderHeaderModel = () => {
        if (!header?.model) return null;

        const modelProps = {
            header: header,
            color: header.color,
            elements: header.elements,
            colorPalette: header.colorPalette,
            elementsOpacity: header.elementsOpacity
        };

        switch (header.model) {
            case "MODEL_1":
                return <HeaderModel1 {...modelProps} />;
            case "MODEL_2":
                return <HeaderModel2 {...modelProps} />;
            case "MODEL_3":
                return <HeaderModel3 {...modelProps} />;
            case "MODEL_4":
                return <HeaderModel4 {...modelProps} />;
            case "MODEL_5":
                return <HeaderModel5 {...modelProps} />;
            case "MODEL_6":
                return <HeaderModel6 {...modelProps} />;
            case "MODEL_7":
                return <HeaderModel7 {...modelProps} />;
            case "MODEL_8":
                return <HeaderModel8 {...modelProps} />;
            default:
                return null;
        }
    };

    const renderTextSection = (section) => (
        <div className="w-full h-full flex justify-center items-center py-8 sm:py-12">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-4xl mx-auto"
                    style={{
                        color: section.config.textColor,
                        fontSize: section.config.fontSize ? `${section.config.fontSize}px` : '16px',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.5',
                        textAlign: section.config.alignment?.toLowerCase() || 'left'
                    }}
                >
                    {section.config.content}
                </div>
            </div>
        </div>
    );

    const renderGallerySection = (section) => {
        if (!selectedAuct?.product_list?.length) return null;

        // Determinar o número de colunas com base na largura da tela
        // Use 2 colunas para dispositivos móveis (estilo Shein)
        const itemsPerRow = windowWidth <= 639 ? 2 : 
                         windowWidth <= 830 ? 2 : 
                         section.config.itemsPerRow || 3;

        return (
            <div className="h-full overflow-y-auto py-4 sm:py-6">
                <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-7xl">
                    <div className={` gap-2 sm:gap-4 grid-cols-5`}
                        style={{
                            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`
                        }}>
                        {selectedAuct.product_list.map((product, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer 
                                    transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                                onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                            >
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
                                        <span className="text-white bg-black/50 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                                            Ver detalhes
                                        </span>
                                    </div>
                                </div>
                                {section.config.showTitle && (
                                    <div className="p-2 sm:p-3">
                                        <h3 className="font-bold text-sm sm:text-base truncate">{product.title}</h3>
                                        {section.config.showPrice && (
                                            <p className="text-gray-600 text-sm font-semibold">
                                                R$ {product.initial_value?.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
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
            <div className="h-auto flex items-center justify-center py-12 sm:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {section.config.fields?.map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-1 sm:mb-2">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-2 sm:p-3 border rounded-lg bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-2 sm:p-3 border rounded-lg bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                 w-full justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                            >
                                <WhatsApp fontSize={windowWidth < 640 ? "small" : "medium"} />
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

        // Determinar o número de colunas com base na largura da tela
        const itemsPerRow = windowWidth <= 639 ? 2 : 
                         windowWidth <= 830 ? 2 : 
                         section.config.itemsPerRow || 3;

        return (
            <div className="h-full overflow-y-auto py-4 sm:py-6">
                <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-7xl">
                    <div className={`grid gap-2 sm:gap-4 md:gap-6`}
                        style={{
                            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`
                        }}>
                        {aucts.map((auct, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/advertiser/home/shop/${auct.id}`)}
                            >
                                <div className="aspect-video">
                                    <img
                                        src={auct.cover_img_url || auct.product_list?.[0]?.cover_img_url}
                                        alt={auct.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-2 sm:p-3">
                                    <h3 className="font-bold text-sm sm:text-base mb-1 truncate">{auct.title}</h3>

                                    {section.config.showProductCount && (
                                        <p className="text-gray-600 text-xs sm:text-sm mb-1">
                                            {auct.product_list?.length || 0} produtos
                                        </p>
                                    )}

                                    {section.config.showStartDate && (
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            Início: {formatDate(auct.start_date)}
                                        </p>
                                    )}

                                    {section.config.showEndDate && (
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            Término: {formatDate(auct.end_date)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="w-full min-h-screen bg-[#fff] overflow-x-hidden relative"
            style={{ fontFamily: fontStyle }}>

            <HomeNav 
                sections={sections} 
                header={header}
                onLoginClick={() => setIsLoginModalOpen(true)}
            />
            
            <header
                className={`w-full relative overflow-hidden mt-[8vh]
                    ${header?.sizeType === "FULL" ? "h-[80vh] sm:h-[90vh] md:h-[100vh]" : ""} 
                    ${header?.sizeType === "MEDIUM" ? "h-[40vh] sm:h-[45vh] md:h-[50vh]" : ""}
                    ${header?.sizeType === "SMALL" ? "h-[20vh] sm:h-[22vh] md:h-[25vh]" : ""}`}
                style={{ backgroundColor: header?.color || '#ffffff' }}>

                {/* Background Image Layer */}
                {header?.backgroundImage && (
                    <div style={getBackgroundImageStyle()} />
                )}

                {/* Decorative Elements Layer */}
                {renderHeaderModel()}

                {/* Text Layer */}
                <HeaderTexts
                    texts={header?.texts}
                    fontStyle={fontStyle}
                    style={header?.style}
                    position={header?.position}
                    colorPalette={header?.colorPalette}
                />

                {/* Carousel Layer */}
                <HeaderCarousel 
                    config={{
                        ...header?.carousel,
                        // Garante configurações mínimas adequadas para dispositivos móveis
                        itemsToShow: windowWidth <= 640 ? 1 : (header?.carousel?.itemsToShow || 3),
                        showNavigation: windowWidth > 640 ? (header?.carousel?.showNavigation || true) : false,
                        // Adiciona opções de paginação para mobile se não estiver explicitamente definido
                        showPagination: windowWidth <= 640 ? true : (header?.carousel?.showPagination || false)
                    }} 
                    advertiser_id={advertiser_id} 
                />
            </header>

            {/* Sections - Agora ordenadas */}
            {sections?.sort((a, b) => a.order - b.order).map((section, index) => {
                const sectionType = section.type.toLowerCase();
                const mobileSizeAdjustment = windowWidth <= 640 ? 0.7 : 
                                          windowWidth <= 830 ? 0.85 : 1;

                return (
                    <section
                        key={index}
                        data-section-type={sectionType}
                        className={`w-full flex items-center justify-center relative transition-colors duration-1000 ease-in-out`}
                        style={{
                            backgroundColor: section.color,
                            minHeight: section.sizeType === "SMALL" ? `${25 * mobileSizeAdjustment}vh` :
                                section.sizeType === "MEDIUM" ? `${50 * mobileSizeAdjustment}vh` :
                                    section.sizeType === "FULL" ? `${100 * mobileSizeAdjustment}vh` : `${50 * mobileSizeAdjustment}vh`,
                            transitionDelay: `${index * 200}ms`,
                            fontFamily: fontStyle
                        }}
                    >
                        <div className="w-full h-full">
                            {sectionType === 'gallery' && renderGallerySection(section)}
                            {sectionType === 'text' && renderTextSection(section)}
                            {sectionType === 'form' && renderFormSection(section)}
                            {sectionType === 'auct_list' && renderAuctListSection(section)}
                        </div>
                    </section>
                );
            })}

            {/* Footer */}
            {footer && <FooterAdvHome footer={footer} />}

            {/* Modal de Login */}
            <LoginClientModalAdv 
                modalOn={isLoginModalOpen}
                setIsModalOn={setIsLoginModalOpen}
                header={header}
                fontStyle={fontStyle}
            />
        </div>
    );
}

export default HomeAdvertiser;