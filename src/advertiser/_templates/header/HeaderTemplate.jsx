/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import HeaderCarousel from './HeaderCarousel';
import HeaderBackground from './components/HeaderBackground';
import HeaderTexts from './components/HeaderTexts';
import HeaderDecorative from './components/HeaderDecorative';
import { rgbToHsl, hslToRgb } from './utils/colorUtils';
import { updateHeaderText, fetchTemplate } from '../../../features/template/HeaderSlice';

function HeaderTemplate() {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);
    const [advertiser, setAdvertiser] = useState(null);
    const [editingText, setEditingText] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedText, setDraggedText] = useState(null);
    const headerRef = useRef(null);
    const { advertiser_id } = useParams();

    useEffect(() => {
        if (advertiser_id) {
            dispatch(fetchTemplate(advertiser_id));
        }
    }, [advertiser_id]);

    const adjustColor = (color, saturation, lightness) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const hsl = rgbToHsl(r, g, b);
        hsl[1] = saturation / 100;
        hsl[2] = lightness / 100;

        const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    };

    const getElementStyle = (elementId) => {
        if (!elementId) {
            return {
                backgroundColor: headerData.color,
                opacity: headerData.elementsOpacity / 100
            };
        }

        const element = headerData.elements?.[elementId];
        const elementConfig = element?.[headerData.colorPalette];

        if (!elementConfig) return {
            backgroundColor: headerData.color,
            opacity: headerData.elementsOpacity / 100
        };

        return {
            backgroundColor: adjustColor(
                headerData.color,
                elementConfig.saturation,
                elementConfig.lightness
            ),
            opacity: headerData.elementsOpacity / 100
        };
    };

    const getBackgroundImageStyle = () => {
        if (!headerData.background?.image) return {};

        const isCompanyLogo = advertiser?.url_profile_company_logo_cover === headerData.background.image;

        return {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("${headerData.background.image}")`,
            backgroundSize: isCompanyLogo ? 'auto 100%' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: headerData.background.opacity / 100,
            filter: `blur(${headerData.background.blur}px) brightness(${headerData.background.brightness}%)`,
            zIndex: 0,
            maxHeight: '100%',
            height: '100%'
        };
    };

    const handleTextDoubleClick = (text) => {
        setEditingText(text);
    };

    const handleTextChange = (e, text) => {
        const { name, value } = e.target;

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const newTimeout = setTimeout(() => {
            dispatch(updateHeaderText({
                id: text.id,
                updates: { [name]: value }
            }));
        }, 300);

        setTypingTimeout(newTimeout);
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

        const newLeft = `${(x / headerRect.width) * 100}%`;
        const newTop = `${(y / headerRect.height) * 100}%`;

        dispatch(updateHeaderText({
            id: draggedText.id,
            updates: {
                position: {
                    ...draggedText.position,
                    left: newLeft,
                    top: newTop
                }
            }
        }));
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

    const getHeaderSizeClass = () => {
        switch(headerData.size) {
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
            className={`w-full ${getHeaderSizeClass()} relative overflow-hidden`}
            style={{ 
                backgroundColor: headerData.color,
                fontFamily: headerData.fontStyle
            }}>

            <HeaderBackground
                backgroundImage={headerData.background.image}
                getBackgroundImageStyle={getBackgroundImageStyle}
            />

            <HeaderDecorative
                model={headerData.model}
                getDecorativeElementStyle={getElementStyle}
            />

            <HeaderTexts
                texts={headerData.texts}
                editingText={editingText}
                handleTextDoubleClick={handleTextDoubleClick}
                handleTextChange={handleTextChange}
                setEditingText={setEditingText}
                handleMouseDown={handleMouseDown}
            />

            {headerData.carousel.enabled && (
                <HeaderCarousel
                    advertiser_id={advertiser_id}
                    config={headerData.carousel}
                />
            )}
        </header>
    );
}

export default HeaderTemplate;
