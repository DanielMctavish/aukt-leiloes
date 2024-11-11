/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { 
    ExpandMore, ExpandLess, Delete, Palette,
    ViewCarousel, Email, WhatsApp,
    FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
    Speed, GridView, ViewList
} from '@mui/icons-material';
import { sectionTypes, sizeTypes } from "../templateData/templateModels";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SectionsControls({ template, updateSection, removeSection, selectedPalette }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [aucts, setAucts] = useState([]);
    const { advertiser_id } = useParams();

    useEffect(() => {
        const fetchAucts = async () => {
            try {
                if (!advertiser_id) return;

                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                    params: {
                        creator_id: advertiser_id
                    }
                });
                setAucts(response.data);
            } catch (error) {
                console.error("Erro ao buscar leilões:", error);
            }
        };

        fetchAucts();
    }, [advertiser_id]);

    const handleSectionTypeChange = (index, type) => {
        updateSection(index, 'type', type);
        updateSection(index, 'config', sectionTypes[type].config);
    };

    const handleConfigChange = (index, key, value) => {
        updateSection(index, 'config', {
            ...template.sections[index].config,
            [key]: value
        });
    };

    const renderSectionTypeIcon = (type) => {
        switch(type) {
            case 'gallery': return <ViewCarousel className="text-[#012038]" />;
            case 'text': return <FormatAlignLeft className="text-[#012038]" />;
            case 'form': return <Email className="text-[#012038]" />;
            case 'auctList': return <GridView className="text-[#012038]" />;
            default: return null;
        }
    };

    const renderSectionControls = (section, index) => {
        switch(section.type) {
            case 'gallery':
                return (
                    <div className="space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione o Leilão
                            </label>
                            <select
                                value={section.config.selectedAuctId || ''}
                                onChange={(e) => handleConfigChange(index, 'selectedAuctId', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none bg-white"
                            >
                                <option value="">Selecione um leilão</option>
                                {aucts.map((auct) => (
                                    <option key={auct.id} value={auct.id}>
                                        {auct.title} ({auct.product_list?.length || 0} produtos)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Layout da Galeria
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleConfigChange(index, 'layout', 'grid')}
                                    className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                                        section.config.layout === 'grid' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <GridView /> Grid
                                </button>
                                <button
                                    onClick={() => handleConfigChange(index, 'layout', 'carousel')}
                                    className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                                        section.config.layout === 'carousel' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <ViewCarousel /> Carrossel
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Itens por Linha
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={section.config.itemsPerRow}
                                onChange={(e) => handleConfigChange(index, 'itemsPerRow', parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>1</span>
                                <span>6</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Opções de Exibição
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={section.config.showTitle}
                                        onChange={(e) => handleConfigChange(index, 'showTitle', e.target.checked)}
                                        className="rounded text-[#012038] focus:ring-[#012038]"
                                    />
                                    <span className="text-sm">Mostrar título do produto</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={section.config.showPrice}
                                        onChange={(e) => handleConfigChange(index, 'showPrice', e.target.checked)}
                                        className="rounded text-[#012038] focus:ring-[#012038]"
                                    />
                                    <span className="text-sm">Mostrar preço</span>
                                </label>
                            </div>
                        </div>

                        {section.config.layout === 'carousel' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Velocidade do Carrossel
                                </label>
                                <div className="flex items-center gap-2">
                                    <Speed />
                                    <input
                                        type="range"
                                        min="1000"
                                        max="5000"
                                        step="500"
                                        value={section.config.speed}
                                        onChange={(e) => handleConfigChange(index, 'speed', parseInt(e.target.value))}
                                        className="flex-1"
                                    />
                                    <span>{section.config.speed / 1000}s</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tamanho da Seção
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(sizeTypes).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => updateSection(index, 'sizeType', value)}
                                        className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                                            section.sizeType === value
                                                ? 'border-[#012038] bg-[#012038] text-white'
                                                : 'border-gray-200 hover:border-[#012038] text-gray-700'
                                        }`}
                                    >
                                        <span className="text-sm font-medium capitalize">
                                            {key === 'small' ? 'Pequeno' :
                                             key === 'medium' ? 'Médio' :
                                             'Completo'}
                                        </span>
                                        <span className="text-xs opacity-75">
                                            {key === 'small' ? '25vh' :
                                             key === 'medium' ? '50vh' :
                                             '100vh'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conteúdo
                            </label>
                            <textarea
                                value={section.config.content}
                                onChange={(e) => handleConfigChange(index, 'content', e.target.value)}
                                className="w-full h-32 p-2 border rounded bg-[#efefef] font-mono text-sm"
                                placeholder="Digite o conteúdo da seção..."
                                style={{ 
                                    whiteSpace: 'pre-wrap'
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alinhamento
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleConfigChange(index, 'alignment', 'left')}
                                    className={`flex-1 p-2 rounded ${
                                        section.config.alignment === 'left' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <FormatAlignLeft />
                                </button>
                                <button
                                    onClick={() => handleConfigChange(index, 'alignment', 'center')}
                                    className={`flex-1 p-2 rounded ${
                                        section.config.alignment === 'center' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <FormatAlignCenter />
                                </button>
                                <button
                                    onClick={() => handleConfigChange(index, 'alignment', 'right')}
                                    className={`flex-1 p-2 rounded ${
                                        section.config.alignment === 'right' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <FormatAlignRight />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tamanho da Fonte
                            </label>
                            <select
                                value={section.config.fontSize}
                                onChange={(e) => handleConfigChange(index, 'fontSize', e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#012038] outline-none bg-white"
                            >
                                {[14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48].map(size => (
                                    <option key={size} value={size}>
                                        {size}px
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cor do Texto
                            </label>
                            <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg border border-gray-200">
                                {Object.entries(selectedPalette).map(([key, color]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleConfigChange(index, 'textColor', color)}
                                        className={`w-10 h-10 rounded-lg transition-all ${
                                            section.config.textColor === color 
                                                ? 'ring-2 ring-offset-2 ring-[#012038] scale-110' 
                                                : 'hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        title={`Cor ${key}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'form':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Destino do Formulário
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleConfigChange(index, 'destination', 'whatsapp')}
                                    className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                                        section.config.destination === 'whatsapp' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <WhatsApp /> WhatsApp
                                </button>
                                <button
                                    onClick={() => handleConfigChange(index, 'destination', 'email')}
                                    className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                                        section.config.destination === 'email' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <Email /> Email
                                </button>
                            </div>
                        </div>

                        {section.config.destination === 'whatsapp' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número do WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={section.config.whatsappNumber}
                                    onChange={(e) => handleConfigChange(index, 'whatsappNumber', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="+55 (11) 99999-9999"
                                />
                            </div>
                        )}

                        {section.config.destination === 'email' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de Destino
                                </label>
                                <input
                                    type="email"
                                    value={section.config.email}
                                    onChange={(e) => handleConfigChange(index, 'email', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="contato@exemplo.com"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'auctList':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Layout da Lista
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleConfigChange(index, 'layout', 'grid')}
                                    className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                                        section.config.layout === 'grid' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <GridView /> Grid
                                </button>
                                <button
                                    onClick={() => handleConfigChange(index, 'layout', 'list')}
                                    className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                                        section.config.layout === 'list' 
                                            ? 'bg-[#012038] text-white' 
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <ViewList /> Lista
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderSizeButtons = (section, index) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Tamanho da Seção
            </label>
            <div className="grid grid-cols-3 gap-2">
                {Object.entries(sizeTypes).map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => updateSection(index, 'sizeType', value)}
                        className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                            section.sizeType === value
                                ? 'border-[#012038] bg-[#012038] text-white'
                                : 'border-gray-200 hover:border-[#012038] text-gray-700'
                        }`}
                    >
                        <span className="text-sm font-medium capitalize">
                            {key === 'small' ? 'Pequeno' :
                             key === 'medium' ? 'Médio' :
                             'Completo'}
                        </span>
                        <span className="text-xs opacity-75">
                            {key === 'small' ? '25vh' :
                             key === 'medium' ? '50vh' :
                             '100vh'}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4 overflow-y-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                    <GridView className="text-[#012038]" />
                    Seções
                </h3>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title={isExpanded ? "Recolher seção" : "Expandir seção"}
                >
                    {isExpanded ? 
                        <ExpandLess className="text-gray-600" /> : 
                        <ExpandMore className="text-gray-600" />
                    }
                </button>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
                {template.sections.map((section, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#012038] transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                {renderSectionTypeIcon(section.type)}
                                <h4 className="font-medium text-lg">Seção {index + 1}</h4>
                            </div>
                            <button
                                onClick={() => removeSection(index)}
                                className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                title="Remover seção"
                            >
                                <Delete />
                            </button>
                        </div>

                        {/* Seleção do tipo de seção */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Seção
                            </label>
                            <div className="relative">
                                <select
                                    value={section.type}
                                    onChange={(e) => handleSectionTypeChange(index, e.target.value)}
                                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg appearance-none
                                    focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                    transition-all outline-none bg-white"
                                >
                                    {Object.entries(sectionTypes).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ExpandMore className="text-gray-400" />
                                </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {sectionTypes[section.type]?.description}
                            </p>
                        </div>

                        {/* Tamanho da Seção */}
                        {renderSizeButtons(section, index)}

                        {/* Controles específicos do tipo de seção */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                            {renderSectionControls(section, index)}
                        </div>

                        {/* Cor da Seção */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Palette className="text-[#012038]" />
                                Cor da Seção
                            </label>
                            <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg border border-gray-200">
                                {Object.entries(selectedPalette).map(([key, color]) => (
                                    <button
                                        key={key}
                                        onClick={() => updateSection(index, 'color', color)}
                                        className={`w-10 h-10 rounded-lg transition-all ${
                                            section.color === color 
                                                ? 'ring-2 ring-offset-2 ring-[#012038] scale-110' 
                                                : 'hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        title={`Cor ${key}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SectionsControls; 