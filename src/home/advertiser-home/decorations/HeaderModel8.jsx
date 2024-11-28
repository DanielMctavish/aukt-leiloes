/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel8() {
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
            {/* Elementos minimalistas */}
            <div className="absolute inset-0 flex justify-between items-center p-8">
                {/* Linha vertical esquerda */}
                <div 
                    className="w-[2px] h-[60%]" 
                    style={getElementStyle("element_1")}
                />

                {/* Elementos centrais */}
                <div className="flex flex-col items-center gap-4">
                    <div 
                        className="w-[100px] h-[2px]" 
                        style={getElementStyle("element_2")}
                    />
                    <div 
                        className="w-[2px] h-[100px]" 
                        style={getElementStyle("element_3")}
                    />
                    <div 
                        className="w-[100px] h-[2px]" 
                        style={getElementStyle("element_4")}
                    />
                </div>

                {/* Linha vertical direita */}
                <div 
                    className="w-[2px] h-[60%]" 
                    style={getElementStyle("element_5")}
                />
            </div>

            {/* Elementos de canto */}
            <div className="absolute top-4 left-4">
                <div 
                    className="w-[40px] h-[2px]" 
                    style={getElementStyle("element_6")}
                />
                <div 
                    className="w-[2px] h-[40px]" 
                    style={getElementStyle("element_1")}
                />
            </div>

            <div className="absolute top-4 right-4">
                <div 
                    className="w-[40px] h-[2px]" 
                    style={getElementStyle("element_2")}
                />
                <div 
                    className="w-[2px] h-[40px] ml-[38px]" 
                    style={getElementStyle("element_3")}
                />
            </div>

            <div className="absolute bottom-4 left-4">
                <div 
                    className="w-[2px] h-[40px]" 
                    style={getElementStyle("element_4")}
                />
                <div 
                    className="w-[40px] h-[2px]" 
                    style={getElementStyle("element_5")}
                />
            </div>

            <div className="absolute bottom-4 right-4">
                <div 
                    className="w-[2px] h-[40px] ml-[38px]" 
                    style={getElementStyle("element_6")}
                />
                <div 
                    className="w-[40px] h-[2px]" 
                    style={getElementStyle("element_1")}
                />
            </div>
        </div>
    );
}

export default HeaderModel8; 