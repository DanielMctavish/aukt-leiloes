/* eslint-disable react/prop-types */
import { GridView, Store } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AuctListSectionControls({ section, index, onUpdate }) {
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
            {/* Itens por Linha */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GridView className="text-gray-400 text-sm" />
                    Itens por Linha
                </label>
                <div className="flex gap-2">
                    {[2, 3, 4].map((num) => (
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

            {/* Opções de Exibição */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Informações Exibidas
                </label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={section.config.showProductCount}
                            onChange={(e) => handleConfigUpdate({ showProductCount: e.target.checked })}
                            className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Quantidade de Produtos</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={section.config.showStartDate}
                            onChange={(e) => handleConfigUpdate({ showStartDate: e.target.checked })}
                            className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Data de Início</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={section.config.showEndDate}
                            onChange={(e) => handleConfigUpdate({ showEndDate: e.target.checked })}
                            className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Data de Término</span>
                    </label>
                </div>
            </div>

            {/* Lista de Leilões Disponíveis */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Store className="text-gray-400 text-sm" />
                    Leilões Disponíveis
                </label>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {aucts.map((auct) => (
                        <div 
                            key={auct.id} 
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">{auct.title}</h4>
                                    <p className="text-sm text-gray-500">
                                        {auct.product_list?.length || 0} produtos
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AuctListSectionControls; 