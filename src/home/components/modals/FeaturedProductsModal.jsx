/* eslint-disable react/prop-types */
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function FeaturedProductsModal({ isOpen, onClose, products }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay com blur */}
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-[80vh] mx-4 bg-white rounded-2xl shadow-2xl flex flex-col">
                {/* Header - Fixo */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-[#012038]">
                            Produtos em Destaque
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Os itens mais disputados da semana
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <Close className="text-gray-500" />
                    </button>
                </div>

                {/* Products Grid - Scrollável */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                                className="group bg-white rounded-xl overflow-hidden cursor-pointer 
                                    border border-gray-100 hover:shadow-lg transition-all duration-300"
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
                                    <h3 className="font-medium text-gray-900 group-hover:text-[#012038] 
                                        transition-colors duration-300 line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <div className="mt-2 flex items-center justify-between">
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
                </div>
            </div>
        </div>
    );
}

export default FeaturedProductsModal; 