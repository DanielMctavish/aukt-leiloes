/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";

function HeaderModel2({ color, elementsOpacity }) {
    const { headerData } = useSelector(state => state.header);

    const getElementStyle = (elementId) => {

        console.log("observando headerData >>>> ", elementsOpacity)

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
            backgroundColor:color,
            opacity: elementsOpacity 
        };
    };


    return (
        <div className="absolute inset-0 z-10">
            <div className="w-[260px] h-[260px] rounded-full absolute right-[20vh] bottom-[-4vh]"
                style={getElementStyle("element_1")}></div>
            <div className="w-[300px] h-[300px] rounded-full absolute right-[-4vh] bottom-[-4vh]"
                style={getElementStyle("element_2")}></div>
            <div className="w-[260px] h-[260px] rounded-full absolute left-[17vh] bottom-[-4vh]"
                style={getElementStyle("element_3")}></div>
            <div className="w-[290px] h-[290px] rounded-full absolute left-[-4vh] bottom-[-4vh]"
                style={getElementStyle("element_4")}></div>
            <div className="w-[300px] h-[300px] rounded-full absolute left-[-100px] top-[-100px]"
                style={getElementStyle("element_5")}></div>
            <div className="w-[360px] h-[360px] rounded-full absolute right-[-7vh] top-[-10vh]"
                style={getElementStyle("element_6")}></div>
            <div className="w-[240px] h-[240px] rounded-full absolute right-[20vh] top-[-50px]"
                style={getElementStyle("element_1")}></div>
        </div>
    );
}

export default HeaderModel2; 