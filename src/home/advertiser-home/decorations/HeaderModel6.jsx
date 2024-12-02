/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel6({ color, elementsOpacity }) {
    const { headerData } = useSelector(state => state.header);

    const getElementStyle = (elementId) => {
        if (!elementId) {
            return {
                borderColor: color,
                opacity: elementsOpacity / 100
            };
        }

        const element = headerData.elements?.[elementId];
        const elementConfig = element?.[headerData.colorPalette];

        if (!elementConfig) return {
            borderColor: color,
            opacity: elementsOpacity 
        };

        return {
            borderColor: color,
            opacity: elementsOpacity 
        };
    };

    return (
        <div className="absolute inset-0 z-10">
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 flex gap-0 h-[33.33%]">
                    <div className="w-[40%] h-full border-[2px]"
                        style={getElementStyle("element_1")}></div>
                    <div className="w-[25%] h-full border-[2px] border-l-0"
                        style={getElementStyle("element_2")}></div>
                    <div className="w-[35%] h-full border-[2px] border-l-0"
                        style={getElementStyle("element_3")}></div>
                </div>
                <div className="absolute top-[33.33%] left-0 right-0 flex gap-0 h-[33.33%]">
                    <div className="w-[30%] h-full border-[2px] border-t-0"
                        style={getElementStyle("element_4")}></div>
                    <div className="w-[45%] h-full border-[2px] border-l-0 border-t-0"
                        style={getElementStyle("element_5")}></div>
                    <div className="w-[25%] h-full border-[2px] border-l-0 border-t-0"
                        style={getElementStyle("element_6")}></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex gap-0 h-[33.33%]">
                    <div className="w-[50%] h-full border-[2px] border-t-0"
                        style={getElementStyle("element_1")}></div>
                    <div className="w-[20%] h-full border-[2px] border-l-0 border-t-0"
                        style={getElementStyle("element_2")}></div>
                    <div className="w-[30%] h-full border-[2px] border-l-0 border-t-0"
                        style={getElementStyle("element_3")}></div>
                </div>
            </div>
        </div>
    );
}

export default HeaderModel6; 