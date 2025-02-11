/* eslint-disable react-hooks/exhaustive-deps */
import { Rocket, Refresh, Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SpanTemplateControl from './SpanTemplateControl';
import SureDeleteTemplateModal from './SureDeleteTemplateModal';

function ButtonsDeploy() {
    const [templateExists, setTemplateExists] = useState(false);
    const { advertiser_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Selecionando dados dos slices
    const { headerData } = useSelector(state => state.header);
    const { sectionsData } = useSelector(state => state.sections);
    const { footerData } = useSelector(state => state.footer);

    useEffect(() => {

        // console.log("observando headerData", headerData.texts[0]);

        if (advertiser_id) {
            checkExistingTemplate()
        }
    }, [headerData])


    const checkExistingTemplate = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-advertiser`,
                {
                    params: { advertiserId: advertiser_id },
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`
                    }
                }
            ).then(response => {
                setTemplateExists(response.data?.SiteTemplate?.[0]?.id ? response.data?.SiteTemplate?.[0]?.id : false);
            });

            return null;
        } catch (error) {
            console.error("Erro ao verificar template:", error);
            return null;
        }
    };

    // Funções auxiliares para normalizar valores dos enums
    const normalizeHeaderModel = (model) => {
        const validModels = [
            'MODEL_1', 'MODEL_2', 'MODEL_3', 'MODEL_4', 'MODEL_5',
            'MODEL_6', 'MODEL_7', 'MODEL_8', 'MODEL_9', 'MODEL_10',
            'MODEL_11', 'MODEL_12', 'MODEL_13', 'MODEL_14', 'MODEL_15',
            'MODEL_16', 'MODEL_17'
        ];
        const normalizedModel = model?.toUpperCase();
        return validModels.includes(normalizedModel) ? normalizedModel : 'MODEL_1';
    };

    const normalizeSectionType = (type) => {
        const validTypes = [
            'PRODUCT_CAROUSEL', 'FORM', 'GALLERY',
            'AUCT_LIST', 'TEXT', 'TESTIMONIALS'
        ];
        const normalizedType = type?.toUpperCase();
        return validTypes.includes(normalizedType) ? normalizedType : 'TEXT';
    };

    const normalizeSizeType = (size) => {
        const validSizes = ['SMALL', 'MEDIUM', 'FULL'];
        const normalizedSize = size?.toUpperCase();
        return validSizes.includes(normalizedSize) ? normalizedSize : 'MEDIUM';
    };

    const normalizeColorPalette = (palette) => {
        const validPalettes = ['CLEAN', 'CANDY', 'DARK', 'MONOCHROMATIC'];
        const normalizedPalette = palette?.toUpperCase();
        return validPalettes.includes(normalizedPalette) ? normalizedPalette : 'CLEAN';
    };

    const normalizeLayoutType = (layout) => {
        const validLayouts = ['GRID', 'CAROUSEL', 'LIST'];
        const normalizedLayout = layout?.toUpperCase();
        return validLayouts.includes(normalizedLayout) ? normalizedLayout : 'GRID';
    };

    const normalizeAlignmentType = (alignment) => {
        const validAlignments = ['LEFT', 'CENTER', 'RIGHT'];
        const normalizedAlignment = alignment?.toUpperCase();
        return validAlignments.includes(normalizedAlignment) ? normalizedAlignment : 'LEFT';
    };

    const normalizeDestinationType = (destination) => {
        const validDestinations = ['WHATSAPP', 'EMAIL'];
        const normalizedDestination = destination?.toUpperCase();
        return validDestinations.includes(normalizedDestination) ? normalizedDestination : 'WHATSAPP';
    };

    // Prepara os dados do template
    const prepareTemplateData = () => {
        return {
            advertiserId: advertiser_id,
            colorPalette: normalizeColorPalette(headerData.colorPalette),
            fontStyle: headerData.fontStyle,
            header: {
                color: headerData.color,
                sizeType: normalizeSizeType(headerData.sizeType),
                model: normalizeHeaderModel(headerData.model),
                backgroundImage: headerData.backgroundImage,
                backgroundImageOpacity: headerData.backgroundImageOpacity || 1,
                backgroundImageBlur: headerData.backgroundImageBlur || 0,
                backgroundImageBrightness: headerData.backgroundImageBrightness || 1,
                elementsOpacity: headerData.elementsOpacity || 1,
                texts: headerData.texts.map(text => ({
                    title: text.title || '',
                    content: text.content || '',
                    positionTop: text.positionTop || '50%',
                    positionLeft: text.positionLeft || '50%',
                    positionWidth: text.positionWidth || '80%',
                    titleBackground: text.titleBackground || 'rgba(0,0,0,0.5)',
                    titleColor: text.titleColor || '#ffffff',
                    contentColor: text.contentColor || '#ffffff',
                    titleSize: text.titleSize || '48px',
                    titleBorderRadius: text.titleBorderRadius || '5px',
                    visible: true
                })),
                carousel: headerData.carousel?.enabled ? {
                    enabled: true,
                    title: headerData.carousel.title || 'Produtos em Destaque',
                    selectedAuctId: headerData.carousel.selectedAuctId || null,
                    sizeWidth: headerData.carousel.sizeWidth || '100%',
                    sizeHeight: headerData.carousel.sizeHeight || '400px',
                    itemsToShow: headerData.carousel.itemsToShow || 3,
                    speed: headerData.carousel.speed || 3000,
                    positionTop: headerData.carousel.positionTop || '60%',
                    positionLeft: headerData.carousel.positionLeft || '50%',
                    showTitle: headerData.carousel.showTitle ?? true,
                    showPrice: headerData.carousel.showPrice ?? true,
                    showCarouselTitle: headerData.carousel.showCarouselTitle ?? true,
                    showNavigation: headerData.carousel.showNavigation ?? true
                } : undefined
            },
            sections: sectionsData.sections.map(section => ({
                type: normalizeSectionType(section.type),
                color: section.color || '#ffffff',
                sizeType: normalizeSizeType(section.sizeType),
                config: {
                    selectedAuctId: section.config?.selectedAuctId || null,
                    layout: normalizeLayoutType(section.config?.layout),
                    itemsPerRow: section.config?.itemsPerRow || 3,
                    showPrice: section.config?.showPrice ?? true,
                    showTitle: section.config?.showTitle ?? true,
                    autoplay: section.config?.autoplay ?? true,
                    speed: section.config?.speed || 3000,
                    content: section.config?.content || '',
                    alignment: normalizeAlignmentType(section.config?.alignment),
                    fontSize: section.config?.fontSize || '16px',
                    textColor: section.config?.textColor || '#000000',
                    preserveLineBreaks: section.config?.preserveLineBreaks ?? true,
                    destination: normalizeDestinationType(section.config?.destination),
                    whatsappNumber: section.config?.whatsappNumber || '',
                    email: section.config?.email || '',
                    fields: section.config?.fields || [],
                    buttonText: section.config?.buttonText || 'Enviar',
                    successMessage: section.config?.successMessage || 'Mensagem enviada com sucesso!'
                }
            })),
            footer: {
                color: footerData.color || '#333333',
                sizeType: normalizeSizeType(footerData.size),
                companyName: footerData.companyName || '',
                showSocialLinks: footerData.showSocialLinks ?? true,
                textColor: footerData.textColor || '#ffffff',
                borderColor: footerData.borderColor || '#444444',
                elementsOpacity: (footerData.elementsOpacity || 100) / 100,
                sections: footerData.sections.map(section => ({
                    title: section.title || '',
                    links: section.links?.map(link => ({
                        name: link.name || '',
                        url: link.url || ''
                    })) || []
                })),
                socialMedia: footerData.socialMedia.map(social => ({
                    type: social.type || '',
                    url: social.url || ''
                }))
            }
        };
    };

    // Função para fazer deploy do site
    const handleDeploy = async () => {
        try {
            setLoading(true);
            const existingTemplateId = await checkExistingTemplate();

            if (existingTemplateId) {
                await handleUpdate(templateExists);
                return;
            }

            const templateData = prepareTemplateData();
            await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/template/create-template`,
                templateData,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setToast({ message: 'Site publicado com sucesso!', type: 'success' });
        } catch (error) {
            console.error("Erro ao fazer deploy:", error);
            setToast({ message: 'Erro ao publicar o site. Tente novamente.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Função para atualizar o site
    const handleUpdate = async (templateId) => {
        if (!templateId) {
            setToast({ message: 'Nenhum template encontrado para atualizar.', type: 'error' });
            return;
        }

        try {
            setLoading(true);
            const templateData = prepareTemplateData();
            await axios.patch(
                `${import.meta.env.VITE_APP_BACKEND_API}/template/update-template?templateId=${templateId}`,
                templateData,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setToast({ message: 'Site atualizado com sucesso!', type: 'success' });
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            setToast({ message: 'Erro ao atualizar o site. Tente novamente.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Função para excluir o template
    const handleDelete = async () => {
        const id = templateExists || await checkExistingTemplate();
        if (!id) {
            setToast({ message: 'Nenhum template encontrado para excluir.', type: 'error' });
            return;
        }

        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `${import.meta.env.VITE_APP_BACKEND_API}/template/delete?templateId=${templateExists}`,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`
                    }
                }
            );

            setTemplateExists(false);
            setToast({ message: 'Template excluído com sucesso!', type: 'success' });
        } catch (error) {
            console.error("Erro ao excluir:", error);
            setToast({ message: 'Erro ao excluir o template. Tente novamente.', type: 'error' });
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            {toast && (
                <SpanTemplateControl 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {showDeleteModal && (
                <SureDeleteTemplateModal 
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 p-6">

                {
                    templateExists ? (

                        <button
                            onClick={() => handleUpdate(templateExists)}
                            disabled={loading}
                            className="w-full group relative flex items-center justify-center gap-3 
                    bg-white text-[#012038] font-medium
                    py-4 px-6 rounded-xl shadow-lg hover:shadow-xl
                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                    border-2 border-[#012038]/10 hover:border-[#012038]/20
                    disabled:opacity-50 disabled:cursor-not-allowed">
                            <Refresh className={`text-2xl group-hover:rotate-180 transition-transform duration-500
                    ${loading ? 'animate-spin' : ''}`} />
                            <span>{loading ? 'Processando...' : 'Atualizar Site'}</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleDeploy}
                            disabled={loading}
                            className="w-full group relative flex items-center justify-center gap-3 
                            bg-gradient-to-r from-[#012038] to-[#036982] text-white font-medium
                            py-4 px-6 rounded-xl shadow-lg hover:shadow-xl
                            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                            overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#036982] to-[#012038] 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                            <Rocket className={`text-2xl relative z-10 group-hover:rotate-12 transition-transform duration-300
                            ${loading ? 'animate-bounce' : ''}`} />
                            <span className="relative z-10">{loading ? 'Processando...' : 'Deploy Site'}</span>
                        </button>
                    )
                }


                {
                    templateExists && (
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="w-full group relative flex items-center justify-center gap-3 
                            bg-white text-red-500 font-medium
                            py-4 px-6 rounded-xl shadow-lg hover:shadow-xl
                            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                            border-2 border-red-100 hover:border-red-200
                            hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Delete className={`text-2xl group-hover:rotate-12 transition-transform duration-300
                            ${loading ? 'animate-pulse' : ''}`} />
                            <span>{loading ? 'Processando...' : 'Excluir Template'}</span>
                        </button>
                    )
                }



            </div>
        </>
    )
}

export default ButtonsDeploy;