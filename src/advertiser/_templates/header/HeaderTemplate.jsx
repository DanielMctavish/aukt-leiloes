/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { constructorModels } from '../templateData/templateModels';
import axios from 'axios';

function HeaderTemplate({ getSizeClass, template, selectedHeaderModel }) {
    const [advertiser, setAdvertiser] = useState(null);
    const { advertiser_id } = useParams();

    useEffect(() => {
        console.log("observando template -> ", template.colorPalette);
        console.log("constructorModels -> ", constructorModels.model_01.elements[0]);
        

        const fetchAdvertiserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find?adv_id=${advertiser_id}`);
                setAdvertiser(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do anunciante:", error);
            }
        };

        if (advertiser_id) {
            fetchAdvertiserData();
        }
    }, [advertiser_id, template]);

    const adjustColor = (color, saturation, lightness) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const hsl = rgbToHsl(r, g, b);
        hsl[1] = saturation / 100; // Ajusta a saturação
        hsl[2] = lightness / 100; // Ajusta o brilho

        const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    };

    const getElementStyle = (elementId) => {
        const model = constructorModels.model_01;
        const element = elementId ? model.elements.find(el => el.id === elementId) : model.background_element;
        const colorScheme = template.colorPalette;

        if (!element || !element[colorScheme]) {
            console.error(`Element or color scheme not found for elementId: ${elementId}, colorScheme: ${colorScheme}`);
            return { backgroundColor: template.header.color }; // Fallback para a cor padrão do header
        }

        const { saturation, lightness } = element[colorScheme];

        return {
            backgroundColor: adjustColor(
                template.header.color,
                saturation,
                lightness
            )
        };
    };

    const textStyle = {
        color: 'white',
        textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)'
    };

    const getHeaderStyle = () => {
        const baseStyle = getElementStyle();
        if (template.header.backgroundImage) {
            return {
                ...baseStyle,
                position: 'relative',
                overflow: 'hidden',
            };
        }
        return baseStyle;
    };

    const getBackgroundImageStyle = () => {
        if (template.header.backgroundImage) {
            return {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${template.header.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: (template.header.backgroundImageOpacity || 30) / 100,
                filter: `blur(${template.header.backgroundImageBlur || 2}px) brightness(${template.header.backgroundImageBrightness || 100}%)`,
            };
        }
        return {};
    };

    const renderHeaderContent = () => (
        <>
            <div className="flex flex-col justify-center items-start p-4 z-10 ml-[14vh] relative">
                <h2 className="text-[70px] font-bold" style={textStyle}>
                    {advertiser ? advertiser.name : "Nome do Anunciante"}
                </h2>
                <h3 className="text-[40px]" style={textStyle}>
                    {advertiser ? advertiser.company_name : "Nome da Empresa"}
                </h3>
            </div>
            {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
        </>
    );

    switch (selectedHeaderModel) {
        case 1:
            return (
                <header className={`w-full flex relative overflow-hidden ${getSizeClass(template.header.sizeType)}`}
                    style={getHeaderStyle()}>
                    {renderHeaderContent()}
                    <div name="element_3" className="w-[110px] h-full absolute right-[48%] z-10" style={getElementStyle("element_3")}></div>
                    <div name="element_4" className="w-[110px] h-full absolute right-[40%] z-10" style={getElementStyle("element_4")}></div>
                    <div name="element_2" className="w-[120px] h-[60vh] absolute left-[34vh] bottom-[-10vh] origin-bottom-left 
                    transform rotate-[-50deg] z-10" style={getElementStyle("element_2")}></div>
                    <div name="element_1" className="w-[100px] h-[60vh] absolute left-[34vh] bottom-[-28vh] origin-bottom-left 
                    transform rotate-[-50deg] z-10" style={getElementStyle("element_1")}></div>
                    <div name="element_5" className="w-[120px] h-[60vh] absolute right-[34vh] top-[-13vh] origin-top-right 
                    transform rotate-[-50deg] z-10" style={getElementStyle("element_5")}></div>
                    <div name="element_6" className="w-[100px] h-[60vh] absolute right-[34vh] top-[-28vh] origin-top-right 
                    transform rotate-[-50deg] z-10" style={getElementStyle("element_6")}></div>
                </header>
            );
        case 2:
            return (
                <header className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden flex justify-center items-center`}
                    style={getHeaderStyle()}>
                    {renderHeaderContent()}
                    <div className="absolute inset-0 z-10">
                        <div className="w-[260px] h-[260px] rounded-full absolute right-[20vh] bottom-[-4vh]" style={getElementStyle("element_1")}></div>
                        <div className="w-[300px] h-[300px] rounded-full absolute right-[-4vh] bottom-[-4vh]" style={getElementStyle("element_2")}></div>
                        <div className="w-[260px] h-[260px] rounded-full absolute left-[17vh] bottom-[-4vh]" style={getElementStyle("element_3")}></div>
                        <div className="w-[290px] h-[290px] rounded-full absolute left-[-4vh] bottom-[-4vh]" style={getElementStyle("element_4")}></div>
                        <div className="w-[300px] h-[300px] rounded-full absolute left-[-100px] top-[-100px]" style={getElementStyle("element_5")}></div>
                        <div className="w-[360px] h-[360px] rounded-full absolute right-[-7vh] top-[-10vh]" style={getElementStyle("element_6")}></div>
                        <div className="w-[240px] h-[240px] rounded-full absolute right-[20vh] top-[-50px]" style={getElementStyle("element_1")}></div>
                    </div>
                </header>
            );
        case 3:
            return (
                <header className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`}
                    style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex w-full h-[5vh] mt-[2vh]">
                                {[...Array(12)].map((_, index) => (
                                    <div key={`top-${index}`} className="flex-1 mx-[0.5vh]" style={getElementStyle(`element_${(index % 6) + 1}`)}></div>
                                ))}
                            </div>
                            <div className="flex w-full h-[5vh] mb-[2vh]">
                                {[...Array(12)].map((_, index) => (
                                    <div key={`bottom-${index}`} className="flex-1 mx-[0.5vh]" style={getElementStyle(`element_${(index % 6) + 1}`)}></div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[80%] h-[60%] border-[10px] border-white opacity-30"></div>
                        </div>
                    </div>
                    {renderHeaderContent()}
                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );
        case 4:
            return (
                <header className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        <div className="absolute top-0 left-0 w-full h-1/2 transform -skew-y-6" style={{...getElementStyle("element_1"), opacity: 0.2}}></div>
                        <div className="absolute bottom-0 right-0 w-full h-1/2 transform skew-y-6" style={{...getElementStyle("element_2"), opacity: 0.2}}></div>
                        <div className="absolute top-4 left-4 flex space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{...getElementStyle("element_3"), opacity: 0.7}}></div>
                            <div className="w-3 h-3 rounded-full" style={{...getElementStyle("element_4"), opacity: 0.7}}></div>
                            <div className="w-3 h-3 rounded-full" style={{...getElementStyle("element_5"), opacity: 0.7}}></div>
                        </div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-4 rounded-full" style={{
                            borderColor: getElementStyle("element_6").backgroundColor,
                            opacity: 0.3
                        }}></div>
                    </div>
                    {renderHeaderContent()}
                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );
        default:
            return (
                <header className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    {renderHeaderContent()}
                    <h2 className="text-2xl font-bold p-4 z-10 relative" style={textStyle}>
                        {advertiser ? advertiser.name : "Header default"}
                    </h2>
                </header>
            );
    }
}

// Funções auxiliares para conversão de cores
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // acromático
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // acromático
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default HeaderTemplate;
