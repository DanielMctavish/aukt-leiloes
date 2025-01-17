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

//abstratos...........................................

//cores e gradientes................................
const colorOptions = [
    // Cores Neutras
    { id: 'solid-white', label: 'Branco', value: '#ffffff' },
    { id: 'solid-gray-50', label: 'Cinza Claro', value: '#f9fafb' },
    { id: 'solid-gray-100', label: 'Cinza Suave', value: '#f3f4f6' },
    { id: 'solid-gray-200', label: 'Cinza Médio', value: '#e5e7eb' },
    { id: 'solid-gray-800', label: 'Cinza Escuro', value: '#1f2937' },
    { id: 'solid-black', label: 'Preto', value: '#000000' },
    
    // Azuis
    { id: 'solid-blue-50', label: 'Azul Claro', value: '#eff6ff' },
    { id: 'solid-blue-200', label: 'Azul Suave', value: '#bfdbfe' },
    { id: 'solid-blue-500', label: 'Azul', value: '#3b82f6' },
    { id: 'solid-blue-700', label: 'Azul Escuro', value: '#1d4ed8' },
    
    // Vermelhos
    { id: 'solid-red-50', label: 'Vermelho Claro', value: '#fef2f2' },
    { id: 'solid-red-200', label: 'Vermelho Suave', value: '#fecaca' },
    { id: 'solid-red-500', label: 'Vermelho', value: '#ef4444' },
    { id: 'solid-red-700', label: 'Vermelho Escuro', value: '#b91c1c' },
    
    // Verdes
    { id: 'solid-green-50', label: 'Verde Claro', value: '#f0fdf4' },
    { id: 'solid-green-200', label: 'Verde Suave', value: '#bbf7d0' },
    { id: 'solid-green-500', label: 'Verde', value: '#22c55e' },
    { id: 'solid-green-700', label: 'Verde Escuro', value: '#15803d' },
    
    // Roxos
    { id: 'solid-purple-50', label: 'Roxo Claro', value: '#faf5ff' },
    { id: 'solid-purple-200', label: 'Roxo Suave', value: '#e9d5ff' },
    { id: 'solid-purple-500', label: 'Roxo', value: '#a855f7' },
    { id: 'solid-purple-700', label: 'Roxo Escuro', value: '#7e22ce' },
    
    // Amarelos
    { id: 'solid-yellow-50', label: 'Amarelo Claro', value: '#fefce8' },
    { id: 'solid-yellow-200', label: 'Amarelo Suave', value: '#fef08a' },
    { id: 'solid-yellow-500', label: 'Amarelo', value: '#eab308' },
    { id: 'solid-yellow-700', label: 'Amarelo Escuro', value: '#a16207' },
    
    // Laranjas
    { id: 'solid-orange-50', label: 'Laranja Claro', value: '#fff7ed' },
    { id: 'solid-orange-200', label: 'Laranja Suave', value: '#fed7aa' },
    { id: 'solid-orange-500', label: 'Laranja', value: '#f97316' },
    { id: 'solid-orange-700', label: 'Laranja Escuro', value: '#c2410c' },
];

