/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderModel2() {
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
            {Object.keys(headerData.elements).map((elementId) => (
                <div
                    key={elementId}
                    name={elementId}
                    className={`
                        ${elementId === "element_1" && "w-[260px] h-[260px] rounded-full absolute right-[20vh] bottom-[-4vh]"}
                        ${elementId === "element_2" && "w-[300px] h-[300px] rounded-full absolute right-[-4vh] bottom-[-4vh]"}
                        ${elementId === "element_3" && "w-[260px] h-[260px] rounded-full absolute left-[17vh] bottom-[-4vh]"}
                        ${elementId === "element_4" && "w-[290px] h-[290px] rounded-full absolute left-[-4vh] bottom-[-4vh]"}
                        ${elementId === "element_5" && "w-[300px] h-[300px] rounded-full absolute left-[-100px] top-[-100px]"}
                        ${elementId === "element_6" && "w-[360px] h-[360px] rounded-full absolute right-[-7vh] top-[-10vh]"}
                    `}
                    style={getElementStyle(elementId)}
                />
            ))}
        </div>
    );
}

export default HeaderModel2; 