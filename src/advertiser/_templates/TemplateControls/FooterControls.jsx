/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    ExpandMore,
    ExpandLess,
    Palette,
    AspectRatio,
    Edit,
    Link,
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Add,
    Delete
} from '@mui/icons-material';
import { sizeTypes } from "../templateData/templateModels";

function FooterControls({ template, updateFooter, selectedPalette }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleAddSection = () => {
        const newSections = { ...template.footer.sections };
        const sectionKey = `section_${Object.keys(newSections).length + 1}`;
        newSections[sectionKey] = {
            title: "Nova Seção",
            links: []
        };
        updateFooter('sections', newSections);
    };

    const handleRemoveSection = (sectionKey) => {
        const newSections = { ...template.footer.sections };
        delete newSections[sectionKey];
        updateFooter('sections', newSections);
    };

    const handleAddLink = (sectionKey) => {
        const newSections = { ...template.footer.sections };
        newSections[sectionKey].links.push({
            label: "Novo Link",
            url: "#"
        });
        updateFooter('sections', newSections);
    };

    const handleRemoveLink = (sectionKey, linkIndex) => {
        const newSections = { ...template.footer.sections };
        newSections[sectionKey].links.splice(linkIndex, 1);
        updateFooter('sections', newSections);
    };

    const handleUpdateSection = (sectionKey, field, value) => {
        const newSections = { ...template.footer.sections };
        if (field === 'title') {
            newSections[sectionKey].title = value;
        }
        updateFooter('sections', newSections);
    };

    const handleUpdateLink = (sectionKey, linkIndex, field, value) => {
        const newSections = { ...template.footer.sections };
        newSections[sectionKey].links[linkIndex][field] = value;
        updateFooter('sections', newSections);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            {/* Cabeçalho do Controle */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Edit className="text-[#012038]" />
                    Footer
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </button>
            </div>

            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {/* Seções do Footer */}
                <div className="space-y-6">
                    {/* Cabeçalho das Seções */}
                    <div className="flex justify-between items-center">
                        <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2">
                            <Edit className="text-gray-500 text-sm" />
                            Seções do Footer
                        </h4>
                        <button
                            onClick={handleAddSection}
                            disabled={Object.keys(template.footer.sections).length >= 4}
                            className="flex items-center gap-2 px-4 py-2 bg-[#012038] text-white rounded-lg 
                                     hover:bg-[#012038]/90 transition-all duration-300 disabled:opacity-50
                                     disabled:cursor-not-allowed"
                        >
                            <Add className="text-sm" />
                            Nova Seção
                        </button>
                    </div>

                    {/* Lista de Seções */}
                    <div className="space-y-4">
                        {Object.entries(template.footer.sections).map(([key, section]) => (
                            <div key={key} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-[#012038] transition-all duration-300">
                                {/* Cabeçalho da Seção */}
                                <div className="bg-gray-100 p-4 flex justify-between items-center">
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => handleUpdateSection(key, 'title', e.target.value)}
                                        className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 
                                                 focus:border-[#012038] px-2 py-1 outline-none transition-all duration-300"
                                        placeholder="Título da seção"
                                    />
                                    <button
                                        onClick={() => handleRemoveSection(key)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                                    >
                                        <Delete />
                                    </button>
                                </div>

                                {/* Links da Seção */}
                                <div className="p-4 space-y-3">
                                    {section.links.map((link, linkIndex) => (
                                        <div key={linkIndex} className="flex flex-col gap-2 group bg-white p-3 rounded-lg border border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">Link {linkIndex + 1}</span>
                                                <button
                                                    onClick={() => handleRemoveLink(key, linkIndex)}
                                                    className="p-1 text-red-500 opacity-0 group-hover:opacity-100 
                                                             hover:bg-red-50 rounded transition-all duration-300"
                                                >
                                                    <Delete className="text-sm" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => handleUpdateLink(key, linkIndex, 'label', e.target.value)}
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 
                                                         focus:ring-[#012038] focus:border-transparent outline-none
                                                         transition-all duration-300"
                                                placeholder="Nome do link"
                                            />
                                            <input
                                                type="text"
                                                value={link.url}
                                                onChange={(e) => handleUpdateLink(key, linkIndex, 'url', e.target.value)}
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 
                                                         focus:ring-[#012038] focus:border-transparent outline-none
                                                         transition-all duration-300"
                                                placeholder="URL"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleAddLink(key)}
                                        className="w-full p-2 mt-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                                                 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Add className="text-sm" />
                                        Adicionar Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cor do Footer */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <Palette className="text-gray-400 text-sm" />
                        Cor do Footer
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {Object.entries(selectedPalette).map(([key, color]) => (
                            <button
                                key={key}
                                onClick={() => updateFooter('color', color)}
                                className={`w-10 h-10 rounded-lg transition-all ${template.footer.color === color
                                        ? 'ring-2 ring-offset-2 ring-[#012038] scale-110'
                                        : 'hover:scale-105'
                                    }`}
                                style={{ backgroundColor: color }}
                                title={`Cor ${key}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Tamanho do Footer */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <AspectRatio className="text-gray-400 text-sm" />
                        Tamanho do Footer
                    </label>
                    <div className="flex gap-3">
                        {Object.entries(sizeTypes).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => updateFooter('sizeType', value)}
                                className={`flex-1 p-3 rounded-lg border transition-all ${template.footer.sizeType === value
                                        ? 'border-[#012038] bg-[#012038] text-white'
                                        : 'border-gray-200 hover:border-[#012038] text-gray-700'
                                    }`}
                            >
                                <span className="text-sm font-medium capitalize">
                                    {key === 'full' ? 'Completo' :
                                        key === 'half' ? 'Médio' :
                                            'Pequeno'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Redes Sociais */}
                <div className="mb-6">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <Link className="text-gray-400 text-sm" />
                        Redes Sociais
                    </h4>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Facebook className="text-[#012038]" />
                                <span className="font-medium">Facebook</span>
                            </div>
                            <input
                                type="text"
                                value={template.footer.socialLinks.facebook}
                                onChange={(e) => updateFooter('socialLinks', {
                                    ...template.footer.socialLinks,
                                    facebook: e.target.value
                                })}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none"
                                placeholder="https://facebook.com/sua-pagina"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Twitter className="text-[#012038]" />
                                <span className="font-medium">Twitter</span>
                            </div>
                            <input
                                type="text"
                                value={template.footer.socialLinks.twitter}
                                onChange={(e) => updateFooter('socialLinks', {
                                    ...template.footer.socialLinks,
                                    twitter: e.target.value
                                })}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none"
                                placeholder="https://twitter.com/seu-perfil"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Instagram className="text-[#012038]" />
                                <span className="font-medium">Instagram</span>
                            </div>
                            <input
                                type="text"
                                value={template.footer.socialLinks.instagram}
                                onChange={(e) => updateFooter('socialLinks', {
                                    ...template.footer.socialLinks,
                                    instagram: e.target.value
                                })}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none"
                                placeholder="https://instagram.com/seu-perfil"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <LinkedIn className="text-[#012038]" />
                                <span className="font-medium">LinkedIn</span>
                            </div>
                            <input
                                type="text"
                                value={template.footer.socialLinks.linkedin}
                                onChange={(e) => updateFooter('socialLinks', {
                                    ...template.footer.socialLinks,
                                    linkedin: e.target.value
                                })}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none"
                                placeholder="https://linkedin.com/in/seu-perfil"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FooterControls; 