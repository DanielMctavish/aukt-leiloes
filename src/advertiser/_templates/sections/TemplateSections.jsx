/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { WhatsApp } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import 'swiper/css';

function TemplateSections({ template, textColorClass, fadeIn }) {
    const [aucts, setAucts] = useState([]);
    const { advertiser_id } = useParams();

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

    const renderGallerySection = (section) => {
        const selectedAuct = aucts.find(auct => auct.id === section.config.selectedAuctId);
        if (!selectedAuct?.product_list?.length) return null;

        if (section.config.layout === 'grid') {
            return (
                <div className="h-full overflow-y-auto">
                    <div className={`grid gap-4 p-4 ${textColorClass}`}
                        style={{
                            gridTemplateColumns: `repeat(${section.config.itemsPerRow}, 1fr)`
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
        }

        return (
            <div className="h-full w-full flex items-center justify-center">
                <Swiper
                    spaceBetween={20}
                    slidesPerView={section.config.itemsPerRow}
                    autoplay={{ delay: section.config.speed }}
                    style={{
                        width: section.config.carouselWidth || '100%',
                        height: section.config.carouselHeight || '400px'
                    }}
                >
                    {selectedAuct.product_list.map((product, idx) => (
                        <SwiperSlide key={idx}>
                            <div
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                                style={{ height: section.config.carouselHeight || '400px' }}
                            >
                                <div className="h-[70%] overflow-hidden">
                                    <img
                                        src={product.cover_img_url}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {section.config.showTitle && (
                                    <div className="h-[30%] p-4 flex flex-col justify-between">
                                        <h3 className="font-bold text-lg line-clamp-2">{product.title}</h3>
                                        {section.config.showPrice && (
                                            <p className="text-gray-600 mt-2">
                                                R$ {product.initial_value?.toFixed(2)}
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

    const renderTextSection = (section) => (
        <div className="h-full overflow-y-auto flex items-center justify-center">
            <div className={`p-8 text-${section.config.alignment} ${textColorClass} w-full max-w-4xl`}
                style={{ color: section.config.textColor }}
            >
                {section.config.showTitle && section.config.title && (
                    <h3 className={`text-2xl font-bold mb-4 text-${section.config.alignment}`}
                        style={{ color: section.config.textColor }}
                    >
                        {section.config.title}
                    </h3>
                )}
                <div style={{
                    fontSize: `${section.config.fontSize}px`,
                    whiteSpace: 'pre-wrap'
                }}>
                    {section.config.content}
                </div>
            </div>
        </div>
    );

    const renderFormSection = (section) => {
        const handleSubmit = async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };

            // Formatar mensagem para WhatsApp
            const text = `*Nome:* ${data.name}%0A` +
                        `*Email:* ${data.email}%0A` +
                        `*Telefone:* ${data.phone}%0A` +
                        `*Mensagem:* ${data.message}`;

            const phone = section.config.whatsappNumber.replace(/\D/g, '');
            window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        };

        return (
            <div className="h-full overflow-y-auto flex items-center justify-center">
                <div className={`max-w-2xl w-full p-8 ${textColorClass}`}>
                    <h3 className="text-2xl font-bold mb-6">{section.config.title}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {section.config.fields.map((field, idx) => (
                            <div key={idx}>
                                <label className="block text-sm font-medium mb-1">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        name={field.type === 'textarea' ? 'message' : field.type}
                                        className="w-full p-3 border rounded-lg bg-white text-gray-900
                                            focus:ring-2 focus:ring-[#012038] outline-none
                                            placeholder:text-gray-400"
                                        required={field.required}
                                        placeholder={`Digite ${field.label.toLowerCase()}...`}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.type === 'text' ? 'name' : field.type}
                                        className="w-full p-3 border rounded-lg bg-white text-gray-900
                                            focus:ring-2 focus:ring-[#012038] outline-none
                                            placeholder:text-gray-400"
                                        required={field.required}
                                        placeholder={`Digite ${field.label.toLowerCase()}...`}
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 p-3 
                                bg-[#012038] text-white rounded-lg hover:bg-[#012038]/90 
                                transition-colors"
                        >
                            <WhatsApp />
                            {section.config.buttonText}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const renderAuctListSection = (section) => {
        return (
            <div className="h-full overflow-y-auto">
                {section.config.layout === 'grid' ? (
                    <div className={`grid gap-6 p-6 ${textColorClass}`}
                        style={{
                            gridTemplateColumns: `repeat(${section.config.itemsPerRow}, 1fr)`
                        }}>
                        {aucts.map((auct, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                                <img
                                    src={auct.auct_cover_img}
                                    alt={auct.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{auct.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2 py-1 text-sm rounded ${auct.status === 'live' ? 'bg-green-100 text-green-800' :
                                                auct.status === 'cataloged' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {auct.status === 'live' ? 'Ao vivo' :
                                                auct.status === 'cataloged' ? 'Catalogado' :
                                                    auct.status === 'finished' ? 'Finalizado' :
                                                        auct.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {auct.product_list?.length || 0} produtos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        {aucts.map((auct, idx) => (
                            <div key={idx} className="flex gap-4 bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                                <img
                                    src={auct.auct_cover_img}
                                    alt={auct.title}
                                    className="w-48 h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="p-4 flex-1">
                                    <h3 className="font-bold text-lg mb-2">{auct.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2 py-1 text-sm rounded ${auct.status === 'live' ? 'bg-green-100 text-green-800' :
                                                auct.status === 'cataloged' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {auct.status === 'live' ? 'Ao vivo' :
                                                auct.status === 'cataloged' ? 'Catalogado' :
                                                    auct.status === 'finished' ? 'Finalizado' :
                                                        auct.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {auct.product_list?.length || 0} produtos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {template.sections.map((section, index) => (
                <section
                    key={index}
                    className={`w-full relative transition-all duration-1000 ease-in-out 
                        ${section.type !== 'form' ? `
                            ${section.sizeType === "small" && "min-h-[25vh]"}
                            ${section.sizeType === "medium" && "min-h-[50vh]"}
                            ${section.sizeType === "full" && "min-h-[100vh]"}
                        ` : 'min-h-fit py-12'} 
                        ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{
                        backgroundColor: section.color,
                        transitionDelay: `${index * 200}ms`
                    }}
                >
                    <div className="w-full h-full">
                        {section.type === 'gallery' && renderGallerySection(section)}
                        {section.type === 'text' && renderTextSection(section)}
                        {section.type === 'form' && renderFormSection(section)}
                        {section.type === 'auctList' && renderAuctListSection(section)}
                    </div>
                </section>
            ))}
        </>
    );
}

export default TemplateSections;