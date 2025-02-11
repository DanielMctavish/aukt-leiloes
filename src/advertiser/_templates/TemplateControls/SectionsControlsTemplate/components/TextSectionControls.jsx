/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { 
    Close,
    FormatSize,
    TextFields,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateSectionsData } from "../../../../../features/template/SectionsSlice";

const TextSectionControls = ({ setIsModalText }) => {
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const { headerData } = useSelector(state => state.header);
    const [config, setConfig] = useState({
        type: 'Text',
        config: {
            content: '',
            alignment: 'LEFT',
            fontSize: '16',
            textColor: Object.values(headerData.palettes[headerData.colorPalette])[0],
            fontFamily: headerData.fontStyle
        }
    });

    const fontSizes = [
        { value: '12', label: 'Pequeno' },
        { value: '16', label: 'Médio' },
        { value: '20', label: 'Grande' },
        { value: '24', label: 'Extra Grande' }
    ];

    // Gera um array de cores a partir da paleta atual
    const colors = Object.entries(headerData.palettes[headerData.colorPalette]).map(([key, value]) => ({
        value,
        label: `Cor ${key}`
    }));

    const handleConfigChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            config: {
                ...prev.config,
                [key]: value
            }
        }));
    };

    const handleSaveSection = () => {
        const newSection = {
            type: "Text",
            config: config.config,
            color: "#ffffff",
            sizeType: "contained"
        };

        dispatch(updateSectionsData({
            sections: [...sectionsData.sections, newSection]
        }));

        setIsModalText(false);
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <TextFields className="text-[#036982] text-2xl" />
                        <div>
                            <h2 className="text-2xl font-bold text-[#036982]">Seção de Texto</h2>
                            <p className="text-gray-500 mt-1">Personalize o conteúdo e aparência do texto</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalText(false)} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Close className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Alinhamento */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <FormatAlignLeft className="text-[#036982]" />
                            <label className="text-lg font-semibold text-[#036982]">
                                Alinhamento do Texto
                            </label>
                        </div>
                        <div className="flex gap-3">
                            {[
                                { value: 'LEFT', icon: <FormatAlignLeft />, label: 'Esquerda' },
                                { value: 'CENTER', icon: <FormatAlignCenter />, label: 'Centro' },
                                { value: 'RIGHT', icon: <FormatAlignRight />, label: 'Direita' }
                            ].map((align) => (
                                <button
                                    key={align.value}
                                    onClick={() => handleConfigChange("alignment", align.value)}
                                    className={`flex-1 p-4 flex flex-col items-center gap-2 rounded-lg border-2 transition-all
                                        ${config.config.alignment === align.value
                                            ? 'border-[#036982] bg-[#036982]/5'
                                            : 'border-gray-200 hover:border-[#036982]/30'
                                        }`}
                                >
                                    {align.icon}
                                    <span className="text-sm font-medium">{align.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tamanho da Fonte */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <FormatSize className="text-[#036982]" />
                            <label className="text-lg font-semibold text-[#036982]">
                                Tamanho da Fonte
                            </label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {fontSizes.map((size) => (
                                <button
                                    key={size.value}
                                    onClick={() => handleConfigChange("fontSize", size.value)}
                                    className={`p-4 flex flex-col items-center gap-2 rounded-lg border-2 transition-all
                                        ${config.config.fontSize === size.value
                                            ? 'border-[#036982] bg-[#036982]/5'
                                            : 'border-gray-200 hover:border-[#036982]/30'
                                        }`}
                                >
                                    <span className="text-sm font-medium">{size.label}</span>
                                    <span 
                                        className="text-gray-500" 
                                        style={{ 
                                            fontSize: `${size.value}px`,
                                            fontFamily: config.config.fontFamily
                                        }}
                                    >
                                        Aa
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cor do Texto */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <TextFields className="text-[#036982]" />
                            <label className="text-lg font-semibold text-[#036982]">
                                Cor do Texto
                            </label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => handleConfigChange("textColor", color.value)}
                                    className={`p-4 flex flex-col items-center gap-2 rounded-lg border-2 transition-all
                                        ${config.config.textColor === color.value
                                            ? 'border-[#036982] bg-[#036982]/5'
                                            : 'border-gray-200 hover:border-[#036982]/30'
                                        }`}
                                >
                                    <div 
                                        className="w-6 h-6 rounded-full border border-gray-200"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <span className="text-sm font-medium">{color.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <TextFields className="text-[#036982]" />
                            <label className="text-lg font-semibold text-[#036982]">
                                Conteúdo do Texto
                            </label>
                        </div>
                        <textarea 
                            value={config.config.content}
                            onChange={(e) => handleConfigChange("content", e.target.value)}
                            className="w-full min-h-[200px] p-4 border-2 border-gray-200 rounded-lg
                                focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all
                                resize-none"
                            placeholder="Digite seu texto aqui..."
                            style={{ fontFamily: config.config.fontFamily }}
                        />
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-[#036982] mb-4">Prévia</h3>
                        <div className="bg-white p-6 rounded-lg min-h-[100px] border-2 border-gray-200">
                            <div
                                style={{
                                    fontSize: `${config.config.fontSize}px`,
                                    color: config.config.textColor,
                                    textAlign: config.config.alignment.toLowerCase(),
                                    fontFamily: config.config.fontFamily
                                }}
                            >
                                {config.config.content || 'Digite algum texto para ver a prévia...'}
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsModalText(false)}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveSection}
                            className="px-6 py-2 bg-[#036982] text-white rounded-lg hover:bg-[#036982]/90 transition-colors"
                        >
                            Salvar Seção
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextSectionControls;