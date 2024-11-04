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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Sobre */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-6 border-b-2 pb-2"
                            style={{ borderColor: template.footer.borderColor }}>
                            {template.footer.sections.about.title}
                        </h3>
                        <div className="flex flex-col space-y-2">
                            {template.footer.sections.about.links.map((link, index) => (
                                <a key={index} 
                                    href={formatUrl(link.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:translate-x-2 transition-transform duration-300 hover:opacity-80">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Serviços */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-6 border-b-2 pb-2"
                            style={{ borderColor: template.footer.borderColor }}>
                            {template.footer.sections.services.title}
                        </h3>
                        <div className="flex flex-col space-y-2">
                            {template.footer.sections.services.links.map((link, index) => (
                                <a key={index} 
                                    href={formatUrl(link.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:translate-x-2 transition-transform duration-300 hover:opacity-80">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contato */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-6 border-b-2 pb-2"
                            style={{ borderColor: template.footer.borderColor }}>
                            {template.footer.sections.contact.title}
                        </h3>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center gap-3">
                                <Phone className="text-xl" />
                                <a href="tel:+551112345678" 
                                    className="hover:opacity-80 transition-opacity">
                                    +55 11 1234-5678
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Email className="text-xl" />
                                <a href="mailto:contato@empresa.com" 
                                    className="hover:opacity-80 transition-opacity">
                                    contato@empresa.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Place className="text-xl" />
                                <span>São Paulo, SP</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter e Redes Sociais */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-6 border-b-2 pb-2"
                            style={{ borderColor: template.footer.borderColor }}>
                            Conecte-se
                        </h3>
                        {/* Newsletter */}
                        <div className="flex flex-col space-y-2">
                            <input 
                                type="email" 
                                placeholder="Seu e-mail"
                                className="px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                Inscrever-se
                            </button>
                        </div>
                        {/* Redes Sociais */}
                        {template.footer.showSocialLinks && (
                            <div className="flex space-x-4 mt-4">
                                <a href={formatUrl(template.footer.socialLinks.facebook)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="transform hover:scale-110 transition-transform">
                                    <Facebook className="text-2xl hover:opacity-80 transition-opacity" />
                                </a>
                                <a href={formatUrl(template.footer.socialLinks.twitter)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="transform hover:scale-110 transition-transform">
                                    <Twitter className="text-2xl hover:opacity-80 transition-opacity" />
                                </a>
                                <a href={formatUrl(template.footer.socialLinks.instagram)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="transform hover:scale-110 transition-transform">
                                    <Instagram className="text-2xl hover:opacity-80 transition-opacity" />
                                </a>
                                <a href={formatUrl(template.footer.socialLinks.linkedin)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="transform hover:scale-110 transition-transform">
                                    <LinkedIn className="text-2xl hover:opacity-80 transition-opacity" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="w-full py-4" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Arboris Codex. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default FooterTemplate;
