/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import HeaderCarousel from './HeaderCarousel';
import HeaderBackground from './components/HeaderBackground';
import HeaderTexts from './components/HeaderTexts';
import HeaderDecorative from './components/HeaderDecorative';
import { rgbToHsl, hslToRgb } from './utils/colorUtils';
import { constructorModels } from '../templateData/templateModels';

function HeaderTemplate({ template, selectedHeaderModel, updateHeader }) {
    const [advertiser, setAdvertiser] = useState(null);
    const [header, setHeader] = useState(null);
    const { advertiser_id } = useParams();
    const [editingText, setEditingText] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedText, setDraggedText] = useState(null);
    const headerRef = useRef(null);
    const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);
    const [currentModel, setCurrentModel] = useState(null);

    useEffect(() => {
        const fetchAdvertiserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-advertiser?advertiserId=${advertiser_id}`);
                setAdvertiser(response.data);
                getSiteTemplate(response.data.id)
            } catch (error) {
                console.error("Erro ao buscar dados do anunciante:", error);
            }
        };

        if (advertiser_id) {
            fetchAdvertiserData();
        }
    }, [advertiser_id]);

    const getSiteTemplate = async (advertiserId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/template/find`, {
                params: { advertiserId: advertiserId }
            });

            if (response.data && response.data[0]) {
                const templateData = response.data[0];
                setHeader(templateData.header);
                setCurrentModel(templateData.header.model);
            }
        } catch (error) {
            console.error("Erro ao buscar template:", error);
        }
    }

    useEffect(() => {
        if (selectedHeaderModel) {
            setCurrentModel(`MODEL_${selectedHeaderModel}`);
        }
    }, [selectedHeaderModel]);

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
        if (!template.header.backgroundImage) return {};

        // Verificar se a imagem de background é a logo da empresa
        const isCompanyLogo = advertiser?.url_profile_company_logo_cover === template.header.backgroundImage;

        return {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("${template.header.backgroundImage}")`,
            backgroundSize: isCompanyLogo ? 'auto 100%' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: (template.header.backgroundImageOpacity || 30) / 100,
            filter: `blur(${template.header.backgroundImageBlur || 2}px) brightness(${template.header.backgroundImageBrightness || 100}%)`,
            zIndex: 0,
            maxHeight: '100%',
            height: '100%'
        };
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
        switch (size) {
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

    const getHeaderSizeClass = (sizeType) => {
        switch (sizeType) {
            case 'SMALL':
                return 'min-h-[25vh]';
            case 'MEDIUM':
                return 'min-h-[50vh]';
            case 'FULL':
                return 'min-h-[100vh]';
            default:
                return 'min-h-[50vh]';
        }
    };


    return (
        <header
            ref={headerRef}
            className={`w-full ${getHeaderSizeClass(header?.sizeType)} relative overflow-hidden`}
            style={getHeaderStyle()}>

            <HeaderBackground
                backgroundImage={template.header.backgroundImage}
                getBackgroundImageStyle={getBackgroundImageStyle}
            />

            <HeaderDecorative
                model={currentModel}
                getDecorativeElementStyle={getDecorativeElementStyle}
            />

            <HeaderTexts
                texts={template.header.texts}
                getPositionStyle={getPositionStyle}
                renderText={renderText}
            />

            {renderCarousel()}
        </header>
    );
}

HeaderTemplate.propTypes = {
    template: PropTypes.shape({
        colorPalette: PropTypes.string.isRequired,
        header: PropTypes.shape({
            color: PropTypes.string.isRequired,
            sizeType: PropTypes.string.isRequired,
            model: PropTypes.string,
            backgroundImage: PropTypes.string,
            backgroundImageOpacity: PropTypes.number,
            backgroundImageBlur: PropTypes.number,
            backgroundImageBrightness: PropTypes.number,
            elementsOpacity: PropTypes.number,
            texts: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                ]).isRequired,
                title: PropTypes.string,
                content: PropTypes.string,
                position: PropTypes.shape({
                    top: PropTypes.string,
                    left: PropTypes.string,
                    width: PropTypes.string
                }),
                style: PropTypes.shape({
                    titleBackground: PropTypes.string,
                    titleColor: PropTypes.string,
                    contentColor: PropTypes.string,
                    titleSize: PropTypes.string,
                    titleBorderRadius: PropTypes.string
                }),
                visible: PropTypes.bool
            })),
            carousel: PropTypes.shape({
                enabled: PropTypes.bool,
                title: PropTypes.string,
                position: PropTypes.shape({
                    top: PropTypes.string,
                    left: PropTypes.string
                })
            })
        }).isRequired
    }).isRequired,
    selectedHeaderModel: PropTypes.number,
    updateHeader: PropTypes.func.isRequired
};

export default HeaderTemplate;
