/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

function FooterTemplate({ getSizeClass, template }) {
    const [footer, setFooter] = useState(null);
    const { advertiser_id } = useParams();

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/template/find`, {
                    params: { advertiserId: advertiser_id }
                });

                if (response.data && response.data[0]) {
                    const templateData = response.data[0];
                    setFooter(templateData.footer);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do footer:", error);
            }
        };

        if (advertiser_id) {
            fetchFooterData();
        }
    }, [advertiser_id]);

    const formatUrl = (url) => {
        if (!url) return '#';
        if (url === '#') return url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    };

    // Use footer do backend ou template.footer para edição
    const currentFooter = footer || template.footer;

    return (
        <footer
            className={`w-full ${getSizeClass(currentFooter.sizeType)} flex flex-col justify-between`}
            style={{
                backgroundColor: currentFooter.color,
                color: currentFooter.textColor
            }}
        >
            {/* Seção Principal */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Seções Dinâmicas */}
                    {currentFooter.sections && Object.entries(currentFooter.sections).map(([key, section]) => (
                        <div key={key} className="space-y-4">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-2 relative"
                                style={{
                                    borderColor: currentFooter.borderColor,
                                }}
                            >
                                {section.title}
                                <span
                                    className="absolute bottom-0 left-0 w-12 h-0.5 transition-all duration-300"
                                    style={{ backgroundColor: currentFooter.borderColor }}
                                ></span>
                            </h3>
                            <div className="flex flex-col space-y-3">
                                {section.links?.map((link, linkIndex) => (
                                    <a
                                        key={linkIndex}
                                        href={formatUrl(link.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center hover:translate-x-2 transition-all duration-300"
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            style={{ backgroundColor: currentFooter.textColor }}
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
                    {currentFooter.showSocialLinks && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-2 relative"
                                style={{ borderColor: currentFooter.borderColor }}
                            >
                                Conecte-se
                                <span
                                    className="absolute bottom-0 left-0 w-12 h-0.5 transition-all duration-300"
                                    style={{ backgroundColor: currentFooter.borderColor }}
                                ></span>
                            </h3>

                            {/* Redes Sociais */}
                            <div className="flex space-x-4 mt-6">
                                {Object.entries(currentFooter.socialLinks).map(([platform, url]) => (
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
                                                style={{ backgroundColor: currentFooter.borderColor }}
                                            >
                                                {platform === 'facebook' && <Facebook className="text-xl" style={{ color: currentFooter.color }} />}
                                                {platform === 'twitter' && <Twitter className="text-xl" style={{ color: currentFooter.color }} />}
                                                {platform === 'instagram' && <Instagram className="text-xl" style={{ color: currentFooter.color }} />}
                                                {platform === 'linkedin' && <LinkedIn className="text-xl" style={{ color: currentFooter.color }} />}
                                            </div>
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Copyright */}
            <div
                className="w-full py-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
                <div className="container mx-auto px-6 text-center text-sm">
                    <p>© {new Date().getFullYear()} {currentFooter.companyName}. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default FooterTemplate;
