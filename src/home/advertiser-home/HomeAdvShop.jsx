/* eslint-disable react-hooks/exhaustive-deps */
import auk_logo from "../../media/logos/logos-auk/aukt_blue.png"
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Clear, ViewModule, ViewList, Search } from "@mui/icons-material";
import debounce from 'lodash/debounce';
import carimboImage from "../../media/carimbo.png";
import HomeNav from './components/HomeNav';
import FooterAdvHome from './components/FooterAdvHome';
import LoginClientModalAdv from './modal/LoginClientModalAdv';
import PaginationAdvShop from './components/PaginationAdvShop';



function HomeAdvShop() {
    const [currentAuct, setCurrentAuction] = useState({});
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [pagesCount, setPagesCount] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [viewMode, setViewMode] = useState('card'); // Novo estado para controlar o modo de visualização
    const [template, setTemplate] = useState(null);
    const [filters, setFilters] = useState({
        min_initial_value: '',
        max_initial_value: '',
        highlight_only: false,
        has_bids: false,
        has_winner: false,
        order: {
            type: 'lote',
            direction: 'asc'
        }
    });

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const navigate = useNavigate();
    const { auct_id } = useParams();

    const [allProducts, setAllProducts] = useState([]); // Novo estado para todos os produtos
    const ITEMS_PER_PAGE = 12; // Constante para itens por página


    useEffect(() => {
        getAuctionById();
    }, [auct_id]);

    useEffect(() => {
        if (currentAuct.advertiser_id) {
            getAdvertiserTemplate();
        }
    }, [currentAuct.advertiser_id]);

    useEffect(() => {
        if (currentAuct.id) {
            applyFilters();
        }
    }, [searchQuery, selectedCategory, selectedGroup, currentAuct, currentPage, filters]);

    const getAuctionById = async () => {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct`, {
            params: { auct_id }
        });
        setCurrentAuction(response.data);
        
        // Definir os produtos iniciais já ordenados por lote
        if (response.data.product_list) {
            const sortedProducts = [...response.data.product_list].sort((a, b) => a.lote - b.lote);
            setProductsFiltered(sortedProducts);
            setTotalProducts(sortedProducts.length);
            const totalPages = Math.ceil(sortedProducts.length / 12);
            setPagesCount(Array.from({ length: totalPages }, (_, i) => i));
        }
    };

    const getAdvertiserTemplate = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/template/find`, {
                params: { advertiserId: currentAuct.advertiser_id }
            });

            if (response.data && response.data[0]) {
                const templateData = response.data[0];
                setTemplate({
                    ...templateData,
                    header: {
                        ...templateData.header,
                        elements: templateData.header?.elements || {},
                        colorPalette: templateData.colorPalette || 'clean'
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    };

   

    const debouncedSearch = debounce((query) => {
        setSearchQuery(query);
        setCurrentPage(0);
    }, 300);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        if (query.length >= 3 || query.length === 0) {
            debouncedSearch(query);
        }
    };

    const applyFilters = async () => {
        setIsLoading(true);
        try {
            const params = {
                auct_id: currentAuct.id,
                take: 999,
                advertiser_id: currentAuct.advertiser_id,

                // Filtros de busca
                title: searchQuery || undefined,
                description_contains: searchQuery || undefined,

                // Filtros de grupo
                group: selectedGroup || undefined,

                // Filtros de valor - Convertendo para número
                min_initial_value: filters.min_initial_value ? Number(filters.min_initial_value) : undefined,
                max_initial_value: filters.max_initial_value ? Number(filters.max_initial_value) : undefined,

                // Filtros de status
                has_bids: filters.has_bids || undefined,
                has_winner: filters.has_winner || undefined,
                highlight_only: filters.highlight_only || undefined,

                // Ordenação
                lote_order: filters.order.type === 'lote' ? filters.order.direction : undefined,
                initial_value_order: filters.order.type === 'value' ? filters.order.direction : undefined,
                bid_count_order: filters.order.type === 'bids' ? filters.order.direction : undefined,
                created_at_order: filters.order.type === 'date' ? filters.order.direction : undefined
            };

            // Remover parâmetros undefined e valores zero
            Object.keys(params).forEach(key => {
                if (params[key] === undefined || params[key] === 0) {
                    delete params[key];
                }
            });

            // Log para debug
            console.log('Parâmetros de filtro:', params);

            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, 
                { params }
            );

            let products = [];
            if (response.data?.products) {
                products = response.data.products;
            } else if (Array.isArray(response.data)) {
                products = response.data;
            }

            // Guardar todos os produtos
            setAllProducts(products);
            
            // Calcular total de páginas
            const total = products.length;
            setTotalProducts(total);
            const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
            setPagesCount(Array.from({ length: totalPages }, (_, i) => i));

            // Aplicar paginação no frontend
            const start = currentPage * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            setProductsFiltered(products.slice(start, end));

        } catch (error) {
            console.error('Erro ao filtrar produtos:', error);
            setAllProducts([]);
            setProductsFiltered([]);
            setTotalProducts(0);
            setPagesCount([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Atualizar produtos filtrados quando mudar de página
    useEffect(() => {
        if (allProducts.length > 0) {
            const start = currentPage * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            setProductsFiltered(allProducts.slice(start, end));
        }
    }, [currentPage, allProducts]);

    const handleOrderChange = (type) => {
        setFilters(prev => ({
            ...prev,
            order: {
                type,
                direction: prev.order.type === type && prev.order.direction === 'asc' ? 'desc' : 'asc'
            }
        }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedGroup('');
        setFilters({
            min_initial_value: '',
            max_initial_value: '',
            highlight_only: false,
            has_bids: false,
            has_winner: false,
            order: { type: '', direction: 'asc' }
        });
        setCurrentPage(0);
    };

    const renderProducts = () => {
        // Garantir que productsFiltered seja um array antes de usar map
        if (!Array.isArray(productsFiltered)) {
            console.error('productsFiltered não é um array:', productsFiltered);
            return null;
        }

        if (isLoading) {
            return (
                <div className="flex justify-center items-center w-full h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (productsFiltered.length === 0) {
            return (
                <div className="flex justify-center items-center w-full h-40">
                    <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
                </div>
            );
        }

        if (viewMode === 'card') {
            return productsFiltered.map(product => (
                <div
                    key={product.id}
                    className={`
                        group flex flex-col w-full sm:w-[280px] bg-white rounded-xl shadow-lg overflow-hidden 
                        cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
                        ${product.winner_id ? 'border-2 border-[#0c4866]' : ''}
                    `}
                    onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                >
                    {/* Imagem Container */}
                    <div className="relative h-[160px] sm:h-[220px] overflow-hidden">
                        <img 
                            src={product.cover_img_url} 
                            alt={product.title} 
                            className="w-full h-full object-cover transform transition-transform duration-500 
                                group-hover:scale-110"
                        />
                        
                        {/* Overlay com gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                                <p className="text-white text-xs sm:text-sm line-clamp-2">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* Badge de Status */}
                        {product.winner_id && (
                            <div className="absolute top-0 right-0 m-2 sm:m-3">
                                <img 
                                    src={carimboImage} 
                                    alt="Arrematado"
                                    className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] object-contain transform rotate-12" 
                                />
                            </div>
                        )}

                        {/* Badge de Lote */}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/70 px-2 sm:px-3 py-1 rounded-full">
                            <span className="text-white text-xs sm:text-sm font-medium">
                                Lote {product.lote}
                            </span>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-sm sm:text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-[#012038] 
                            transition-colors">
                            {product.title}
                        </h3>

                        {/* Informações Adicionais */}
                        <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Valor Inicial</p>
                                    <p className="text-base sm:text-lg font-bold text-[#012038]">
                                        {new Intl.NumberFormat('pt-BR', { 
                                            style: 'currency', 
                                            currency: 'BRL' 
                                        }).format(product.initial_value)}
                                    </p>
                                </div>
                                {product.Bid?.length > 0 && (
                                    <div className="text-right">
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Lances</p>
                                        <p className="text-base sm:text-lg font-bold text-green-600">
                                            {product.Bid.length}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ));
        } else {
            // Modo Lista
            return (
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-4 text-left font-medium text-gray-600">Status</th>
                                <th className="p-4 text-left font-medium text-gray-600">Lote</th>
                                <th className="p-4 text-left font-medium text-gray-600">Título</th>
                                <th className="p-4 text-left font-medium text-gray-600">Valor Inicial</th>
                                <th className="p-4 text-left font-medium text-gray-600">Lances</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {productsFiltered.map(product => (
                                <tr
                                    key={product.id}
                                    onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="p-4">
                                        {product.winner_id && (
                                            <img
                                                src={carimboImage}
                                                alt="Arrematado"
                                                className="w-8 h-8 object-contain"
                                            />
                                        )}
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">
                                        {product.lote}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={product.cover_img_url} 
                                                alt="" 
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{product.title}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-[#012038]">
                                        {new Intl.NumberFormat('pt-BR', { 
                                            style: 'currency', 
                                            currency: 'BRL' 
                                        }).format(product.initial_value)}
                                    </td>
                                    <td className="p-4 font-medium text-green-600">
                                        {product.Bid?.length || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

   

    return (
        <div 
            className="flex flex-col w-full min-h-screen justify-start items-center"
            style={{ 
                fontFamily: template?.fontStyle,
                backgroundColor: template?.header?.color || '#0D1733' 
            }}
        >
            {/* Navbar com estilo do template */}
            <HomeNav 
                sections={[]} 
                header={template?.header}
                advertiser_id={currentAuct.advertiser_id}
                isShop={true}
                onLoginClick={() => setIsLoginModalOpen(true)}
            />

            {/* Header */}
            <div 
                className="flex w-full min-h-[30vh] sm:min-h-[40vh] overflow-hidden relative mt-[8vh]"
                style={{ backgroundColor: template?.header?.color || 'white' }}
            >
                <img 
                    src={currentAuct.auct_cover_img || ""} 
                    alt="" 
                    className="object-cover absolute w-full h-full"
                    style={{ 
                        opacity: template?.header?.backgroundImageOpacity || 1,
                        filter: `blur(${template?.header?.backgroundImageBlur || 0}px) 
                            brightness(${(template?.header?.backgroundImageBrightness || 1) * 100}%)`
                    }}
                />
                
                <div 
                    onClick={() => navigate(`/advertiser/home/${currentAuct.advertiser_id}`)}
                    className="flex justify-center items-center fixed top-2 left-2 z-50 bg-white 
                        p-2 rounded-md cursor-pointer opacity-30 hover:opacity-100 transition-all duration-300"
                >
                    <img src={auk_logo} alt="" className="w-[30px] h-[30px] object-cover" />
                </div>
            </div>

            {/* Body Main - Melhorado para Mobile */}
            <div className="flex flex-col w-full sm:w-[90%] lg:w-[80%] min-h-[140vh] mb-[3vh] mt-[3vh] rounded-xl 
                overflow-hidden bg-white shadow-2xl">
                {/* Capa com degradê usando cores do template */}
                <div 
                    className="w-full h-auto py-6 sm:py-8 text-white px-4 sm:px-8 relative overflow-hidden"
                    style={{ 
                        background: `linear-gradient(to right, 
                            ${template?.header?.color || '#1a237e'}cc,
                            ${template?.header?.color || '#3f51b5'}99)`
                    }}
                >
                    {/* Efeito de overlay */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    {/* Conteúdo */}
                    <div className="relative z-10">
                        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{currentAuct.title}</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
                            <span>
                                {currentAuct.auct_dates && 
                                    dayjs(currentAuct.auct_dates[0].date_auct).format('DD MMM')}
                            </span>
                            <span className="hidden sm:block">-</span>
                            <span>
                                {currentAuct.auct_dates && 
                                    dayjs(currentAuct.auct_dates[currentAuct.auct_dates.length - 1].date_auct)
                                        .format('DD MMM YYYY')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filtros - Versão Mobile Otimizada */}
                <div className="w-full bg-white p-4 sm:p-8">
                    {/* Barra de Pesquisa e Filtros Principais */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {/* Barra de Pesquisa */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                onChange={handleSearchChange}
                                className="w-full h-11 pl-11 pr-4 bg-gray-50 rounded-lg text-sm
                                    border-none focus:ring-2 focus:ring-blue-100 transition-all
                                    placeholder-gray-400"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        </div>

                        {/* Grupos */}
                        <select
                            value={selectedGroup}
                            onChange={(e) => {
                                setSelectedGroup(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full h-11 px-4 bg-gray-50 rounded-lg text-sm text-gray-600
                                border-none focus:ring-2 focus:ring-blue-100 transition-all
                                cursor-pointer appearance-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '1.5em 1.5em'
                            }}
                        >
                            <option value="">Selecione um grupo</option>
                            {currentAuct.auct_dates?.map((date, i) => (
                                <option key={i} value={date.group}>Grupo {date.group}</option>
                            ))}
                        </select>

                        {/* Ordenação */}
                        <select
                            value={filters.order.type}
                            onChange={(e) => handleOrderChange(e.target.value)}
                            className="w-full h-11 px-4 bg-gray-50 rounded-lg text-sm text-gray-600
                                border-none focus:ring-2 focus:ring-blue-100 transition-all
                                cursor-pointer appearance-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '1.5em 1.5em'
                            }}
                        >
                            <option value="">Ordenar por</option>
                            <option value="lote">Número do Lote {filters.order.direction === 'asc' ? '↑' : '↓'}</option>
                            <option value="value">Valor {filters.order.direction === 'asc' ? '↑' : '↓'}</option>
                            <option value="bids">Quantidade de Lances {filters.order.direction === 'asc' ? '↑' : '↓'}</option>
                            <option value="date">Data de Criação {filters.order.direction === 'asc' ? '↑' : '↓'}</option>
                        </select>

                        {/* Visualização - Ajustado para Mobile */}
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`flex-1 h-11 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                    viewMode === 'card' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <ViewModule fontSize="small" />
                                <span className="text-sm">Cards</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex-1 h-11 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                    viewMode === 'list' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <ViewList fontSize="small" />
                                <span className="text-sm">Lista</span>
                            </button>
                        </div>
                    </div>

                    {/* Filtros Avançados - Versão Mobile */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
                        {/* Checkboxes */}
                        <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.highlight_only}
                                    onChange={(e) => setFilters(prev => ({
                                        ...prev,
                                        highlight_only: e.target.checked
                                    }))}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 rounded flex items-center justify-center transition-colors
                                    ${filters.highlight_only ? 'bg-blue-500' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                                    {filters.highlight_only && <span className="text-white text-xs">✓</span>}
                                </span>
                                <span className="text-sm text-gray-600">Destaques</span>
                            </label>

                            <label className="inline-flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.has_bids}
                                    onChange={(e) => setFilters(prev => ({
                                        ...prev,
                                        has_bids: e.target.checked
                                    }))}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 rounded flex items-center justify-center transition-colors
                                    ${filters.has_bids ? 'bg-blue-500' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                                    {filters.has_bids && <span className="text-white text-xs">✓</span>}
                                </span>
                                <span className="text-sm text-gray-600">Com lances</span>
                            </label>
                        </div>

                        {/* Filtros de Valor - Versão Mobile */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                                type="number"
                                placeholder="R$ Min"
                                value={filters.min_initial_value}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilters(prev => ({
                                        ...prev,
                                        min_initial_value: value === '' ? '' : Number(value)
                                    }));
                                }}
                                min="0"
                                step="1"
                                className="flex-1 sm:w-28 h-11 px-3 bg-gray-50 rounded-lg text-sm
                                    border-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="R$ Max"
                                value={filters.max_initial_value}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    max_initial_value: e.target.value
                                }))}
                                className="flex-1 sm:w-28 h-11 px-3 bg-gray-50 rounded-lg text-sm
                                    border-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        {/* Botão Limpar - Versão Mobile */}
                        {(searchQuery || selectedGroup || filters.order.type || 
                          filters.highlight_only || filters.has_bids || 
                          filters.min_initial_value || filters.max_initial_value) && (
                            <button
                                onClick={clearFilters}
                                className="w-full sm:w-auto h-11 px-4 text-sm text-red-500 hover:text-red-600 
                                    transition-colors flex items-center justify-center gap-2 sm:ml-auto
                                    bg-red-50 hover:bg-red-100 rounded-lg"
                            >
                                <Clear fontSize="small" />
                                Limpar filtros
                            </button>
                        )}
                    </div>

                    {/* Contador de Resultados */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            {totalProducts} {totalProducts === 1 ? 'produto encontrado' : 'produtos encontrados'}
                        </span>
                    </div>
                </div>

                {/* Grid de Produtos - Versão Mobile Otimizada */}
                <div className={`w-full p-3 sm:p-6 bg-gray-50 ${
                    viewMode === 'card' 
                        ? 'grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-6' 
                        : ''
                }`}>
                    {renderProducts()}
                </div>

                {/* Paginação - Versão Mobile Otimizada */}
                <div className="px-3 sm:px-6 py-4 bg-white border-t border-gray-100">
                    <PaginationAdvShop
                        pages_count={pagesCount}
                        current_page={currentPage}
                        setcurrentpage={setCurrentPage}
                    />
                </div>

                {/* Footer */}
                {template?.footer && <FooterAdvHome footer={template.footer} />}

                {/* Modal de Login */}
                <LoginClientModalAdv 
                    modalOn={isLoginModalOpen}
                    setIsModalOn={setIsLoginModalOpen}
                    header={template?.header}
                    fontStyle={template?.fontStyle}
                />
            </div>
        </div>
    );
}

export default HomeAdvShop;