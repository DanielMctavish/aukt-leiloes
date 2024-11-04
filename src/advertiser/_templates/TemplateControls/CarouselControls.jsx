/* eslint-disable react/prop-types */
import { ViewCarousel, Speed, Image, Settings, Store } from '@mui/icons-material';
import TextPositionControls from './TextPositionControls';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CarouselControls({ carousel, onUpdate }) {
    const [aucts, setAucts] = useState([]);
    const [selectedAuct, setSelectedAuct] = useState(null);
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

    const handleChange = (property, value) => {
        onUpdate({
            ...carousel,
            [property]: value
        });
    };

    const handleAuctChange = (auctId) => {
        const selectedAuct = aucts.find(auct => auct.id === auctId);
        setSelectedAuct(selectedAuct);
        onUpdate({
            ...carousel,
            selectedAuctId: auctId,
            products: selectedAuct?.product_list || []
        });
    };

    return (
        <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <ViewCarousel className="text-gray-500" />
                    <h4 className="font-medium">Carrossel de Produtos</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={carousel.enabled}
                        onChange={(e) => handleChange('enabled', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-[#012038]"></div>
                </label>
            </div>

            {carousel.enabled && (
                <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                    {/* Seleção do Leilão */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Store className="text-gray-400 text-sm" />
                            Selecione o Leilão
                        </label>
                        <select
                            value={carousel.selectedAuctId || ''}
                            onChange={(e) => handleAuctChange(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                            focus:ring-[#012038] focus:border-[#012038]"
                        >
                            <option value="">Selecione um leilão</option>
                            {aucts.map((auct) => (
                                <option key={auct.id} value={auct.id}>
                                    {auct.title} ({auct.product_list?.length || 0} produtos)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Título */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Settings className="text-gray-400 text-sm" />
                            Título do Carrossel
                        </label>
                        <input
                            type="text"
                            value={carousel.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                            focus:ring-[#012038] focus:border-[#012038]"
                            placeholder="Digite o título do carrossel"
                        />
                    </div>

                    {/* Largura */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Largura do Carrossel
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="25"
                                max="100"
                                step="5"
                                value={parseInt(carousel.size.width)}
                                onChange={(e) => handleChange('size', {
                                    ...carousel.size,
                                    width: `${e.target.value}%`
                                })}
                                className="w-full accent-blue-500"
                            />
                            <span className="text-sm text-gray-500 w-20 text-right">
                                {carousel.size.width}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 px-2 mt-1">
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Altura */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Altura do Carrossel
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="200"
                                max="600"
                                step="50"
                                value={parseInt(carousel.size.height)}
                                onChange={(e) => handleChange('size', {
                                    ...carousel.size,
                                    height: `${e.target.value}px`
                                })}
                                className="w-full accent-blue-500"
                            />
                            <span className="text-sm text-gray-500 w-20 text-right">{carousel.size.height}</span>
                        </div>
                    </div>

                    {/* Itens Visíveis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Image className="text-gray-400 text-sm" />
                            Quantidade de Imagens
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleChange('itemsToShow', num)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        carousel.itemsToShow === num
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Velocidade */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Speed className="text-gray-400 text-sm" />
                            Velocidade de Transição
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={carousel.speed / 1000}
                                onChange={(e) => handleChange('speed', e.target.value * 1000)}
                                className="w-full accent-blue-500"
                            />
                            <span className="text-sm text-gray-500 w-20 text-right">{carousel.speed / 1000}s</span>
                        </div>
                    </div>

                    {/* Posição */}
                    <TextPositionControls
                        text={{ position: carousel.position }}
                        onPositionChange={(_, newPosition) => handleChange('position', newPosition)}
                        label="Posição do Carrossel"
                    />

                    {/* Visibilidade dos elementos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visibilidade dos Elementos
                        </label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={carousel.showTitle !== false}
                                    onChange={(e) => handleChange('showTitle', e.target.checked)}
                                    className="rounded text-[#012038] focus:ring-[#012038]"
                                />
                                <span className="text-sm text-gray-600">Título do Produto</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={carousel.showPrice !== false}
                                    onChange={(e) => handleChange('showPrice', e.target.checked)}
                                    className="rounded text-[#012038] focus:ring-[#012038]"
                                />
                                <span className="text-sm text-gray-600">Preço</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={carousel.showCarouselTitle !== false}
                                    onChange={(e) => handleChange('showCarouselTitle', e.target.checked)}
                                    className="rounded text-[#012038] focus:ring-[#012038]"
                                />
                                <span className="text-sm text-gray-600">Título do Carrossel</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={carousel.showNavigation !== false}
                                    onChange={(e) => handleChange('showNavigation', e.target.checked)}
                                    className="rounded text-[#012038] focus:ring-[#012038]"
                                />
                                <span className="text-sm text-gray-600">Setas de Navegação</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarouselControls;
