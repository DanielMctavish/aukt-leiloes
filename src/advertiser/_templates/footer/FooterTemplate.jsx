/* eslint-disable react/prop-types */
import { Facebook, Twitter, Instagram, LinkedIn, Place, Phone, Email } from '@mui/icons-material';

function FooterTemplate({ getSizeClass, template }) {
    // Função para garantir que a URL tenha o protocolo correto
    const formatUrl = (url) => {
        if (!url) return '#';
        if (url === '#') return url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    };

    return (
        <footer
            className={`w-full ${getSizeClass(template.footer.sizeType)} flex flex-col justify-between`}
            style={{ 
                backgroundColor: template.footer.color,
                color: template.footer.textColor
            }}
        >
            {/* Seção Principal */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Seções Dinâmicas */}
                    {Object.values(template.footer.sections).map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-2 relative"
                                style={{ 
                                    borderColor: template.footer.borderColor,
                                }}
                            >
                                {section.title}
                                <span 
                                    className="absolute bottom-0 left-0 w-12 h-0.5 transition-all duration-300"
                                    style={{ backgroundColor: template.footer.borderColor }}
                                ></span>
                            </h3>
                            <div className="flex flex-col space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <a 
                                        key={linkIndex} 
                                        href={formatUrl(link.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center hover:translate-x-2 transition-all duration-300"
                                    >
                                        <span 
                                            className="w-1.5 h-1.5 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            style={{ backgroundColor: template.footer.textColor }}
                                        ></span>
                                        <span className="hover:opacity-80 transition-opacity">
                                            {link.label}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Conecte-se e Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-2 relative"
                            style={{ borderColor: template.footer.borderColor }}
                        >
                            Conecte-se
                            <span 
                                className="absolute bottom-0 left-0 w-12 h-0.5 transition-all duration-300"
                                style={{ backgroundColor: template.footer.borderColor }}
                            ></span>
                        </h3>
                        
                        {/* Newsletter */}
                        <div className="flex flex-col space-y-2">
                            <input 
                                type="email" 
                                placeholder="Seu e-mail"
                                className="px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                                style={{ 
                                    color: template.footer.textColor,
                                    borderColor: template.footer.borderColor 
                                }}
                            />
                            <button 
                                className="px-4 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                                style={{ 
                                    backgroundColor: template.footer.borderColor,
                                    color: template.footer.color
                                }}
                            >
                                Inscrever-se
                            </button>
                        </div>

                        {/* Redes Sociais */}
                        {template.footer.showSocialLinks && (
                            <div className="flex space-x-4 mt-6">
                                {Object.entries(template.footer.socialLinks).map(([platform, url]) => (
                                    url && (
                                        <a 
                                            key={platform}
                                            href={formatUrl(url)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="transform hover:scale-110 transition-all duration-300"
                                        >
                                            <div 
                                                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-all duration-300"
                                                style={{ backgroundColor: template.footer.borderColor }}
                                            >
                                                {platform === 'facebook' && <Facebook className="text-xl" style={{ color: template.footer.color }} />}
                                                {platform === 'twitter' && <Twitter className="text-xl" style={{ color: template.footer.color }} />}
                                                {platform === 'instagram' && <Instagram className="text-xl" style={{ color: template.footer.color }} />}
                                                {platform === 'linkedin' && <LinkedIn className="text-xl" style={{ color: template.footer.color }} />}
                                            </div>
                                        </a>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div 
                className="w-full py-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
                <div className="container mx-auto px-6 text-center text-sm">
                    <p>© {new Date().getFullYear()} {template.footer.companyName}. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default FooterTemplate;
