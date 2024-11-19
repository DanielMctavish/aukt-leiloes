/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { templateModels, candyColors, sizeTypes, cleanColors, darkColors, monochromaticColors } from "./templateData/templateModels";
import AdvertiserTemplateControls from './AdvertiserTemplateControls';
import HeaderTemplate from './header/HeaderTemplate';
import FooterTemplate from './footer/FooterTemplate';
import WelcomeScreen from './welcome_template/WelcomeScreen';
import TemplateSections from './sections/TemplateSections';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdvertiserTemplate() {
    const [template, setTemplate] = useState(templateModels);
    const [selectedHeaderModel, setSelectedHeaderModel] = useState(1);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [asideWidth, setAsideWidth] = useState(20);
    const [isResizing, setIsResizing] = useState(false);
    const [advertiser, setAdvertiser] = useState(null);
    const asideRef = useRef(null);
    const { advertiser_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentAdvertiser();
    }, []);

    const getCurrentAdvertiser = async () => {
        try {
            // Verificar se existe sessão
            const advertiserSession = localStorage.getItem('advertiser-session-aukt');
            if (!advertiserSession) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }

            // Verificar se o token existe
            const { token } = JSON.parse(advertiserSession);
            if (!token) {
               
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }

            // Fazer a requisição com o token
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-advertiser`, 
                {
                    params: { advertiserId: advertiser_id },
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (!response.data) {
                
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }

            setAdvertiser(response.data);

        } catch (error) {
            localStorage.removeItem('advertiser-session-aukt');
            navigate("/");
        }
    };

    useEffect(() => {
        if (!showWelcomeScreen) {
            setTimeout(() => setFadeIn(true), 100);
        }
    }, [showWelcomeScreen]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;

            const newWidth = (e.clientX / window.innerWidth) * 100;
            // Limitar a largura entre 20% e 50%
            if (newWidth >= 20 && newWidth <= 50) {
                setAsideWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [isResizing]);

    const getSizeClass = (sizeType) => {
        switch (sizeType) {
            case 'small': return 'min-h-[25vh]';
            case 'medium': return 'min-h-[50vh]';
            case 'full': return 'min-h-[100vh]';
            default: return 'min-h-[50vh]'; // Padrão médio
        }
    };

    const getTextColor = () => {
        return template.colorPalette === 'dark' ? 'text-white' : 'text-black';
    };

    const updateHeader = (property, value) => {
        setTemplate(prevTemplate => ({
            ...prevTemplate,
            header: {
                ...prevTemplate.header,
                [property]: value,
                // Se a propriedade for 'texts', atualize também os textos do modelo atual
                ...(property === 'texts' && { texts: value })
            }
        }));
    };

    const updateFooter = (property, value) => {
        setTemplate(prevTemplate => ({
            ...prevTemplate,
            footer: { ...prevTemplate.footer, [property]: value }
        }));
    };

    const updateSection = (index, property, value) => {
        setTemplate(prevTemplate => {
            const newSections = [...prevTemplate.sections];
            newSections[index] = { ...newSections[index], [property]: value };
            return { ...prevTemplate, sections: newSections };
        });
    };

    const addSection = (type) => {
        if (template.sections.length < 3) {
            const colorPalette = {
                clean: cleanColors,
                candy: candyColors,
                dark: darkColors,
                monochromatic: monochromaticColors
            }[template.colorPalette] || cleanColors;

            setTemplate(prevTemplate => ({
                ...prevTemplate,
                sections: [...prevTemplate.sections, {
                    type,
                    color: colorPalette[Math.floor(Math.random() * 7) + 1],
                    sizeType: sizeTypes.half
                }]
            }));
        }
    };

    const removeSection = (index) => {
        setTemplate(prevTemplate => ({
            ...prevTemplate,
            sections: prevTemplate.sections.filter((_, i) => i !== index)
        }));
    };

    const updateInitialConfig = (property, value) => {
        setTemplate(prevTemplate => {
            const newTemplate = { ...prevTemplate, [property]: value };

            // Atualizar cores apenas se a paleta de cores for alterada
            if (property === 'colorPalette') {
                const colorPalette = {
                    clean: cleanColors,
                    candy: candyColors,
                    dark: darkColors,
                    monochromatic: monochromaticColors
                }[value] || cleanColors;

                newTemplate.header.color = colorPalette[1];
                newTemplate.footer.color = colorPalette[4];
                newTemplate.sections = newTemplate.sections.map(section => ({
                    ...section,
                    color: colorPalette[Math.floor(Math.random() * 7) + 1]
                }));
            }

            return newTemplate;
        });
    };

    const textColorClass = getTextColor();

    if (showWelcomeScreen) {
        return <WelcomeScreen onContinue={() => setShowWelcomeScreen(false)} />;
    }

    return (
        <div className={`flex w-full h-screen bg-white overflow-hidden transition-opacity duration-1000 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Informações do Anunciante */}
            {advertiser ? (
                <div
                onClick={()=>navigate(`/advertiser/dashboard`)}
                 className="absolute top-4 right-[3vh] z-50 bg-white/90 cursor-pointer
                backdrop-blur-sm p-1 rounded-lg shadow-lg opacity-30 hover:opacity-100">
                    <div className="flex items-center gap-4">
                        {advertiser.url_profile_company_logo_cover ? (
                            <img
                                src={advertiser.url_profile_company_logo_cover}
                                alt="Logo"
                                className="w-[40px] h-[40px] rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-[#012038] text-white flex items-center justify-center text-xl font-bold">
                                {advertiser.name[0]}
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-[14px] text-[#012038]">{advertiser.company_name}</h3>
                            <p className="text-[12px] text-gray-600">{advertiser.email}</p>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Aside com controles */}
            <div
                ref={asideRef}
                style={{ width: `${asideWidth}%`, minWidth: '300px', maxWidth: '600px' }}
                className="relative h-screen"
            >
                <div className="h-full overflow-y-auto">
                    <AdvertiserTemplateControls
                        template={template}
                        updateHeader={updateHeader}
                        updateFooter={updateFooter}
                        updateSection={updateSection}
                        addSection={addSection}
                        removeSection={removeSection}
                        updateInitialConfig={updateInitialConfig}
                        selectedHeaderModel={selectedHeaderModel}
                        setSelectedHeaderModel={setSelectedHeaderModel}
                    />
                </div>

                {/* Borda arrastável */}
                <div
                    className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-[#012038]/20 transition-colors"
                    onMouseDown={() => setIsResizing(true)}
                />
            </div>

            {/* Área principal */}
            <div
                className={`h-screen bg-gray-800 p-1 overflow-y-auto flex flex-col ${textColorClass}`}
                style={{
                    width: `calc(100% - ${asideWidth}%)`,
                    minWidth: '50%',
                    fontFamily: template.fontStyle
                }}
            >
                <HeaderTemplate
                    getSizeClass={getSizeClass}
                    template={template}
                    selectedHeaderModel={selectedHeaderModel}
                    updateHeader={updateHeader}
                />

                <TemplateSections
                    template={template}
                    textColorClass={textColorClass}
                    getSizeClass={getSizeClass}
                    fadeIn={fadeIn}
                />

                <FooterTemplate
                    getSizeClass={getSizeClass}
                    template={template}
                    textColorClass={textColorClass}
                />
            </div>

            {/* Overlay */}
            {isResizing && (
                <div className="fixed inset-0 bg-transparent z-50" />
            )}
        </div>
    );
}

export default AdvertiserTemplate;