const gradientOptions = [
    // Gradientes Azuis
    { 
        id: 'gradient-blue-modern', 
        label: 'Azul Moderno',
        value: 'linear-gradient(45deg, #1e40af, #3b82f6, #93c5fd)'
    },
    { 
        id: 'gradient-blue-night', 
        label: 'Noite Azul',
        value: 'linear-gradient(45deg, #1e3a8a, #1e40af, #3b82f6)'
    },
    
    // Gradientes Roxos
    { 
        id: 'gradient-purple-luxury', 
        label: 'Roxo Luxo',
        value: 'linear-gradient(45deg, #581c87, #7e22ce, #a855f7)'
    },
    { 
        id: 'gradient-purple-sunset', 
        label: 'Pôr do Sol Roxo',
        value: 'linear-gradient(45deg, #6b21a8, #9333ea, #d8b4fe)'
    },
    
    // Gradientes Verdes
    { 
        id: 'gradient-green-nature', 
        label: 'Natureza',
        value: 'linear-gradient(45deg, #14532d, #15803d, #22c55e)'
    },
    { 
        id: 'gradient-green-fresh', 
        label: 'Verde Fresco',
        value: 'linear-gradient(45deg, #166534, #22c55e, #86efac)'
    },
    
    // Gradientes Quentes
    { 
        id: 'gradient-sunset-warm', 
        label: 'Pôr do Sol Quente',
        value: 'linear-gradient(45deg, #7c2d12, #c2410c, #fb923c)'
    },
    { 
        id: 'gradient-fire', 
        label: 'Fogo',
        value: 'linear-gradient(45deg, #991b1b, #dc2626, #f97316)'
    },
    
    // Gradientes Modernos
    { 
        id: 'gradient-modern-1', 
        label: 'Moderno 1',
        value: 'linear-gradient(45deg, #6366f1, #a855f7, #ec4899)'
    },
    { 
        id: 'gradient-modern-2', 
        label: 'Moderno 2',
        value: 'linear-gradient(45deg, #0ea5e9, #6366f1, #a855f7)'
    },
    
    // Gradientes Suaves
    { 
        id: 'gradient-soft-blue', 
        label: 'Azul Suave',
        value: 'linear-gradient(45deg, #bfdbfe, #93c5fd, #60a5fa)'
    },
    { 
        id: 'gradient-soft-green', 
        label: 'Verde Suave',
        value: 'linear-gradient(45deg, #bbf7d0, #86efac, #4ade80)'
    },
    
    // Gradientes Escuros
    { 
        id: 'gradient-dark-1', 
        label: 'Escuro Elegante',
        value: 'linear-gradient(45deg, #020617, #1e293b, #334155)'
    },
    { 
        id: 'gradient-dark-2', 
        label: 'Escuro Moderno',
        value: 'linear-gradient(45deg, #18181b, #27272a, #3f3f46)'
    },
    
    // Gradientes Corporativos
    { 
        id: 'gradient-corporate-1', 
        label: 'Corporativo 1',
        value: 'linear-gradient(45deg, #0f172a, #1e293b, #334155)'
    },
    { 
        id: 'gradient-corporate-2', 
        label: 'Corporativo 2',
        value: 'linear-gradient(45deg, #1e3a8a, #1e40af, #2563eb)'
    }
];

function BackgroundImageControls({ background, onUpdate }) {
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
        onUpdate({
            image: url,
            opacity: background?.opacity || 30,
            blur: background?.blur || 2,
            brightness: background?.brightness || 100
        });
    };

    const handleColorChange = (colorValue) => {
        onUpdate({
            ...background,
            image: null,
            gradient: null,
            color: colorValue,
            opacity: background?.opacity || 100,
            blur: 0,
            brightness: background?.brightness || 100
        });
    };

    const handleGradientChange = (gradientValue) => {
        onUpdate({
            ...background,
            image: null,
            color: null,
            gradient: gradientValue,
            opacity: background?.opacity || 100,
            blur: 0,
            brightness: background?.brightness || 100
        });
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
                <Image className="text-gray-500" />
                Personalização de Fundo
            </h4>

            {/* Seção de Imagens */}
            <div className="mb-8">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Imagens</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {backgroundOptions.map((bg) => (
                        <button
                            key={bg.id}
                            onClick={() => handleBackgroundChange(bg.url)}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                background?.image === bg.url
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
            </div>

            {/* Seção de Cores Sólidas */}
            <div className="mb-8">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Cores Sólidas</h5>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                    {colorOptions.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => handleColorChange(color.value)}
                            className={`
                                w-full aspect-square rounded-lg overflow-hidden
                                border-2 transition-all
                                ${background?.color === color.value 
                                    ? 'border-blue-500 scale-105 shadow-lg' 
                                    : 'border-gray-200 hover:border-blue-200'
                                }
                            `}
                        >
                            <div 
                                className="w-full h-full"
                                style={{ backgroundColor: color.value }}
                            >
                                <span className="sr-only">{color.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Seção de Gradientes */}
            <div className="mb-8">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Gradientes</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {gradientOptions.map((gradient) => (
                        <button
                            key={gradient.id}
                            onClick={() => handleGradientChange(gradient.value)}
                            className={`
                                w-full aspect-video rounded-lg overflow-hidden
                                border-2 transition-all
                                ${background?.gradient === gradient.value 
                                    ? 'border-blue-500 scale-105 shadow-lg' 
                                    : 'border-gray-200 hover:border-blue-200'
                                }
                            `}
                        >
                            <div 
                                className="w-full h-full"
                                style={{ background: gradient.value }}
                            >
                                <span className="sr-only">{gradient.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {(background?.image || background?.color || background?.gradient) && (
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
                            value={background.opacity}
                            onChange={(e) => onUpdate({
                                ...background,
                                opacity: parseInt(e.target.value)
                            })}
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
                            value={background.blur}
                            onChange={(e) => onUpdate({
                                ...background,
                                blur: parseInt(e.target.value)
                            })}
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
                            value={background.brightness}
                            onChange={(e) => onUpdate({
                                ...background,
                                brightness: parseInt(e.target.value)
                            })}
                            className="w-full accent-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default BackgroundImageControls;
