/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { WhatsApp } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { fetchTemplate } from '../../../features/template/SectionsSlice';
import 'swiper/css';

function TemplateSections() {
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const { headerData } = useSelector(state => state.header);
    const [aucts, setAucts] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 830);
    const { advertiser_id } = useParams();

    useEffect(() => {
        if (advertiser_id) {
            dispatch(fetchTemplate(advertiser_id));
        }
    }, [advertiser_id, dispatch]);

    useEffect(() => {
        const fetchAucts = async () => {
            try {
                if (!advertiser_id) return;

                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                    params: {
                        creator_id: advertiser_id
                    }
                });
                setAucts(response.data);
            } catch (error) {
                console.error("Erro ao buscar leilões:", error);
            }
        };

        fetchAucts();
    }, [advertiser_id]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 830);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderGallerySection = (section) => {
        const selectedAuct = aucts.find(auct => auct.id === section.config.selectedAuctId);
        if (!selectedAuct?.product_list?.length) return null;

        return (
            <div className="h-full overflow-y-auto">
                <div className={`grid gap-4 p-4`}
                    style={{
                        gridTemplateColumns: `repeat(${isMobile ? 1 : section.config.itemsPerRow}, 1fr)`
                    }}>
                    {selectedAuct.product_list.map((product, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={product.cover_img_url}
                                alt={product.title}
                                className="w-full h-48 object-cover"
                            />
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
                    textAlign: section.config.alignment?.toLowerCase() || 'left'
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

            // Coleta todos os campos do formulário
            section.config.fields.forEach(field => {
                data[field.label] = formData.get(field.label.toLowerCase().replace(/\s+/g, '-'));
            });

            // Formatar mensagem para WhatsApp
            const text = Object.entries(data)
                .map(([key, value]) => `*${key}:* ${value}`)
                .join('%0A');

            const phone = section.config.whatsappNumber.replace(/\D/g, '');
            window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        };

        return (
            <div className="h-full overflow-y-auto flex items-center justify-center p-8">
                <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-lg p-8">
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
                                        className="w-full p-3 border rounded-lg bg-white/10 backdrop-blur-sm"
                                        rows={4}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.label.toLowerCase().replace(/\s+/g, '-')}
                                        required={field.required}
                                        className="w-full p-3 border rounded-lg bg-white/10 backdrop-blur-sm"
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full justify-center"
                        >
                            <WhatsApp />
                            {section.config.buttonText || 'Enviar Mensagem'}
                        </button>
                    </form>
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
                        gridTemplateColumns: `repeat(${isMobile ? 1 : section.config.itemsPerRow}, 1fr)`
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
        );
    };

    return (
        <>
            {sectionsData?.sections?.map((section, index) => {
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
                            {sectionType === 'gallery' && renderGallerySection({ ...section, config: { ...section.config } })}
                            {sectionType === 'text' && renderTextSection(section)}
                            {sectionType === 'form' && renderFormSection(section)}
                            {sectionType === 'auct_list' && renderAuctListSection(section)}
                        </div>
                    </section>
                );
            })}
        </>
    );
}

export default TemplateSections;