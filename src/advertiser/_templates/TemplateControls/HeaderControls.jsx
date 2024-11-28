/* eslint-disable react/prop-types */
import { AspectRatio, TextFields, FormatSize, BorderAll, Palette, Opacity, ExpandMore, ExpandLess, DeleteForever } from '@mui/icons-material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { 
    setHeaderSize,
    setHeaderColor,
    setHeaderModel,
    setHeaderBackground,
    setElementsOpacity,
    addHeaderText,
    updateHeaderText,
    removeHeaderText,
    setCarouselConfig,
    toggleCarousel
} from '../../../features/template/HeaderSlice';

import BackgroundImageControls from './BackgroundImageControls';
import HeaderModelSelector from './HeaderModelSelector';
import TextPositionControls from './TextPositionControls';
import CarouselControls from './CarouselControls';

function HeaderControls() {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleAddText = () => {
        const newText = {
            id: uuidv4(),
            title: "Novo Título",
            content: "Novo conteúdo",
            position: {
                top: '50%',
                left: '50%',
                width: '30vw'
            },
            style: {
                titleBackground: 'transparent',
                titleColor: '#ffffff',
                contentColor: '#ffffff',
                titleSize: '1x',
                titleBorderRadius: '0px'
            },
            visible: true
        };

        dispatch(addHeaderText(newText));
    };

    const handleTextUpdate = (textId, updates) => {
        dispatch(updateHeaderText({ id: textId, updates }));
    };

    const handleCarouselUpdate = (carouselConfig) => {
        dispatch(setCarouselConfig(carouselConfig));
    };

    const handleElementsOpacityChange = (value) => {
        dispatch(setElementsOpacity(value));
    };

    const handleModelChange = (modelNumber) => {
        dispatch(setHeaderModel(`MODEL_${modelNumber}`));
    };

    const handleSizeChange = (size) => {
        dispatch(setHeaderSize(size));
    };

    const handleDeleteText = (textId) => {
        dispatch(removeHeaderText(textId));
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
                        {Object.entries(headerData.palettes[headerData.colorPalette] || {}).map(([key, color]) => (
                            <button
                                key={key}
                                onClick={() => dispatch(setHeaderColor(color))}
                                className={`w-8 h-8 rounded-full transition-all ${
                                    headerData.color === color 
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
                        {[
                            { key: 'small', value: 'SMALL', label: 'Pequeno' },
                            { key: 'medium', value: 'MEDIUM', label: 'Médio' },
                            { key: 'full', value: 'FULL', label: 'Completo' }
                        ].map(({ key, value, label }) => (
                            <button
                                key={key}
                                onClick={() => handleSizeChange(value)}
                                className={`flex-1 p-3 rounded-lg border transition-all ${
                                    headerData.size === value
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-full ${
                                        key === 'full' ? 'h-8' :
                                        key === 'medium' ? 'h-6' :
                                        'h-4'
                                    } bg-current opacity-20 rounded`}></div>
                                    <span className="text-sm font-medium">
                                        {label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <HeaderModelSelector 
                    selectedModel={headerData.model}
                    onModelChange={handleModelChange}
                    color={headerData.color}
                    elementsOpacity={headerData.elementsOpacity}
                    onOpacityChange={handleElementsOpacityChange}
                />

                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <TextFields className="text-gray-500" />
                            <h4 className="font-medium">Textos do Header</h4>
                        </div>
                        <button
                            onClick={handleAddText}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Adicionar Texto
                        </button>
                    </div>

                    {headerData.texts?.map((text, index) => (
                        <div 
                            key={text.id} 
                            className="mb-6 bg-gray-50 rounded-lg border border-gray-100 p-4"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-gray-700">Área de Texto {index + 1}</span>
                                </div>
                                <button
                                    onClick={() => handleDeleteText(text.id)}
                                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500 hover:text-red-600"
                                    title="Excluir texto"
                                >
                                    <DeleteForever />
                                </button>
                            </div>

                            <div className="space-y-6 mt-4">
                                <div className="bg-white p-3 rounded-md border border-gray-200">
                                    <TextPositionControls
                                        text={text}
                                        onPositionChange={handleTextUpdate}
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
                                        Cores do Texto
                                    </label>
                                    <div className="grid gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600 mb-2 block">Cor do Título</label>
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
                                                {Object.entries(headerData.palettes[headerData.colorPalette] || {}).map(([key, color]) => (
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
                                        <div>
                                            <label className="text-sm text-gray-600 mb-2 block">Cor do Conteúdo</label>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleTextUpdate(text.id, {
                                                        style: { ...text.style, contentColor: '#ffffff' }
                                                    })}
                                                    className={`w-8 h-8 rounded-full bg-white border border-gray-300 transition-all ${
                                                        text.style?.contentColor === '#ffffff' ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                                                    }`}
                                                    title="Branco"
                                                />
                                                {Object.entries(headerData.palettes[headerData.colorPalette] || {}).map(([key, color]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleTextUpdate(text.id, {
                                                            style: { ...text.style, contentColor: color }
                                                        })}
                                                        className={`w-8 h-8 rounded-full transition-all ${
                                                            text.style?.contentColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
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

                <BackgroundImageControls 
                    background={headerData.background}
                    onUpdate={(updates) => dispatch(setHeaderBackground(updates))}
                    color={headerData.color}
                />

                <CarouselControls
                    carousel={headerData.carousel}
                    onUpdate={handleCarouselUpdate}
                    onToggle={(enabled) => dispatch(toggleCarousel(enabled))}
                />

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
                            value={headerData.elementsOpacity}
                            onChange={(e) => handleElementsOpacityChange(parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <span className="text-sm text-gray-500 w-16 text-right">
                            {headerData.elementsOpacity}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderControls;
