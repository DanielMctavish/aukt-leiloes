/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSectionsData } from "../../../../../features/template/SectionsSlice";
import axios from "axios";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function CarroselProductsSectionControls({advertiserAucts, setIsModalCarroselProducts}){
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const [selectedAuct, setSelectedAuct] = useState("");
    const [selectedAuctProducts, setSelectedAuctProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        selectedAuctId: null,
        layout: "contained",
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
                const existingCarouselIndex = sectionsData.sections.findIndex(section => section.type === "PRODUCT_CAROUSEL");
                const newSection = {
                    type: "PRODUCT_CAROUSEL",
                    config: {
                        ...config,
                        selectedAuctId: selectedAuct,
                        autoplay: true,
                        speed: 3000
                    },
                    color: "#ffffff",
                    sizeType: "MEDIUM"
                };

                if (existingCarouselIndex !== -1) {
                    // Se já existe um carrossel, atualiza ele
                    const updatedSections = [...sectionsData.sections];
                    updatedSections[existingCarouselIndex] = newSection;
                    dispatch(updateSectionsData({
                        sections: updatedSections
                    }));
                } else {
                    // Se não existe, cria um novo
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
        setIsModalCarroselProducts(false);
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
            const existingCarouselIndex = sectionsData.sections.findIndex(section => section.type === "PRODUCT_CAROUSEL");
            const newSection = {
                type: "PRODUCT_CAROUSEL",
                config: newConfig,
                color: "#ffffff",
                sizeType: "MEDIUM"
            };

            if (existingCarouselIndex !== -1) {
                // Se já existe um carrossel, atualiza ele
                const updatedSections = [...sectionsData.sections];
                updatedSections[existingCarouselIndex] = newSection;
                dispatch(updateSectionsData({
                    sections: updatedSections
                }));
            }
        }
    };

    const handleLayoutChange = (layout) => {
        handleConfigChange("layout", layout);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
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
                    <h1 className="text-3xl font-bold text-[#036982]">Configuração do Carrosel</h1>
                    <p className="text-gray-500 mt-2">Personalize a exibição dos seus produtos</p>
                </div>

                <div className="w-full max-w-4xl flex flex-col gap-8">
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

                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h2 className="text-lg font-semibold text-[#036982] mb-6">Configurações de Exibição</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="font-medium text-gray-700 block">Tipo de Layout</label>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => handleLayoutChange("full")}
                                        className={`p-4 rounded-lg transition-all ${
                                            config.layout === "full" 
                                                ? "bg-[#036982] text-white shadow-lg" 
                                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#036982]/50"
                                        }`}>
                                        Carrosel Completo
                                    </button>
                                    <button 
                                        onClick={() => handleLayoutChange("contained")}
                                        className={`p-4 rounded-lg transition-all ${
                                            config.layout === "contained" 
                                                ? "bg-[#036982] text-white shadow-lg" 
                                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#036982]/50"
                                        }`}>
                                        Carrosel Contido
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="font-medium text-gray-700 block">Itens por Linha</label>
                                <select
                                    value={config.itemsPerRow}
                                    onChange={(e) => handleConfigChange("itemsPerRow", parseInt(e.target.value))}
                                    className="w-full bg-white border-2 border-gray-200 p-3 rounded-lg text-gray-700
                                    focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                >
                                    {[1,2,3,4,5,6,7].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Item' : 'Itens'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-white rounded-lg border-2 border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={config.autoplay}
                                        onChange={(e) => handleConfigChange("autoplay", e.target.checked)}
                                        className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                    />
                                    <span className="text-gray-700">Autoplay</span>
                                </label>
                            </div>

                            {config.autoplay && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <label className="font-medium text-gray-700 block mb-2">
                                        Velocidade do Autoplay (ms)
                                    </label>
                                    <input
                                        type="number"
                                        value={config.speed}
                                        onChange={(e) => handleConfigChange("speed", parseInt(e.target.value))}
                                        min="1000"
                                        step="500"
                                        className="w-full md:w-1/3 bg-white border-2 border-gray-200 p-2 rounded-lg
                                        focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="w-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#036982]/20 border-t-[#036982]"></div>
                            <p className="text-gray-500 mt-4">Carregando produtos...</p>
                        </div>
                    ) : selectedAuctProducts.length > 0 ? (
                        <div className="w-full bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-[#036982] mb-6">Prévia do Carrosel</h3>
                            <div className={`w-full ${config.layout === "full" ? "h-[400px]" : "h-[300px] max-w-4xl mx-auto"}`}>
                                <Swiper
                                    modules={[Autoplay, Navigation, Pagination]}
                                    spaceBetween={config.layout === "full" ? 0 : 20}
                                    slidesPerView={config.itemsPerRow}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={config.autoplay ? {
                                        delay: config.speed,
                                        disableOnInteraction: false,
                                    } : false}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1,
                                            spaceBetween: config.layout === "full" ? 0 : 10
                                        },
                                        480: {
                                            slidesPerView: Math.min(2, config.itemsPerRow),
                                            spaceBetween: config.layout === "full" ? 0 : 15
                                        },
                                        768: {
                                            slidesPerView: Math.min(4, config.itemsPerRow),
                                            spaceBetween: config.layout === "full" ? 0 : 15
                                        },
                                        1024: {
                                            slidesPerView: Math.min(5, config.itemsPerRow),
                                            spaceBetween: config.layout === "full" ? 0 : 20
                                        },
                                        1280: {
                                            slidesPerView: config.itemsPerRow,
                                            spaceBetween: config.layout === "full" ? 0 : 20
                                        }
                                    }}
                                    className="w-full h-full rounded-lg overflow-hidden"
                                >
                                    {selectedAuctProducts.map((product) => (
                                        <SwiperSlide key={product.id} className="relative group">
                                            <img 
                                                src={product.cover_img_url} 
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {(config.showTitle || config.showPrice) && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent 
                                                text-white p-6 transform transition-transform duration-300">
                                                    {config.showTitle && (
                                                        <h4 className="text-lg font-semibold mb-2">{product.title}</h4>
                                                    )}
                                                    {config.showPrice && (
                                                        <p className="text-sm opacity-90">
                                                            Valor Inicial: {formatCurrency(product.initial_value)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
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

export default CarroselProductsSectionControls;