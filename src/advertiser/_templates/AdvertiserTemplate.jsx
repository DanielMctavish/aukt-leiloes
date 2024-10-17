/* eslint-disable react/prop-types */
import { useState } from 'react';
import { templateModels, candyColors, sizeTypes, cleanColors, darkColors, monochromaticColors } from "./templateData/templateModels";
import AdvertiserTemplateControls from './AdvertiserTemplateControls';

// construtor de site do anunciante
function AdvertiserTemplate() {
    const [template, setTemplate] = useState(templateModels);

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
            header: { ...prevTemplate.header, [property]: value }
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

    return (
        <div className="flex w-full h-screen bg-white overflow-hidden">
            <AdvertiserTemplateControls
                template={template}
                updateHeader={updateHeader}
                updateFooter={updateFooter}
                updateSection={updateSection}
                addSection={addSection}
                removeSection={removeSection}
                updateInitialConfig={updateInitialConfig}
            />

            {/* ÁREA DE SESSÕES */}
            <div className={`w-4/5 h-screen bg-gray-800 p-1 overflow-y-auto flex flex-col ${textColorClass}`} style={{ fontFamily: template.fontStyle }}>
                <header
                    className={`w-full ${getSizeClass(template.header.sizeType)}`}
                    style={{ backgroundColor: template.header.color }}
                >
                    <h2 className={`text-2xl font-bold p-4 ${textColorClass}`}>Header</h2>
                </header>

                {template.sections.map((section, index) => (
                    <section
                        key={index}
                        className={`w-full ${getSizeClass(section.sizeType)}`}
                        style={{ backgroundColor: section.color }}
                    >
                        <h2 className={`text-2xl font-bold p-4 ${textColorClass}`}>
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </h2>
                    </section>
                ))}

                <footer
                    className={`w-full ${getSizeClass(template.footer.sizeType)}`}
                    style={{ backgroundColor: template.footer.color }}
                >
                    <h2 className={`text-2xl font-bold p-4 ${textColorClass}`}>Footer</h2>
                </footer>
            </div>
        </div>
    )
}

export default AdvertiserTemplate;
