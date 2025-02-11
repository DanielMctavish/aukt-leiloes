/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Close, FormatShapes, Visibility } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setHeaderModel } from "../../../../../features/template/HeaderSlice";

function DecorativesHeaderControls({ setIsModalSelector }) {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);
    const [selectedElement, setSelectedElement] = useState(parseInt(headerData.model.split('_')[1]) || 8);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const getDecorativeElementStyle = () => {
        return {
            backgroundColor: headerData.color,
            opacity: headerData.elementsOpacity
        };
    };

    const handleModelSelect = (modelNumber) => {
        setSelectedElement(modelNumber);
        dispatch(setHeaderModel(`MODEL_${modelNumber}`));
        if (!isPreviewMode) {
            setIsModalSelector(false);
        }
    };

    const renderModel = (modelNumber) => {
        switch(modelNumber) {
            case 1:
                return (
                    <div className="absolute inset-0 z-10">
                        <div name="element_3" className="w-[110px] h-full absolute right-[48%]"
                            style={getDecorativeElementStyle("element_3")}></div>
                        <div name="element_4" className="w-[110px] h-full absolute right-[40%]"
                            style={getDecorativeElementStyle("element_4")}></div>
                        <div name="element_2" className="w-[120px] h-[60vh] absolute left-[34vh] bottom-[-10vh] origin-bottom-left 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_2")}></div>
                        <div name="element_1" className="w-[100px] h-[60vh] absolute left-[34vh] bottom-[-28vh] origin-bottom-left 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_1")}></div>
                        <div name="element_5" className="w-[120px] h-[60vh] absolute right-[34vh] top-[-13vh] origin-top-right 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_5")}></div>
                        <div name="element_6" className="w-[100px] h-[60vh] absolute right-[34vh] top-[-28vh] origin-top-right 
                        transform rotate-[-50deg]" style={getDecorativeElementStyle("element_6")}></div>
                    </div>
                );
            case 2:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="w-[260px] h-[260px] rounded-full absolute right-[20vh] bottom-[-4vh]"
                            style={getDecorativeElementStyle("element_1")}></div>
                        <div className="w-[300px] h-[300px] rounded-full absolute right-[-4vh] bottom-[-4vh]"
                            style={getDecorativeElementStyle("element_2")}></div>
                        <div className="w-[260px] h-[260px] rounded-full absolute left-[17vh] bottom-[-4vh]"
                            style={getDecorativeElementStyle("element_3")}></div>
                        <div className="w-[290px] h-[290px] rounded-full absolute left-[-4vh] bottom-[-4vh]"
                            style={getDecorativeElementStyle("element_4")}></div>
                        <div className="w-[300px] h-[300px] rounded-full absolute left-[-100px] top-[-100px]"
                            style={getDecorativeElementStyle("element_5")}></div>
                        <div className="w-[360px] h-[360px] rounded-full absolute right-[-7vh] top-[-10vh]"
                            style={getDecorativeElementStyle("element_6")}></div>
                        <div className="w-[240px] h-[240px] rounded-full absolute right-[20vh] top-[-50px]"
                            style={getDecorativeElementStyle("element_1")}></div>
                    </div>
                );
            case 3:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex w-full h-[5vh] mt-[2vh]">
                                {[...Array(12)].map((_, index) => (
                                    <div key={`top-${index}`} className="flex-1 mx-[0.5vh]"
                                        style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}></div>
                                ))}
                            </div>
                            <div className="flex w-full h-[5vh] mb-[2vh]">
                                {[...Array(12)].map((_, index) => (
                                    <div key={`bottom-${index}`} className="flex-1 mx-[0.5vh]"
                                        style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="absolute top-0 left-0 w-full h-1/2 transform -skew-y-6"
                            style={getDecorativeElementStyle("element_1")}></div>
                        <div className="absolute bottom-0 right-0 w-full h-1/2 transform skew-y-6"
                            style={getDecorativeElementStyle("element_2")}></div>
                        <div className="absolute top-4 left-4 flex space-x-2">
                            <div className="w-3 h-3 rounded-full" style={getDecorativeElementStyle("element_3")}></div>
                            <div className="w-3 h-3 rounded-full" style={getDecorativeElementStyle("element_4")}></div>
                            <div className="w-3 h-3 rounded-full" style={getDecorativeElementStyle("element_5")}></div>
                        </div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-4 rounded-full"
                            style={getDecorativeElementStyle("element_6")}></div>
                    </div>
                );
            case 5:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-[300px] h-[300px] rounded-full"
                                style={getDecorativeElementStyle("element_1")}></div>
                            <div className="absolute inset-0 w-[400px] h-[400px] rounded-full border-[20px] -translate-x-[50px] -translate-y-[50px]"
                                style={getDecorativeElementStyle("element_2")}></div>
                        </div>
                        <div className="absolute top-10 left-10 w-20 h-20 rounded-full"
                            style={getDecorativeElementStyle("element_3")}></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full"
                            style={getDecorativeElementStyle("element_4")}></div>
                        <div className="absolute top-20 right-20 w-12 h-12 rounded-full"
                            style={getDecorativeElementStyle("element_5")}></div>
                        <div className="absolute bottom-20 left-20 w-14 h-14 rounded-full"
                            style={getDecorativeElementStyle("element_6")}></div>
                    </div>
                );
            case 6:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-0 right-0 flex gap-0 h-[33.33%]">
                                <div className="w-[40%] h-full border-[2px]"
                                    style={getDecorativeElementStyle("element_1")}></div>
                                <div className="w-[25%] h-full border-[2px] border-l-0"
                                    style={getDecorativeElementStyle("element_2")}></div>
                                <div className="w-[35%] h-full border-[2px] border-l-0"
                                    style={getDecorativeElementStyle("element_3")}></div>
                            </div>
                            <div className="absolute top-[33.33%] left-0 right-0 flex gap-0 h-[33.33%]">
                                <div className="w-[30%] h-full border-[2px] border-t-0"
                                    style={getDecorativeElementStyle("element_4")}></div>
                                <div className="w-[45%] h-full border-[2px] border-l-0 border-t-0"
                                    style={getDecorativeElementStyle("element_5")}></div>
                                <div className="w-[25%] h-full border-[2px] border-l-0 border-t-0"
                                    style={getDecorativeElementStyle("element_6")}></div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 flex gap-0 h-[33.33%]">
                                <div className="w-[50%] h-full border-[2px] border-t-0"
                                    style={getDecorativeElementStyle("element_1")}></div>
                                <div className="w-[20%] h-full border-[2px] border-l-0 border-t-0"
                                    style={getDecorativeElementStyle("element_2")}></div>
                                <div className="w-[30%] h-full border-[2px] border-l-0 border-t-0"
                                    style={getDecorativeElementStyle("element_3")}></div>
                            </div>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="w-full h-full grid grid-cols-8 gap-1 p-1">
                            {[...Array(48)].map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full h-full"
                                    style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            case 8:
            case 9:
                return (
                    <div className="absolute inset-0 z-10 overflow-hidden">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={`wave-${index}`}
                                className="absolute w-[200%] h-[40px] transform -rotate-45"
                                style={{
                                    ...getDecorativeElementStyle(`element_${index + 1}`),
                                    top: `${index * 20}%`,
                                    left: `-${index * 10}%`
                                }}
                            ></div>
                        ))}
                    </div>
                );
            case 10:
                return (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={`circle-${index}`}
                                className="absolute rounded-full animate-pulse"
                                style={{
                                    ...getDecorativeElementStyle(`element_${index + 1}`),
                                    width: `${(6 - index) * 100}px`,
                                    height: `${(6 - index) * 100}px`,
                                    animationDelay: `${index * 0.2}s`
                                }}
                            ></div>
                        ))}
                    </div>
                );
            case 11:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="grid grid-cols-6 gap-2 p-4 h-full">
                            {[...Array(36)].map((_, index) => (
                                <div
                                    key={`hex-${index}`}
                                    className="aspect-square rotate-45"
                                    style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            case 12:
                return (
                    <div className="absolute inset-0 z-10 flex flex-col justify-between py-8">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={`zigzag-${index}`}
                                className="h-[2px] w-full flex"
                                style={{transform: index % 2 === 0 ? 'scaleX(1)' : 'scaleX(-1)'}}
                            >
                                <div className="w-full h-full"
                                    style={{
                                        ...getDecorativeElementStyle(`element_${(index % 6) + 1}`),
                                        clipPath: 'polygon(0 0, 25% 100%, 50% 0, 75% 100%, 100% 0)'
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>
                );
            case 13:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="grid grid-cols-8 gap-1 h-full">
                            {[...Array(32)].map((_, index) => (
                                <div
                                    key={`triangle-${index}`}
                                    className="w-full h-full"
                                    style={{
                                        ...getDecorativeElementStyle(`element_${(index % 6) + 1}`),
                                        clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            case 14:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="grid grid-cols-6 gap-4 p-8 h-full">
                            {[...Array(24)].map((_, index) => (
                                <div
                                    key={`diamond-${index}`}
                                    className="aspect-square rotate-45"
                                    style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            case 15:
                return (
                    <div className="absolute inset-0 z-10 p-8">
                        <div className="w-full h-full border-[20px] relative"
                            style={getDecorativeElementStyle("element_1")}>
                            <div className="absolute top-4 left-4 w-20 h-20 border-t-4 border-l-4"
                                style={getDecorativeElementStyle("element_2")}></div>
                            <div className="absolute top-4 right-4 w-20 h-20 border-t-4 border-r-4"
                                style={getDecorativeElementStyle("element_3")}></div>
                            <div className="absolute bottom-4 left-4 w-20 h-20 border-b-4 border-l-4"
                                style={getDecorativeElementStyle("element_4")}></div>
                            <div className="absolute bottom-4 right-4 w-20 h-20 border-b-4 border-r-4"
                                style={getDecorativeElementStyle("element_5")}></div>
                        </div>
                    </div>
                );
            case 16:
                return (
                    <div className="absolute inset-0 z-10">
                        <div className="grid grid-cols-4 gap-8 p-8 h-full">
                            {[...Array(16)].map((_, index) => (
                                <div
                                    key={`leaf-${index}`}
                                    className="w-full h-full rounded-full"
                                    style={{
                                        ...getDecorativeElementStyle(`element_${(index % 6) + 1}`),
                                        clipPath: 'path("M 0,50 C 25,0 75,0 100,50 C 75,100 25,100 0,50 Z")'
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            case 17:
                return (
                    <div className="absolute inset-0 z-10">
                        {[...Array(12)].map((_, index) => (
                            <div
                                key={`float-${index}`}
                                className="absolute rounded-full animate-float"
                                style={{
                                    ...getDecorativeElementStyle(`element_${(index % 6) + 1}`),
                                    width: `${Math.random() * 60 + 20}px`,
                                    height: `${Math.random() * 60 + 20}px`,
                                    top: `${Math.random() * 80}%`,
                                    left: `${Math.random() * 80}%`,
                                    animationDelay: `${index * 0.3}s`,
                                    animationDuration: `${Math.random() * 3 + 2}s`
                                }}
                            ></div>
                        ))}
                    </div>
                );
            case 18:
                return (
                    <div className="absolute inset-0 z-10 p-4">
                        <div className="grid grid-cols-8 grid-rows-6 gap-2 h-full">
                            {[...Array(48)].map((_, index) => (
                                <div
                                    key={`grid-${index}`}
                                    className={`w-full ${index % 3 === 0 ? 'h-full row-span-2' : 'h-full'}`}
                                    style={getDecorativeElementStyle(`element_${(index % 6) + 1}`)}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`fixed inset-0 ${!isPreviewMode ? 'bg-black/90 backdrop-blur-md' : ''} 
            flex items-center ${isPreviewMode ? 'justify-start' : 'justify-center'} z-[999]
            transition-all duration-500`}>

            <div className={`${isPreviewMode ? 'w-[400px] h-full rounded-r-2xl' : 'w-[95%] h-[95%] rounded-2xl'} 
                bg-white shadow-2xl flex relative transition-all duration-500`}>

                {/* Área de Configurações - Lateral */}
                <div className="w-full h-full border-r border-gray-200 flex flex-col overflow-y-auto">
                    <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-[#036982]">Elementos Decorativos</h1>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                                    className="p-2 rounded-full hover:bg-gray-100 
                                        transition-all duration-200 group"
                                    title={isPreviewMode ? "Modo Tela Cheia" : "Modo Preview"}
                                >
                                    <Visibility className={`text-[#036982] transition-transform duration-300
                                        ${isPreviewMode ? 'rotate-180' : 'rotate-0'}`} />
                                </button>
                                <button 
                                    onClick={() => setIsModalSelector(false)} 
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                                >
                                    <Close className="text-[#036982]" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-2">Escolha o estilo dos elementos decorativos</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(18)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handleModelSelect(index + 1)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 group
                                        ${selectedElement === index + 1
                                            ? 'border-[#036982] bg-[#036982]/5' 
                                            : 'border-gray-200 hover:border-[#036982]/30'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-3 rounded-xl ${
                                            selectedElement === index + 1
                                                ? 'bg-[#036982]/10' 
                                                : 'bg-gray-50 group-hover:bg-[#036982]/5'
                                            } transition-all duration-300`}>
                                            <FormatShapes 
                                                className={`text-2xl ${
                                                    selectedElement === index + 1
                                                        ? 'text-[#036982]' 
                                                        : 'text-gray-400 group-hover:text-[#036982]/70'
                                                    } transition-colors duration-300`}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            selectedElement === index + 1
                                                ? 'text-[#036982]' 
                                                : 'text-gray-500 group-hover:text-[#036982]/70'
                                            } transition-colors duration-300`}>
                                            Modelo {index + 1}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Área de Preview - Principal */}
                {!isPreviewMode && (
                    <div className="flex-1 bg-gray-900 relative overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="relative w-full h-[80vh] bg-gradient-to-b from-gray-800 to-gray-900 
                                rounded-lg overflow-hidden">
                                {renderModel(selectedElement)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DecorativesHeaderControls;