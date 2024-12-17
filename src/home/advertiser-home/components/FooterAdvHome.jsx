/* eslint-disable react/prop-types */
import { Instagram, Facebook, YouTube, Twitter, LinkedIn, MusicNote, WhatsApp, Language } from '@mui/icons-material';


function FooterAdvHome({ footer }) {
    if (!footer) return null;

    const getSocialIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'instagram': return <Instagram />;
            case 'facebook': return <Facebook />;
            case 'youtube': return <YouTube />;
            case 'twitter': return <Twitter />;
            case 'linkedin': return <LinkedIn />;
            case 'tiktok': return <MusicNote />;
            case 'whatsapp': return <WhatsApp />;
            default: return <Language />;
        }
    };

    return (
        <footer
            className="w-full relative overflow-hidden"
            style={{
                backgroundColor: footer.color,
                minHeight: footer.sizeType === "SMALL" ? "25vh" :
                    footer.sizeType === "MEDIUM" ? "50vh" :
                        footer.sizeType === "LARGE" ? "75vh" : "50vh"
            }}
        >
            <div className="container mx-auto px-4 lg:px-8 py-12">
                {/* Footer Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {footer.sections?.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="font-bold text-lg" style={{ color: footer.textColor }}>
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links?.map((link, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-80 transition-opacity"
                                            style={{ color: footer.textColor }}
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Social Media */}
                {footer.showSocialLinks && (
                    <div className="flex justify-center gap-4 border-t border-opacity-20 mb-8"
                        style={{ borderColor: footer.borderColor }}>
                        <div className="pt-8 flex gap-6">
                            {footer.socialMedia?.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-opacity text-2xl"
                                    style={{ color: footer.textColor }}
                                >
                                    {getSocialIcon(social.type)}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Copyright */}
            <div
                className="w-full py-4 bottom-0 absolute"
                style={{
                    backgroundColor: footer.borderColor,
                    color: footer.textColor
                }}
            >
                <div className="container mx-auto px-4 md:px-6 text-center text-sm">
                    <p>© {new Date().getFullYear()}. Todos os direitos reservados | {footer.companyName || 'Arboris Codex'}.</p>
                </div>
            </div>
        </footer>
    );
}

export default FooterAdvHome; 