/* eslint-disable react/prop-types */
import { Opacity } from '@mui/icons-material';

function HeaderModelSelector({ selectedModel, onModelChange, color, elementsOpacity, onOpacityChange }) {
    const handleModelSelect = (model) => {
        onModelChange(model);
    };

    return (
        <section className='flex flex-col w-full mt-4'>
            <h3 className="font-semibold mb-2">Selecione seu modelo:</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((model) => (
                    <button
                        key={model}
                        className={`p-2 rounded h-24 overflow-hidden relative ${
                            selectedModel === `MODEL_${model}`
                                ? 'ring-2 ring-blue-500'
                                : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleModelSelect(model)}
                    >
                        {model === 1 && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                <div className="absolute left-0 top-0 w-1/3 h-full bg-gray-300 transform -skew-x-12"></div>
                                <div className="absolute right-0 top-0 w-1/4 h-full bg-gray-300"></div>
                                <div className="z-10 text-xs">Modelo 01</div>
                            </div>
                        )}
                        {model === 2 && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                <div className="absolute left-1 bottom-1 w-10 h-10 bg-gray-300 rounded-full"></div>
                                <div className="absolute right-1 top-1 w-12 h-12 bg-gray-300 rounded-full"></div>
                                <div className="z-10 text-xs">Modelo 02</div>
                            </div>
                        )}
                        {model === 3 && (
                            <div className="w-full h-full bg-gray-200 flex flex-col justify-between items-center">
                                <div className="w-full h-3 flex">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex-1 bg-gray-300 m-0.5"></div>
                                    ))}
                                </div>
                                <div className="z-10 text-xs">Modelo 03</div>
                                <div className="w-full h-3 flex">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex-1 bg-gray-300 m-0.5"></div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {model === 4 && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gray-300 opacity-50 transform -skew-y-6"></div>
                                <div className="z-10 text-xs">Modelo 04</div>
                            </div>
                        )}
                        {model === 5 && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                                    <div className="absolute w-24 h-24 border-4 border-gray-300 rounded-full"></div>
                                </div>
                                <div className="z-10 text-xs">Modelo 05</div>
                            </div>
                        )}
                        {model === 6 && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                <div className="absolute inset-0 p-1">
                                    {/* Elementos de diferentes tamanhos */}
                                    <div className="absolute top-1 left-1 w-8 h-8 border border-gray-300"></div>
                                    <div className="absolute top-1 right-1 w-12 h-10 border border-gray-300"></div>
                                    <div className="absolute bottom-1 left-2 w-10 h-6 border border-gray-300"></div>
                                    <div className="absolute bottom-2 right-3 w-6 h-8 border border-gray-300"></div>
                                    <div className="absolute top-[40%] left-[30%] w-8 h-4 border border-gray-300"></div>
                                </div>
                                <div className="z-10 text-xs">Modelo 06</div>
                            </div>
                        )}
                        {model === 7 && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                <div className="absolute inset-0 grid grid-cols-4 gap-0.5 p-0.5">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-full h-4 border border-gray-300"></div>
                                    ))}
                                </div>
                                <div className="z-10 text-xs">Modelo 07</div>
                            </div>
                        )}
                        {model === 8 && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                                <div className="z-10 text-xs">Modelo 08</div>
                                <div className="absolute inset-2 border-2 border-dashed border-gray-300"></div>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Controle de opacidade dos elementos decorativos */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Opacity className="text-gray-400 text-sm" />
                    Opacidade dos Elementos Decorativos
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={elementsOpacity}
                        onChange={(e) => onOpacityChange(parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                    />
                    <span className="text-sm text-gray-500 w-16 text-right">
                        {elementsOpacity}%
                    </span>
                </div>
            </div>
        </section>
    );
}

export default HeaderModelSelector;
