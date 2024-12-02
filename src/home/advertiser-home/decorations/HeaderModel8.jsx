/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";

function HeaderModel8({ color, elementsOpacity }) {
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

    // O modelo 8 não tem elementos decorativos, então retornamos null
    return null;
}

export default HeaderModel8; 