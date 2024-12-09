/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import {
    Person, Home, Collections, ContactPage,
    Gavel, Article
} from '@mui/icons-material';
import logo_aukt from '../../../media/logos/logos-auk/aukt_blue.png';

function HomeNav({ sections }) {
    const navigate = useNavigate();

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
        // Primeiro, vamos pegar todos os elementos section
        const allSections = document.querySelectorAll('section');
        let targetSection = null;

        // Procuramos a primeira seção do tipo correspondente
        allSections.forEach((section) => {
            if (!targetSection) {
                const sectionType = section.getAttribute('data-section-type');
                if (sectionType === targetType) {
                    targetSection = section;
                }
            }
        });

        // Se encontrou a seção, rola até ela
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="w-full h-[8vh] bg-white shadow-2xl shadow-[#161616a9] fixed top-0 z-[99]">
            <div className="container mx-auto h-full px-4 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Logo e Nome */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logo_aukt}
                            alt="AUK Logo"
                            className="h-8"
                        />
                        <span className="text-[#012038] font-bold text-xl hidden md:block">
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
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#012038] 
                                        transition-colors text-sm"
                                >
                                    {icon}
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-4">
                        {/* Site Principal */}
                        <a
                            href="https://aukt.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 hover:text-[#012038] 
                                transition-colors text-sm"
                        >
                            <Home className="text-xl" />
                            <span className="hidden md:block">AUKT</span>
                        </a>
                        <button
                            onClick={() => navigate('/floor/hub')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#012038] 
                            transition-colors text-sm"
                        >
                            <Gavel className="text-xl" />
                        </button>

                        {/* Login Cliente */}
                        <button
                            onClick={() => navigate('/client/login')}
                            className="flex items-center gap-2 bg-[#012038] text-white px-4 py-2 
                                rounded-full hover:bg-[#012038]/90 transition-colors text-sm"
                        >
                            <Person className="text-xl" />
                            <span className="hidden md:block">Área do Cliente</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default HomeNav; 