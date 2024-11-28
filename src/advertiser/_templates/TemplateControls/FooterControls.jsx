/* eslint-disable react/prop-types */
import { DeleteForever, Facebook, Instagram, LinkedIn, Twitter, YouTube, WhatsApp, MusicNote, Edit, ExpandMore, ExpandLess, Palette } from "@mui/icons-material"
import { v4 as uuidv4 } from "uuid"
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
    addFooterSection,
    removeFooterSection,
    addSocialMedia,
    setFooterSize,
    updateFooterSection,
    setFooterColor,
    setFooterTextColor,
    setBorderColor
} from '../../../features/template/FooterSlice';

// Lista de redes sociais disponíveis
const SOCIAL_NETWORKS = [
    { id: 'instagram', name: 'Instagram', placeholder: '@usuario', icon: <Instagram fontSize="small" /> },
    { id: 'facebook', name: 'Facebook', placeholder: 'URL do perfil', icon: <Facebook fontSize="small" /> },
    { id: 'twitter', name: 'Twitter', placeholder: '@usuario', icon: <Twitter fontSize="small" /> },
    { id: 'linkedin', name: 'LinkedIn', placeholder: 'URL do perfil', icon: <LinkedIn fontSize="small" /> },
    { id: 'youtube', name: 'YouTube', placeholder: 'URL do canal', icon: <YouTube fontSize="small" /> },
    { id: 'tiktok', name: 'TikTok', placeholder: '@usuario', icon: <MusicNote fontSize="small" /> },
    { id: 'whatsapp', name: 'WhatsApp', placeholder: 'Número com DDD', icon: <WhatsApp fontSize="small" /> }
];

