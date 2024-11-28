/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel7() {
    const { headerData } = useSelector(state => state.header);
    const colorScheme = headerData.colorPalette || 'clean';

    const getElementStyle = (elementId) => {
        const element = headerData.elements[elementId];
        if (!element || !element[colorScheme]) return {};

        return {
            backgroundColor: headerData.color || '#000000',
            opacity: headerData.elementsOpacity / 100
        };
    };

    return (
        <div className="absolute inset-0 z-10">
            {/* Grade de tijolinhos */}
            <div className="w-full h-full grid grid-cols-8 gap-1 p-2">
                {[...Array(48)].map((_, index) => {
                    // Usa os elementos em ciclo para variar os estilos
                    const elementId = `element_${(index % 6) + 1}`;
                    return (
                        <div
                            key={index}
                            className="w-full h-full"
                            style={getElementStyle(elementId)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default HeaderModel7; 