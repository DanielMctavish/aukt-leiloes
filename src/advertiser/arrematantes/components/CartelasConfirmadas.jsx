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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cartelas && cartelas.map(cartela => (
                <div key={cartela.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <img src={avatares_pessoas[cartela.Client.client_avatar]} alt=""
                                className="w-10 h-10 object-cover rounded-full border-2 border-[#1dad24]" 
                            />
                            <div>
                                <h3 className="text-sm font-semibold text-[#012038] truncate">
                                    {cartela.Client.name}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">{cartela.auction}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Produtos:</span>
                                <div className="relative">
                                    <span 
                                        onClick={() => toggleProductModal(cartela.id)}
                                        className="product-count-trigger relative bg-[#1dad24] text-white text-xs px-2 py-0.5 
                                            rounded-full cursor-pointer hover:bg-[#168d1d]"
                                    >
                                        {cartela.products.length}
                                    </span>
                                    {showMod[cartela.id] && (
                                        <div className="absolute top-full left-0 mt-2 z-50">
                                            <ProductDetailsModal 
                                                products={cartela.products}
                                                onClose={handleCloseModal}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-bold text-[#012038]">
                                    {new Intl.NumberFormat('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL' 
                                    }).format(cartela.amount)}
                                </span>
                                {cartela.amount > cartela.products.reduce((sum, p) => sum + p.initial_value, 0) && (
                                    <span className="text-xs text-green-600">
                                        Valorização: +{new Intl.NumberFormat('pt-BR', { 
                                            style: 'currency', 
                                            currency: 'BRL' 
                                        }).format(cartela.amount - cartela.products.reduce((sum, p) => sum + p.initial_value, 0))}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <select
                                value={cartela.status}
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    setCartelas(prevCartelas => prevCartelas.map(c => 
                                        c.id === cartela.id ? { ...c, status: newStatus } : c
                                    ));
                                }}
                                className={`w-full p-1.5 text-xs rounded-md focus:outline-none 
                                    focus:ring-1 ${
                                    cartela.status === "DENIED" ? 'bg-red-500 text-white' :
                                    cartela.status === "PAYMENT_CONFIRMED" ? 'bg-blue-500 text-white' :
                                    cartela.status === "PROCESS" ? 'bg-yellow-500 text-white' :
                                    cartela.status === "SENDED" ? 'bg-green-500 text-white' :
                                    cartela.status === "DELIVERED" ? 'bg-purple-500 text-white' :
                                    'bg-[#1dad24] text-white'
                                }`}
                            >
                                <option value="PENDENT">Pendente</option>
                                <option value="PAYMENT_CONFIRMED">Pagamento Confirmado</option>
                                <option value="PROCESS">Processando</option>
                                <option value="SENDED">Enviado</option>
                                <option value="DELIVERED">Entregue</option>
                                <option value="DENIED">Recusado</option>
                            </select>

                            {cartela.status === "SENDED" && (
                                <input
                                    type="text"
                                    placeholder="Insira o código de rastreio"
                                    value={cartela.tracking_code || trackingCodes[cartela.id] || ""}
                                    onChange={(e) => setTrackingCodes(prev => ({ 
                                        ...prev, 
                                        [cartela.id]: e.target.value 
                                    }))}
                                    className="w-full p-1.5 text-xs border border-[#1dad24] rounded-md 
                                        focus:outline-none focus:ring-1 focus:ring-[#1dad24] bg-white"
                                />
                            )}

                            <button
                                onClick={() => handleUpdateCartela(cartela.id)}
                                className={`w-full py-1.5 bg-[#012038] text-white text-xs rounded-md 
                                    hover:bg-[#01477f] flex items-center justify-center ${
                                    updatingCartelas[cartela.id] ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={updatingCartelas[cartela.id]}
                            >
                                {updatingCartelas[cartela.id] ? (
                                    <svg className="animate-spin h-3 w-3 mr-1 border-t-2 border-b-2 
                                        border-white rounded-full" viewBox="0 0 24 24">
                                    </svg>
                                ) : null}
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