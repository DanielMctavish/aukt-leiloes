/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { constructorModels } from '../templateData/templateModels';
import axios from 'axios';
import HeaderCarousel from './HeaderCarousel';

function HeaderTemplate({ getSizeClass, template, selectedHeaderModel, updateHeader }) {
    const [, setAdvertiser] = useState(null);
    const { advertiser_id } = useParams();
    const [editingText, setEditingText] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedText, setDraggedText] = useState(null);
    const headerRef = useRef(null);
    const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);

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

        // Retorna apenas a cor, sem a opacidade
        return {
            backgroundColor: adjustColor(
                template.header.color,
                saturation,
                lightness
            )
        };
    };

    // Nova função para aplicar opacidade aos elementos decorativos
    const getDecorativeElementStyle = (elementId) => {
        const baseStyle = getElementStyle(elementId);
        const opacity = (template.header.elementsOpacity || 100) / 100;
        
        return {
            ...baseStyle,
            opacity,
            borderColor: baseStyle.backgroundColor, // Para elementos com borda
            backgroundColor: baseStyle.backgroundColor // Para elementos sólidos
        };
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


    const getPositionStyle = (position) => {
        return {
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: position.width
        };
    };

    const handleTextDoubleClick = (text) => {
        setEditingText(text);
    };

    const handleTextChange = (e, text) => {
        const { name, value } = e.target;

        // Limpa o timeout anterior se existir
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Cria um novo timeout
        const newTimeout = setTimeout(() => {
            const updatedTexts = template.header.texts.map(t => 
                t.id === text.id ? { ...t, [name]: value } : t
            );
            updateHeader('texts', updatedTexts);
        }, 300); // 300ms de delay

        setTypingTimeout(newTimeout);
    };

    const getTitleSize = (size) => {
        switch(size) {
            case '2x': return 'text-[80px]';
            case '3x': return 'text-[100px]';
            default: return 'text-[60px]';
        }
    };

    const handleMouseDown = (e, text) => {
        if (editingText) return;
        setIsDragging(true);
        setDraggedText(text);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !draggedText || !headerRef.current) return;

        const headerRect = headerRef.current.getBoundingClientRect();
        const x = e.clientX - headerRect.left;
        const y = e.clientY - headerRect.top;

        // Calcula a nova posição em porcentagem
        const newLeft = `${(x / headerRect.width) * 100}%`;
        const newTop = `${(y / headerRect.height) * 100}%`;

        // Atualiza a posição do texto
        const updatedTexts = template.header.texts.map(text => 
            text.id === draggedText.id 
                ? { 
                    ...text, 
                    position: { 
                        ...text.position, 
                        left: newLeft,
                        top: newTop
                    } 
                } 
                : text
        );

        updateHeader('texts', updatedTexts);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedText(null);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, draggedText]);

    const handleCarouselMouseDown = (e) => {
        if (!template.header.carousel?.enabled) return;

        setIsDraggingCarousel(true);
        const headerRect = headerRef.current.getBoundingClientRect();
        const x = e.clientX - headerRect.left;
        const y = e.clientY - headerRect.top;

        // Calcula a nova posição em porcentagem
        const newLeft = `${(x / headerRect.width) * 100}%`;
        const newTop = `${(y / headerRect.height) * 100}%`;

        const updatedCarousel = {
            ...template.header.carousel,
            position: {
                ...template.header.carousel.position,
                left: newLeft,
                top: newTop
            }
        };

        updateHeader('carousel', updatedCarousel);
    };

    const handleCarouselMouseMove = (e) => {
        if (!isDraggingCarousel || !headerRef.current) return;

        const headerRect = headerRef.current.getBoundingClientRect();
        const x = e.clientX - headerRect.left;
        const y = e.clientY - headerRect.top;

        // Calcula a nova posição em porcentagem
        const newLeft = `${(x / headerRect.width) * 100}%`;
        const newTop = `${(y / headerRect.height) * 100}%`;

        const updatedCarousel = {
            ...template.header.carousel,
            position: {
                ...template.header.carousel.position,
                left: newLeft,
                top: newTop
            }
        };

        updateHeader('carousel', updatedCarousel);
    };

    const handleCarouselMouseUp = () => {
        setIsDraggingCarousel(false);
    };

    useEffect(() => {
        if (isDraggingCarousel) {
            document.addEventListener('mousemove', handleCarouselMouseMove);
            document.addEventListener('mouseup', handleCarouselMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleCarouselMouseMove);
            document.removeEventListener('mouseup', handleCarouselMouseUp);
        };
    }, [isDraggingCarousel]);

    const renderText = (text) => {
        if (editingText?.id === text.id) {
            return (
                <div className="relative">
                    <input
                        type="text"
                        name="title"
                        defaultValue={text.title}
                        className="text-[60px] font-bold w-full bg-transparent border-b border-white"
                        onChange={(e) => handleTextChange(e, text)}
                        autoFocus
                    />
                    <textarea
                        name="content"
                        defaultValue={text.content}
                        className="w-full bg-transparent border-b border-white mt-2"
                        onChange={(e) => handleTextChange(e, text)}
                    />
                    <button
                        onClick={() => setEditingText(null)}
                        className="absolute top-0 right-0 text-white bg-[#131313] px-2 py-1 rounded text-sm"
                    >
                        confirmar
                    </button>
                </div>
            );
        }

        return (
            <div 
                className={`cursor-move ${isDragging && draggedText?.id === text.id ? 'opacity-70' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, text)}
            >
                <h1 
                    className={`${getTitleSize(text.style?.titleSize)} font-bold select-none`}
                    style={{
                        backgroundColor: text.style?.titleBackground || 'transparent',
                        color: text.style?.titleColor || 'white',
                        padding: text.style?.titleBackground !== 'transparent' ? '0.5rem' : '0',
                        borderRadius: text.style?.titleBorderRadius || '0px'
                    }}
                    onDoubleClick={() => handleTextDoubleClick(text)}
                >
                    {text.title}
                </h1>
                <p 
                    className="select-none"
                    style={{ color: text.style?.contentColor || 'white' }}
                    onDoubleClick={() => handleTextDoubleClick(text)}
                >
                    {text.content}
                </p>
            </div>
        );
    };

    const renderCarousel = () => {
        if (template.header.carousel?.enabled) {
            return (
                <div 
                    className="cursor-move"
                    onMouseDown={handleCarouselMouseDown}
                >
                    <HeaderCarousel
                        advertiser_id={advertiser_id}
                        config={template.header.carousel}
                    />
                </div>
            );
        }
        return null;
    };

    switch (selectedHeaderModel) {
        case 1:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full flex relative overflow-hidden ${getSizeClass(template.header.sizeType)}`}
                    style={getHeaderStyle()}>
                    {/* Elementos decorativos */}
                    <div className="absolute inset-0 z-10">
                        <div name="element_3" className="w-[110px] h-full absolute right-[48%]" 
                            style={getDecorativeElementStyle("element_3")}></div>
                        <div name="element_4" className="w-[110px] h-full absolute right-[40%]" 
                            style={getDecorativeElementStyle("element_4")}></div>
                        <div name="element_2" className="w-[120px] h-[60vh] absolute left-[34vh] bottom-[-10vh] origin-bottom-left 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_2")}></div>
                        <div name="element_1" className="w-[100px] h-[60vh] absolute left-[34vh] bottom-[-28vh] origin-bottom-left 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_1")}></div>
                        <div name="element_5" className="w-[120px] h-[60vh] absolute right-[34vh] top-[-13vh] origin-top-right 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_5")}></div>
                        <div name="element_6" className="w-[100px] h-[60vh] absolute right-[34vh] top-[-28vh] origin-top-right 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_6")}></div>
                    </div>


                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );
        case 2:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden flex justify-center items-center`}
                    style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        <div className="w-[260px] h-[260px] rounded-full absolute right-[20vh] bottom-[-4vh]" style={getDecorativeElementStyle("element_1")}></div>
                        <div className="w-[300px] h-[300px] rounded-full absolute right-[-4vh] bottom-[-4vh]" style={getDecorativeElementStyle("element_2")}></div>
                        <div className="w-[260px] h-[260px] rounded-full absolute left-[17vh] bottom-[-4vh]" style={getDecorativeElementStyle("element_3")}></div>
                        <div className="w-[290px] h-[290px] rounded-full absolute left-[-4vh] bottom-[-4vh]" style={getDecorativeElementStyle("element_4")}></div>
                        <div className="w-[300px] h-[300px] rounded-full absolute left-[-100px] top-[-100px]" style={getDecorativeElementStyle("element_5")}></div>
                        <div className="w-[360px] h-[360px] rounded-full absolute right-[-7vh] top-[-10vh]" style={getDecorativeElementStyle("element_6")}></div>
                        <div className="w-[240px] h-[240px] rounded-full absolute right-[20vh] top-[-50px]" style={getDecorativeElementStyle("element_1")}></div>
                    </div>

                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );
        case 3:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`}
                    style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex w-full h-[5vh] mt-[2vh]">
                                {[...Array(12)].map((_, index) => (
                                    <div key={`top-${index}`} className="flex-1 mx-[0.5vh]" style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}></div>
                                ))}
                            </div>
                            <div className="flex w-full h-[5vh] mb-[2vh]">
                                {[...Array(12)].map((_, index) => (
                                    <div key={`bottom-${index}`} className="flex-1 mx-[0.5vh]" style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );
        case 4:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        <div className="absolute top-0 left-0 w-full h-1/2 transform -skew-y-6" style={getDecorativeElementStyle("element_1")}></div>
                        <div className="absolute bottom-0 right-0 w-full h-1/2 transform skew-y-6" style={getDecorativeElementStyle("element_2")}></div>
                        <div className="absolute top-4 left-4 flex space-x-2">
                            <div className="w-3 h-3 rounded-full" style={getDecorativeElementStyle("element_3")}></div>
                            <div className="w-3 h-3 rounded-full" style={getDecorativeElementStyle("element_4")}></div>
                            <div className="w-3 h-3 rounded-full" style={getDecorativeElementStyle("element_5")}></div>
                        </div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-4 rounded-full" style={{
                            borderColor: getElementStyle("element_6").backgroundColor,
                            opacity: 0.3
                        }}></div>
                    </div>

                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );
        case 5:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        {/* Círculo central */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-[300px] h-[300px] rounded-full" style={getDecorativeElementStyle("element_1")}></div>
                            <div className="absolute inset-0 w-[400px] h-[400px] rounded-full border-[20px] -translate-x-[50px] -translate-y-[50px]"
                                style={{ borderColor: getElementStyle("element_2").backgroundColor }}></div>
                        </div>
                        
                        {/* Círculos decorativos */}
                        <div className="absolute top-10 left-10 w-20 h-20 rounded-full" style={getDecorativeElementStyle("element_3")}></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full" style={getDecorativeElementStyle("element_4")}></div>
                        <div className="absolute top-20 right-20 w-12 h-12 rounded-full" style={getDecorativeElementStyle("element_5")}></div>
                        <div className="absolute bottom-20 left-20 w-14 h-14 rounded-full" style={getDecorativeElementStyle("element_6")}></div>
                    </div>

                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );

        case 6:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        {/* Grade principal com elementos conectados */}
                        <div className="absolute inset-0">
                            {/* Primeira linha */}
                            <div className="absolute top-0 left-0 right-0 flex gap-0 h-[33.33%]">
                                <div className="w-[40%] h-full border-[2px]" 
                                    style={getDecorativeElementStyle("element_1")}></div>
                                <div className="w-[25%] h-full border-[2px] border-l-0" 
                                    style={{ borderColor: getElementStyle("element_2").backgroundColor }}></div>
                                <div className="w-[35%] h-full border-[2px] border-l-0" 
                                    style={{ borderColor: getElementStyle("element_3").backgroundColor }}></div>
                            </div>

                            {/* Segunda linha */}
                            <div className="absolute top-[33.33%] left-0 right-0 flex gap-0 h-[33.33%]">
                                <div className="w-[30%] h-full border-[2px] border-t-0" 
                                    style={{ borderColor: getElementStyle("element_4").backgroundColor }}></div>
                                <div className="w-[45%] h-full border-[2px] border-l-0 border-t-0" 
                                    style={{ borderColor: getElementStyle("element_5").backgroundColor }}></div>
                                <div className="w-[25%] h-full border-[2px] border-l-0 border-t-0" 
                                    style={{ borderColor: getElementStyle("element_6").backgroundColor }}></div>
                            </div>

                            {/* Terceira linha */}
                            <div className="absolute bottom-0 left-0 right-0 flex gap-0 h-[33.33%]">
                                <div className="w-[50%] h-full border-[2px] border-t-0" 
                                    style={{ borderColor: getElementStyle("element_1").backgroundColor }}></div>
                                <div className="w-[20%] h-full border-[2px] border-l-0 border-t-0" 
                                    style={{ borderColor: getElementStyle("element_2").backgroundColor }}></div>
                                <div className="w-[30%] h-full border-[2px] border-l-0 border-t-0" 
                                    style={{ borderColor: getElementStyle("element_3").backgroundColor }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );

        case 7:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    <div className="absolute inset-0 z-10">
                        {/* Grade de tijolinhos */}
                        <div className="w-full h-full grid grid-cols-8 gap-1 p-2">
                            {[...Array(48)].map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full h-full border-[2px]"
                                    style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );

        case 8:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    {/* Sem elementos decorativos, apenas textos e background */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
                </header>
            );

        default:
            return (
                <header 
                    ref={headerRef}
                    className={`w-full ${getSizeClass(template.header.sizeType)} relative overflow-hidden`} style={getHeaderStyle()}>
                    {/* Caixas de texto */}
                    <section className='absolute inset-0 z-20'>
                        {template.header.texts?.map((text) => (
                            text.visible !== false && (
                                <div
                                    key={text.id}
                                    className='text-white'
                                    style={getPositionStyle(text.position)}
                                >
                                    {renderText(text)}
                                </div>
                            )
                        ))}
                    </section>

                    {renderCarousel()}

                    {template.header.backgroundImage && <div style={getBackgroundImageStyle()}></div>}
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
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default HeaderTemplate;
