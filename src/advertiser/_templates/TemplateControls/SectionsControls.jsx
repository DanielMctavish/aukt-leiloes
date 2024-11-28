/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    ExpandMore, ExpandLess, Delete, Palette,
    ViewCarousel, Email, FormatAlignLeft, GridView,
    AspectRatio
} from '@mui/icons-material';
import { 
    removeSection,
    updateSection,
    updateSectionConfig
} from '../../../features/template/SectionsSlice';
import TextSectionControls from './TextSectionControls';
import GallerySectionControls from './GallerySectionControls';
import FormSectionControls from './FormSectionControls';
import AuctListSectionControls from './AuctListSectionControls';

function SectionsControls() {
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const { headerData } = useSelector(state => state.header);
    const [isExpanded, setIsExpanded] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});

    const handleSectionTypeChange = (index, type) => {
        dispatch(updateSection({ 
            index, 
            key: 'type', 
            value: type
        }));
    };

    const handleUpdateSection = (index, key, value) => {
        dispatch(updateSection({ index, key, value }));
    };

    const handleConfigUpdate = (index, config) => {
        dispatch(updateSectionConfig({ index, config }));
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const renderSectionTypeIcon = (type) => {
        switch(type) {
            case 'gallery': return <ViewCarousel className="text-[#012038]" />;
            case 'text': return <FormatAlignLeft className="text-[#012038]" />;
            case 'form': return <Email className="text-[#012038]" />;
            case 'auct_list': return <GridView className="text-[#012038]" />;
            default: return null;
        }
    };

    const renderSectionControls = (section, index) => {
        const sectionType = section.type.toLowerCase();
        
        switch(sectionType) {
            case 'text':
                return <TextSectionControls 
                    section={section} 
                    index={index} 
                    onUpdate={handleConfigUpdate}
                />;
            case 'gallery':
                return <GallerySectionControls 
                    section={section} 
                    index={index} 
                    onUpdate={handleConfigUpdate}
                />;
            case 'form':
                return <FormSectionControls 
                    section={section} 
                    index={index} 
                    onUpdate={handleConfigUpdate}
                />;
            case 'auct_list':
                return <AuctListSectionControls 
                    section={section} 
                    index={index} 
                    onUpdate={handleConfigUpdate}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
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

            <div className={`transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[calc(100vh-200px)] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                {sectionsData.sections.map((section, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#012038] transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                {renderSectionTypeIcon(section.type)}
                                <h4 className="font-medium text-lg">Seção {index + 1}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleSection(index)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    title={expandedSections[index] ? "Recolher seção" : "Expandir seção"}
                                >
                                    {expandedSections[index] ? 
                                        <ExpandLess className="text-gray-600" /> : 
                                        <ExpandMore className="text-gray-600" />
                                    }
                                </button>
                                <button
                                    onClick={() => dispatch(removeSection(index))}
                                    className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                    title="Remover seção"
                                >
                                    <Delete />
                                </button>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 overflow-hidden ${
                            expandedSections[index] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                            {/* Seleção do tipo de seção */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Seção
                                </label>
                                <div className="relative">
                                    <select
                                        value={section.type.toLowerCase()}
                                        onChange={(e) => handleSectionTypeChange(index, e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none
                                        focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                        transition-all outline-none bg-white"
                                    >
                                        <option value="text">Texto</option>
                                        <option value="gallery">Galeria de Produtos</option>
                                        <option value="form">Formulário de Contato</option>
                                        <option value="auct_list">Lista de Leilões</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ExpandMore className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Tamanho da Seção */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <AspectRatio className="text-gray-400 text-sm" />
                                    Tamanho da Seção
                                </label>
                                <div className="flex gap-3">
                                    {[
                                        { key: 'small', value: 'SMALL', label: 'Pequeno' },
                                        { key: 'medium', value: 'MEDIUM', label: 'Médio' },
                                        { key: 'full', value: 'FULL', label: 'Completo' }
                                    ].map(({ key, value, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => handleUpdateSection(index, 'sizeType', value)}
                                            className={`flex-1 p-3 rounded-lg border transition-all ${
                                                section.sizeType === value
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

                            {/* Cor da Seção */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Palette className="text-[#012038]" />
                                    Cor da Seção
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg border border-gray-200">
                                    {Object.entries(headerData.palettes[headerData.colorPalette] || {}).map(([key, color]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleUpdateSection(index, 'color', color)}
                                            className={`w-10 h-10 rounded-full transition-all ${
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

                            {/* Controles específicos do tipo de seção */}
                            {renderSectionControls(section, index)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SectionsControls; 