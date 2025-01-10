/* eslint-disable react/prop-types */
import { useState } from 'react';
import { formatDate, formatCurrency } from '../../../utils/formatters';

const ProductDetailsModal = ({ products, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!products || products.length === 0) return null;

    return (
        <>
            {/* Overlay */}
            {isExpanded && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 transition-opacity duration-300" />
            )}

            {/* Modal */}
            <div 
                className={`product-modal-container bg-white shadow-xl rounded-xl transition-all duration-300 
                    ${isExpanded 
                        ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] max-h-[85vh] overflow-y-auto p-6 z-[100]' 
                        : 'p-3 min-w-[320px]'
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isExpanded) setIsExpanded(true);
                }}
            >
                {!isExpanded ? (
                    // Compact View - Only Images
                    <div className="flex flex-wrap gap-3">
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                className="relative group"
                            >
                                <img 
                                    src={product.cover_img_url}
                                    alt={product.title}
                                    className="w-[70px] h-[70px] object-cover rounded-xl border border-gray-100 
                                        transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                                    opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Expanded View - Detailed Information
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800">Detalhes dos Produtos</h3>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 
                                    hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.map(product => (
                                <div key={product.id} 
                                    className="bg-white rounded-xl border border-gray-100 overflow-hidden 
                                        hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Product Header */}
                                    <div className="relative">
                                        <img 
                                            src={product.cover_img_url}
                                            alt={product.title}
                                            className="w-full h-48 object-cover" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h4 className="text-white font-semibold mb-1 line-clamp-1">
                                                {product.title}
                                            </h4>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/90 text-sm">
                                                    Lote: {product.lote}
                                                </span>
                                                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 
                                                    rounded-full text-xs">
                                                    {product.categorie}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 space-y-4">
                                        {/* Values */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-gray-500">Valor Inicial</span>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {formatCurrency(product.initial_value)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500">Valor Final</span>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {formatCurrency(product.real_value)}
                                                </p>
                                                {product.real_value > product.initial_value && (
                                                    <span className="text-xs text-green-600">
                                                        +{formatCurrency(product.real_value - product.initial_value)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500">Valor Reserva</span>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {formatCurrency(product.reserve_value)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500">Status</span>
                                                <p className={`text-sm font-semibold ${
                                                    product.real_value >= product.reserve_value 
                                                        ? 'text-green-600' 
                                                        : 'text-yellow-600'
                                                }`}>
                                                    {product.real_value >= product.reserve_value 
                                                        ? 'Reserva Atingida' 
                                                        : 'Abaixo da Reserva'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span>Grupo:</span>
                                                <span className="text-gray-800">{product.group}</span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span>Data:</span>
                                                <span className="text-gray-800">
                                                    {formatDate(product.created_at)}
                                                </span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span>Lances:</span>
                                                <span className="text-gray-800">
                                                    {product.Bid?.length || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Additional Images */}
                                        {product.group_imgs_url?.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {product.group_imgs_url.slice(0, 4).map((imgUrl, index) => (
                                                    <img 
                                                        key={index}
                                                        src={imgUrl}
                                                        alt={`${product.title} - ${index + 1}`}
                                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 
                                                            hover:scale-105 transition-transform cursor-pointer" 
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDetailsModal; 