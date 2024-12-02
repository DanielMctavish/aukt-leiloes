/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";

function HeaderModel1({ color, elementsOpacity }) {
    const { headerData } = useSelector(state => state.header);

    const getElementStyle = (elementId) => {
        if (!elementId) {
            return {
                backgroundColor: color,
                opacity: elementsOpacity / 100
            };
        }

        const element = headerData.elements?.[elementId];
        const elementConfig = element?.[headerData.colorPalette];

        if (!elementConfig) return {
            backgroundColor: color,
            opacity: elementsOpacity 
        };

        return {
            backgroundColor: color,
            opacity: elementsOpacity 
        };
    };

    return (
        <div className="absolute inset-0 z-10">
            <div name="element_3" className="w-[110px] h-full absolute right-[48%]"
                style={getElementStyle("element_3")}></div>
            <div name="element_4" className="w-[110px] h-full absolute right-[40%]"
                style={getElementStyle("element_4")}></div>
            <div name="element_2" className="w-[120px] h-[60vh] absolute left-[34vh] bottom-[-10vh] origin-bottom-left 
                transform rotate-[-50deg]" style={getElementStyle("element_2")}></div>
            <div name="element_1" className="w-[100px] h-[60vh] absolute left-[34vh] bottom-[-28vh] origin-bottom-left 
                transform rotate-[-50deg]" style={getElementStyle("element_1")}></div>
            <div name="element_5" className="w-[120px] h-[60vh] absolute right-[34vh] top-[-13vh] origin-top-right 
                transform rotate-[-50deg]" style={getElementStyle("element_5")}></div>
            <div name="element_6" className="w-[100px] h-[60vh] absolute right-[34vh] top-[-28vh] origin-top-right 
                transform rotate-[-50deg]" style={getElementStyle("element_6")}></div>
        </div>
    );
}

export default HeaderModel1; 