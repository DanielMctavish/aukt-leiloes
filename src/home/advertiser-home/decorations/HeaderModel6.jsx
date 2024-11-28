/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel6() {
    const { headerData } = useSelector(state => state.header);
    const colorScheme = headerData.colorPalette || 'clean';

    const getElementStyle = (elementId) => {
        const element = headerData.elements[elementId];
        if (!element || !element[colorScheme]) return {};

        return {
            borderColor: headerData.color || '#000000',
            opacity: headerData.elementsOpacity / 100
        };
    };

    return (
        <div className="absolute inset-0 z-10">
            <div className="absolute inset-0">
                {/* Primeira linha */}
                <div className="absolute top-0 left-0 right-0 flex gap-0 h-[33.33%]">
                    <div 
                        className="w-[40%] h-full border-[2px]" 
                        style={getElementStyle("element_1")}
                    />
                    <div 
                        className="w-[25%] h-full border-[2px] border-l-0" 
                        style={getElementStyle("element_2")}
                    />
                    <div 
                        className="w-[35%] h-full border-[2px] border-l-0" 
                        style={getElementStyle("element_3")}
                    />
                </div>

                {/* Segunda linha */}
                <div className="absolute top-[33.33%] left-0 right-0 flex gap-0 h-[33.33%]">
                    <div 
                        className="w-[30%] h-full border-[2px] border-t-0" 
                        style={getElementStyle("element_4")}
                    />
                    <div 
                        className="w-[45%] h-full border-[2px] border-l-0 border-t-0" 
                        style={getElementStyle("element_5")}
                    />
                    <div 
                        className="w-[25%] h-full border-[2px] border-l-0 border-t-0" 
                        style={getElementStyle("element_6")}
                    />
                </div>

                {/* Terceira linha */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-0 h-[33.33%]">
                    <div 
                        className="w-[50%] h-full border-[2px] border-t-0" 
                        style={getElementStyle("element_1")}
                    />
                    <div 
                        className="w-[20%] h-full border-[2px] border-l-0 border-t-0" 
                        style={getElementStyle("element_2")}
                    />
                    <div 
                        className="w-[30%] h-full border-[2px] border-l-0 border-t-0" 
                        style={getElementStyle("element_3")}
                    />
                </div>
            </div>
        </div>
    );
}

export default HeaderModel6; 