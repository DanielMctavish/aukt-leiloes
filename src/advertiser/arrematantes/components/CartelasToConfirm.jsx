import { useState } from 'react';
import ProductDetailsModal from '../mod/ProductDetailsModal';

function CartelasToConfirm({ 
    ClientGroupData, 
    selectedAuction, 
    avatares_pessoas, 
    handleConfirmCard,
    selectedCartelaStatus,
    setCartelaStatus
}) {
    const [showMod, setShowMod] = useState({});
    const [expandedMod, setExpandedMod] = useState({});

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
            {ClientGroupData.map(groupClient => {
                if (groupClient.id !== selectedAuction) return null;

                let totalValue = 0;
                groupClient.products.forEach(product => {
                    totalValue += product.initial_value;
                });

                return (
                    <div key={groupClient.winner_id + groupClient.auction}
                        className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <img src={avatares_pessoas[groupClient.avatar]} alt="" 
                                    className="w-10 h-10 object-cover rounded-full border-2 border-[#1dad24]"
                                />
                                <div>
                                    <h3 className="text-sm font-semibold text-[#012038] truncate">
                                        {groupClient.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate">
                                        {groupClient.auction}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">Produtos:</span>
                                    <div className="relative">
                                        <span 
                                            onClick={() => toggleProductModal(groupClient.winner_id)}
                                            className="product-count-trigger relative bg-[#1dad24] text-white text-xs px-2 py-0.5 
                                                rounded-full cursor-pointer hover:bg-[#168d1d]"
                                        >
                                            {groupClient.products.length}
                                        </span>
                                        {showMod[groupClient.winner_id] && (
                                            <div className="absolute top-full left-0 mt-2 z-50">
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

                            <div className="flex flex-col gap-2">
                                <select 
                                    onChange={(e) => setCartelaStatus(e.target.value)} 
                                    className="w-full p-1.5 text-xs bg-white border border-gray-300 
                                        rounded-md text-gray-700 focus:border-[#1dad24] 
                                        focus:ring-1 focus:ring-[#1dad24] outline-none"
                                >
                                    <option value="PENDENT">Pendente</option>
                                    <option value="PAYMENT_CONFIRMED">Pagamento confirmado</option>
                                    <option value="PROCESS">Processando</option>
                                    <option value="SENDED">Enviado</option>
                                    <option value="DELIVERED">Entregue</option>
                                    <option value="DENIED">Recusado</option>
                                </select>

                                <button 
                                    onClick={() => handleConfirmCard(
                                        groupClient.advertiser_id,
                                        groupClient.products,
                                        groupClient.winner_id,
                                        totalValue
                                    )}
                                    className="w-full py-1.5 bg-[#012038] text-white text-xs 
                                        rounded-md hover:bg-[#01477f]"
                                >
                                    Confirmar
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