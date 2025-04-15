/* eslint-disable react/prop-types */
import { ArrowLeft, ArrowRight, Visibility, ViewModule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { handleNextProduct, handlePrevProduct } from '../../functions/productNavigation';

// Componente para o cabeçalho do produto com navegação e controles
const ProductHeader = ({ productId, auctId, setShowBids, showBids, currentProduct, currentAuct }) => {
    const navigate = useNavigate();

    const handleViewCatalog = () => {
        if (auctId) {
            // Utilizando window.location para navegação simples
            window.location.href = `/advertiser/home/shop/${auctId}`;
        } else {
            console.error("Não foi possível abrir o catálogo deste leilão.");
        }
    };
    
    return (
        <div className='sticky top-0 z-10 bg-white p-3 sm:p-4 md:p-6 border-b border-gray-100'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
                {/* ID do produto */}
                <div className="flex flex-col">
                    <span className='text-gray-500 text-xs sm:text-sm'>Produto</span>
                    <span className='font-semibold text-lg sm:text-xl md:text-2xl text-gray-800'>
                        {productId ? `#${productId}` : 'Carregando...'}
                    </span>
                </div>

                {/* Container com botões na versão mobile */}
                <div className="flex justify-between items-center w-full sm:w-auto">
                    {/* Botões de ação: catálogo e lances */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                        {/* Botão Ver Catálogo - Em mobile só mostra ícone */}
                        <button
                            onClick={handleViewCatalog}
                            className="flex items-center justify-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 
                                bg-[#1399CF] hover:bg-[#0d7eaa] active:bg-[#0d7eaa]
                                text-white rounded-[8px] sm:rounded-md shadow-sm
                                transition-colors text-xs sm:text-sm font-medium"
                        >
                            <ViewModule className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Ver Catálogo</span>
                        </button>
                        
                        {/* Botão de ver/ocultar lances - Em mobile só mostra ícone */}
                        <button
                            onClick={() => setShowBids(!showBids)}
                            className={`flex items-center justify-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2
                                text-white rounded-[8px] sm:rounded-md shadow-sm 
                                transition-colors text-xs sm:text-sm font-medium
                                ${showBids 
                                    ? 'bg-[#141839] hover:bg-[#1e2456] active:bg-[#1e2456]' 
                                    : 'bg-[#141839] hover:bg-[#1e2456] active:bg-[#1e2456]'}`}
                        >
                            <Visibility className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">{showBids ? 'Ocultar Lances' : 'Ver Lances'}</span>
                        </button>
                    </div>

                    {/* Botões de navegação */}
                    <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-3">
                        <button
                            onClick={() => handlePrevProduct(currentProduct, currentAuct, navigate)}
                            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors
                                text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300"
                            aria-label="Produto anterior"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                            onClick={() => handleNextProduct(currentProduct, currentAuct, navigate)}
                            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors
                                text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300"
                            aria-label="Próximo produto"
                        >
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductHeader; 