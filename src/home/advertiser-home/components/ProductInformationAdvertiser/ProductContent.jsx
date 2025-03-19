/* eslint-disable react/prop-types */

// Componente que mostra o conteúdo principal do produto
const ProductContent = ({ currentProduct, formatCurrency }) => {
    return (
        <div className='space-y-6'>
            <div className='space-y-4'>
                <h1 className='font-bold text-3xl text-gray-800 leading-tight'>
                    {currentProduct.title}
                </h1>
                <p className='text-gray-600 text-lg'>
                    {currentProduct.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    <span className='text-sm font-medium'>
                        {currentProduct.Bid && currentProduct.Bid.length} lance(s)
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                    <span className='text-gray-500 text-sm block mb-1'>Valor inicial</span>
                    <span className='text-xl font-semibold text-gray-800'>
                        {formatCurrency(currentProduct.initial_value)}
                    </span>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                    <span className='text-blue-600 text-sm block mb-1'>Valor atual</span>
                    <span className='text-xl font-semibold text-blue-800'>
                        {formatCurrency(currentProduct.real_value)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductContent; 