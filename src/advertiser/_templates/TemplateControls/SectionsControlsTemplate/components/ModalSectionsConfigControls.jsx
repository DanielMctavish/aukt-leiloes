/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { Close, ViewCarousel, ContactMail, GridView, Gavel, TextFields, Reviews, Edit, Delete, FormatSize, Palette, Visibility } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AuctCarouselSectionControls from "./AuctCarouselSectionControls";
import CarroselProductsSectionControls from "./CarroselProductsSectionControls";
import FormSectionControls from "./FormSectionControls";
import GalleryProductsSection from "./GalleryProductsSection";
import TestimonialsSectionControls from "./TestimonialsSectionControls";
import TextSectionControls from "./TextSectionControls";
import { useParams } from "react-router-dom";
import axios from "axios";
import { updateSectionsData } from "../../../../../features/template/SectionsSlice";

function ModalSectionsConfigControls({ setIsModalSectionsOpen, setIsRetracted }) {
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const { headerData } = useSelector(state => state.header);
    const [advertiserData, setAdvertiserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    //params advertiserId
    const { advertiser_id } = useParams();

    useEffect(() => {
        const fetchAdvertiserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-advertiser?advertiserId=${advertiser_id}`);
                setAdvertiserData(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do anunciante:", error.message);
            } finally {
                setLoading(false);
            }
        };

        if (advertiser_id) {
            fetchAdvertiserData();
        }
    }, [advertiser_id]);

    // Estados para controlar qual modal de seção está aberto
    const [isModalCarroselProducts, setIsModalCarroselProducts] = useState(false);
    const [isModalForm, setIsModalForm] = useState(false);
    const [isModalProductGallery, setIsModalProductGallery] = useState(false);
    const [isModalAuctCarousel, setIsModalAuctCarousel] = useState(false);
    const [isModalText, setIsModalText] = useState(false);
    const [isModalTestimonials, setIsModalTestimonials] = useState(false);

    const handleRemoveSection = (index) => {
        const newSections = sectionsData.sections.filter((_, i) => i !== index);
        dispatch(updateSectionsData({
            sections: newSections
        }));
    };

    const handleEditSection = (index) => {
        const section = sectionsData.sections[index];
        switch (section.type) {
            case "PRODUCT_CAROUSEL":
                setIsModalCarroselProducts(true);
                break;
            case "AUCT_LIST":
                setIsModalAuctCarousel(true);
                break;
            case "FORM":
                setIsModalForm(true);
                break;
            case "TEXT":
                setIsModalText(true);
                break;
            case "GALLERY":
                setIsModalProductGallery(true);
                break;
            case "TESTIMONIALS":
                setIsModalTestimonials(true);
                break;
        }
    };

    const handleSectionSizeChange = (index, size) => {
        const updatedSections = [...sectionsData.sections];
        updatedSections[index] = {
            ...updatedSections[index],
            sizeType: size
        };
        dispatch(updateSectionsData({
            sections: updatedSections
        }));
    };

    const handleSectionColorChange = (index, color) => {
        const updatedSections = [...sectionsData.sections];
        updatedSections[index] = {
            ...updatedSections[index],
            color: color
        };
        dispatch(updateSectionsData({
            sections: updatedSections
        }));
    };

    // Array com as seções disponíveis
    const availableSections = [
        { 
            title: 'Carrosel de Produtos', 
            type: 'PRODUCT_CAROUSEL',
            icon: <ViewCarousel />,
            onClick: () => setIsModalCarroselProducts(true)
        },
        { 
            title: 'Formulário de Contato', 
            type: 'FORM',
            icon: <ContactMail />,
            onClick: () => setIsModalForm(true)
        },
        { 
            title: 'Grid de Produtos', 
            type: 'GALLERY',
            icon: <GridView />,
            onClick: () => setIsModalProductGallery(true)
        },
        { 
            title: 'Carrosel de Leilões', 
            type: 'AUCT_LIST',
            icon: <Gavel />,
            onClick: () => setIsModalAuctCarousel(true)
        },
        { 
            title: 'Sessão de Textos', 
            type: 'TEXT',
            icon: <TextFields />,
            onClick: () => setIsModalText(true)
        },
        { 
            title: 'Depoimentos de Clientes', 
            type: 'TESTIMONIALS',
            icon: <Reviews />,
            onClick: () => setIsModalTestimonials(true)
        }
    ];

    // Verifica se uma seção já foi adicionada
    const isSectionAdded = (type) => {
        return sectionsData.sections.some(section => section.type === type);
    };

    const closeModalAndRetract = () => {
        setIsModalSectionsOpen(false);
        setTimeout(() => {
            setIsRetracted(true);
        }, 400);
    };

    // Renderiza o modal apropriado baseado no estado
    if (isModalCarroselProducts) return <CarroselProductsSectionControls
        advertiserAucts={advertiserData.Aucts}
        setIsModalCarroselProducts={setIsModalCarroselProducts} />;

    if (isModalForm) return <FormSectionControls setIsModalForm={setIsModalForm} />;

    if (isModalProductGallery) return <GalleryProductsSection
        advertiserAucts={advertiserData.Aucts}
        setIsModalProductGallery={setIsModalProductGallery} />;

    if (isModalAuctCarousel) return <AuctCarouselSectionControls
        advertiserAucts={advertiserData.Aucts}
        setIsModalAuctCarousel={setIsModalAuctCarousel} />;

    if (isModalText) return <TextSectionControls setIsModalText={setIsModalText} onClose={closeModalAndRetract} />;

    if (isModalTestimonials) return <TestimonialsSectionControls setIsModalTestimonials={setIsModalTestimonials} />;

    return (
        <div className={`w-full h-[100vh] fixed top-0 left-0 
            ${isPreviewMode ? 'bg-transparent pointer-events-none' : 'bg-[#0D2B44]/80'} 
            flex ${isPreviewMode ? 'justify-start' : 'justify-center'} items-start z-[999] 
            ${isPreviewMode ? '' : 'backdrop-blur-[4px]'} overflow-y-auto`}>

            <div className={`${isPreviewMode ? 'w-[400px] h-[100vh] rounded-r-2xl pointer-events-auto' : 'w-[85%] h-[85%] rounded-2xl'} 
                bg-white shadow-2xl flex flex-col gap-4 items-center relative p-8 overflow-y-auto 
                transition-all duration-300 ease-in-out
                ${isPreviewMode ? 'sticky top-0' : ''}`}>

                {/* Botões de Controle */}
                <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
                        title={isPreviewMode ? "Modo Tela Cheia" : "Modo Preview"}
                    >
                        <Visibility 
                            className={`text-[#144366] transform transition-transform duration-300 ${isPreviewMode ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    <button
                        onClick={closeModalAndRetract}
                        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                        <Close className="text-[#144366]" />
                    </button>
                </div>

                {/* Título */}
                <div className="w-full text-center mb-4 mt-8">
                    <h2 className="text-2xl font-bold text-[#144366]">Configuração de Seções</h2>
                    <p className="text-gray-500 mt-1">Adicione e gerencie as seções do seu template</p>
                </div>

                {/* Seção de Adição de Novas Seções */}
                <section className="w-full flex flex-col gap-4">
                    <h3 className="text-[#144366] font-semibold">Seções Disponíveis</h3>

                    {/* Lista de Seções Disponíveis */}
                    <div className="grid grid-cols-1 gap-4">
                        {availableSections.map((section, index) => {
                            const isAdded = isSectionAdded(section.type);
                            return (
                            <button
                                key={index}
                                    onClick={!isAdded ? section.onClick : undefined}
                                    disabled={isAdded}
                                    className={`group relative flex items-center gap-4 p-4 bg-white rounded-xl
                                        shadow-md transition-all duration-300
                                        ${!isAdded ? 'hover:shadow-lg hover:-translate-x-1 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                                        overflow-hidden border-l-4 ${isAdded ? 'border-gray-300' : 'border-[#144366]'}`}
                            >
                                {/* Ícone */}
                                    <div className={`p-2 rounded-lg ${isAdded
                                            ? 'bg-gray-100 text-gray-400'
                                            : 'bg-[#F5F8FA] text-[#144366] group-hover:bg-[#144366] group-hover:text-white'
                                        } transition-all duration-300`}>
                                    {section.icon}
                                </div>

                                {/* Título */}
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${isAdded
                                                ? 'text-gray-400'
                                                : 'text-[#5A7184] group-hover:text-[#144366]'
                                            } transition-colors duration-300`}>
                                    {section.title}
                                </span>
                                        {isAdded && (
                                            <span className="text-sm text-gray-400">
                                                Já adicionado
                                            </span>
                                        )}
                                    </div>

                                {/* Hover Effect Overlay */}
                                    {!isAdded && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F5F8FA]
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    )}
                            </button>
                            );
                        })}
                    </div>
                </section>

                {/* Seção de Seções Atuais */}
                <section className="w-full flex flex-col gap-4 mt-8">
                    <h3 className="text-[#144366] font-semibold">Seções Adicionadas</h3>
                    <div className="flex flex-col gap-2">
                        {sectionsData.sections.map((section, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200
                                    hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="flex flex-col gap-3">
                                    {/* Cabeçalho da Seção */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[#F5F8FA] text-[#144366]">
                                                {section.type === "PRODUCT_CAROUSEL" && <ViewCarousel />}
                                                {section.type === "AUCT_LIST" && <Gavel />}
                                                {section.type === "FORM" && <ContactMail />}
                                                {section.type === "TEXT" && <TextFields />}
                                                {section.type === "GALLERY" && <GridView />}
                                                {section.type === "TESTIMONIALS" && <Reviews />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-gray-700 font-medium truncate">
                                                    {section.type === "PRODUCT_CAROUSEL" && "Carrosel de Produtos"}
                                                    {section.type === "AUCT_LIST" && "Carrosel de Leilões"}
                                                    {section.type === "FORM" && "Formulário de Contato"}
                                                    {section.type === "TEXT" && "Seção de Texto"}
                                                    {section.type === "GALLERY" && "Galeria de Produtos"}
                                                    {section.type === "TESTIMONIALS" && "Depoimentos"}
                                                </span>
                                                <span className="text-sm text-gray-500 truncate">
                                                    {section.type === "PRODUCT_CAROUSEL" && `${section.config.itemsPerRow} item(s) por linha - Layout ${section.config.layout === "full" ? "Completo" : "Contido"}`}
                                                    {section.type === "AUCT_LIST" && `${section.config.itemsPerRow} item(s) por linha - Layout ${section.config.layout === "full" ? "Completo" : "Contido"}`}
                                                    {section.type === "FORM" && "Formulário de contato personalizado"}
                                                    {section.type === "TEXT" && (section.config.content?.substring(0, 50) + "...")}
                                                    {section.type === "GALLERY" && `${section.config.itemsPerRow} produtos por linha`}
                                                    {section.type === "TESTIMONIALS" && "Depoimentos de clientes"}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Botões de Ação */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleRemoveSection(index)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                title="Remover seção"
                                            >
                                                <Delete className="text-xl" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Controles de Tamanho e Cor */}
                                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200">
                                        {/* Controles de Tamanho */}
                                        <div className="flex items-center gap-1">
                                            {['SMALL', 'MEDIUM', 'FULL'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => handleSectionSizeChange(index, size)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all
                                                        ${section.sizeType === size
                                                            ? 'bg-[#144366] text-white'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    title={size === 'SMALL' ? 'Pequeno' : size === 'MEDIUM' ? 'Médio' : 'Grande'}
                                                >
                                                    {size === 'SMALL' ? 'P' : size === 'MEDIUM' ? 'M' : 'G'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Controles de Cor */}
                                        <div className="flex items-center gap-1 flex-wrap">
                                            <button
                                                onClick={() => handleSectionColorChange(index, '#FFFFFF')}
                                                className={`w-8 h-8 rounded-full transition-all border-2
                                                    ${section.color === '#FFFFFF'
                                                        ? 'border-[#144366] scale-110'
                                                        : 'border-gray-300 hover:border-[#144366]'
                                                    }`}
                                                style={{ backgroundColor: '#FFFFFF' }}
                                                title="Cor branca"
                                            />
                                            {Object.entries(headerData.palettes[headerData.colorPalette]).map(([key, color]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => handleSectionColorChange(index, color)}
                                                    className={`w-8 h-8 rounded-full transition-all border-2
                                                        ${section.color === color
                                                            ? 'border-[#144366] scale-110'
                                                            : 'border-transparent hover:border-gray-300'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                    title={`Cor ${parseInt(key) + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {sectionsData.sections.length === 0 && (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                Nenhuma seção adicionada ainda. Clique em uma das opções acima para começar.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ModalSectionsConfigControls; 