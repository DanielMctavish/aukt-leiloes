/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSectionsData } from "../../../../../features/template/SectionsSlice";
import axios from "axios";

function GalleryProductsSection({advertiserAucts, setIsModalProductGallery}){
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const [selectedAuct, setSelectedAuct] = useState("");
    const [selectedAuctProducts, setSelectedAuctProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        selectedAuctId: null,
        layout: "GRID",
        itemsPerRow: 3,
        showPrice: true,
        showTitle: true
    });

    const fetchProducts = async (advertiser_id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-advertiser?advertiserId=${advertiser_id}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`
                }
            });
            
            const productsFromSelectedAuct = response.data.filter(product => product.auct_id === selectedAuct);
            setSelectedAuctProducts(productsFromSelectedAuct);

            // Atualiza o Redux apenas após ter os produtos
            if (productsFromSelectedAuct.length > 0) {
                const existingGalleryIndex = sectionsData.sections.findIndex(section => 
                    section.type === "GALLERY" && section.config.selectedAuctId === selectedAuct
                );

                if (existingGalleryIndex === -1) {
                    const newSection = {
                        type: "GALLERY",
                        config: {
                            ...config,
                            selectedAuctId: selectedAuct
                        },
                        color: "#ffffff",
                        sizeType: "MEDIUM"
                    };

                    dispatch(updateSectionsData({
                        sections: [...sectionsData.sections, newSection]
                    }));
                }
            }
        } catch (error) {
            console.error("Erro ao buscar produtos:", error.message);
            setSelectedAuctProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedAuct) {
            const auct = advertiserAucts.find(a => a.id === selectedAuct);
            if (auct) {
                fetchProducts(auct.advertiser_id);
            }
        } else {
            setSelectedAuctProducts([]);
        }
    }, [selectedAuct]);

    const handleCloseModal = () => {
        setIsModalProductGallery(false);
    };

    const handleAuctChange = (e) => {
        const value = e.target.value;
        setSelectedAuct(value);
        setConfig(prev => ({
            ...prev,
            selectedAuctId: value
        }));
    };

    const handleConfigChange = (key, value) => {
        const newConfig = {
            ...config,
            [key]: value
        };
        setConfig(newConfig);

        // Atualiza o Redux apenas se já tivermos produtos
        if (selectedAuctProducts.length > 0) {
            const existingGalleryIndex = sectionsData.sections.findIndex(section => 
                section.type === "GALLERY" && section.config.selectedAuctId === selectedAuct
            );

            if (existingGalleryIndex !== -1) {
                const updatedSections = [...sectionsData.sections];
                updatedSections[existingGalleryIndex] = {
                    ...updatedSections[existingGalleryIndex],
                    config: newConfig
                };

                dispatch(updateSectionsData({
                    sections: updatedSections
                }));
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getGridColumns = (itemsPerRow) => {
        return `grid-cols-1 sm:grid-cols-2 ${
            itemsPerRow >= 3 ? 'md:grid-cols-3' : ''
        } ${
            itemsPerRow >= 4 ? 'lg:grid-cols-4' : ''
        } ${
            itemsPerRow >= 5 ? 'xl:grid-cols-5' : ''
        } ${
            itemsPerRow >= 6 ? '2xl:grid-cols-6' : ''
        }`;
    };

    return(
        <div className="w-full h-[100vh] fixed top-0 left-0 bg-black/90
        flex justify-center items-center z-[999] backdrop-blur-md overflow-y-auto">

            <div className="w-[90%] h-[90%] bg-white rounded-2xl shadow-2xl flex flex-col 
            gap-8 items-center relative p-8 overflow-y-auto">
                <button 
                    onClick={handleCloseModal} 
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                    <Close className="text-gray-500 hover:text-gray-700" />
                </button>
                
                <div className="text-center relative w-full pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-[#036982]">Galeria de Produtos</h1>
                    <p className="text-gray-500 mt-2">Personalize a exibição dos seus produtos em grid</p>
                </div>

                <div className="w-full max-w-4xl flex flex-col gap-8">
                    {/* Seleção do Leilão */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <label className="text-lg font-semibold text-[#036982] mb-4 block">
                            Selecione o Leilão
                        </label>
                        <select 
                            value={selectedAuct}
                            onChange={handleAuctChange}
                            className="w-full bg-white border-2 border-[#036982]/20 p-3 text-gray-700 rounded-lg
                            focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all">
                            <option value="">Selecione o leilão</option>
                            {advertiserAucts?.map((auct) => (
                                <option key={auct.id} value={auct.id}>{auct.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Configurações */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h2 className="text-lg font-semibold text-[#036982] mb-6">Configurações de Exibição</h2>
                        
                        <div className="space-y-6">
                            {/* Itens por Linha */}
                            <div className="space-y-2">
                                <label className="font-medium text-gray-700 block">Itens por Linha</label>
                                <select
                                    value={config.itemsPerRow}
                                    onChange={(e) => handleConfigChange("itemsPerRow", parseInt(e.target.value))}
                                    className="w-full bg-white border-2 border-gray-200 p-3 rounded-lg text-gray-700
                                    focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                >
                                    {[2,3,4,5,6].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Item' : 'Itens'}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Opções de Visualização */}
                            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={config.showTitle}
                                            onChange={(e) => handleConfigChange("showTitle", e.target.checked)}
                                            className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                        />
                                        <span className="text-gray-700">Mostrar Título</span>
                                    </label>

                                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={config.showPrice}
                                            onChange={(e) => handleConfigChange("showPrice", e.target.checked)}
                                            className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                        />
                                        <span className="text-gray-700">Mostrar Preço</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prévia */}
                    {loading ? (
                        <div className="w-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#036982]/20 border-t-[#036982]"></div>
                            <p className="text-gray-500 mt-4">Carregando produtos...</p>
                        </div>
                    ) : selectedAuctProducts.length > 0 ? (
                        <div className="w-full bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-[#036982] mb-6">Prévia da Galeria</h3>
                            <div className={`grid ${getGridColumns(config.itemsPerRow)} gap-4`}>
                                {selectedAuctProducts.map((product) => (
                                    <div key={product.id} 
                                        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="aspect-square overflow-hidden">
                                            <img 
                                                src={product.cover_img_url} 
                                                alt={product.title}
                                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        {(config.showTitle || config.showPrice) && (
                                            <div className="p-4">
                                                {config.showTitle && (
                                                    <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:line-clamp-none transition-all">
                                                        {product.title}
                                                    </h4>
                                                )}
                                                {config.showPrice && (
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-sm text-gray-500">Valor Inicial</span>
                                                        <p className="text-lg font-bold text-[#036982]">
                                                            {formatCurrency(product.initial_value)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : selectedAuct && (
                        <div className="w-full text-center py-12 bg-gray-50 rounded-xl">
                            <p className="text-gray-500">Nenhum produto encontrado para este leilão.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GalleryProductsSection;