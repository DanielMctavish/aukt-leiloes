/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel5() {
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

    const getBorderStyle = (elementId) => {
        const element = headerData.elements[elementId];
        if (!element || !element[colorScheme]) return {};

        return {
            borderColor: headerData.color || '#000000',
            opacity: headerData.elementsOpacity / 100
        };
    };

    return (
        <div className="absolute inset-0 z-10">
            {/* Círculo central com borda */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div 
                    className="w-[300px] h-[300px] rounded-full" 
                    style={getElementStyle("element_1")}
                />
                <div 
                    className="absolute inset-0 w-[400px] h-[400px] rounded-full border-[20px] -translate-x-[50px] -translate-y-[50px]"
                    style={getBorderStyle("element_2")}
                />
            </div>
            
            {/* Círculos decorativos */}
            <div 
                className="absolute top-10 left-10 w-20 h-20 rounded-full" 
                style={getElementStyle("element_3")}
            />
            <div 
                className="absolute bottom-10 right-10 w-16 h-16 rounded-full" 
                style={getElementStyle("element_4")}
            />
            <div 
                className="absolute top-20 right-20 w-12 h-12 rounded-full" 
                style={getElementStyle("element_5")}
            />
            <div 
                className="absolute bottom-20 left-20 w-14 h-14 rounded-full" 
                style={getElementStyle("element_6")}
            />
        </div>
    );
}

export default HeaderModel5; 