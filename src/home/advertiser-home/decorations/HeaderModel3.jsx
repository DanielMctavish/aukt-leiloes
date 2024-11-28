/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel3() {
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
            <div className="flex flex-col justify-between h-full">
                <div className="flex w-full h-[5vh] mt-[2vh]">
                    {Object.keys(headerData.elements).slice(0, 6).map((elementId) => (
                        <div 
                            key={elementId}
                            className="flex-1 mx-[0.5vh]"
                            style={getElementStyle(elementId)}
                        />
                    ))}
                </div>
                <div className="flex w-full h-[5vh] mb-[2vh]">
                    {Object.keys(headerData.elements).slice(0, 6).map((elementId) => (
                        <div 
                            key={`bottom-${elementId}`}
                            className="flex-1 mx-[0.5vh]"
                            style={getElementStyle(elementId)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HeaderModel3; 