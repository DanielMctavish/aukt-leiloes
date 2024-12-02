/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel3({ color, elementsOpacity }) {
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
            <div className="flex flex-col justify-between h-full">
                <div className="flex w-full h-[5vh] mt-[2vh]">
                    {[...Array(12)].map((_, index) => (
                        <div 
                            key={`top-${index}`} 
                            className="flex-1 mx-[0.5vh]" 
                            style={getElementStyle(`element_${(index % 6) + 1}`)}
                        ></div>
                    ))}
                </div>
                <div className="flex w-full h-[5vh] mb-[2vh]">
                    {[...Array(12)].map((_, index) => (
                        <div 
                            key={`bottom-${index}`} 
                            className="flex-1 mx-[0.5vh]" 
                            style={getElementStyle(`element_${(index % 6) + 1}`)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HeaderModel3; 