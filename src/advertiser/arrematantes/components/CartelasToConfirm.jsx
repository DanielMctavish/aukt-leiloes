/* eslint-disable react/prop-types */
import { useState } from 'react';
import ProductDetailsModal from '../mod/ProductDetailsModal';

function CartelasToConfirm({ 
    ClientGroupData, 
    selectedAuction, 
    avatares_pessoas, 
    handleConfirmCard,
    setCartelaStatus
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ClientGroupData.map(groupClient => {
                if (groupClient.id !== selectedAuction) return null;

                const totalValue = groupClient.products.reduce((sum, product) => 
                    sum + product.real_value, 0
                );

                return (
                    <div key={groupClient.winner_id + groupClient.auction}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={avatares_pessoas[groupClient.avatar]} alt="" 
                                        className="w-12 h-12 object-cover rounded-full border-2 border-[#1dad24] shadow-md"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1dad24] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {groupClient.products.length}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-[#012038] truncate flex items-center gap-2">
                                        {groupClient.name} 
                                        <span className='font-light text-[#676767] text-xs bg-gray-100 px-2 py-0.5 rounded-full'>
                                            {groupClient.nickname}</span>
                                    </h3>
                                    <p className='text-xs text-gray-500 truncate'>
                                        {groupClient.client_email}
                                    </p>
                                    <hr />
                                    <p className="text-xs text-gray-500 truncate font-bold">
                                        {groupClient.auction}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-600">Produtos:</span>
                                    <div className="relative">
                                        <span 
                                            onClick={() => toggleProductModal(groupClient.winner_id)}
                                            className="product-count-trigger relative bg-gradient-to-r from-[#1dad24] to-[#25c52c] text-white text-xs px-3 py-1 
                                                rounded-full cursor-pointer hover:from-[#168d1d] hover:to-[#1dad24] transition-all duration-300 shadow-sm flex items-center gap-1"
                                        >
                                            {groupClient.products.length}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        
                                        {showMod[groupClient.winner_id] && (
                                            <div className="absolute z-10 top-full left-0 mt-2">
                                                <ProductDetailsModal 
                                                    products={groupClient.products}
                                                    onClose={handleCloseModal}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[#012038]">
                                    {new Intl.NumberFormat('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL' 
                                    }).format(totalValue)}
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                <select 
                                    onChange={(e) => setCartelaStatus(e.target.value)} 
                                    className="w-full p-2 text-sm bg-white border border-gray-200 
                                        rounded-md text-gray-700 focus:border-[#1dad24] 
                                        focus:ring-1 focus:ring-[#1dad24] outline-none shadow-sm"
                                >
                                    <option value="PENDENT">Pendente</option>
                                    <option value="PAYMENT_CONFIRMED">Pagamento confirmado</option>
                                    <option value="PROCESS">Processando</option>
                                    <option value="SENDED">Enviado</option>
                                    <option value="DELIVERED">Entregue</option>
                                    <option value="DENIED">Recusado</option>
                                </select>
                                
                                <button 
                                    onClick={() => handleConfirmCard(groupClient.advertiser_id, groupClient.products, groupClient.winner_id)}
                                    className="w-full bg-gradient-to-r from-[#012038] to-[#1a3c5a] text-white py-2 rounded-md text-sm font-medium
                                        hover:from-[#1a3c5a] hover:to-[#012038] transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirmar Cartela
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CartelasToConfirm; 