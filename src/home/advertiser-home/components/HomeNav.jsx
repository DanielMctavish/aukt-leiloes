/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import {
    Person, Home, Collections, ContactPage,
    Gavel, Article, Store, ExitToApp
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import logo_aukt from '../../../media/logos/logos-auk/aukt_blue.png';

function HomeNav({ sections, header, advertiser_id, isShop, onLoginClick }) {
    console.log('Header color:', header?.color); // Para debug
    const navigate = useNavigate();
    const [clientSession, setClientSession] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('client-auk-session-login');
        if (session) {
            setClientSession(JSON.parse(session));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('client-auk-session-login');
        setClientSession(null);
        setShowDropdown(false);
    };

    // Função para ajustar o brilho da cor
    const adjustBrightness = (color, amount) => {
        // Se não houver cor definida, usa o azul padrão
        if (!color) return '#012038';

        // Remove o # se existir
        color = color.replace('#', '');
        
        // Converte para RGB
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16);

        // Ajusta o brilho
        r = Math.min(255, Math.max(0, r + amount));
        g = Math.min(255, Math.max(0, g + amount));
        b = Math.min(255, Math.max(0, b + amount));

        // Converte de volta para hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Cores baseadas no header
    const navColors = {
        background: `${header?.color || '#012038'}e6`, // Cor principal com transparência
        lighter: adjustBrightness(header?.color, 30),  // Versão mais clara
        darker: adjustBrightness(header?.color, -30),  // Versão mais escura
    };

    const getSectionInfo = (type) => {
        switch (type.toLowerCase()) {
            case 'gallery':
                return {
                    icon: <Collections className="text-xl" />,
                    label: 'Galeria'
                };
            case 'form':
                return {
                    icon: <ContactPage className="text-xl" />,
                    label: 'Contato'
                };
            case 'auct_list':
                return {
                    icon: <Gavel className="text-xl" />,
                    label: 'Leilões'
                };
            case 'text':
                return {
                    icon: <Article className="text-xl" />,
                    label: 'Sobre'
                };
            default:
                return {
                    icon: <Article className="text-xl" />,
                    label: 'Sobre'
                };
        }
    };

    const scrollToSection = (targetType) => {
        const allSections = document.querySelectorAll('section');
        let targetSection = null;

        allSections.forEach((section) => {
            if (!targetSection) {
                const sectionType = section.getAttribute('data-section-type');
                if (sectionType === targetType) {
                    targetSection = section;
                }
            }
        });

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Função para determinar o estilo do texto baseado na paleta
    const getTextStyle = () => {
        if (header?.colorPalette === 'CLEAN') {
            return { 
                color: '#000000',
                textShadow: '0 0 1px rgba(255, 255, 255, 0.7)' // Sombra branca sutil para contraste
            };
        }
        return { 
            color: 'white',
            textShadow: 'none'
        };
    };

    const textStyle = getTextStyle();

    const renderUserButton = () => {
        if (clientSession) {
            return (
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full 
                            transition-colors text-sm"
                        style={{
                            backgroundColor: header?.colorPalette === 'CLEAN' ? '#000000' : 'white',
                            color: header?.colorPalette === 'CLEAN' ? 'white' : (header?.color || '#012038'),
                        }}
                    >
                        <Person className="text-xl" />
                        <span className="hidden md:block truncate max-w-[120px]">
                            {clientSession.name}
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div 
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                            style={{ 
                                border: '1px solid rgba(0,0,0,0.1)',
                            }}
                        >
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {clientSession.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {clientSession.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 
                                    flex items-center gap-2"
                            >
                                <ExitToApp className="text-base" />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full 
                    transition-colors text-sm"
                style={{
                    backgroundColor: header?.colorPalette === 'CLEAN' ? '#000000' : 'white',
                    color: header?.colorPalette === 'CLEAN' ? 'white' : (header?.color || '#012038'),
                    ':hover': {
                        backgroundColor: header?.colorPalette === 'CLEAN' 
                            ? 'rgba(0, 0, 0, 0.9)' 
                            : 'rgba(255, 255, 255, 0.9)'
                    }
                }}
            >
                <Person className="text-xl" />
                <span className="hidden md:block">Área do Cliente</span>
            </button>
        );
    };

    return (
        <nav 
            className="w-full h-[8vh] backdrop-blur-sm fixed top-0 left-0 z-[99]"
            style={{ 
                backgroundColor: navColors.background,
            }}
        >
            <div className="w-full h-full px-4 lg:px-6 flex items-center">
                <div className="flex items-center justify-between w-full">
                    {/* Logo e Nome */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logo_aukt}
                            alt="AUK Logo"
                            className="h-8"
                        />
                        <span 
                            className="font-bold text-xl hidden md:block"
                            style={textStyle}
                        >
                            AUK Leilões
                        </span>
                    </div>

                    {/* Links das Seções */}
                    <div className="hidden md:flex items-center gap-6">
                        {sections?.map((section, index) => {
                            const { icon, label } = getSectionInfo(section.type);
                            return (
                                <button
                                    key={index}
                                    onClick={() => scrollToSection(section.type.toLowerCase())}
                                    className="flex items-center gap-2 text-white/80 hover:text-white 
                                        transition-colors text-sm"
                                    style={textStyle}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-4">
                        {/* Botão para o site do anunciante - Só aparece no HomeAdvShop */}
                        {isShop && advertiser_id && (
                            <button
                                onClick={() => navigate(`/advertiser/home/${advertiser_id}`)}
                                className="flex items-center gap-2 text-white/80 hover:text-white 
                                    transition-colors text-sm px-3 py-2 rounded-md"
                                style={textStyle}
                            >
                                <Store className="text-xl" />
                                <span className="hidden md:block">Site do Anunciante</span>
                            </button>
                        )}

                        {/* Site Principal */}
                        <a
                            href="https://aukt.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/80 hover:text-white 
                                transition-colors text-sm"
                            style={textStyle}
                        >
                            <Home className="text-xl" />
                            <span className="hidden md:block">AUKT</span>
                        </a>

                        <button
                            onClick={() => navigate('/floor/hub')}
                            className="flex items-center gap-2 text-white/80 hover:text-white 
                                transition-colors text-sm"
                            style={textStyle}
                        >
                            <Gavel className="text-xl" />
                        </button>

                        {/* Botão de Login/Usuário */}
                        {renderUserButton()}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default HomeNav; 