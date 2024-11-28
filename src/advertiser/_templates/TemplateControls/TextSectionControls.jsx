/* eslint-disable react/prop-types */
import { FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, Palette, ExpandMore } from '@mui/icons-material';
import { useSelector } from 'react-redux';

function TextSectionControls({ section, index, onUpdate }) {
    const { headerData } = useSelector(state => state.header);

    const handleConfigUpdate = (updates) => {
        onUpdate(index, {
            ...section.config,
            ...updates
        });
    };

    // Array com tamanhos de fonte disponíveis
    const fontSizes = [
        16, 19, 24, 32, 40, 48, 56, 64, 72, 80, 96, 120, 140, 160
    ];

    return (
        <div className="space-y-6">
            {/* Tamanho do Texto */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FormatSize className="text-gray-400 text-sm" />
                    Tamanho do Texto
                </label>
                <div className="relative">
                    <select
                        value={section.config.fontSize}
                        onChange={(e) => handleConfigUpdate({ fontSize: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none
                            focus:ring-2 focus:ring-[#012038] focus:border-transparent
                            transition-all outline-none bg-white"
                    >
                        {fontSizes.map(size => (
                            <option key={size} value={size}>
                                {size}px
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ExpandMore className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Alinhamento do Texto */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FormatAlignLeft className="text-gray-400 text-sm" />
                    Alinhamento
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleConfigUpdate({ alignment: 'LEFT' })}
                        className={`p-3 rounded-lg flex-1 transition-all ${
                            section.config.alignment?.toUpperCase() === 'LEFT'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FormatAlignLeft />
                    </button>
                    <button
                        onClick={() => handleConfigUpdate({ alignment: 'CENTER' })}
                        className={`p-3 rounded-lg flex-1 transition-all ${
                            section.config.alignment?.toUpperCase() === 'CENTER'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FormatAlignCenter />
                    </button>
                    <button
                        onClick={() => handleConfigUpdate({ alignment: 'RIGHT' })}
                        className={`p-3 rounded-lg flex-1 transition-all ${
                            section.config.alignment?.toUpperCase() === 'RIGHT'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FormatAlignRight />
                    </button>
                </div>
            </div>

            {/* Cor do Texto */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Palette className="text-gray-400 text-sm" />
                    Cor do Texto
                </label>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleConfigUpdate({ textColor: '#FFFFFF' })}
                        className={`w-8 h-8 rounded-full bg-white border border-gray-300 transition-all ${
                            section.config.textColor === '#FFFFFF' ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                        }`}
                        title="Branco"
                    />
                    <button
                        onClick={() => handleConfigUpdate({ textColor: '#000000' })}
                        className={`w-8 h-8 rounded-full bg-black transition-all ${
                            section.config.textColor === '#000000' ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                        }`}
                        title="Preto"
                    />
                    {Object.entries(headerData.palettes[headerData.colorPalette] || {}).map(([key, color]) => (
                        <button
                            key={key}
                            onClick={() => handleConfigUpdate({ textColor: color })}
                            className={`w-8 h-8 rounded-full transition-all ${
                                section.config.textColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            title={`Cor ${key}`}
                        />
                    ))}
                </div>
            </div>

            {/* Conteúdo do Texto */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conteúdo do Texto
                </label>
                <textarea
                    value={section.config.content}
                    onChange={(e) => handleConfigUpdate({ content: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg min-h-[200px] 
                        focus:ring-2 focus:ring-[#012038] focus:border-transparent
                        transition-all outline-none bg-white resize-y"
                    placeholder="Digite seu texto aqui..."
                    style={{
                        fontSize: '16px',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                    }}
                />
            </div>
        </div>
    );
}

export default TextSectionControls; 