/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

function HeaderDecorative({ getDecorativeElementStyle }) {
    const { headerData } = useSelector(state => state.header);

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
        MODEL_8: () => null, // Modelo sem elementos decorativos
        MODEL_9: () => (
            <div className="absolute inset-0 z-10 overflow-hidden">
                {[...Array(6)].map((_, index) => {
                    // Velocidade diferente para cada elemento (entre 15s e 30s)
                    const duration = 15 + (index * 3);
                    
                    return (
                        <div
                            key={`wave-${index}`}
                            className="absolute w-[300%] h-[40px] animate-diagonalMove"
                            style={{
                                ...getDecorativeElementStyle(`element_${index + 1}`),
                                top: `${index * 20}%`,
                                left: `${index * 10}%`,
                                '--duration': `${duration}s`
                            }}
                        ></div>
                    );
                })}
            </div>
        ),
        MODEL_10: () => (
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
        ),
        MODEL_11: () => (
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
        ),
        MODEL_12: () => (
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
        ),
        MODEL_13: () => (
            <div className="absolute inset-0 z-10">
                <div className="absolute inset-0 flex flex-col">
                    {/* Parte Superior */}
                    <div className="h-1/2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-[120%] h-[200%] origin-top-left -rotate-12"
                            style={getDecorativeElementStyle("element_1")}></div>
                        <div className="absolute top-[20%] left-[30%] w-[100%] h-[180%] origin-top-left -rotate-12"
                            style={getDecorativeElementStyle("element_2")}></div>
                        <div className="absolute top-[40%] left-[60%] w-[80%] h-[160%] origin-top-left -rotate-12"
                            style={getDecorativeElementStyle("element_3")}></div>
                    </div>
                    {/* Parte Inferior */}
                    <div className="h-1/2 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-[120%] h-[200%] origin-bottom-right rotate-12"
                            style={getDecorativeElementStyle("element_4")}></div>
                        <div className="absolute bottom-[20%] right-[30%] w-[100%] h-[180%] origin-bottom-right rotate-12"
                            style={getDecorativeElementStyle("element_5")}></div>
                        <div className="absolute bottom-[40%] right-[60%] w-[80%] h-[160%] origin-bottom-right rotate-12"
                            style={getDecorativeElementStyle("element_6")}></div>
                    </div>
                </div>
            </div>
        ),
        MODEL_14: () => (
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
        ),
        MODEL_15: () => (
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
        ),
        MODEL_16: () => (
            <div className="absolute inset-0 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[300px] h-[300px] animate-spinSlow">
                        {/* Círculo central */}
                        <div className="absolute inset-0 rounded-full border-[30px]"
                            style={getDecorativeElementStyle("element_1")}></div>
                        
                        {/* Linhas radiais */}
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={`ray-${index}`}
                                className="absolute top-1/2 left-1/2 w-[400px] h-[3px] -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    ...getDecorativeElementStyle(`element_${(index % 3) + 2}`),
                                    transform: `translate(-50%, -50%) rotate(${index * 45}deg)`
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        MODEL_17: () => (
            <div className="absolute inset-0 z-10 overflow-hidden">
                {/* Esferas caindo */}
                {[...Array(40)].map((_, index) => {
                    const size = Math.random() * 60 + 20; // Tamanho entre 20px e 80px
                    const duration = Math.random() * 15 + 10; // Duração entre 10s e 25s
                    const delay = Math.random() * -20; // Delay negativo para começar em posições diferentes
                    const translateX = Math.random() * 200 - 100; // Movimento lateral entre -100px e 100px
                    const brightness = 0.8 + Math.random() * 0.4; // Brilho entre 0.8 e 1.2
                    
                    return (
                        <div
                            key={`sphere-${index}`}
                            className="absolute animate-fallingSphere rounded-full"
                            style={{
                                ...getDecorativeElementStyle(`element_${(index % 6) + 1}`),
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${Math.random() * 100}%`,
                                '--duration': `${duration}s`,
                                '--tx': `${translateX}px`,
                                animationDelay: `${delay}s`,
                                filter: `brightness(${brightness})`,
                                boxShadow: `0 0 ${size/4}px rgba(255,255,255,${0.1 + Math.random() * 0.2})`
                            }}
                        ></div>
                    );
                })}
            </div>
        ),
        MODEL_18: () => (
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
        )
    };

    const RenderDecorative = decorativeElements[headerData.model];
    return RenderDecorative ? <RenderDecorative /> : null;
}

export default HeaderDecorative; 