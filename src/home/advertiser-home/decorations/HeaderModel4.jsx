/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel4({ color, elementsOpacity }) {
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
            <div className="absolute top-0 left-0 w-full h-1/2 transform -skew-y-6" 
                style={getElementStyle("element_1")}></div>
            <div className="absolute bottom-0 right-0 w-full h-1/2 transform skew-y-6" 
                style={getElementStyle("element_2")}></div>
            <div className="absolute top-4 left-4 flex space-x-2">
                <div className="w-3 h-3 rounded-full" style={getElementStyle("element_3")}></div>
                <div className="w-3 h-3 rounded-full" style={getElementStyle("element_4")}></div>
                <div className="w-3 h-3 rounded-full" style={getElementStyle("element_5")}></div>
            </div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-4 rounded-full" 
                style={getElementStyle("element_6")}></div>
        </div>
    );
}

export default HeaderModel4; 