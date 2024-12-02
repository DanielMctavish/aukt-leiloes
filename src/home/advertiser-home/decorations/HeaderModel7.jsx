/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel7({ color, elementsOpacity }) {
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
            <div className="w-full h-full grid grid-cols-8 gap-1 p-1">
                {[...Array(48)].map((_, index) => (
                    <div
                        key={index}
                        className="w-full h-full"
                        style={getElementStyle(`element_${(index % 6) + 1}`)}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default HeaderModel7; 