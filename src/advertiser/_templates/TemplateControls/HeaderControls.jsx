/* eslint-disable react/prop-types */
import { AspectRatio, Visibility, VisibilityOff, TextFields, FormatSize, BorderAll, Palette, Opacity, ExpandMore, ExpandLess } from '@mui/icons-material';
import { sizeTypes } from "../templateData/templateModels";
import BackgroundImageControls from './BackgroundImageControls';
import HeaderModelSelector from './HeaderModelSelector';
import TextPositionControls from './TextPositionControls';
import CarouselControls from './CarouselControls';
import { useState } from 'react';

function HeaderControls({ template, updateHeader, selectedHeaderModel, setSelectedHeaderModel, selectedPalette }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleTextUpdate = (textId, changes) => {
        const updatedTexts = template.header.texts.map(text => 
            text.id === textId ? { ...text, ...changes } : text
        );
        updateHeader('texts', updatedTexts);
    };

    const handleTextPositionChange = (textId, newPosition) => {
        handleTextUpdate(textId, { position: newPosition });
    };

    const handleVisibilityToggle = (textId) => {
        const text = template.header.texts.find(t => t.id === textId);
        handleTextUpdate(textId, { visible: !text.visible });
    };

    const handleCarouselUpdate = (carouselConfig) => {
        updateHeader('carousel', carouselConfig);
    };

    const handleElementsOpacityChange = (value) => {
        updateHeader('elementsOpacity', value);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Header</h3>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title={isExpanded ? "Recolher seção" : "Expandir seção"}
                >
                    {isExpanded ? 
                        <ExpandLess className="text-gray-600" /> : 
                        <ExpandMore className="text-gray-600" />
                    }
                </button>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <Palette className="text-gray-400 text-sm" />
                        Cor do Header
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedPalette).map(([key, color]) => (
                            <button
                                key={key}
                                onClick={() => updateHeader('color', color)}
                                className={`w-8 h-8 rounded-full transition-all ${
                                    template.header.color === color 
                                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' 
                                        : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: color }}
                                title={`Cor ${key}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <AspectRatio className="text-gray-400 text-sm" />
                        Tamanho do Header
                    </label>
                    <div className="flex gap-3">
                        {Object.entries(sizeTypes).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => updateHeader('sizeType', value)}
                                className={`flex-1 p-3 rounded-lg border transition-all ${
                                    template.header.sizeType === value
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    {/* Ícones representativos dos tamanhos */}
                                    <div className={`w-full ${
                                        key === 'full' ? 'h-8' :
                                        key === 'half' ? 'h-6' :
                                        'h-4'
                                    } bg-current opacity-20 rounded`}></div>
                                    <span className="text-sm font-medium capitalize">
                                        {key === 'full' ? 'Completo' :
                                         key === 'half' ? 'Médio' :
                                         'Pequeno'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <HeaderModelSelector 
                    selectedHeaderModel={selectedHeaderModel}
                    setSelectedHeaderModel={setSelectedHeaderModel}
                    template={template}
                    updateHeader={updateHeader}
                />

                <div className="mt-6 border-t pt-4">
                    <div className="flex items-center gap-2 mb-4">
                        <TextFields className="text-gray-500" />
                        <h4 className="font-medium">Textos do Header</h4>
                    </div>

                    {template.header.texts?.map(text => (
                        <div 
                            key={text.id} 
                            className={`mb-6 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
                                text.visible ? 'max-h-[1000px] p-4' : 'max-h-[60px]'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                                        {text.id}
                                    </span>
                                    <span className="font-medium text-gray-700">Área de Texto {text.id}</span>
                                </div>
                                <button
                                    onClick={() => handleVisibilityToggle(text.id)}
                                    className={`p-2 hover:bg-gray-200 rounded-full transition-colors ${
                                        text.visible ? 'rotate-0' : 'rotate-180'
                                    }`}
                                    title={text.visible ? "Recolher área" : "Expandir área"}
                                >
                                    {text.visible ? <Visibility className="text-blue-500" /> : <VisibilityOff className="text-gray-400" />}
                                </button>
                            </div>

                            <div className={`space-y-6 mt-4 transition-all duration-300 ${text.visible ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="bg-white p-3 rounded-md border border-gray-200">
                                    <TextPositionControls
                                        text={text}
                                        onPositionChange={handleTextPositionChange}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <FormatSize className="text-gray-400 text-sm" />
                                        Tamanho do Título
                                    </label>
                                    <div className="flex gap-2">
                                        {['1x', '2x', '3x'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => handleTextUpdate(text.id, {
                                                    style: { ...text.style, titleSize: size }
                                                })}
                                                className={`px-4 py-2 rounded-full flex-1 transition-all ${
                                                    text.style?.titleSize === size
                                                        ? 'bg-blue-500 text-white shadow-md'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <BorderAll className="text-gray-400 text-sm" />
                                        Arredondamento da Borda
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="20"
                                            value={parseInt(text.style?.titleBorderRadius) || 0}
                                            onChange={(e) => handleTextUpdate(text.id, {
                                                style: { ...text.style, titleBorderRadius: `${e.target.value}px` }
                                            })}
                                            className="w-full accent-blue-500"
                                        />
                                        <span className="text-sm text-gray-500 w-16 text-right">
                                            {text.style?.titleBorderRadius || '0px'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Palette className="text-gray-400 text-sm" />
                                        Cores do Título
                                    </label>
                                    <div className="grid gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600 mb-2 block">Background</label>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleTextUpdate(text.id, {
                                                        style: { ...text.style, titleBackground: 'transparent' }
                                                    })}
                                                    className={`w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all ${
                                                        text.style?.titleBackground === 'transparent' ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                                                    }`}
                                                    title="Transparente"
                                                >
                                                    <span className="text-xs">T</span>
                                                </button>
                                                {Object.entries(selectedPalette).map(([key, color]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleTextUpdate(text.id, {
                                                            style: { ...text.style, titleBackground: color }
                                                        })}
                                                        className={`w-8 h-8 rounded-full transition-all ${
                                                            text.style?.titleBackground === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                                                        }`}
                                                        style={{ backgroundColor: color }}
                                                        title={`Cor ${key}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-gray-600 mb-2 block">Cor do Texto</label>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleTextUpdate(text.id, {
                                                        style: { ...text.style, titleColor: '#ffffff' }
                                                    })}
                                                    className={`w-8 h-8 rounded-full bg-white border border-gray-300 transition-all ${
                                                        text.style?.titleColor === '#ffffff' ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                                                    }`}
                                                    title="Branco"
                                                />
                                                {Object.entries(selectedPalette).map(([key, color]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleTextUpdate(text.id, {
                                                            style: { ...text.style, titleColor: color }
                                                        })}
                                                        className={`w-8 h-8 rounded-full transition-all ${
                                                            text.style?.titleColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                                                        }`}
                                                        style={{ backgroundColor: color }}
                                                        title={`Cor ${key}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Opacity className="text-gray-400 text-sm" />
                        Opacidade dos Elementos
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={template.header.elementsOpacity || 100}
                            onChange={(e) => handleElementsOpacityChange(parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <span className="text-sm text-gray-500 w-16 text-right">
                            {template.header.elementsOpacity || 100}%
                        </span>
                    </div>
                </div>

                <CarouselControls
                    carousel={template.header.carousel || {
                        enabled: false,
                        title: "Produtos em Destaque",
                        size: {
                            width: "600px",
                            height: "400px"
                        },
                        itemsToShow: 4,
                        speed: 3000,
                        position: {
                            top: '60%',
                            left: '10%'
                        }
                    }}
                    onUpdate={handleCarouselUpdate}
                />

                <BackgroundImageControls 
                    template={template}
                    updateHeader={updateHeader}
                />
            </div>
        </div>
    );
}

export default HeaderControls;
