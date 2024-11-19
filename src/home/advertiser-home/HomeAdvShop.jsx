/* eslint-disable react-hooks/exhaustive-deps */
import auk_logo from "../../media/logos/logos-auk/aukt_blue.png"
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Clear, ViewModule, ViewList } from "@mui/icons-material";
import PaginationComponent from "./components/Pagination";
import debounce from 'lodash/debounce';
import carimboImage from "../../media/carimbo.png"; // Certifique-se de importar a imagem do carimbo

function HomeAdvShop() {
    const [currentAuct, setCurrentAuction] = useState({});
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [pagesCount, setPagesCount] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState('card'); // Novo estado para controlar o modo de visualização

    const navigate = useNavigate();
    const { auct_id } = useParams();
    const shopWindowShop = useRef();

    useEffect(() => {
        getAuctionById();
    }, [auct_id]);

    useEffect(() => {
        if (currentAuct.id) {
            applyFilters();
            extractCategories();
        }
    }, [searchQuery, selectedCategory, selectedGroup, sortBy, currentAuct, currentPage]);

    const getAuctionById = async () => {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct`, {
            params: { auct_id }
        });
        setCurrentAuction(response.data);
        const totalProductsCount = response.data.product_list ? response.data.product_list.length : 0;
        setTotalProducts(totalProductsCount);
        const totalPages = Math.ceil(totalProductsCount / 12);
        setPagesCount(Array.from({ length: totalPages }, (_, i) => i));
    };

    const extractCategories = () => {
        if (currentAuct.product_list) {
            const allCategories = currentAuct.product_list.flatMap(product => product.categorie);
            const uniqueCategories = [...new Set(allCategories)];
            setCategories(uniqueCategories);
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
                title: searchQuery,
                categorie: selectedCategory,
                group: selectedGroup,
                lote_order: sortBy === 'lote' ? true : undefined,
                initial_value_order: sortBy === 'valor' ? true : undefined,
                bid_count_order: sortBy === 'lances' ? true : undefined,
                take: 12,
                skip: currentPage * 12
            };

            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, { params });

            if (Array.isArray(response.data)) {
                setProductsFiltered(response.data);
            } else {
                setProductsFiltered([]);
            }
        } catch (error) {
            setProductsFiltered([]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedGroup('');
        setSortBy('');
        setCurrentPage(0);
    };

    const renderProducts = () => {
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
                        flex flex-col w-[250px] bg-white rounded-lg shadow-lg overflow-hidden 
                    cursor-pointer hover:shadow-xl transition-shadow relative ${product.winner_id ? 'border-2 border-[#0c4866]' : ''}
                        `}
                    onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                >
                    <img src={product.cover_img_url} alt="" className="h-[200px] w-full object-cover" />
                    {product.winner_id && (
                        <img src={carimboImage} alt="Arrematado"
                            className="absolute top-2 left-2 w-[160px] h-[160px] object-contain transform z-[99]" />
                    )
                    }
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 truncate">{product.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">Lote {product.lote}</p>
                        <p className="text-sm font-semibold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.initial_value)}
                        </p>
                    </div>
                </div>
            ));
        } else {
            return (
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Lote</th>
                            <th className="p-2 text-left">Título</th>
                            <th className="p-2 text-left">Valor Inicial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsFiltered.map(product => (
                            <tr
                                key={product.id}
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                            >
                                <td className="p-2">
                                    {product.Winner && (
                                        <img
                                            src={carimboImage}
                                            alt="Arrematado"
                                            className="w-6 h-6 object-contain"
                                        />
                                    )}
                                </td>
                                <td className="p-2">{product.lote}</td>
                                <td className="p-2">{product.title}</td>
                                <td className="p-2">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.initial_value)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div ref={shopWindowShop} className="flex flex-col w-full min-h-screen bg-[#0D1733] justify-start items-center">

            <div
                onClick={() => navigate(`/advertiser/home/${currentAuct.advertiser_id}`)}
                className="flex justify-center items-center fixed top-2 left-2 z-50 bg-[#fff] 
            p-2 rounded-md cursor-pointer opacity-30 hover:opacity-100 transition-all duration-300">
                <img src={auk_logo} alt="" className="w-[30px] h-[30px] object-cover" />
            </div>

            {/* Header */}
            <div className="flex w-full min-h-[40vh] overflow-hidden bg-white relative">
                <img src={currentAuct.auct_cover_img || ""} alt="" className="object-cover absolute w-full h-full" />
            </div>

            {/* Body Main */}
            <div className="flex flex-col w-[80%] min-h-[140vh] mb-[3vh] mt-[3vh] rounded-[12px] overflow-hidden bg-white shadow-xl">
                {/* Capa com degradê */}
                <div className="w-full h-48 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3f51b5] text-white p-8">
                    <h1 className="text-4xl font-bold mb-2">{currentAuct.title}</h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[0].date_auct).format('DD MMM')}</span>
                        <span>-</span>
                        <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[currentAuct.auct_dates.length - 1].date_auct).format('DD MMM YYYY')}</span>
                    </div>
                </div>

                {/* Filtros */}
                <div className="w-full bg-white shadow-md p-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Pesquisar produtos"
                                onChange={handleSearchChange}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-600"
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-600"
                            >
                                <option value="">Todas as categorias</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <select
                                value={selectedGroup}
                                onChange={(e) => {
                                    setSelectedGroup(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-600"
                            >
                                <option value="">Todos os grupos</option>
                                {currentAuct.auct_dates && currentAuct.auct_dates.map((date, i) => (
                                    <option key={i} value={date.group}>{date.group}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <select
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-600"
                            >
                                <option value="">Ordenar por</option>
                                <option value="lances">Lances</option>
                                <option value="lote">Lotes</option>
                                <option value="valor">Valor</option>
                            </select>
                        </div>
                        {(searchQuery || selectedCategory || selectedGroup || sortBy) && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                            >
                                <Clear sx={{ fontSize: 20, marginRight: 1 }} />
                                Limpar Filtros
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-semibold text-gray-700">
                            {totalProducts} produtos encontrados
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                <ViewModule />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                <ViewList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Produtos */}
                <div className={`w-full p-6 bg-gray-100 ${viewMode === 'card' ? 'flex flex-wrap justify-center gap-6' : ''}`}>
                    {renderProducts()}
                </div>

                {/* Paginação */}
                <div className="flex justify-center p-6 bg-white w-full">
                    <PaginationComponent
                        pages_count={pagesCount}
                        current_page={currentPage}
                        auct_id={auct_id}
                        setproductsfiltered={setProductsFiltered}
                        setcurrentpage={setCurrentPage}
                    />
                </div>
            </div>

        </div>
    );
}

export default HomeAdvShop;