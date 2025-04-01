/* eslint-disable react/prop-types */

// Componente que mostra o conteúdo principal do produto
const ProductContent = ({ currentProduct, formatCurrency }) => {
    // Verificar se o produto tem as propriedades necessárias
    if (!currentProduct || typeof currentProduct !== 'object') {
        return (
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Carregando informações do produto...</p>
            </div>
        );
    }

    // Determinar o número de lances com segurança
    const bidCount = currentProduct.Bid && Array.isArray(currentProduct.Bid) 
        ? currentProduct.Bid.length 
        : 0;

    return (
        <div className='space-y-4 md:space-y-6'>
            {/* Cabeçalho do produto */}
            <div className='space-y-3 md:space-y-4'>
                {/* Número do lote e título */}
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 
                    rounded-lg shadow-sm self-start mb-1 w-[260px] text-center">
                        <span className='text-sm font-semibold'>
                            Lote {currentProduct.lote || '-'}
                        </span>
                    </div>
                    <h1 className='font-bold text-xl md:text-3xl text-gray-800 leading-tight'>
                        {currentProduct.title || 'Sem título'}
                    </h1>
                </div>
                
                {/* Descrição com rolagem horizontal em mobile */}
                <div className='max-h-[120px] overflow-y-auto md:max-h-full 
                    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                    pr-2 bg-white/50 rounded-md'>
                    <p className='text-sm md:text-lg text-gray-600'>
                        {currentProduct.description || 'Sem descrição disponível'}
                    </p>
                </div>
                
                {/* Badge de lances */}
                <div className="flex flex-wrap gap-2 mt-2">
                    <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full shadow-sm">
                        <span className='text-xs md:text-sm font-medium'>
                            {bidCount} {bidCount === 1 ? 'lance' : 'lances'}
                        </span>
                    </div>
                    
                    {/* Status do leilão */}
                    {currentProduct.Winner ? (
                        <div className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-full shadow-sm">
                            <span className='text-xs md:text-sm font-medium'>Finalizado</span>
                        </div>
                    ) : currentProduct.seconds_remaining <= 0 ? (
                        <div className="inline-flex items-center px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full shadow-sm">
                            <span className='text-xs md:text-sm font-medium'>Aguardando resultado</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-full shadow-sm">
                            <span className='text-xs md:text-sm font-medium'>Em andamento</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Cards de valores */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 my-4">
                <div className="bg-gray-50 p-3 md:p-4 rounded-xl shadow-sm">
                    <span className='text-gray-500 text-xs md:text-sm block mb-1'>Valor inicial</span>
                    <span className='text-base md:text-xl font-semibold text-gray-800'>
                        {formatCurrency(currentProduct.initial_value || 0)}
                    </span>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-xl shadow-sm">
                    <span className='text-blue-600 text-xs md:text-sm block mb-1'>Valor atual</span>
                    <span className='text-base md:text-xl font-semibold text-blue-800'>
                        {formatCurrency(currentProduct.real_value || 0)}
                    </span>
                </div>
            </div>
            
            {/* Informações adicionais - apenas em mobile */}
            <div className="md:hidden bg-gray-50 p-3 rounded-xl shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-xs font-medium text-gray-500">Incremento:</span>
                    <span className="text-xs font-semibold text-gray-700">
                        {formatCurrency(currentProduct.bid_increment || 0)}
                    </span>
                </div>
                {currentProduct.commission_percentage && (
                    <div className="flex justify-between items-center pt-2 border-b border-gray-200 pb-2">
                        <span className="text-xs font-medium text-gray-500">Comissão:</span>
                        <span className="text-xs font-semibold text-gray-700">
                            {currentProduct.commission_percentage}%
                        </span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-medium text-gray-500">Local de retirada:</span>
                    <span className="text-xs font-semibold text-gray-700">
                        {currentProduct.location_withdrawal || "Não informado"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductContent; 