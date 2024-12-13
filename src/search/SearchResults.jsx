import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../home/navigation/Navigation';
import Footer from '../home/components/Footer';
import { Search } from '@mui/icons-material';

function SearchResults() {
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 12;
    const location = useLocation();
    const navigate = useNavigate();
    const searchQuery = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        setSearchInput(searchQuery || '');
        setCurrentPage(1); // Reset para primeira página em nova busca
        fetchProducts(searchQuery);
    }, [searchQuery]);

    const fetchProducts = async (query) => {
        if (!query) return;

        try {
            setIsLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-title?title=${query}`
            );
            setSearchedProducts(response.data);
            setTotalPages(Math.ceil(response.data.length / productsPerPage));
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Pegar produtos da página atual
    const getCurrentPageProducts = () => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return searchedProducts.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Componente de Paginação
    const Pagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded-md transition-colors duration-200 
                        ${currentPage === i 
                            ? 'bg-[#012038] text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center mt-8 space-x-2 p-3">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Anterior
                </button>
                
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1 mx-1 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="mx-1">...</span>}
                    </>
                )}

                {pages}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="mx-1">...</span>}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-1 mx-1 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Próxima
                </button>
            </div>
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim().length >= 3) {
            navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navigation />
            
            <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Search Input Section */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Buscar produtos..."
                                className="w-full py-3 pl-12 pr-4 text-gray-900 bg-white rounded-xl 
                                    border border-gray-200 focus:border-[#012038] focus:ring-1 
                                    focus:ring-[#012038] outline-none shadow-sm transition-all duration-200"
                            />
                            <button
                                type="submit"
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                            >
                                <Search className="text-gray-400 hover:text-[#012038] transition-colors" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Resultados para &ldquo;{searchQuery}&rdquo;
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchedProducts.length} produtos encontrados
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#012038]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                            {getCurrentPageProducts().map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 
                                        overflow-hidden cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={product.cover_img_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transform transition-transform 
                                                duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-sm font-medium text-[#012038]">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(product.initial_value)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Lote: {product.lote}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {searchedProducts.length > productsPerPage && <Pagination />}
                    </>
                )}

                {!isLoading && searchedProducts.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">
                            Nenhum produto encontrado
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Tente buscar com outros termos
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default SearchResults; 