import { useState } from 'react';
import { Palette } from '@mui/icons-material';
import { getContrastColor } from './utils';

function ColorSelector({ colors, currentColor, onChange, label }) {
    const [isOpen, setIsOpen] = useState(false);

    const allColors = {
        transparent: 'transparent',
        white: '#ffffff', // Adicionando branco
        ...colors
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <div
                    className="flex items-center justify-between w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded-full border border-gray-300" 
                            style={{ 
                                backgroundColor: currentColor,
                                backgroundImage: currentColor === 'transparent' ? 
                                    'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)' : 
                                    'none',
                                backgroundSize: '4px 4px'
                            }}>
                        </div>
                        <span>{currentColor}</span>
                    </div>
                    <span className="ml-2">▼</span>
                </div>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette className="h-5 w-5 text-gray-400" />
                </div>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {Object.entries(allColors).map(([key, color]) => (
                            <button
                                key={key}
                                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                                onClick={() => {
                                    onChange(color);
                                    setIsOpen(false);
                                }}
                                style={{ 
                                    backgroundColor: color === 'transparent' ? 'white' : color,
                                    color: color === 'transparent' ? '#000' : getContrastColor(color)
                                }}
                            >
                                <div className="w-4 h-4 mr-2 rounded-full border border-gray-300" 
                                    style={{ 
                                        backgroundColor: color,
                                        backgroundImage: color === 'transparent' ? 
                                            'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)' : 
                                            'none',
                                        backgroundSize: '4px 4px'
                                    }}>
                                </div>
                                {key === 'transparent' ? 'Transparente' : 
                                 key === 'white' ? 'Branco' : color}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ColorSelector;
