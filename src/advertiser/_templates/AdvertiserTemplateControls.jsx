/* eslint-disable react/prop-types */
import { Palette, AspectRatio, Add, Delete, FormatSize } from '@mui/icons-material';
import { cleanColors, candyColors, darkColors, monochromaticColors, sizeTypes, sectionTypes, fontStyles } from "./templateData/templateModels";
import { useState } from 'react';

// Função auxiliar para determinar a cor do texto com base na cor de fundo
const getContrastColor = (hexColor) => {
    // Remove o # se presente
    const color = hexColor.charAt(0) === '#' ? hexColor.substring(1, 7) : hexColor;
    // Converte para RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Calcula a luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Retorna preto ou branco dependendo da luminância
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

function AdvertiserTemplateControls({ template, updateHeader, updateFooter, updateSection, addSection, removeSection, updateInitialConfig }) {
    const ColorSelector = ({ colors, currentColor, onChange, label }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                    <div
                        className="flex items-center justify-between w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: currentColor }}></div>
                            <span>{currentColor}</span>
                        </div>
                        <span className="ml-2">▼</span>
                    </div>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Palette className="h-5 w-5 text-gray-400" />
                    </div>
                    {isOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            {Object.entries(colors).map(([key, color]) => (
                                <button
                                    key={key}
                                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                                    onClick={() => {
                                        onChange(color);
                                        setIsOpen(false);
                                    }}
                                    style={{ backgroundColor: color, color: getContrastColor(color) }}
                                >
                                    <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: color }}></div>
                                    {color}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const isInitialConfigComplete = template.colorPalette && template.fontStyle;

    const colorPalettes = {
        clean: cleanColors,
        candy: candyColors,
        dark: darkColors,
        monochromatic: monochromaticColors
    };

    // Usar a paleta de cores selecionada
    const selectedPalette = colorPalettes[template.colorPalette] || cleanColors;

    return (
        <aside className="w-1/5 h-screen bg-gray-100 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">AUK CONSTRUCTOR</h2>

            <div className="bg-white shadow rounded-lg p-4 mb-4 gap-2 flex flex-col">
                <h3 className="font-semibold mb-2">Configurações iniciais</h3>

                <div className="relative">
                    <select
                        value={template.colorPalette}
                        onChange={e => updateInitialConfig('colorPalette', e.target.value)}
                        className="block w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                    >
                        <option value="">Selecione a paleta de cores</option>
                        <option value="clean">Clean</option>
                        <option value="candy">Candy</option>
                        <option value="dark">Dark</option>
                        <option value="monochromatic">Monocromático</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Palette className="h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div className="relative">
                    <select
                        value={template.fontStyle}
                        onChange={e => updateInitialConfig('fontStyle', e.target.value)}
                        className="block w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                    >
                        <option value="">Selecione o estilo de fonte</option>
                        {Object.entries(fontStyles).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FormatSize className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {isInitialConfigComplete && (
                <>
                    <div className="bg-white shadow rounded-lg p-4 mb-4">
                        <h3 className="font-semibold mb-2">Header</h3>
                        <ColorSelector
                            colors={selectedPalette}
                            currentColor={template.header.color}
                            onChange={(color) => updateHeader('color', color)}
                            label="Cor"
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                            <div className="relative">
                                <select
                                    value={template.header.sizeType}
                                    onChange={e => updateHeader('sizeType', e.target.value)}
                                    className="block w-full pl-10 pr-4 py-2 bg-[#e8e8e8]
                                    text-base border-gray-300 focus:outline-none 
                                    focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {Object.values(sizeTypes).map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AspectRatio className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {template.sections.map((section, index) => (
                        <div key={index} className="bg-white shadow rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</h3>
                                <button onClick={() => removeSection(index)} className="text-red-600 hover:text-red-800">
                                    <Delete className="h-5 w-5" />
                                </button>
                            </div>
                            <ColorSelector
                                colors={selectedPalette}
                                currentColor={section.color}
                                onChange={(color) => updateSection(index, 'color', color)}
                                label="Cor"
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                                <div className="relative">
                                    <select
                                        value={section.sizeType}
                                        onChange={e => updateSection(index, 'sizeType', e.target.value)}
                                        className="block w-full pl-10 pr-4 
                                        py-2 text-base border-gray-300 bg-[#e8e8e8]
                                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        {Object.values(sizeTypes).map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <AspectRatio className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={section.type}
                                    onChange={e => updateSection(index, 'type', e.target.value)}
                                    className="block w-full px-3 py-2 text-base bg-[#e8e8e8]
                                    border-gray-300 focus:outline-none focus:ring-indigo-500 
                                    focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {Object.values(sectionTypes).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}

                    <div className="bg-white shadow rounded-lg p-4 mb-4">
                        <h3 className="font-semibold mb-2">Footer</h3>
                        <ColorSelector
                            colors={selectedPalette}
                            currentColor={template.footer.color}
                            onChange={(color) => updateFooter('color', color)}
                            label="Cor"
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                            <div className="relative">
                                <select
                                    value={template.footer.sizeType}
                                    onChange={e => updateFooter('sizeType', e.target.value)}
                                    className="block w-full pl-10 pr-4 py-2 
                                    text-base border-gray-300 focus:outline-none bg-[#e8e8e8]
                                    focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {Object.values(sizeTypes).map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AspectRatio className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => addSection('section')}
                        disabled={template.sections.length >= 3}
                        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent 
                            text-sm font-medium rounded-md text-[#4d4d4d] bg-[#effdff] 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                            ${template.sections.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Add className="h-5 w-5 mr-2" />
                        Adicionar Seção
                    </button>
                </>
            )}
        </aside>
    );
}

export default AdvertiserTemplateControls;