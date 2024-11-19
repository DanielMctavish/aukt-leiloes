/* eslint-disable react/prop-types */

function HeaderDecorative({ model, getDecorativeElementStyle }) {
    const decorativeElements = {
        MODEL_1: () => (
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
        ),
        MODEL_2: () => (
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
        ),
        MODEL_3: () => (
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
        ),
        MODEL_4: () => (
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
        ),
        MODEL_5: () => (
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
        ),
        MODEL_6: () => (
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
        ),
        MODEL_7: () => (
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
        ),
        MODEL_8: () => null // Modelo sem elementos decorativos
    };

    const RenderDecorative = decorativeElements[model];
    return RenderDecorative ? <RenderDecorative /> : null;
}

export default HeaderDecorative; 