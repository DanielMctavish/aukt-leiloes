/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import formatCurrency from "../../../../utils/formatCurrency";
import ReceiveWebsocketOnFloor from "../../../../a-floor/class/ReceiveWebsocketOnFloor";

// Função para calcular o incremento com base no valor atual
const getIncrementValue = (value) => {
    const baseValue = value || 0;
    
    if (baseValue <= 600) {
        return 20;
    } else if (baseValue <= 1200) {
        return 24; // 20% a mais que 20
    } else if (baseValue <= 3000) {
        return 30; // 50% a mais que 20
    } else if (baseValue <= 6000) {
        return 40; // 100% a mais que 20
    } else if (baseValue <= 12000) {
        return 60; // 200% a mais que 20
    } else {
        return Math.ceil(baseValue * 0.01); // 1% do valor para valores muito altos
    }
};

const ProductContent = ({ currentProduct, auctionId }) => {
    // Estados separados para cada informação
    const [title, setTitle] = useState(currentProduct?.title || 'Sem título');
    const [description, setDescription] = useState(currentProduct?.description || 'Sem descrição disponível');
    const [loteNumber, setLoteNumber] = useState(currentProduct?.lote || '-');
    const [initialValue, setInitialValue] = useState(currentProduct?.initial_value || 0);
    const [currentValue, setCurrentValue] = useState(currentProduct?.real_value || currentProduct?.initial_value || 0);
    const [bidCount, setBidCount] = useState(currentProduct?.Bid?.length || 0);
    const [incrementValue, setIncrementValue] = useState(getIncrementValue(currentProduct?.real_value || currentProduct?.initial_value || 0));
    const [nextMinBid, setNextMinBid] = useState((currentProduct?.real_value || currentProduct?.initial_value || 0) + getIncrementValue(currentProduct?.real_value || currentProduct?.initial_value || 0));
    const [status, setStatus] = useState('em_andamento');
    const [commission, setCommission] = useState(currentProduct?.commission_percentage);
    
    const websocketRef = useRef(null);

    // Função para atualizar todos os valores relacionados
    const updateValues = (newValue) => {
        setCurrentValue(newValue);
        const newIncrement = getIncrementValue(newValue);
        setIncrementValue(newIncrement);
        setNextMinBid(newValue + newIncrement);
    };

    // Efeito para atualizar estados quando currentProduct mudar
    useEffect(() => {
        if (currentProduct) {
            setTitle(currentProduct.title || 'Sem título');
            setDescription(currentProduct.description || 'Sem descrição disponível');
            setLoteNumber(currentProduct.lote || '-');
            setInitialValue(currentProduct.initial_value || 0);
            setCurrentValue(currentProduct.real_value || currentProduct.initial_value || 0);
            setBidCount(currentProduct.Bid?.length || 0);
            setCommission(currentProduct.commission_percentage);
            
            // Atualizar valores dependentes
            const realValue = currentProduct.real_value || currentProduct.initial_value || 0;
            const newIncrement = getIncrementValue(realValue);
            setIncrementValue(newIncrement);
            setNextMinBid(realValue + newIncrement);

            // Determinar status
            if (currentProduct.Winner) {
                setStatus('finalizado');
            } else if (currentProduct.seconds_remaining <= 0) {
                setStatus('aguardando');
            } else {
                setStatus('em_andamento');
            }
        }
    }, [currentProduct]);

    useEffect(() => {

        console.log("observando o auctionId", auctionId)
        if (!auctionId) return;

        // Inicializar WebSocket
        websocketRef.current = new ReceiveWebsocketOnFloor(auctionId);

        // Configurar listener para lances em catálogo
        websocketRef.current.receiveBidCatalogedMessage((message) => {
            const { body } = message.data;
            console.log("message bid cataloged on product content", body)
            if (body?.currentBid && body?.product?.id === currentProduct?.id) {
                // Atualizar valores
                const newValue = body.currentBid.value;
                updateValues(newValue);
                
                // Atualizar contagem de lances
                if (body.product.Bid) {
                    setBidCount(body.product.Bid.length);
                }
            }
        });

        // Configurar listener para lances normais
        websocketRef.current.receiveBidMessage((message) => {
            const { body } = message.data;
            if (body?.currentBid && body?.product?.id === currentProduct?.id) {
                // Atualizar valores
                const newValue = body.currentBid.value;
                updateValues(newValue);
                
                // Atualizar contagem de lances
                if (body.product.Bid) {
                    setBidCount(body.product.Bid.length);
                }
            }
        });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auctionId, currentProduct?.id]);

    return (
        <div className='w-full overflow-x-hidden space-y-3 md:space-y-6 px-1 sm:px-2 md:px-4'>
            {/* Cabeçalho do produto */}
            <div className='space-y-2 md:space-y-4 w-full'>
                {/* Número do lote e título */}
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 w-full">
                    <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 
                    rounded-lg shadow-sm self-start mb-1 w-fit text-center flex-shrink-0">
                        <span className='text-xs md:text-sm font-semibold'>
                            Lote {loteNumber}
                        </span>
                    </div>
                    <h1 className='font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-tight w-full break-words mb-2 sm:mb-3'>
                        {title}
                    </h1>
                </div>
                
                {/* Descrição com rolagem vertical em mobile */}
                <div className='max-h-[80px] sm:max-h-[100px] md:max-h-[120px] overflow-y-auto w-full
                    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                    pr-2 bg-white/50 rounded-md text-xs sm:text-sm md:text-base'>
                    <p className='text-gray-600 p-1 break-words'>
                        {description}
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
                    {status === 'finalizado' ? (
                        <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-red-50 text-red-600 rounded-full shadow-sm">
                            <span className='text-[10px] sm:text-xs md:text-sm font-medium'>Finalizado</span>
                        </div>
                    ) : status === 'aguardando' ? (
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

            {/* Cards de valores */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 my-2 sm:my-3 md:my-4 w-full">
                <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-sm">
                    <span className='text-gray-500 text-[10px] sm:text-xs md:text-sm block mb-0.5 sm:mb-1'>Valor inicial</span>
                    <span className='text-sm sm:text-base md:text-xl font-semibold text-gray-800 truncate'>
                        {formatCurrency(initialValue)}
                    </span>
                </div>
                <div className="bg-blue-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-sm">
                    <span className='text-blue-600 text-[10px] sm:text-xs md:text-sm block mb-0.5 sm:mb-1'>Valor atual</span>
                    <span className='text-sm sm:text-base md:text-xl font-semibold text-blue-800 truncate'>
                        {formatCurrency(currentValue)}
                    </span>
                </div>
            </div>
            
            {/* Informações adicionais */}
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm w-full">
                <div className="flex justify-between items-center border-b border-gray-200 pb-1.5 sm:pb-2">
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">Próximo incremento:</span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 truncate ml-2 max-w-[50%]">
                        {formatCurrency(incrementValue)}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-b border-gray-200 pb-1.5 sm:pb-2">
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">Próximo lance mínimo:</span>
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 truncate ml-2 max-w-[50%]">
                        {formatCurrency(nextMinBid)}
                    </span>
                </div>
                {commission && (
                    <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-b border-gray-200 pb-1.5 sm:pb-2">
                        <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">Comissão:</span>
                        <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 truncate ml-2 max-w-[50%]">
                            {commission}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductContent; 