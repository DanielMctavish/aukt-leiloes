/* eslint-disable react/prop-types */
import {
    Facebook,
    Instagram,
    LinkedIn,
    Twitter,
    YouTube,
    WhatsApp,
    MusicNote
} from "@mui/icons-material";

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

function RenderFooterAdvertiser({ footer, fontStyle }) {
    // Função para determinar a altura e padding baseado no tamanho selecionado
    const getFooterStyles = () => {
        switch (footer.sizeType) {
            case 'SMALL':
                return {
                    height: 'min-h-[40vh]',
                    mainPadding: 'py-12',
                };
            case 'MEDIUM':
                return {
                    height: 'min-h-[60vh]',
                    mainPadding: 'py-16',
                };
            case 'LARGE':
                return {
                    height: 'min-h-[80vh]',
                    mainPadding: 'py-20',
                };
            default:
                return {
                    height: 'min-h-[60vh]',
                    mainPadding: 'py-16',
                };
        }
    }

    const styles = getFooterStyles();

    // Função para pegar o ícone da rede social de forma segura
    const getSocialIcon = (type) => {
        if (!type) return null;
        const normalizedType = type.toLowerCase();
        return SOCIAL_ICONS[normalizedType] || null;
    }

    // Função para formatar a URL corretamente
    const formatUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    }

    return (
        <footer
            className={`w-full ${styles.height} flex flex-col justify-between transition-all`}
            style={{
                backgroundColor: footer.color,
                fontFamily: fontStyle,
                color: footer.textColor,
            }}
        >
            {/* Seções do Footer */}
            <div className={`flex-grow ${styles.mainPadding}`}>
                <div className="w-[80%] mx-auto h-full flex flex-col">
                    {/* Grid de Seções */}
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {footer.sections?.map((section, index) => (
                            <div key={index} className="flex flex-col gap-6">
                                <h3 className="text-xl font-semibold">
                                    {section.title}
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {section.links.map((link, linkIndex) => (
                                        <a
                                            key={linkIndex}
                                            href={formatUrl(link.url)}
                                            className="hover:opacity-80 transition-opacity text-base"
                                            style={{ color: footer.textColor }}
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

                    {/* Redes Sociais */}
                    {footer.showSocialLinks && footer.socialMedia?.length > 0 && (
                        <div
                            className="flex justify-center gap-8 mt-12 pt-12"
                            style={{ borderTop: `1px solid ${footer.borderColor}` }}
                        >
                            {footer.socialMedia.map((social, index) => {
                                const icon = getSocialIcon(social.type);
                                if (!icon) return null;

                                return (
                                    <a
                                        key={index}
                                        href={formatUrl(social.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-3xl hover:opacity-80 transition-all duration-300 hover:scale-110"
                                        style={{ color: footer.textColor }}
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
                className="w-full py-6"
                style={{
                    backgroundColor: footer.borderColor,
                    color: footer.textColor
                }}
            >
                <div className="w-[80%] mx-auto text-center">
                    <p className="text-sm">© {new Date().getFullYear()} {footer.companyName}. Todos os direitos reservados | AUKT Tech.</p>
                </div>
            </div>
        </footer>
    );
}

export default RenderFooterAdvertiser;