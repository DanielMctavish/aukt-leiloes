/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Close, ViewCarousel, DragIndicator, Visibility, 
    KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setCarouselConfig } from "../../../../../features/template/HeaderSlice";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function CarrouselHeaderControls({ setIsModalSelector }) {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);
    const { advertiser_id } = useParams();
    const [advertiserAucts, setAdvertiserAucts] = useState([]);
    const [selectedAuctProducts, setSelectedAuctProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const [config, setConfig] = useState(headerData.carousel || {
        enabled: false,
        title: "Produtos em Destaque",
        selectedAuctId: null,
        sizeWidth: "100%",
        sizeHeight: "50%",
        itemsToShow: 3,
        speed: 3000,
        positionTop: "0",
        positionLeft: "0",
        showTitle: true,
        showPrice: true,
        showCarouselTitle: true,
        showNavigation: true,
        isDraggable: false
    });

    const [carouselMode, setCarouselMode] = useState('fixed');

    useEffect(() => {
        const fetchAucts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                    params: {
                        creator_id: advertiser_id
                    }
                });
                setAdvertiserAucts(response.data);
            } catch (error) {
                console.error("Erro ao buscar leilões:", error);
            }
        };

        fetchAucts();
    }, [advertiser_id]);

    const fetchProducts = async (auct_id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-advertiser?advertiserId=${advertiser_id}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`
                }
            });
            
            const productsFromSelectedAuct = response.data.filter(product => product.auct_id === auct_id);
            setSelectedAuctProducts(productsFromSelectedAuct);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setSelectedAuctProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAuctChange = (e) => {
        const auct_id = e.target.value;
        setConfig(prev => ({
            ...prev,
            selectedAuctId: auct_id
        }));
        if (auct_id) {
            fetchProducts(auct_id);
        }
    };

    const handleConfigChange = (key, value) => {
        const newConfig = {
            ...config,
            [key]: value
        };
        setConfig(newConfig);
        dispatch(setCarouselConfig(newConfig));
    };

    const handleModeChange = (mode) => {
        setCarouselMode(mode);
        const newConfig = {
            ...config,
            positionTop: mode === 'fixed' ? '0' : config.positionTop,
            positionLeft: mode === 'fixed' ? '0' : config.positionLeft,
            sizeHeight: mode === 'fixed' ? '40%' : config.sizeHeight,
            sizeWidth: mode === 'fixed' ? '100%' : config.sizeWidth,
            spaceBetween: mode === 'fixed' ? 0 : 20,
            isDraggable: mode !== 'fixed'
        };
        setConfig(newConfig);
        dispatch(setCarouselConfig(newConfig));
    };

    const handlePositionChange = (direction) => {
        const step = 5; // 5% por clique
        const newConfig = { ...config };
        
        switch(direction) {
            case 'up':
                newConfig.positionTop = `${parseInt(config.positionTop) - step}%`;
                break;
            case 'down':
                newConfig.positionTop = `${parseInt(config.positionTop) + step}%`;
                break;
            case 'left':
                newConfig.positionLeft = `${parseInt(config.positionLeft) - step}%`;
                break;
            case 'right':
                newConfig.positionLeft = `${parseInt(config.positionLeft) + step}%`;
                break;
        }
        
        setConfig(newConfig);
        dispatch(setCarouselConfig(newConfig));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className={`fixed inset-0 ${!isPreviewMode ? 'bg-black/90' : 'bg-transparent'} 
        flex items-center ${isPreviewMode ? 'justify-start' : 'justify-center backdrop-blur-md'} z-[999]  overflow-hidden`}>
            <div className={`${isPreviewMode ? 'w-[400px] h-full rounded-r-2xl' : 'w-[95%] h-[95%] rounded-2xl'} 
            bg-white shadow-2xl flex relative transition-all duration-500`}>
                {/* Área de Configurações - Lateral */}
                <div className="w-[400px] h-full border-r border-gray-200 flex flex-col overflow-y-auto">
                    <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-[#036982]">Configuração do Carrossel</h1>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                                    className="p-2 rounded-full hover:bg-gray-100 
                                        transition-all duration-200 group"
                                    title={isPreviewMode ? "Modo Tela Cheia" : "Modo Preview"}
                                >
                                    <Visibility className={`text-[#036982] transition-transform duration-300
                                        ${isPreviewMode ? 'rotate-180' : 'rotate-0'}`} />
                                </button>
                                <button 
                                    onClick={() => setIsModalSelector(false)} 
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                                >
                                    <Close className="text-[#036982]" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-2">Configure o carrossel do cabeçalho</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Ativar/Desativar Carrossel */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={config.enabled}
                                        onChange={(e) => handleConfigChange("enabled", e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                                        rounded-full peer peer-checked:after:translate-x-full 
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                        after:bg-white after:rounded-full after:h-5 after:w-5 
                                        after:transition-all peer-checked:bg-[#036982]">
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Modo do Carrossel */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h2 className="text-lg font-semibold text-[#036982] mb-4">Modo do Carrossel</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleModeChange('fixed')}
                                    className="flex-1 p-4 rounded-lg border-2 border-gray-200 hover:border-[#036982]/50"
                                >
                                    Carrossel Fixo
                                </button>
                                <button
                                    onClick={() => handleModeChange('free')}
                                    className="flex-1 p-4 rounded-lg border-2 border-gray-200 hover:border-[#036982]/50"
                                >
                                    Carrossel Livre
                                </button>
                            </div>
                        </div>

                        {config.enabled && (
                            <>
                                {/* Seleção de Leilão */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Selecione o Leilão
                                    </label>
                                    <select 
                                        value={config.selectedAuctId || ""}
                                        onChange={handleAuctChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white
                                        focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                        disabled={loading}
                                    >
                                        <option value="">Selecione um leilão</option>
                                        {advertiserAucts.map(auct => (
                                            <option key={auct.id} value={auct.id}>{auct.title}</option>
                                        ))}
                                    </select>
                                    {loading && (
                                        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#036982] border-t-transparent rounded-full animate-spin"></div>
                                            Carregando produtos...
                                        </div>
                                    )}
                                    {!loading && selectedAuctProducts.length > 0 && (
                                        <div className="mt-2 text-sm text-green-600">
                                            {selectedAuctProducts.length} produtos encontrados
                                        </div>
                                    )}
                                </div>

                                {/* Configurações de Exibição */}
                                <div className="space-y-4">
                                    {/* Título do Carrossel */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Título do Carrossel
                                        </label>
                                        <input
                                            type="text"
                                            value={config.title}
                                            onChange={(e) => handleConfigChange("title", e.target.value)}
                                            placeholder="Ex: Produtos em Destaque"
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white
                                            focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                        />
                                    </div>

                                    {/* Posicionamento */}
                                    {carouselMode !== 'fixed' && (
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-gray-700 mb-3">Controles de Posição</h3>
                                            <div className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={() => handlePositionChange('up')}
                                                    className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all"
                                                >
                                                    <KeyboardArrowUp className="text-[#036982] text-3xl" />
                                                </button>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handlePositionChange('left')}
                                                        className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all"
                                                    >
                                                        <KeyboardArrowLeft className="text-[#036982] text-3xl" />
                                                    </button>
                                                    <div className="w-12 h-12 rounded-full bg-[#036982]/10 flex items-center justify-center">
                                                        <DragIndicator className="text-[#036982]" />
                                                    </div>
                                                    <button
                                                        onClick={() => handlePositionChange('right')}
                                                        className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all"
                                                    >
                                                        <KeyboardArrowRight className="text-[#036982] text-3xl" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handlePositionChange('down')}
                                                    className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all"
                                                >
                                                    <KeyboardArrowDown className="text-[#036982] text-3xl" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dimensões */}
                                    {carouselMode === 'fixed' ? (
                                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                                            <h3 className="font-medium text-gray-700 mb-3">Altura do Carrossel</h3>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="text-sm text-gray-600">Altura</label>
                                                    <span className="text-sm text-gray-600">{config.sizeHeight}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="20"
                                                    max="100"
                                                    value={parseInt(config.sizeHeight)}
                                                    onChange={(e) => handleConfigChange("sizeHeight", `${e.target.value}%`)}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                                                        [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                                                        [&::-webkit-slider-thumb]:bg-[#036982] hover:[&::-webkit-slider-thumb]:bg-[#036982]/90"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                                            <h3 className="font-medium text-gray-700 mb-3">Dimensões</h3>
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <label className="text-sm text-gray-600">Largura</label>
                                                        <span className="text-sm text-gray-600">{config.sizeWidth}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="20"
                                                        max="100"
                                                        value={parseInt(config.sizeWidth)}
                                                        onChange={(e) => handleConfigChange("sizeWidth", `${e.target.value}%`)}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                                                            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                                                            [&::-webkit-slider-thumb]:bg-[#036982] hover:[&::-webkit-slider-thumb]:bg-[#036982]/90"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <label className="text-sm text-gray-600">Altura</label>
                                                        <span className="text-sm text-gray-600">{config.sizeHeight}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="20"
                                                        max="100"
                                                        value={parseInt(config.sizeHeight)}
                                                        onChange={(e) => handleConfigChange("sizeHeight", `${e.target.value}%`)}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                                                            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                                                            [&::-webkit-slider-thumb]:bg-[#036982] hover:[&::-webkit-slider-thumb]:bg-[#036982]/90"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Configurações do Carrossel */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Itens por Slide
                                            </label>
                                            <input
                                                type="number"
                                                value={config.itemsToShow}
                                                onChange={(e) => handleConfigChange("itemsToShow", parseInt(e.target.value))}
                                                min="1"
                                                max="5"
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white
                                                focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Velocidade (ms)
                                            </label>
                                            <input
                                                type="number"
                                                value={config.speed}
                                                onChange={(e) => handleConfigChange("speed", parseInt(e.target.value))}
                                                min="1000"
                                                step="500"
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white
                                                focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Opções de Exibição */}
                                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-gray-700 mb-3">Opções de Exibição</h3>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={config.showTitle}
                                                onChange={(e) => handleConfigChange("showTitle", e.target.checked)}
                                                className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                            />
                                            <span className="text-sm text-gray-700">Mostrar Título dos Produtos</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={config.showPrice}
                                                onChange={(e) => handleConfigChange("showPrice", e.target.checked)}
                                                className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                            />
                                            <span className="text-sm text-gray-700">Mostrar Preço dos Produtos</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={config.showCarouselTitle}
                                                onChange={(e) => handleConfigChange("showCarouselTitle", e.target.checked)}
                                                className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                            />
                                            <span className="text-sm text-gray-700">Mostrar Título do Carrossel</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={config.showNavigation}
                                                onChange={(e) => handleConfigChange("showNavigation", e.target.checked)}
                                                className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                            />
                                            <span className="text-sm text-gray-700">Mostrar Navegação</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={config.isDraggable}
                                                onChange={(e) => handleConfigChange("isDraggable", e.target.checked)}
                                                className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                            />
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <DragIndicator className="text-gray-400" sx={{ fontSize: '1rem' }} />
                                                Permitir Arrastar
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Área de Preview - Principal */}
                {!isPreviewMode && (
                    <div className="flex-1 bg-gray-900 relative overflow-hidden">
                        {config.enabled && selectedAuctProducts.length > 0 ? (
                            <div className="w-full h-full flex items-center justify-center p-8">
                                <div className="relative w-full h-full max-h-[80vh]">
                                    <Swiper
                                        modules={[Navigation, Autoplay, Pagination]}
                                        spaceBetween={config.spaceBetween}
                                        slidesPerView={config.itemsToShow}
                                        navigation={config.showNavigation}
                                        pagination={config.showNavigation ? { clickable: true } : false}
                                        autoplay={{
                                            delay: config.speed,
                                            disableOnInteraction: false,
                                        }}
                                        loop={true}
                                        draggable={config.isDraggable}
                                        className="w-full h-full"
                                        breakpoints={{
                                            320: {
                                                slidesPerView: 1,
                                            },
                                            640: {
                                                slidesPerView: Math.min(2, config.itemsToShow),
                                            },
                                            768: {
                                                slidesPerView: Math.min(3, config.itemsToShow),
                                            },
                                            1024: {
                                                slidesPerView: config.itemsToShow,
                                            },
                                        }}
                                    >
                                        {selectedAuctProducts.map((product) => (
                                            <SwiperSlide key={product.id} className="relative group h-full">
                                                <div className="w-full h-full relative overflow-hidden rounded-lg">
                                                    <img 
                                                        src={product.cover_img_url} 
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {(config.showTitle || config.showPrice) && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent 
                                                        text-white p-4 transform transition-transform duration-300">
                                                            {config.showTitle && (
                                                                <h4 className="text-lg font-semibold mb-2 line-clamp-1">{product.title}</h4>
                                                            )}
                                                            {config.showPrice && (
                                                                <p className="text-sm opacity-90">
                                                                    Valor Inicial: {formatCurrency(product.initial_value)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    {config.showCarouselTitle && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                                                {config.title}
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                                <ViewCarousel sx={{ fontSize: '4rem' }} className="mb-4 opacity-40" />
                                <p className="text-lg">
                                    {!config.enabled 
                                        ? "Ative o carrossel para visualizar o preview" 
                                        : "Selecione um leilão para visualizar o preview"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CarrouselHeaderControls;