/* eslint-disable react/prop-types */
import { ViewCarousel, GridView, Speed, Image, Store } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GallerySectionControls({ section, index, onUpdate }) {
    const [aucts, setAucts] = useState([]);
    const { advertiser_id } = useParams();

    useEffect(() => {
        const fetchAucts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                    params: {
                        creator_id: advertiser_id
                    }
                });
                setAucts(response.data);
            } catch (error) {
                console.error("Erro ao buscar leilões:", error);
            }
        };

        if (advertiser_id) {
            fetchAucts();
        }
    }, [advertiser_id]);

    const handleConfigUpdate = (updates) => {
        onUpdate(index, {
            ...section.config,
            ...updates
        });
    };

    return (
        <div className="space-y-6">
            {/* Seleção do Leilão */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Store className="text-gray-400 text-sm" />
                    Selecione o Leilão
                </label>
                <select
                    value={section.config.selectedAuctId || ''}
                    onChange={(e) => handleConfigUpdate({ selectedAuctId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"
                >
                    <option value="">Selecione um leilão</option>
                    {aucts.map((auct) => (
                        <option key={auct.id} value={auct.id}>
                            {auct.title} ({auct.product_list?.length || 0} produtos)
                        </option>
                    ))}
                </select>
            </div>

            {/* Layout */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GridView className="text-gray-400 text-sm" />
                    Layout
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleConfigUpdate({ layout: 'grid' })}
                        className={`flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                            section.config.layout === 'grid'
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                    >
                        <GridView /> Grade
                    </button>
                    <button
                        onClick={() => handleConfigUpdate({ layout: 'carousel' })}
                        className={`flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                            section.config.layout === 'carousel'
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                    >
                        <ViewCarousel /> Carrossel
                    </button>
                </div>
            </div>

            {/* Itens por Linha */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Image className="text-gray-400 text-sm" />
                    Itens por Linha
                </label>
                <div className="flex gap-2">
                    {[2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleConfigUpdate({ itemsPerRow: num })}
                            className={`flex-1 p-3 rounded-lg border transition-all ${
                                section.config.itemsPerRow === num
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Velocidade (apenas para carrossel) */}
            {section.config.layout === 'carousel' && (
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Speed className="text-gray-400 text-sm" />
                        Velocidade de Transição
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={section.config.speed / 1000}
                            onChange={(e) => handleConfigUpdate({ speed: e.target.value * 1000 })}
                            className="w-full accent-blue-500"
                        />
                        <span className="text-sm text-gray-500 w-16 text-right">
                            {section.config.speed / 1000}s
                        </span>
                    </div>
                </div>
            )}

            {/* Opções de Exibição */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opções de Exibição
                </label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={section.config.showTitle}
                            onChange={(e) => handleConfigUpdate({ showTitle: e.target.checked })}
                            className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Mostrar Título</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={section.config.showPrice}
                            onChange={(e) => handleConfigUpdate({ showPrice: e.target.checked })}
                            className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Mostrar Preço</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default GallerySectionControls; 