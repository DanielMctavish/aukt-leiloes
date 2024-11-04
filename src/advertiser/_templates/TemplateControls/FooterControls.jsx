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
    LinkedIn
} from '@mui/icons-material';
import { sizeTypes } from "../templateData/templateModels";

function FooterControls({ template, updateFooter, selectedPalette }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleSectionUpdate = (sectionKey, newData) => {
        const updatedSections = {
            ...template.footer.sections,
            [sectionKey]: {
                ...template.footer.sections[sectionKey],
                ...newData
            }
        };
        updateFooter('sections', updatedSections);
    };

    const handleSocialLinkUpdate = (platform, url) => {
        updateFooter('socialLinks', {
            ...template.footer.socialLinks,
            [platform]: url
        });
    };

    return (
        <div className={`bg-white shadow rounded-lg p-4 mb-4 ${isExpanded ? "overflow-y-auto" : "overflow-hidden"}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Footer</h3>
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

            <div className={`transition-all duration-300 ease-in-out  ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
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

                {/* Seções do Footer */}
                <div className="mb-6">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <Edit className="text-gray-400 text-sm" />
                        Seções do Footer
                    </h4>
                    {Object.entries(template.footer.sections).map(([key, section]) => (
                        <div key={key} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                type="text"
                                value={section.title}
                                onChange={(e) => handleSectionUpdate(key, { title: e.target.value })}
                                className="w-full p-3 mb-3 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none bg-white"
                                placeholder="Título da seção"
                            />
                            {section.links.map((link, index) => (
                                <div key={index} className="mb-4">
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => {
                                            const newLinks = [...section.links];
                                            newLinks[index].label = e.target.value;
                                            handleSectionUpdate(key, { links: newLinks });
                                        }}
                                        className="w-full p-3 mb-2 border border-gray-300 rounded-lg
                                        focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                        transition-all outline-none bg-white"
                                        placeholder="Label do link"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            URL:
                                        </span>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...section.links];
                                                newLinks[index].url = e.target.value;
                                                handleSectionUpdate(key, { links: newLinks });
                                            }}
                                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg
                                            focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                            transition-all outline-none bg-white/50"
                                            placeholder="https://exemplo.com"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
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
                                onChange={(e) => handleSocialLinkUpdate('facebook', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none bg-white"
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
                                onChange={(e) => handleSocialLinkUpdate('twitter', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none bg-white"
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
                                onChange={(e) => handleSocialLinkUpdate('instagram', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none bg-white"
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
                                onChange={(e) => handleSocialLinkUpdate('linkedin', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                transition-all outline-none bg-white"
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