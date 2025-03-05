/* eslint-disable react/prop-types */
import { useState } from 'react';
import ProductDetailsModal from '../mod/ProductDetailsModal';

function CartelasConfirmadas({ 
    cartelas, 
    avatares_pessoas, 
    setCartelas,
    handleUpdateCartela,
    updatingCartelas,
    trackingCodes,
    setTrackingCodes
}) {
    const [showMod, setShowMod] = useState({});

    const toggleProductModal = (id) => {
        setShowMod(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCloseModal = () => {
        setShowMod({});
    };

    const getStatusColor = (status) => {
        const statusColors = {
            "DENIED": 'bg-red-500 hover:bg-red-600',
            "PAYMENT_CONFIRMED": 'bg-blue-500 hover:bg-blue-600',
            "PROCESS": 'bg-yellow-500 hover:bg-yellow-600',
            "SENDED": 'bg-green-500 hover:bg-green-600',
            "DELIVERED": 'bg-purple-500 hover:bg-purple-600',
            "PENDENT": 'bg-[#1dad24] hover:bg-[#168d1d]'
        };
        return statusColors[status] || 'bg-[#1dad24] hover:bg-[#168d1d]';
    };

    const getStatusText = (status) => {
        const statusText = {
            "DENIED": 'Recusado',
            "PAYMENT_CONFIRMED": 'Pagamento Confirmado',
            "PROCESS": 'Em Processamento',
            "SENDED": 'Enviado',
            "DELIVERED": 'Entregue',
            "PENDENT": 'Pendente'
        };
        return statusText[status] || status;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cartelas && cartelas.map(cartela => (
                <div key={cartela.id} 
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 
                        border border-gray-100 overflow-hidden"
                >
                    {/* Cabeçalho do Card */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#f8f9fa] to-white">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={avatares_pessoas[cartela.Client.client_avatar]} 
                                    alt=""
                                    className="w-12 h-12 object-cover rounded-full border-2 border-[#1dad24] 
                                        shadow-md hover:scale-105 transition-transform duration-200" 
                                />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 
                                    border-white ${getStatusColor(cartela.status)}`}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-[#012038] truncate">
                                    {cartela.Client.name}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">{cartela.auction}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full text-white font-medium 
                                ${getStatusColor(cartela.status)}`}
                            >
                                {getStatusText(cartela.status)}
                            </span>
                        </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-4 space-y-4">
                        {/* Informações dos Produtos */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => toggleProductModal(cartela.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 
                                        rounded-full hover:bg-blue-100 transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" 
                                        viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">
                                        {cartela.products.length} Produto{cartela.products.length !== 1 ? 's' : ''}
                                    </span>
                                </button>
                                {showMod[cartela.id] && (
                                    <div className="absolute z-50">
                                        <ProductDetailsModal 
                                            products={cartela.products}
                                            onClose={handleCloseModal}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-[#012038]">
                                    {new Intl.NumberFormat('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL' 
                                    }).format(cartela.amount)}
                                </span>
                                {cartela.amount > cartela.products.reduce((sum, p) => sum + p.initial_value, 0) && (
                                    <p className="text-xs text-green-600 font-medium">
                                        +{new Intl.NumberFormat('pt-BR', { 
                                            style: 'currency', 
                                            currency: 'BRL' 
                                        }).format(cartela.amount - cartela.products.reduce((sum, p) => sum + p.initial_value, 0))}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Seletor de Status e Código de Rastreio */}
                        <div className="space-y-3">
                            <select
                                value={cartela.status}
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    setCartelas(prevCartelas => prevCartelas.map(c => 
                                        c.id === cartela.id ? { ...c, status: newStatus } : c
                                    ));
                                    if (newStatus === "SENDED" && !trackingCodes[cartela.id]) {
                                        setTrackingCodes(prev => ({
                                            ...prev,
                                            [cartela.id]: ""
                                        }));
                                    }
                                }}
                                className={`w-full p-2 text-sm rounded-lg focus:ring-2 focus:ring-opacity-50 
                                    border-0 cursor-pointer transition-colors duration-200 text-white font-medium
                                    ${getStatusColor(cartela.status)}`}
                            >
                                <option value="PENDENT">Pendente</option>
                                <option value="PAYMENT_CONFIRMED">Pagamento Confirmado</option>
                                <option value="PROCESS">Em Processamento</option>
                                <option value="SENDED">Enviado</option>
                                <option value="DELIVERED">Entregue</option>
                                <option value="DENIED">Recusado</option>
                            </select>

                            {cartela.status === "SENDED" && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Insira o código de rastreio"
                                        value={cartela.tracking_code || trackingCodes[cartela.id] || ""}
                                        onChange={(e) => {
                                            setTrackingCodes(prev => ({ 
                                                ...prev, 
                                                [cartela.id]: e.target.value 
                                            }));
                                            setCartelas(prevCartelas => prevCartelas.map(c => 
                                                c.id === cartela.id 
                                                    ? { ...c, tracking_code: e.target.value }
                                                    : c
                                            ));
                                        }}
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg 
                                            focus:border-[#1dad24] focus:ring-1 focus:ring-[#1dad24] 
                                            outline-none bg-white pl-8"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 
                                        absolute left-2 top-1/2 transform -translate-y-1/2" fill="none" 
                                        viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                        />
                                    </svg>
                                </div>
                            )}

                            <button
                                onClick={() => handleUpdateCartela(cartela.id)}
                                className={`w-full p-2 bg-gradient-to-r from-[#012038] to-[#1a3c5a] 
                                    text-white text-sm rounded-lg hover:from-[#1a3c5a] hover:to-[#012038] 
                                    transition-all duration-300 flex items-center justify-center gap-2
                                    ${updatingCartelas[cartela.id] ? 'opacity-75 cursor-not-allowed' : ''}`}
                                disabled={updatingCartelas[cartela.id]}
                            >
                                {updatingCartelas[cartela.id] ? (
                                    <svg className="animate-spin h-4 w-4 border-2 border-white rounded-full" 
                                        viewBox="0 0 24 24"
                                    />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" 
                                        viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                                        />
                                    </svg>
                                )}
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CartelasConfirmadas; 