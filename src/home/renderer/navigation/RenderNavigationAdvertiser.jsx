/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Menu, Close, Home, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function RenderNavigationAdvertiser({ sections, fontStyle, colorPalette = 'clean' }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const navigate = useNavigate();

    // Definir as cores baseadas na paleta
    const PALETTES = {
        clean: {
            1: '#e8f3f2',
            2: '#dffeee',
            3: '#b3f7ff',
            4: '#fde1ff',
            5: '#fffee9',
            6: '#ffeed1',
            7: '#e4ffe2',
            8: '#f7fffe'
        },
        candy: {
            1: '#f96f6f',
            2: '#ffb46a',
            3: '#ffff6c',
            4: '#5fff5f',
            5: '#7effff',
            6: '#8181ff',
            7: '#fd89fd',
            8: '#fe59ac'
        },
        dark: {
            1: '#1A1A1A',
            2: '#081527',
            3: '#0a280e',
            4: '#250202',
            5: '#290336',
            6: '#232802',
            7: '#2f1c02',
            8: '#2e0226'
        },
        monochromatic: {
            1: '#2E2E2E',
            2: '#3D3D3D',
            3: '#4C4C4C',
            4: '#5B5B5B',
            5: '#6A6A6A',
            6: '#797979',
            7: '#888888',
            8: '#979797'
        }
    };

    // Criar o estilo do degradê com validação segura
    const getGradientStyle = () => {
        const selectedPalette = PALETTES[colorPalette?.toLowerCase()] || PALETTES.clean;
        return {
            background: `linear-gradient(to right, ${selectedPalette[1]}, ${selectedPalette[2]})`,
        };
    };

    // Função para determinar o estilo do texto baseado na paleta
    const getTextStyle = (isScrolled) => {
        const normalizedPalette = colorPalette?.toLowerCase() || 'clean';
        
        if (!isScrolled) {
            return 'text-white drop-shadow-lg';
        }

        switch (normalizedPalette) {
            case 'clean':
                return 'text-gray-800';
            case 'candy':
            case 'dark':
            case 'monochromatic':
                return 'text-white';
            default:
                return 'text-gray-800';
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            setScrolled(scrollPosition > 50);

            // Identificar a seção ativa
            const headerElement = document.getElementById('header');
            const navHeight = 80; // Altura da navegação

            // Verifica se está na área do header (Home)
            const headerHeight = headerElement?.offsetHeight || 0;
            if (scrollPosition < headerHeight - navHeight) {
                setActiveSection('home');
                return;
            }

            // Verifica se está na área do footer (Informações)
            const footerThreshold = 150; // Ajuste para detecção do footer
            if (scrollPosition + windowHeight >= documentHeight - footerThreshold) {
                setActiveSection('info');
                return;
            }

            // Verifica se está em alguma seção intermediária
            let foundActiveSection = false;
            sections?.forEach(section => {
                const element = document.getElementById(section.type.toLowerCase());
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top;
                    const elementBottom = rect.bottom;
                    
                    // Ajusta a área de detecção para considerar a navegação
                    if (elementTop <= navHeight + 20 && elementBottom >= navHeight) {
                        setActiveSection(section.type);
                        foundActiveSection = true;
                    }
                }
            });

            // Se não encontrou nenhuma seção ativa
            if (!foundActiveSection) {
                let closestSection = null;
                let closestDistance = Infinity;

                sections?.forEach(section => {
                    const element = document.getElementById(section.type.toLowerCase());
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        const distance = Math.abs(rect.top - navHeight);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestSection = section.type;
                        }
                    }
                });

                if (closestSection) {
                    setActiveSection(closestSection);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollToSection = (sectionType) => {
        const navHeight = 80; // Altura da navegação
        
        if (sectionType === 'home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setActiveSection('home');
        } else if (sectionType === 'info') {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
            setActiveSection('info');
        } else {
            const element = document.getElementById(sectionType.toLowerCase());
            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                setActiveSection(sectionType);
            }
        }
        
        setIsMenuOpen(false);
    };

    const getSectionTitle = (type) => {
        switch (type) {
            case "PRODUCT_CAROUSEL":
                return "Produtos";
            case "FORM":
                return "Contato";
            case "GALLERY":
                return "Galeria";
            case "AUCT_LIST":
                return "Leilões";
            case "TEXT":
                return "Sobre";
            case "TESTIMONIALS":
                return "Depoimentos";
            default:
                return type;
        }
    };

    const allMenuItems = [
        { id: 'home', title: 'Home', icon: <Home className="w-5 h-5" /> },
        ...sections?.map(section => ({
            id: section.type,
            title: getSectionTitle(section.type),
            icon: null
        })) || [],
        { id: 'info', title: 'Informações', icon: <Info className="w-5 h-5" /> }
    ];

    return (
        <nav 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
                ${scrolled ? 'shadow-lg' : 'bg-transparent'}
                ${isMenuOpen ? 'h-screen' : ''}`}
            style={{ 
                fontFamily: fontStyle,
                ...(scrolled ? getGradientStyle() : {})
            }}
        >
            {/* Container da Navegação */}
            <div className="w-[80%] mx-auto">
                {/* Barra de Navegação Principal */}
                <div className="flex items-center justify-between h-20">
                    {/* Logo ou Nome */}
                    <div className="flex-shrink-0">
                        <h1 onClick={()=> navigate('/')} 
                        className={`text-2xl font-bold transition-colors duration-300 cursor-pointer ${getTextStyle(scrolled)}`}>
                            AUKT
                        </h1>
                    </div>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        {allMenuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`relative px-2 py-1 transition-colors duration-300 flex items-center gap-2
                                    ${getTextStyle(scrolled)} hover:opacity-80
                                    ${activeSection === item.id ? 'font-semibold' : 'font-medium'}`}
                            >
                                {item.icon}
                                {item.title}
                                {activeSection === item.id && (
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 ${getTextStyle(scrolled)} transform origin-left transition-transform duration-300`} />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Botão Menu Mobile */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg transition-colors duration-300"
                    >
                        {isMenuOpen ? (
                            <Close className={`text-2xl ${getTextStyle(scrolled)}`} />
                        ) : (
                            <Menu className={`text-2xl ${getTextStyle(scrolled)}`} />
                        )}
                    </button>
                </div>

                {/* Menu Mobile */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full" style={getGradientStyle()}>
                        <div className="flex flex-col space-y-4 p-6">
                            {allMenuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`text-left px-4 py-3 rounded-lg transition-all duration-300
                                        flex items-center gap-3
                                        ${activeSection === item.id 
                                            ? 'bg-white/20 text-white font-semibold' 
                                            : 'text-white hover:bg-white/10'}`}
                                >
                                    {item.icon}
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default RenderNavigationAdvertiser;