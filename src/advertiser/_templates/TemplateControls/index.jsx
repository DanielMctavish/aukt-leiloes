/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InitialConfigControls from './InitialConfigControls';
import HeaderControls from './HeaderControls';
import FooterControls from './FooterControls';
import SectionsControls from './SectionsControls';
import { Add, Rocket } from '@mui/icons-material';

function TemplateControls({
    template,
    updateHeader,
    updateFooter,
    updateSection,
    addSection,
    removeSection,
    updateInitialConfig,
    selectedHeaderModel,
    setSelectedHeaderModel,
    selectedPalette
}) {
    const [existingTemplate, setExistingTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { advertiser_id } = useParams();
    const isInitialConfigComplete = template.colorPalette && template.fontStyle;

    useEffect(() => {
        const checkExistingTemplate = async () => {
            try {
                const advertiserSession = localStorage.getItem('advertiser-session-aukt');
                if (!advertiserSession) {
                    console.error('Sessão do anunciante não encontrada');
                    return;
                }

                const { token } = JSON.parse(advertiserSession);
                if (!token) {
                    console.error('Token não encontrado');
                    return;
                }

                console.log('Fazendo requisição com:', {
                    advertiserId: advertiser_id,
                    token: token.substring(0, 10) + '...' // Log parcial do token por segurança
                });

                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/template/find`,
                    {
                        params: { advertiserId: advertiser_id },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                console.log('Resposta do servidor:', response.data);
                
                const firstTemplate = response.data[0];
                console.log("Template encontrado:", firstTemplate);
                
                if (firstTemplate) {
                    setExistingTemplate(firstTemplate);
                    
                    // Mapeando os dados do backend para o formato do frontend
                    updateInitialConfig('colorPalette', firstTemplate.colorPalette.toLowerCase());
                    updateInitialConfig('fontStyle', firstTemplate.fontStyle.toLowerCase());
                    
                    // Header
                    const header = firstTemplate.header;
                    updateHeader('color', header.color);
                    updateHeader('sizeType', header.sizeType.toLowerCase());
                    updateHeader('backgroundImage', header.backgroundImage);
                    updateHeader('backgroundImageOpacity', header.backgroundImageOpacity * 100); // Convertendo de 0-1 para 0-100
                    updateHeader('backgroundImageBlur', header.backgroundImageBlur);
                    updateHeader('backgroundImageBrightness', header.backgroundImageBrightness * 100);
                    updateHeader('elementsOpacity', header.elementsOpacity * 100);

                    // Mapeando os textos do header
                    const mappedTexts = header.texts.map(text => ({
                        id: text.id,
                        title: text.title,
                        content: text.content,
                        position: {
                            top: text.positionTop,
                            left: text.positionLeft,
                            width: text.positionWidth
                        },
                        style: {
                            titleBackground: text.titleBackground,
                            titleColor: text.titleColor,
                            contentColor: text.contentColor,
                            titleSize: text.titleSize.replace('px', ''),
                            titleBorderRadius: text.titleBorderRadius
                        },
                        visible: text.visible
                    }));
                    updateHeader('texts', mappedTexts);

                    // Mapeando o carousel
                    if (header.carousel) {
                        const carousel = header.carousel;
                        updateHeader('carousel', {
                            enabled: carousel.enabled,
                            title: carousel.title,
                            selectedAuctId: carousel.selectedAuctId,
                            size: {
                                width: carousel.sizeWidth,
                                height: carousel.sizeHeight
                            },
                            itemsToShow: carousel.itemsToShow,
                            speed: carousel.speed,
                            position: {
                                top: carousel.positionTop,
                                left: carousel.positionLeft
                            },
                            showTitle: carousel.showTitle,
                            showPrice: carousel.showPrice,
                            showCarouselTitle: carousel.showCarouselTitle,
                            showNavigation: carousel.showNavigation
                        });
                    }

                    // Mapeando as seções
                    firstTemplate.sections.forEach((section, index) => {
                        updateSection(index, 'type', section.type.toLowerCase());
                        updateSection(index, 'color', section.color);
                        updateSection(index, 'sizeType', section.sizeType.toLowerCase());
                        updateSection(index, 'config', {
                            ...section.config,
                            fontSize: section.config.fontSize?.replace('px', '')
                        });
                    });

                    // Footer
                    const footer = firstTemplate.footer;
                    updateFooter('color', footer.color);
                    updateFooter('sizeType', footer.sizeType.toLowerCase());
                    updateFooter('companyName', footer.companyName);
                    updateFooter('showSocialLinks', footer.showSocialLinks);
                    updateFooter('textColor', footer.textColor);
                    updateFooter('borderColor', footer.borderColor);
                    updateFooter('elementsOpacity', footer.elementsOpacity * 100);

                    // Mapeando as seções do footer
                    const mappedFooterSections = {
                        about: {
                            title: "Sobre nós",
                            links: []
                        },
                        services: {
                            title: "Serviços",
                            links: []
                        },
                        contact: {
                            title: "Contato",
                            links: []
                        }
                    };

                    // Preenchendo com os dados do backend
                    footer.sections.forEach(section => {
                        const sectionKey = section.title.toLowerCase().replace(/\s+/g, '_');
                        mappedFooterSections[sectionKey] = {
                            title: section.title,
                            links: section.links.map(link => ({
                                label: link.label,
                                url: link.url
                            }))
                        };
                    });

                    updateFooter('sections', mappedFooterSections);

                    // Mapeando social links
                    if (footer.socialLinks) {
                        updateFooter('socialLinks', {
                            facebook: footer.socialLinks.facebook,
                            twitter: footer.socialLinks.twitter,
                            instagram: footer.socialLinks.instagram,
                            linkedin: footer.socialLinks.linkedin
                        });
                    }

                    // Extrair o número do modelo do enum (ex: MODEL_1 -> 1)
                    setSelectedHeaderModel(parseInt(header.model.replace('MODEL_', '')));
                } else {
                    console.log('Nenhum template encontrado para este anunciante');
                }
            } catch (error) {
                console.error("Erro detalhado:", {
                    message: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                });

                // Se houver dados específicos do erro do servidor
                if (error.response?.data) {
                    console.error("Erro do servidor:", error.response.data);
                }
            }
        };

        if (advertiser_id) {
            console.log('Iniciando busca de template para advertiser_id:', advertiser_id);
            checkExistingTemplate();
        }
    }, [advertiser_id]);

    const handleDeploy = async () => {
        setIsLoading(true);
        try {
            // Pegando o token do localStorage
            const advertiserSession = localStorage.getItem('advertiser-session-aukt');
            if (!advertiserSession) {
                throw new Error('Sessão do anunciante não encontrada');
            }

            const { token } = JSON.parse(advertiserSession);
            if (!token) {
                throw new Error('Token não encontrado');
            }

            // Configuração do header com o token
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: existingTemplate ? {
                    template_id: existingTemplate.id,
                    advertiserId: advertiser_id
                } : undefined
            };

            // Formatando os dados do template para o formato esperado pelo backend
            const formattedTemplate = {
                colorPalette: template.colorPalette.toUpperCase(),
                fontStyle: template.fontStyle,
                header: {
                    color: template.header.color || '#FFFFFF',
                    sizeType: (template.header.sizeType || 'MEDIUM').toUpperCase(),
                    model: `MODEL_${selectedHeaderModel}`,
                    backgroundImage: template.header.backgroundImage || null,
                    backgroundImageOpacity: (template.header.backgroundImageOpacity || 30) / 100,
                    backgroundImageBlur: template.header.backgroundImageBlur || 2,
                    backgroundImageBrightness: (template.header.backgroundImageBrightness || 100) / 100,
                    elementsOpacity: (template.header.elementsOpacity || 100) / 100,
                    texts: (template.header.texts || []).map(text => ({
                        title: text.title || '',
                        content: text.content || '',
                        positionTop: text.position?.top || '50%',
                        positionLeft: text.position?.left || '50%',
                        positionWidth: text.position?.width || '30%',
                        titleBackground: text.style?.titleBackground || 'transparent',
                        titleColor: text.style?.titleColor || '#FFFFFF',
                        contentColor: text.style?.contentColor || '#FFFFFF',
                        titleSize: `${text.style?.titleSize || '24'}px`,
                        titleBorderRadius: text.style?.titleBorderRadius || '0px',
                        visible: text.visible !== false
                    })),
                    carousel: template.header.carousel ? {
                        enabled: template.header.carousel.enabled || false,
                        title: template.header.carousel.title || 'Produtos em Destaque',
                        selectedAuctId: template.header.carousel.selectedAuctId || null,
                        sizeWidth: template.header.carousel.size?.width || '600px',
                        sizeHeight: template.header.carousel.size?.height || '400px',
                        itemsToShow: template.header.carousel.itemsToShow || 4,
                        speed: template.header.carousel.speed || 3000,
                        positionTop: template.header.carousel.position?.top || '60%',
                        positionLeft: template.header.carousel.position?.left || '10%',
                        showTitle: template.header.carousel.showTitle !== false,
                        showPrice: template.header.carousel.showPrice !== false,
                        showCarouselTitle: template.header.carousel.showCarouselTitle !== false,
                        showNavigation: template.header.carousel.showNavigation !== false
                    } : null
                },
                sections: template.sections.map(section => ({
                    type: section.type.toUpperCase(),
                    color: section.color || '#FFFFFF',
                    sizeType: (section.sizeType || 'MEDIUM').toUpperCase(),
                    config: {
                        ...section.config,
                        fontSize: section.config.fontSize ? `${section.config.fontSize}px` : '16px'
                    }
                })),
                footer: {
                    color: template.footer.color || '#333333',
                    sizeType: (template.footer.sizeType || 'MEDIUM').toUpperCase(),
                    companyName: template.footer.companyName || 'Empresa',
                    showSocialLinks: template.footer.showSocialLinks !== false,
                    textColor: template.footer.textColor || '#FFFFFF',
                    borderColor: template.footer.borderColor || '#444444',
                    elementsOpacity: (template.footer.elementsOpacity || 100) / 100,
                    sections: Object.values(template.footer.sections || {}).map(section => ({
                        title: section.title || '',
                        links: (section.links || []).map(link => ({
                            label: link.label || '',
                            url: link.url || '#'
                        }))
                    })),
                    socialLinks: {
                        facebook: template.footer.socialLinks?.facebook || '',
                        twitter: template.footer.socialLinks?.twitter || '',
                        instagram: template.footer.socialLinks?.instagram || '',
                        linkedin: template.footer.socialLinks?.linkedin || ''
                    }
                }
            };

            if (existingTemplate) {
                // Atualizar template existente
                await axios.patch(
                    `${import.meta.env.VITE_APP_BACKEND_API}/template/update-template`,
                    formattedTemplate,
                    config
                );
                alert("Template atualizado com sucesso!");
            } else {
                // Criar novo template
                await axios.post(
                    `${import.meta.env.VITE_APP_BACKEND_API}/template/create-template`, 
                    {
                        ...formattedTemplate,
                        advertiserId: advertiser_id
                    },
                    config
                );
                alert("Template criado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao fazer deploy do template:", error);
            
            // Mensagens de erro mais específicas
            if (error.message === 'Sessão do anunciante não encontrada') {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
            } else if (error.message === 'Token não encontrado') {
                alert("Erro de autenticação. Por favor, faça login novamente.");
            } else if (error.response?.status === 401) {
                alert("Sem autorização. Por favor, faça login novamente.");
            } else if (error.response?.status === 403) {
                alert("Você não tem permissão para realizar esta ação.");
            } else {
                alert("Erro ao fazer deploy do template. Por favor, tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <aside className="w-full h-screen bg-gray-100 relative">
            {/* Conteúdo principal com padding-bottom para não sobrepor os botões fixos */}
            <div className="h-full overflow-y-auto pb-32 p-4"> {/* Aumentado o padding-bottom para acomodar os dois botões */}
                <h2 className="text-xl font-bold mb-4">AUK CONSTRUCTOR</h2>

                <InitialConfigControls
                    template={template}
                    updateInitialConfig={updateInitialConfig}
                />

                {isInitialConfigComplete && (
                    <>
                        <HeaderControls
                            template={template}
                            updateHeader={updateHeader}
                            selectedHeaderModel={selectedHeaderModel}
                            setSelectedHeaderModel={setSelectedHeaderModel}
                            selectedPalette={selectedPalette}
                        />

                        <SectionsControls
                            template={template}
                            updateSection={updateSection}
                            removeSection={removeSection}
                            selectedPalette={selectedPalette}
                        />

                        <FooterControls
                            template={template}
                            updateFooter={updateFooter}
                            selectedPalette={selectedPalette}
                        />
                    </>
                )}
            </div>

            {/* Botões fixos na parte inferior */}
            {isInitialConfigComplete && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-100 border-t border-gray-200 space-y-2">
                    {/* Botão Adicionar Seção */}
                    <button
                        onClick={() => addSection('section')}
                        disabled={template.sections.length >= 3}
                        className={`w-full flex items-center justify-center px-4 py-3 
                            text-gray-700 font-medium rounded-lg transition-all
                            ${template.sections.length >= 3 
                                ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                                : 'bg-[#effdff] hover:bg-[#effdff]/80'}`}
                    >
                        <Add className="h-5 w-5 mr-2" />
                        Adicionar Seção {template.sections.length}/3
                    </button>

                    {/* Botão Publicar/Atualizar */}
                    <button
                        onClick={handleDeploy}
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
                                {existingTemplate ? 'Atualizar Site' : 'Publicar Site'}
                            </>
                        )}
                    </button>
                </div>
            )}
        </aside>
    );
}

export default TemplateControls;
