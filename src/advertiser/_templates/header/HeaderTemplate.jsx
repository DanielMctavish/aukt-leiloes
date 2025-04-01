/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HeaderCarousel from './HeaderCarousel';
import HeaderTexts from './components/HeaderTexts';
import HeaderDecorative from './components/HeaderDecorative';
import { updateHeaderText, fetchTemplate } from '../../../features/template/HeaderSlice';



function HeaderTemplate() {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);
    const headerRef = useRef(null);
    const [editingText, setEditingText] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const { advertiser_id } = useParams();

    useEffect(() => {
        if (advertiser_id) {
            dispatch(fetchTemplate(advertiser_id));
        }
    }, [advertiser_id, dispatch]);

    // Log para debug
    useEffect(() => {
        // console.log('HeaderTemplate - headerData:', headerData);
    }, [headerData]);

    const getElementStyle = () => {
        return {
            backgroundColor: headerData.color,
            opacity: headerData.elementsOpacity
        };
    };

    const getBackgroundStyle = () => {
        if (!headerData.backgroundImage) {
            return {};
        }

        const baseStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: headerData.backgroundImageOpacity || 1,
            filter: `blur(${headerData.backgroundImageBlur || 0}px) brightness(${headerData.backgroundImageBrightness || 1})`,
            zIndex: 0
        };

        // Se for uma URL de imagem
        if (headerData.backgroundImage.startsWith('http') || headerData.backgroundImage.startsWith('/')) {
            return {
                ...baseStyle,
                backgroundImage: `url(${headerData.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        }

        // Se for um gradiente linear
        if (headerData.backgroundImage.startsWith('linear-gradient')) {
            return {
                ...baseStyle,
                backgroundImage: headerData.backgroundImage
            };
        }

        // Se for uma cor sólida
        return {
            ...baseStyle,
            backgroundColor: headerData.backgroundImage
        };
    };

    useEffect(() => {
        console.log("Background mudou:", headerData.backgroundImage);
    }, [headerData.backgroundImage]);

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

    const handleMouseDown = (e, text, onDragEnd) => {
        if (editingText) return;
        e.preventDefault();
        
        const element = e.currentTarget;
        const parent = element.parentElement;
        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialLeft = parseFloat(parent.style.left) || 50;
        const initialTop = parseFloat(parent.style.top) || 50;

        const handleDrag = (e) => {
            const deltaX = (e.clientX - initialX) / parent.parentElement.offsetWidth * 100;
            const deltaY = (e.clientY - initialY) / parent.parentElement.offsetHeight * 100;
            
            const newLeft = `${Math.min(Math.max(initialLeft + deltaX, 0), 100)}%`;
            const newTop = `${Math.min(Math.max(initialTop + deltaY, 0), 100)}%`;
            
            parent.style.left = newLeft;
            parent.style.top = newTop;
        };

        const handleDragEnd = () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
            
            if (onDragEnd) {
                onDragEnd({
                    top: parent.style.top,
                    left: parent.style.left
                });
            }
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
    };

    return (
        <header
            ref={headerRef}
            className={`w-full relative overflow-hidden
                ${headerData.sizeType === "FULL" && "min-h-[100vh]"} 
                ${headerData.sizeType === "MEDIUM" && "min-h-[50vh]"}
                ${headerData.sizeType === "SMALL" && "min-h-[25vh]"}`}
            style={{ fontFamily: headerData.fontStyle }}>

            {/* Background com verificação adicional de opacidade */}
            {headerData.backgroundImage && (
                <div 
                    className="absolute inset-0 w-full h-full bg-red-300"
                    style={getBackgroundStyle()}
                />
            )}

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

            {headerData.carousel?.enabled && (
                <HeaderCarousel
                    advertiser_id={advertiser_id}
                    config={headerData.carousel}
                />
            )}
        </header>
    );
}

export default HeaderTemplate;