function FooterControls() {
    const dispatch = useDispatch();
    const { footerData } = useSelector(state => state.footer);
    const { headerData } = useSelector(state => state.header); // Para acessar as paletas de cores
    const [isExpanded, setIsExpanded] = useState(true);
    
    // Estados locais para edição
    const [footerSession, setFooterSession] = useState(false);
    const [currentSection, setCurrentSection] = useState({
        title: '',
        links: []
    });
    
    // Estado local para edição de redes sociais
    const [editingSocialMedia, setEditingSocialMedia] = useState([]);
    const [showSocialMedia, setShowSocialMedia] = useState(false);
    const [editingSection, setEditingSection] = useState(null);

    const handleAddNewSection = () => {
        setFooterSession(!footerSession);
        setCurrentSection({
            title: '',
            links: []
        });
    }

    const handleConfirmSection = () => {
        if (currentSection.title && currentSection.links.length > 0) {
            // Só envia para o Redux quando confirmar
            dispatch(addFooterSection({
                title: currentSection.title,
                links: currentSection.links.map(link => ({
                    name: link.name,
                    url: link.url
                }))
            }));
            setFooterSession(false);
            setCurrentSection({ title: '', links: [] });
        }
    }

    // Handler para adicionar uma nova rede social para edição
    const handleAddSocialMedia = (network) => {
        setEditingSocialMedia(prev => [...prev, {
            id: uuidv4(),
            type: network.id,
            name: network.name,
            url: ''
        }]);
    }

    // Handler para deletar uma rede social
    const handleDeleteSocialMedia = (index) => {
        setEditingSocialMedia(prev => prev.filter((_, i) => i !== index));
    }

    // Handler para atualizar a URL de uma rede social
    const handleSocialMediaChange = (index, value) => {
        setEditingSocialMedia(prev => prev.map((social, i) => 
            i === index ? { ...social, url: value } : social
        ));
    }

    // Handler para confirmar e salvar as redes sociais no Redux
    const handleConfirmSocialMedia = () => {
        editingSocialMedia.forEach(social => {
            if (social.url.trim()) {
                dispatch(addSocialMedia({
                    type: social.type,
                    url: social.url
                }));
            }
        });
        setEditingSocialMedia([]);
    }

    // Handler para mudar o tamanho do footer
    const handleSizeChange = (size) => {
        dispatch(setFooterSize(size));
    }

    const handleStartEdit = (section, index) => {
        setEditingSection({ ...section, index });
        setFooterSession(true);
        setCurrentSection({ ...section });
    }

    const handleUpdateSection = () => {
        if (editingSection && currentSection.title && currentSection.links.length > 0) {
            dispatch(updateFooterSection({
                index: editingSection.index,
                section: {
                    title: currentSection.title,
                    links: currentSection.links
                }
            }));
            setFooterSession(false);
            setCurrentSection({ title: '', links: [] });
            setEditingSection(null);
        }
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            {/* Header do Controle */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[20px] font-bold">Footer</h1>
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
                isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                {/* Botões de Tamanho */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => handleSizeChange('small')}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm transition-colors ${
                            footerData.size === 'small'
                                ? 'bg-[#2e2e2e] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Altura: 30vh"
                    >
                        Pequeno
                    </button>
                    <button
                        onClick={() => handleSizeChange('medium')}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm transition-colors ${
                            footerData.size === 'medium'
                                ? 'bg-[#2e2e2e] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Altura: 60vh"
                    >
                        Médio
                    </button>
                    <button
                        onClick={() => handleSizeChange('large')}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm transition-colors ${
                            footerData.size === 'large'
                                ? 'bg-[#2e2e2e] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Altura: 100vh"
                    >
                        Completo
                    </button>
                </div>

                {/* Seção de Cores */}
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Palette className="text-gray-500" />
                        Cores do Footer
                    </h3>

                    <div className="space-y-6">
                        {/* Cor de Fundo */}
                        <div>
                            <label className="text-sm text-gray-600 mb-3 block">Cor de Fundo</label>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(headerData.palettes[headerData.colorPalette] || {}).map(([key, color]) => (
                                    <button
                                        key={key}
                                        onClick={() => dispatch(setFooterColor(color))}
                                        className={`w-10 h-10 rounded-full transition-all ${
                                            footerData.color === color 
                                                ? 'ring-2 ring-offset-2 ring-[#012038] scale-110' 
                                                : 'hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        title={`Cor ${key}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Cor do Texto */}
                        <div>
                            <label className="text-sm text-gray-600 mb-3 block">Cor do Texto</label>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => dispatch(setFooterTextColor('#FFFFFF'))}
                                    className={`w-10 h-10 rounded-full bg-white border border-gray-300 transition-all ${
                                        footerData.textColor === '#FFFFFF' ? 'ring-2 ring-offset-2 ring-[#012038] scale-110' : 'hover:scale-105'
                                    }`}
                                    title="Branco"
                                />
                                <button
                                    onClick={() => dispatch(setFooterTextColor('#000000'))}
                                    className={`w-10 h-10 rounded-full bg-black transition-all ${
                                        footerData.textColor === '#000000' ? 'ring-2 ring-offset-2 ring-[#012038] scale-110' : 'hover:scale-105'
                                    }`}
                                    title="Preto"
                                />
                            </div>
                        </div>

                        {/* Cor da Borda */}
                        <div>
                            <label className="text-sm text-gray-600 mb-3 block">Cor da Borda</label>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => dispatch(setBorderColor('rgba(255,255,255,0.2)'))}
                                    className={`w-10 h-10 rounded-full bg-white/20 border border-gray-300 transition-all ${
                                        footerData.borderColor === 'rgba(255,255,255,0.2)' ? 'ring-2 ring-offset-2 ring-[#012038] scale-110' : 'hover:scale-105'
                                    }`}
                                    title="Branco Transparente"
                                />
                                <button
                                    onClick={() => dispatch(setBorderColor('rgba(0,0,0,0.2)'))}
                                    className={`w-10 h-10 rounded-full bg-black/20 transition-all ${
                                        footerData.borderColor === 'rgba(0,0,0,0.2)' ? 'ring-2 ring-offset-2 ring-[#012038] scale-110' : 'hover:scale-105'
                                    }`}
                                    title="Preto Transparente"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Redes Sociais */}
                <div className="border-[1px] border-gray-300 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Redes Sociais</h2>
                        <button 
                            onClick={() => setShowSocialMedia(!showSocialMedia)}
                            className="bg-[#2e2e2e] text-white px-4 py-2 rounded-md hover:bg-[#404040]"
                        >
                            {showSocialMedia ? 'Fechar' : 'Configurar'}
                        </button>
                    </div>

                    {showSocialMedia && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {SOCIAL_NETWORKS.map(network => (
                                    <button
                                        key={network.id}
                                        onClick={() => handleAddSocialMedia(network)}
                                        disabled={editingSocialMedia.some(sm => sm.type === network.id)}
                                        className={`p-3 rounded-full transition-all flex items-center justify-center
                                            ${editingSocialMedia.some(sm => sm.type === network.id)
                                                ? 'bg-gray-100 text-gray-500'
                                                : 'bg-[#2e2e2e] text-white hover:bg-[#404040]'
                                            }`}
                                        title={network.name}
                                    >
                                        {network.icon}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3">
                                {editingSocialMedia.map((social, index) => (
                                    <div key={social.id} className="flex flex-col border-[1px] border-gray-300 p-3 rounded-md relative">
                                        <DeleteForever
                                            onClick={() => handleDeleteSocialMedia(index)}
                                            className="cursor-pointer hover:text-red-600 absolute top-2 right-2"
                                        />
                                        <span className="font-medium mb-2 mt-1">{social.name}</span>
                                        <input
                                            type="text"
                                            value={social.url}
                                            onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                                            placeholder={SOCIAL_NETWORKS.find(n => n.id === social.type)?.placeholder}
                                            className="w-full p-2 rounded-md border border-gray-300 bg-transparent"
                                        />
                                    </div>
                                ))}
                            </div>

                            {editingSocialMedia.length > 0 && (
                                <button 
                                    onClick={handleConfirmSocialMedia}
                                    className="bg-[#2e2e2e] text-white px-4 py-2 rounded-md w-full hover:bg-[#404040] transition-colors"
                                >
                                    Confirmar Redes Sociais
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Seções existentes */}
                <section className="border-[1px] border-gray-300 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Sessões do Footer</h2>
                        <span className="text-sm text-gray-500">({footerData.sections.length} seções)</span>
                    </div>

                    {/* Mini Preview do Footer */}
                    <div className="w-full min-h-[240px] border-[1px] border-gray-300 rounded-md p-4 mb-4 relative">
                        <div className="absolute inset-0 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden p-4">
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="grid grid-cols-4 gap-3 max-w-[600px]">
                                    {footerData.sections.slice(0, 16).map((section, index) => (
                                        <div key={index} 
                                            className="relative group flex-shrink-0"
                                        >
                                            {/* Mini Seção */}
                                            <div className="w-[80px] h-[50px] relative bg-white p-2 rounded-md border border-gray-200">
                                                <div className="h-1 w-10 bg-gray-300 mb-1.5"></div>
                                                <div className="space-y-1">
                                                    {section.links.slice(0, 3).map((_, idx) => (
                                                        <div key={idx} className="h-0.5 w-8 bg-gray-200"></div>
                                                    ))}
                                                </div>

                                                {/* Overlay com ícones */}
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 bg-black/5 rounded-md">
                                                    <button
                                                        onClick={() => handleStartEdit(section, index)}
                                                        className="p-1 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                                                        title="Editar seção"
                                                    >
                                                        <Edit className="text-white text-[12px]" />
                                                    </button>
                                                    <button
                                                        onClick={() => dispatch(removeFooterSection(index))}
                                                        className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                                        title="Excluir seção"
                                                    >
                                                        <DeleteForever className="text-white text-[12px]" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ícones de Redes Sociais */}
                            {footerData.socialMedia.length > 0 && (
                                <div className="absolute bottom-2 right-2 flex gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200">
                                    {footerData.socialMedia.map((social, index) => {
                                        const network = SOCIAL_NETWORKS.find(n => n.id === social.type);
                                        return (
                                            <div key={index} 
                                                className="text-gray-400"
                                                title={`${network?.name}: ${social.url}`}
                                            >
                                                {network?.icon}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={handleAddNewSection}
                        className="bg-[#2e2e2e] text-white px-4 py-2 rounded-md w-full hover:bg-[#404040] transition-colors"
                    >
                        Adicionar Nova Seção
                    </button>
                </section>

                {footerSession && (
                    <div className="flex flex-col gap-4 border-[1px] border-gray-300 p-4 rounded-md">
                        <input 
                            type="text" 
                            value={currentSection.title}
                            onChange={(e) => setCurrentSection({
                                ...currentSection,
                                title: e.target.value
                            })}
                            placeholder="Título da sessão" 
                            className="w-full p-2 rounded-md border border-gray-300 bg-transparent" 
                        />

                        <span>links da sessão</span>
                        <div className="flex flex-col gap-2 border-[1px] border-gray-300 p-4 rounded-md">
                            {currentSection.links.map((link) => (
                                <div key={link.id} className="flex flex-col gap-2 relative">
                                    <DeleteForever 
                                        onClick={() => {
                                            setCurrentSection(prev => ({
                                                ...prev,
                                                links: prev.links.filter(l => l.id !== link.id)
                                            }));
                                        }} 
                                        className="cursor-pointer absolute top-0 right-0" 
                                    />
                                    <input 
                                        type="text"
                                        value={link.name}
                                        onChange={(e) => {
                                            setCurrentSection(prev => ({
                                                ...prev,
                                                links: prev.links.map(l => 
                                                    l.id === link.id ? { ...l, name: e.target.value } : l
                                                )
                                            }));
                                        }}
                                        placeholder="link name" 
                                        className="w-full p-2 rounded-md border border-gray-300 bg-transparent mt-[3vh]" 
                                    />
                                    <input 
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => {
                                            setCurrentSection(prev => ({
                                                ...prev,
                                                links: prev.links.map(l => 
                                                    l.id === link.id ? { ...l, url: e.target.value } : l
                                                )
                                            }));
                                        }}
                                        placeholder="#URL" 
                                        className="w-full p-2 rounded-md border border-gray-300 bg-transparent" 
                                    />
                                </div>
                            ))}
                            <button 
                                onClick={() => {
                                    setCurrentSection(prev => ({
                                        ...prev,
                                        links: [...prev.links, {
                                            id: uuidv4(),
                                            name: '',
                                            url: ''
                                        }]
                                    }));
                                }}
                                className="mt-2 p-2 border rounded hover:bg-gray-100"
                            >
                                adicionar link
                            </button>
                        </div>

                        <button 
                            onClick={editingSection ? handleUpdateSection : handleConfirmSection}
                            className="bg-[#2e2e2e] text-white px-4 py-2 rounded-md"
                        >
                            {editingSection ? 'Atualizar' : 'Confirmar'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FooterControls; 