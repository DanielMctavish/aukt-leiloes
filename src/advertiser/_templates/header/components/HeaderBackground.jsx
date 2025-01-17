/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderBackground({ getBackgroundImageStyle }) {
    const { headerData } = useSelector(state => state.header);
    
    const getBackgroundStyle = () => {
        // Para imagens - mantém a funcionalidade existente
        if (headerData.background?.image) {
            return getBackgroundImageStyle();
        }
        
        // Para gradientes
        if (headerData.background?.gradient) {
            return {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: headerData.background.gradient,
                opacity: headerData.background.opacity / 100,
                filter: `brightness(${headerData.background.brightness}%)`,
                zIndex: 0
            };
        }

        // Para cores sólidas
        if (headerData.background?.color) {
            return {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: headerData.background.color,
                opacity: headerData.background.opacity / 100,
                filter: `brightness(${headerData.background.brightness}%)`,
                zIndex: 0
            };
        }

        return null;
    };
    
    const style = getBackgroundStyle();
    if (!style) return null;
    
    return (
        <div
            key={headerData.background?.image || headerData.background?.color || headerData.background?.gradient}
            className="absolute inset-0 z-0"
            style={style}
        />
    );
}

export default HeaderBackground; 