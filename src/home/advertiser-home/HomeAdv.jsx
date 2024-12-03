/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WhatsApp, Instagram, Facebook, YouTube, Twitter, LinkedIn, Language, MusicNote } from '@mui/icons-material';
import {
    HeaderModel1, HeaderModel2, HeaderModel3, HeaderModel4,
    HeaderModel5, HeaderModel6, HeaderModel7, HeaderModel8
} from "./decorations";
import HeaderTexts from "./texts/HeaderTexts";
import HeaderCarousel from "./carousels/HeaderCarousel";
import HomeNav from './components/HomeNav';

function HomeAdvertiser() {
    const [header, setHeader] = useState(null);
    const [sections, setSections] = useState(null);
    const [footer, setFooter] = useState(null);
    const [fontStyle, setFontStyle] = useState(null);
    const [aucts, setAucts] = useState([]);
    const [selectedAuct, setSelectedAuct] = useState(null);
    const { advertiser_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getSiteTemplate()
        getAucts()
    }, [])

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
        <div className="w-full h-full flex justify-center items-center">
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

        return (
            <div className="h-full overflow-y-auto">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <div className={`grid gap-4 p-4`}
                        style={{
                            gridTemplateColumns: `repeat(${window.innerWidth <= 830 ? 1 : section.config.itemsPerRow}, 1fr)`
                        }}>
                        {selectedAuct.product_list.map((product, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer 
                                    transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                            >
                                <div className="relative">
                                    <img
                                        src={product.cover_img_url}
                                        alt={product.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    {/* Overlay hover */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 
                                        transition-opacity flex items-center justify-center">
                                        <span className="text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                                            Ver detalhes
                                        </span>
                                    </div>
                                </div>
                                {section.config.showTitle && (
                                    <div className="p-4">
                                        <h3 className="font-bold">{product.title}</h3>
                                        {section.config.showPrice && (
                                            <p className="text-gray-600">R$ {product.initial_value?.toFixed(2)}</p>
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
            <div className="h-auto flex items-center justify-center py-24 ">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {section.config.fields?.map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-2">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-3 border rounded-lg bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                            required={field.required}
                                            className="w-full p-3 border rounded-lg bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                 w-full justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <WhatsApp />
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
            <div className="h-full overflow-y-auto">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <div className={`grid gap-6 p-4`}
                        style={{
                            gridTemplateColumns: `repeat(${window.innerWidth <= 830 ? 1 : section.config.itemsPerRow}, 1fr)`
                        }}>
                        {aucts.map((auct, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <img
                                    src={auct.cover_img_url || auct.product_list?.[0]?.cover_img_url}
                                    alt={auct.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{auct.title}</h3>

                                    {section.config.showProductCount && (
                                        <p className="text-gray-600 text-sm mb-2">
                                            {auct.product_list?.length || 0} produtos
                                        </p>
                                    )}

                                    {section.config.showStartDate && (
                                        <p className="text-gray-600 text-sm">
                                            Início: {formatDate(auct.start_date)}
                                        </p>
                                    )}

                                    {section.config.showEndDate && (
                                        <p className="text-gray-600 text-sm">
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

    const getSocialIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'instagram': return <Instagram />;
            case 'facebook': return <Facebook />;
            case 'youtube': return <YouTube />;
            case 'twitter': return <Twitter />;
            case 'linkedin': return <LinkedIn />;
            case 'tiktok': return <MusicNote />;
            case 'whatsapp': return <WhatsApp />;
            default: return <Language />;
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#fff] overflow-x-hidden relative"
            style={{ fontFamily: fontStyle }}>

            <HomeNav sections={sections} />
            
            <header
                className={`w-full relative overflow-hidden mt-[8vh]
                    ${header?.sizeType === "FULL" && "h-[100vh]"} 
                    ${header?.sizeType === "MEDIUM" && "h-[50vh]"}
                    ${header?.sizeType === "SMALL" && "h-[25vh]"}`}
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
                <HeaderCarousel config={header?.carousel} advertiser_id={advertiser_id} />
            </header>

            {/* Sections - Agora ordenadas */}
            {sections?.sort((a, b) => a.order - b.order).map((section, index) => {
                const sectionType = section.type.toLowerCase();

                return (
                    <section
                        key={index}
                        data-section-type={sectionType}
                        className={`w-full flex items-center justify-center relative transition-colors duration-1000 ease-in-out`}
                        style={{
                            backgroundColor: section.color,
                            minHeight: section.sizeType === "SMALL" ? "25vh" :
                                section.sizeType === "MEDIUM" ? "50vh" :
                                    section.sizeType === "FULL" ? "100vh" : "50vh",
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
            {footer && (
                <footer
                    className="w-full relative overflow-hidden"
                    style={{
                        backgroundColor: footer.color,
                        minHeight: footer.sizeType === "SMALL" ? "25vh" :
                            footer.sizeType === "MEDIUM" ? "50vh" :
                                footer.sizeType === "LARGE" ? "75vh" : "50vh"
                    }}
                >
                    <div className="container mx-auto px-4 lg:px-8 py-12">
                        {/* Company Info */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2" style={{ color: footer.textColor }}>
                                {footer.companyName}
                            </h2>
                        </div>

                        {/* Footer Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {footer.sections?.map((section, index) => (
                                <div key={index} className="space-y-4">
                                    <h3 className="font-bold text-lg" style={{ color: footer.textColor }}>
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {section.links?.map((link, idx) => (
                                            <li key={idx}>
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:opacity-80 transition-opacity"
                                                    style={{ color: footer.textColor }}
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Social Media */}
                        {footer.showSocialLinks && (
                            <div className="flex justify-center gap-4 border-t border-opacity-20 mb-8"
                                style={{ borderColor: footer.borderColor }}>
                                <div className="pt-8 flex gap-6">
                                    {footer.socialMedia?.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-80 transition-opacity text-2xl"
                                            style={{ color: footer.textColor }}
                                        >
                                            {getSocialIcon(social.type)}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                    {/* Copyright */}
                    <div
                        className="w-full py-4"
                        style={{
                            backgroundColor: footer.borderColor,
                            color: footer.textColor
                        }}
                    >
                        <div className="container mx-auto px-4 md:px-6 text-center text-sm">
                            <p>© {new Date().getFullYear()}. Todos os direitos reservados | {footer.companyName || 'Arboris Codex'}.</p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

export default HomeAdvertiser;