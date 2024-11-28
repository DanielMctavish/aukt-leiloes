import { useSelector } from 'react-redux';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState, useRef } from 'react';

function CircleStatisticDisplay() {
    const selectedAuction = useSelector((state) => state.selectedToGraph.auction);
    const [productData, setProductData] = useState([]);
    const [numProducts] = useState(4);
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const height = containerRef.current.offsetHeight;
                
                if (width && height) {
                    // As dimensões são usadas diretamente onde necessário
                }
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const processProductData = () => {
            setIsLoading(true);
            if (selectedAuction && selectedAuction.product_list) {
                try {
                    const productCounts = {};

                    // Processa os produtos do leilão selecionado
                    selectedAuction.product_list.forEach(product => {
                        const productName = product.name || product.title || `Produto ${product.id}`;
                        if (!productCounts[productName]) {
                            productCounts[productName] = 0;
                        }
                        productCounts[productName] += product.Bid ? product.Bid.length : 0;
                    });

                    const data = Object.entries(productCounts)
                        .map(([productName, value]) => ({
                            id: productName,
                            value,
                            label: productName.length > 20 
                                ? productName.substring(0, 20) + '...' 
                                : productName,
                            fullLabel: productName
                        }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, numProducts);

                    setProductData(data);
                } catch (error) {
                    console.error('Erro ao processar dados de produtos:', error);
                }
            }
            setIsLoading(false);
        };

        processProductData();
    }, [selectedAuction, numProducts]);



    if (isLoading) {
        return (
            <div className="w-full h-full bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className="w-full h-full bg-white rounded-lg shadow-lg p-4"
        >
            <div className="w-full h-full flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedAuction ? `${selectedAuction.title} - Lances por Produto` : 'Selecione um leilão'}
                </h2>

                {!selectedAuction ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Selecione um leilão para visualizar os dados</p>
                    </div>
                ) : productData.length > 0 ? (
                    <div className="flex-1 flex justify-center items-center gap-4">
                        <div className="w-1/2 flex justify-center">
                            <PieChart
                                series={[
                                    {
                                        data: productData,
                                        innerRadius: 60,
                                        outerRadius: 120,
                                        paddingAngle: 3,
                                        cornerRadius: 4,
                                        startAngle: -90,
                                        endAngle: 270,
                                    }
                                ]}
                                width={containerRef.current?.offsetWidth * 0.45 || 300}
                                height={containerRef.current?.offsetHeight - 100 || 300}
                                slotProps={{
                                    legend: {
                                        hidden: true
                                    }
                                }}
                            />
                        </div>
                        <div className="w-1/2 flex justify-center items-center">
                            <div className="bg-gray-50 rounded-lg p-4 w-[90%]">
                                <h3 className="text-sm font-medium text-gray-600 mb-3">Legenda</h3>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {productData.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <div 
                                                className="w-3 h-3 rounded-full" 
                                                style={{ 
                                                    backgroundColor: [
                                                        '#2196f3', '#ff9800', '#4caf50', 
                                                        '#f44336', '#9c27b0', '#3f51b5',
                                                        '#e91e63', '#009688'
                                                    ][index % 8] 
                                                }}
                                            />
                                            <span className="text-sm text-gray-800 truncate flex-1" title={item.fullLabel}>
                                                {item.label}
                                            </span>
                                            <span className="text-sm font-medium text-gray-600">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Não há dados de lances para exibir</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CircleStatisticDisplay;
