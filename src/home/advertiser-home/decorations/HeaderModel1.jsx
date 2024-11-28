/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel1() {
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

    const getElementClasses = (elementId) => {
        const element = headerData.elements[elementId];
        if (!element || !element[colorScheme]) return '';

        const { saturation, lightness } = element[colorScheme];
        
        // Convertendo os valores para as classes mais próximas do Tailwind
        const satClass = `saturate-[${saturation}]`;
        const brightClass = `brightness-[${lightness / 100}]`;

        return `${satClass} ${brightClass}`;
    };

    return (
        <div className="absolute inset-0 z-10">
            {Object.keys(headerData.elements).map((elementId) => (
                <div
                    key={elementId}
                    name={elementId}
                    className={`
                        ${elementId === "element_3" && "w-[110px] h-full absolute right-[48%]"}
                        ${elementId === "element_4" && "w-[110px] h-full absolute right-[40%]"}
                        ${elementId === "element_2" && "w-[120px] h-[60vh] absolute left-[34vh] bottom-[-10vh] origin-bottom-left transform rotate-[-50deg]"}
                        ${elementId === "element_1" && "w-[100px] h-[60vh] absolute left-[34vh] bottom-[-28vh] origin-bottom-left transform rotate-[-50deg]"}
                        ${elementId === "element_5" && "w-[120px] h-[60vh] absolute right-[34vh] top-[-13vh] origin-top-right transform rotate-[-50deg]"}
                        ${elementId === "element_6" && "w-[100px] h-[60vh] absolute right-[34vh] top-[-28vh] origin-top-right transform rotate-[-50deg]"}
                        ${getElementClasses(elementId)}
                    `}
                    style={getElementStyle(elementId)}
                />
            ))}
        </div>
    );
}

export default HeaderModel1; 