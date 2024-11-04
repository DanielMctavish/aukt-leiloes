/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { templateModels, candyColors, sizeTypes, cleanColors, darkColors, monochromaticColors } from "./templateData/templateModels";
import AdvertiserTemplateControls from './AdvertiserTemplateControls';
import HeaderTemplate from './header/HeaderTemplate';
import FooterTemplate from './footer/FooterTemplate';
import WelcomeScreen from './welcome_template/WelcomeScreen';

// construtor de site do anunciante
function AdvertiserTemplate() {
    const [template, setTemplate] = useState(templateModels);
    const [selectedHeaderModel, setSelectedHeaderModel] = useState(1);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [asideWidth, setAsideWidth] = useState(20); // Largura inicial em porcentagem
    const [isResizing, setIsResizing] = useState(false);
    const asideRef = useRef(null);

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
            case 'full': return 'min-h-[100vh]';
            case 'half': return 'min-h-[50vh]';
            case 'third': return 'min-h-[33.33vh]';
            default: return 'min-h-[40vh]';
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
                    minWidth: '50%', // Garante um tamanho mínimo para a área principal
                    fontFamily: template.fontStyle 
                }}
            >
                <HeaderTemplate 
                    getSizeClass={getSizeClass}
                    template={template}
                    selectedHeaderModel={selectedHeaderModel}
                    updateHeader={updateHeader}
                />

                {template.sections.map((section, index) => (
                    <section
                        key={index}
                        className={`w-full ${getSizeClass(section.sizeType)} transition-all duration-1000 ease-in-out ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ 
                            backgroundColor: section.color,
                            transitionDelay: `${index * 200}ms`
                        }}
                    >
                        <h2 className={`text-2xl font-bold p-4 ${textColorClass}`}>
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </h2>
                    </section>
                ))}

                <FooterTemplate
                    getSizeClass={getSizeClass}
                    template={template}
                    textColorClass={textColorClass}
                />
            </div>

            {/* Overlay para evitar seleção de texto durante o redimensionamento */}
            {isResizing && (
                <div className="fixed inset-0 bg-transparent z-50" />
            )}
        </div>
    );
}

export default AdvertiserTemplate;
