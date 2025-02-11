/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { 
    Close,
    Palette,
    TextFields,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
} from "@mui/icons-material";

const InitialConfigTemplate = ({ onClose }) => {
    const [sectionConfig, setSectionConfig] = useState({
        type: 'TEXT',
        config: {
            content: '',
            alignment: 'LEFT'
        },
        color: 'CLEAN'
    });

    const handleSaveSection = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <TextFields className="text-[#012038]" />
                        <h2 className="text-xl font-medium text-[#012038]">Configuração Inicial</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Cor/Tema */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Palette className="text-gray-600" />
                            <label className="text-sm font-medium text-gray-700">
                                Tema da Seção
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'CLEAN', label: 'Clean', bg: 'bg-white' },
                                { value: 'CANDY', label: 'Candy', bg: 'bg-pink-50' },
                                { value: 'DARK', label: 'Dark', bg: 'bg-gray-900' },
                                { value: 'MONOCHROMATIC', label: 'Mono', bg: 'bg-gray-50' }
                            ].map((theme) => (
                                <button
                                    key={theme.value}
                                    onClick={() => setSectionConfig({...sectionConfig, color: theme.value})}
                                    className={`p-3 flex items-center justify-center gap-2 rounded-lg border transition-all ${
                                        sectionConfig.color === theme.value
                                            ? 'border-[#012038] bg-[#012038]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded ${theme.bg} border`} />
                                    <span className="text-sm">{theme.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Alinhamento */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FormatAlignLeft className="text-gray-600" />
                            <label className="text-sm font-medium text-gray-700">
                                Alinhamento
                            </label>
                        </div>
                        <div className="flex gap-2">
                            {[
                                { value: 'LEFT', icon: <FormatAlignLeft />, label: 'Esquerda' },
                                { value: 'CENTER', icon: <FormatAlignCenter />, label: 'Centro' },
                                { value: 'RIGHT', icon: <FormatAlignRight />, label: 'Direita' }
                            ].map((align) => (
                                <button
                                    key={align.value}
                                    onClick={() => setSectionConfig({
                                        ...sectionConfig, 
                                        config: {...sectionConfig.config, alignment: align.value}
                                    })}
                                    className={`flex-1 p-3 flex items-center justify-center gap-2 rounded-lg border transition-all ${
                                        sectionConfig.config.alignment === align.value
                                            ? 'border-[#012038] bg-[#012038]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {align.icon}
                                    <span className="text-sm">{align.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveSection}
                            className="px-4 py-2 bg-[#012038] text-white rounded-lg hover:bg-[#012038]/90 transition-colors"
                        >
                            Salvar Configuração
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialConfigTemplate; 