/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Image, Opacity, BlurOn, LightMode } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Importando as imagens de background
import bgAntiguidades from '../../../media/backgrounds/templates/BACKGROUND-ANTIGUIDADES.jpg';
import bgCds from '../../../media/backgrounds/templates/BACKGROUND-CDS.jpg';
import bgInstrumentos from '../../../media/backgrounds/templates/BACKGROUND-INSTRUMENTOS.jpg';
import bgLivros from '../../../media/backgrounds/templates/BACKGROUND-LIVROS.jpg';
import bgMiniaturas from '../../../media/backgrounds/templates/BACKGROUND-MINIATURAS.jpg';
import bgMoveis from '../../../media/backgrounds/templates/BACKGROUND-MOVEIS.jpg';
import bgRelogios from '../../../media/backgrounds/templates/BACKGROUND-RELOGIOS.jpg';
import bgVideoGames from '../../../media/backgrounds/templates/BACKGROUND-VIDEO-GAMES.jpg';

function BackgroundImageControls({ template, updateHeader }) {
    const [advertiser, setAdvertiser] = useState(null);
    const { advertiser_id } = useParams();

    useEffect(() => {
        const fetchAdvertiser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-advertiser?advertiserId=${advertiser_id}`);
                setAdvertiser(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do anunciante:", error);
            }
        };

        if (advertiser_id) {
            fetchAdvertiser();
        }
    }, [advertiser_id]);

    const backgroundOptions = [
        { id: 'none', url: null, label: 'Sem imagem' },
        { id: 'company-logo', url: advertiser?.url_profile_company_logo_cover, label: 'Capa da Empresa' },
        { id: 'antiguidades', url: bgAntiguidades, label: 'Antiguidades' },
        { id: 'cds', url: bgCds, label: 'CDs' },
        { id: 'instrumentos', url: bgInstrumentos, label: 'Instrumentos' },
        { id: 'livros', url: bgLivros, label: 'Livros' },
        { id: 'miniaturas', url: bgMiniaturas, label: 'Miniaturas' },
        { id: 'moveis', url: bgMoveis, label: 'Móveis' },
        { id: 'relogios', url: bgRelogios, label: 'Relógios' },
        { id: 'videogames', url: bgVideoGames, label: 'Video Games' }
    ];

    const handleBackgroundChange = (url) => {
        // Limpa o background atual antes de definir o novo
        updateHeader('backgroundImage', null);
        
        // Pequeno timeout para garantir que a limpeza seja processada
        setTimeout(() => {
            updateHeader('backgroundImage', url);
        }, 50);
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
                <Image className="text-gray-500" />
                Imagem de Fundo
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {backgroundOptions.map((bg) => (
                    <button
                        key={bg.id}
                        onClick={() => handleBackgroundChange(bg.url)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            template.header.backgroundImage === bg.url
                                ? 'border-blue-500 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-blue-200'
                        }`}
                    >
                        {bg.url ? (
                            <img
                                src={bg.url}
                                alt={bg.label}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-sm text-gray-500">{bg.label}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-medium">{bg.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            {template.header.backgroundImage && (
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Opacity className="text-gray-400 text-sm" />
                            Opacidade
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={template.header.backgroundImageOpacity}
                            onChange={(e) => updateHeader('backgroundImageOpacity', parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <BlurOn className="text-gray-400 text-sm" />
                            Desfoque
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={template.header.backgroundImageBlur}
                            onChange={(e) => updateHeader('backgroundImageBlur', parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <LightMode className="text-gray-400 text-sm" />
                            Brilho
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={template.header.backgroundImageBrightness}
                            onChange={(e) => updateHeader('backgroundImageBrightness', parseInt(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default BackgroundImageControls;
