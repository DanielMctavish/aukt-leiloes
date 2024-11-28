/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InitialConfigControls from './InitialConfigControls';
import HeaderControls from './HeaderControls';
import FooterControls from './FooterControls';
import SectionsControls from './SectionsControls';
import { Add, Rocket } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addSection } from '../../../features/template/SectionsSlice';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

function TemplateControls() {
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const { headerData } = useSelector(state => state.header);
    const { footerData } = useSelector(state => state.footer);
    const [isLoading, setIsLoading] = useState(false);
    const { advertiser_id } = useParams();
    const isInitialConfigComplete = headerData.colorPalette && headerData.fontStyle;

    const isUpdate = Boolean(headerData?.id);

    const [modalConfig, setModalConfig] = useState({
        success: { isOpen: false, message: '' },
        error: { isOpen: false, message: '' }
    });

    const handleCreateTemplate = async () => {
        setIsLoading(true);
        try {
            const advertiserSession = localStorage.getItem('advertiser-session-aukt');
            if (!advertiserSession) {
                throw new Error('Sessão do anunciante não encontrada');
            }

            const { token } = JSON.parse(advertiserSession);
            if (!token) {
                throw new Error('Token não encontrado');
            }

            await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/template/create-template`,
                {
                    advertiserId: advertiser_id,
                    colorPalette: headerData.colorPalette.toUpperCase(),
                    fontStyle: headerData.fontStyle,
                    header: {
                        color: headerData.color,
                        sizeType: headerData.sizeType.toUpperCase(),
                        model: headerData.model,
                        backgroundImage: headerData.background.image || null,
                        backgroundImageOpacity: headerData.background.opacity / 100,
                        backgroundImageBlur: headerData.background.blur,
                        backgroundImageBrightness: headerData.background.brightness / 100,
                        elementsOpacity: headerData.elementsOpacity / 100,
                        texts: headerData.texts.map(text => ({
                            title: text.title,
                            content: text.content,
                            positionTop: text.position.top,
                            positionLeft: text.position.left,
                            positionWidth: text.position.width,
                            titleBackground: text.style.titleBackground,
                            titleColor: text.style.titleColor,
                            contentColor: text.style.contentColor,
                            titleSize: `${text.style.titleSize}px`,
                            titleBorderRadius: text.style.titleBorderRadius,
                            visible: text.visible
                        })),
                        carousel: headerData.carousel.enabled ? {
                            enabled: headerData.carousel.enabled,
                            title: headerData.carousel.title,
                            selectedAuctId: headerData.carousel.selectedAuctId,
                            sizeWidth: headerData.carousel.size.width,
                            sizeHeight: headerData.carousel.size.height,
                            itemsToShow: headerData.carousel.itemsToShow,
                            speed: headerData.carousel.speed,
                            positionTop: headerData.carousel.position.top,
                            positionLeft: headerData.carousel.position.left,
                            showTitle: headerData.carousel.showTitle,
                            showPrice: headerData.carousel.showPrice,
                            showCarouselTitle: headerData.carousel.showCarouselTitle,
                            showNavigation: headerData.carousel.showNavigation
                        } : null
                    },
                    sections: sectionsData.sections.map(section => ({
                        type: section.type.toUpperCase(),
                        color: section.color,
                        sizeType: section.sizeType.toUpperCase(),
                        config: {
                            ...section.config,
                            fontSize: section.config.fontSize ? `${section.config.fontSize}px` : '16px'
                        }
                    })),
                    footer: {
                        color: footerData.color,
                        sizeType: footerData.size.toUpperCase(),
                        companyName: footerData.companyName,
                        showSocialLinks: footerData.showSocialLinks,
                        textColor: footerData.textColor,
                        borderColor: footerData.borderColor,
                        elementsOpacity: footerData.elementsOpacity / 100,
                        sections: footerData.sections.map(section => ({
                            title: section.title,
                            links: section.links.map(link => ({
                                name: link.name,
                                url: link.url
                            }))
                        })),
                        socialMedia: footerData.socialMedia.map(social => ({
                            type: social.type,
                            url: social.url
                        }))
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setModalConfig(prev => ({
                ...prev,
                success: {
                    isOpen: true,
                    message: "Template criado com sucesso! Seu site está pronto para ser visualizado."
                }
            }));
        } catch (error) {
            console.error("Erro ao criar template:", error.message);
            setModalConfig(prev => ({
                ...prev,
                error: {
                    isOpen: true,
                    message: "Erro ao criar template. Por favor, tente novamente."
                }
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTemplate = async () => {
        setIsLoading(true);
        try {
            const advertiserSession = localStorage.getItem('advertiser-session-aukt');
            if (!advertiserSession) {
                throw new Error('Sessão do anunciante não encontrada');
            }

            const { token } = JSON.parse(advertiserSession);
            if (!token) {
                throw new Error('Token não encontrado');
            }

            await axios.patch(
                `${import.meta.env.VITE_APP_BACKEND_API}/template/update-template?templateId=${headerData.id}`,
                {
                    id: headerData.id,
                    colorPalette: headerData.colorPalette.toUpperCase(),
                    fontStyle: headerData.fontStyle,
                    header: {
                        color: headerData.color,
                        sizeType: headerData.sizeType.toUpperCase(),
                        model: headerData.model,
                        backgroundImage: headerData.background.image || null,
                        backgroundImageOpacity: headerData.background.opacity / 100,
                        backgroundImageBlur: headerData.background.blur,
                        backgroundImageBrightness: headerData.background.brightness / 100,
                        elementsOpacity: headerData.elementsOpacity / 100,
                        texts: headerData.texts.map(text => ({
                            title: text.title,
                            content: text.content,
                            positionTop: text.position.top,
                            positionLeft: text.position.left,
                            positionWidth: text.position.width,
                            titleBackground: text.style.titleBackground,
                            titleColor: text.style.titleColor,
                            contentColor: text.style.contentColor,
                            titleSize: `${text.style.titleSize}px`,
                            titleBorderRadius: text.style.titleBorderRadius,
                            visible: text.visible
                        })),
                        carousel: headerData.carousel.enabled ? {
                            enabled: headerData.carousel.enabled,
                            title: headerData.carousel.title,
                            selectedAuctId: headerData.carousel.selectedAuctId || null,
                            sizeWidth: headerData.carousel.size.width,
                            sizeHeight: headerData.carousel.size.height,
                            itemsToShow: headerData.carousel.itemsToShow,
                            speed: headerData.carousel.speed,
                            positionTop: headerData.carousel.position.top,
                            positionLeft: headerData.carousel.position.left,
                            showTitle: headerData.carousel.showTitle,
                            showPrice: headerData.carousel.showPrice,
                            showCarouselTitle: headerData.carousel.showCarouselTitle,
                            showNavigation: headerData.carousel.showNavigation
                        } : undefined
                    },
                    sections: sectionsData.sections.map(section => ({
                        type: section.type.toUpperCase(),
                        color: section.color,
                        sizeType: section.sizeType.toUpperCase(),
                        config: {
                            ...section.config,
                            fontSize: section.config.fontSize ? `${section.config.fontSize}px` : '16px',
                            layout: section.config.layout?.toUpperCase(),
                            alignment: section.config.alignment?.toUpperCase(),
                            destination: section.config.destination?.toUpperCase()
                        }
                    })),
                    footer: {
                        color: footerData.color,
                        sizeType: ['SMALL', 'MEDIUM', 'LARGE'].includes(footerData.size) 
                            ? footerData.size 
                            : 'MEDIUM',
                        companyName: footerData.companyName,
                        showSocialLinks: footerData.showSocialLinks,
                        textColor: footerData.textColor,
                        borderColor: footerData.borderColor,
                        elementsOpacity: footerData.elementsOpacity / 100,
                        sections: footerData.sections.map(section => ({
                            title: section.title,
                            links: section.links.map(link => ({
                                name: link.name,
                                url: link.url
                            }))
                        })),
                        socialMedia: footerData.socialMedia.map(social => ({
                            type: social.type,
                            url: social.url
                        }))
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setModalConfig(prev => ({
                ...prev,
                success: {
                    isOpen: true,
                    message: "Template atualizado com sucesso! As alterações já estão disponíveis."
                }
            }));
        } catch (error) {
            console.error("Erro ao atualizar template:", error.message);
            setModalConfig(prev => ({
                ...prev,
                error: {
                    isOpen: true,
                    message: "Erro ao atualizar template. Por favor, tente novamente."
                }
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <aside className="w-full h-screen bg-gray-100 relative">
                <div className="h-full overflow-y-auto pb-32 p-4">
                    <h2 className="text-xl font-bold mb-4">AUK CONSTRUCTOR</h2>

                    <InitialConfigControls />

                    {isInitialConfigComplete && (
                        <>
                            <HeaderControls />
                            <SectionsControls />
                            <FooterControls />
                        </>
                    )}
                </div>

                {/* Botões fixos na parte inferior */}
                {isInitialConfigComplete && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-100 border-t border-gray-200 space-y-2">
                        <button
                            onClick={() => dispatch(addSection('text'))}
                            disabled={sectionsData.sections.length >= 3}
                            className={`w-full flex items-center justify-center px-4 py-3 
                                text-gray-700 font-medium rounded-lg transition-all
                                ${sectionsData.sections.length >= 3
                                    ? 'bg-gray-100 cursor-not-allowed opacity-50'
                                    : 'bg-[#effdff] hover:bg-[#effdff]/80'}`}
                        >
                            <Add className="h-5 w-5 mr-2" />
                            Adicionar Seção {sectionsData.sections.length}/3
                        </button>

                        {/* Botão Publicar/Atualizar */}
                        <button
                            onClick={isUpdate ? handleUpdateTemplate : handleCreateTemplate}
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center px-4 py-3 
                                text-white font-medium rounded-lg transition-all
                                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#012038] hover:bg-[#012038]/90'}`}
                        >
                            {isLoading ? (
                                "Processando..."
                            ) : (
                                <>
                                    <Rocket className="h-5 w-5 mr-2" />
                                    {isUpdate ? 'Atualizar Site' : 'Publicar Site'}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </aside>

            <SuccessModal 
                isOpen={modalConfig.success.isOpen}
                message={modalConfig.success.message}
                onClose={() => setModalConfig(prev => ({
                    ...prev,
                    success: { isOpen: false, message: '' }
                }))}
            />

            <ErrorModal 
                isOpen={modalConfig.error.isOpen}
                message={modalConfig.error.message}
                onClose={() => setModalConfig(prev => ({
                    ...prev,
                    error: { isOpen: false, message: '' }
                }))}
            />
        </>
    );
}

export default TemplateControls;
