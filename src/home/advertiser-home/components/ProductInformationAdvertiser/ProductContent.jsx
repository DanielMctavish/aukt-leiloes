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
        <div className='w-full overflow-x-hidden space-y-3 md:space-y-6 px-1 sm:px-2 md:px-4'>
            {/* Cabeçalho do produto */}
            <div className='space-y-2 md:space-y-4 w-full'>
                {/* Número do lote e título */}
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 w-full">
                    <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 
                    rounded-lg shadow-sm self-start mb-1 w-fit text-center flex-shrink-0">
                        <span className='text-xs md:text-sm font-semibold'>
                            Lote {currentProduct.lote || '-'}
                        </span>
                    </div>
                    <h1 className='font-bold text-lg sm:text-xl md:text-2xl text-gray-800 leading-tight w-full break-words'>
                        {currentProduct.title || 'Sem título'}
                    </h1>
                </div>
                
                {/* Descrição com rolagem vertical em mobile - agora mais compacta */}
                <div className='max-h-[80px] sm:max-h-[100px] md:max-h-[120px] overflow-y-auto w-full
                    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                    pr-2 bg-white/50 rounded-md text-xs sm:text-sm md:text-base'>
                    <p className='text-gray-600 p-1 break-words'>
                        {currentProduct.description || 'Sem descrição disponível'}
                    </p>
                </div>
                
                {/* Badge de lances e status */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
                    <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-50 text-blue-600 rounded-full shadow-sm">
                        <span className='text-[10px] sm:text-xs md:text-sm font-medium'>
                            {bidCount} {bidCount === 1 ? 'lance' : 'lances'}
                        </span>
                    </div>
                    
                    {/* Status do leilão */}
                    {currentProduct.Winner ? (
                        <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-red-50 text-red-600 rounded-full shadow-sm">
                            <span className='text-[10px] sm:text-xs md:text-sm font-medium'>Finalizado</span>
                        </div>
                    ) : currentProduct.seconds_remaining <= 0 ? (
                        <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-yellow-50 text-yellow-600 rounded-full shadow-sm">
                            <span className='text-[10px] sm:text-xs md:text-sm font-medium'>Aguardando resultado</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-green-50 text-green-600 rounded-full shadow-sm">
                            <span className='text-[10px] sm:text-xs md:text-sm font-medium'>Em andamento</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Cards de valores - mais compactos em mobile */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 my-2 sm:my-3 md:my-4 w-full">
                <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-sm">
                    <span className='text-gray-500 text-[10px] sm:text-xs md:text-sm block mb-0.5 sm:mb-1'>Valor inicial</span>
                    <span className='text-sm sm:text-base md:text-xl font-semibold text-gray-800 truncate'>
                        {formatCurrency(currentProduct.initial_value || 0)}
                    </span>
                </div>
                <div className="bg-blue-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-sm">
                    <span className='text-blue-600 text-[10px] sm:text-xs md:text-sm block mb-0.5 sm:mb-1'>Valor atual</span>
                    <span className='text-sm sm:text-base md:text-xl font-semibold text-blue-800 truncate'>
                        {formatCurrency(currentProduct.real_value || 0)}
                    </span>
                </div>
            </div>
            
            {/* Informações adicionais - agora visível em todos os dispositivos mas mais compacto em mobile */}
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm w-full">
                <div className="flex justify-between items-center border-b border-gray-200 pb-1.5 sm:pb-2">
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">Incremento:</span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 truncate ml-2 max-w-[50%]">
                        {formatCurrency(currentProduct.bid_increment || 0)}
                    </span>
                </div>
                {currentProduct.commission_percentage && (
                    <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-b border-gray-200 pb-1.5 sm:pb-2">
                        <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">Comissão:</span>
                        <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 truncate ml-2 max-w-[50%]">
                            {currentProduct.commission_percentage}%
                        </span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-1.5 sm:pt-2">
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">Local:</span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 text-right truncate ml-2 max-w-[50%]">
                        {currentProduct.location_withdrawal || "Não informado"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductContent; 