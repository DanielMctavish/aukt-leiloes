/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import {
    Facebook,
    Instagram,
    LinkedIn,
    Twitter,
    YouTube,
    WhatsApp,
    MusicNote
} from "@mui/icons-material";
import { useEffect } from 'react';

// Mapeamento de ícones para cada tipo de rede social
const SOCIAL_ICONS = {
    'facebook': <Facebook />,
    'instagram': <Instagram />,
    'twitter': <Twitter />,
    'linkedin': <LinkedIn />,
    'youtube': <YouTube />,
    'tiktok': <MusicNote />,
    'whatsapp': <WhatsApp />
};

function FooterTemplate() {
    const { footerData } = useSelector(state => state.footer);
    const { headerData } = useSelector(state => state.header);

    useEffect(() => {
        // console.log("observando o footerData",footerData)
    }, [footerData])

    // Função para determinar a cor do texto baseado na paleta
    const getTextColor = () => {
        const palette = headerData.colorPalette?.toLowerCase();
        switch (palette) {
            case 'clean':
                return footerData.textColor || '#333333';
            case 'candy':
                return footerData.textColor || '#ffffff';
            case 'dark':
                return '#ffffff';
            case 'monochromatic':
                return '#ffffff';
            default:
                return footerData.textColor || '#333333';
        }
    };

    // Função para determinar a altura e padding baseado no tamanho selecionado
    const getFooterStyles = () => {
        switch (footerData.sizeType) {
            case 'SMALL':
                return {
                    height: 'min-h-[30vh]',
                    mainPadding: 'py-4',
                };
            case 'MEDIUM':
                return {
                    height: 'min-h-[60vh]',
                    mainPadding: 'py-8',
                };
            case 'LARGE':
                return {
                    height: 'min-h-[100vh]',
                    mainPadding: 'py-16',
                };
            default:
                return {
                    height: 'min-h-[60vh]',
                    mainPadding: 'py-8',
                };
        }
    }

    const styles = getFooterStyles();

    // Função para dividir as seções em grupos de 4 (melhor distribuição)
    const getSectionRows = () => {
        const rows = [];
        const sections = footerData.sections || [];
        for (let i = 0; i < sections.length; i += 4) {
            rows.push(sections.slice(i, i + 4));
        }
        return rows;
    }

    // Função para pegar o ícone da rede social de forma segura
    const getSocialIcon = (type) => {
        if (!type) return null;
        const normalizedType = type.toLowerCase();
        return SOCIAL_ICONS[normalizedType] || null;
    }

    const textColor = getTextColor();

    return (
        <footer
            className={`w-full ${styles.height} flex flex-col justify-between transition-all`}
            style={{
                backgroundColor: footerData.color,
                fontFamily: headerData.fontStyle,
                color: textColor,
            }}
        >
            {/* Seções do Footer */}
            <div className={`w-full ${styles.mainPadding}`}>
                <div className="container mx-auto px-4 md:px-6">
                    {/* Organiza as seções em linhas */}
                    <div className="flex flex-col gap-8 md:gap-12">
                        {getSectionRows().map((row, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {row.map((section, index) => (
                                    <div key={index} className="flex flex-col gap-4">
                                        <h3 className="text-lg font-semibold text-center md:text-left">
                                            {section.title}
                                        </h3>
                                        <div className="flex flex-col gap-2">
                                            {section.links.map((link, linkIndex) => (
                                                <a
                                                    key={linkIndex}
                                                    href={link.url}
                                                    className="hover:opacity-80 transition-opacity text-center md:text-left"
                                                    style={{ color: textColor }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {link.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Redes Sociais */}
                    {footerData.showSocialLinks && footerData.socialMedia?.length > 0 && (
                        <div
                            className="flex justify-center gap-6 mt-8 pt-8"
                            style={{ borderTop: `1px solid ${textColor}` }}
                        >
                            {footerData.socialMedia.map((social, index) => {
                                const icon = getSocialIcon(social.type);
                                if (!icon) return null;

                                return (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-2xl hover:opacity-80 transition-opacity"
                                        style={{ color: textColor }}
                                    >
                                        {icon}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Copyright */}
            <div
                className="w-full py-4"
                style={{
                    backgroundColor: footerData.borderColor,
                    color: textColor
                }}
            >
                <div className="container mx-auto px-4 md:px-6 text-center text-sm">
                    <p>© {new Date().getFullYear()} {footerData.companyName}. Todos os direitos reservados | AUKT Tech.</p>
                </div>
            </div>
        </footer>
    );
}

export default FooterTemplate;
