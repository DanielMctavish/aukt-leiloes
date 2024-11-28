import { useSelector } from 'react-redux';
import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState, useRef } from 'react';

function PanelGraph() {
    const selectedAuction = useSelector((state) => state.selectedToGraph.auction);
    const [bidsData, setBidsData] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchBidsData = () => {
            if (selectedAuction) {
                try {
                    const bids = [];
                    for (const product of selectedAuction.product_list) {
                        if (product.Bid) {
                            bids.push({
                                productId: product.id,
                                productName: product.name || product.title || `Lote ${product.id}`,
                                bidCount: product.Bid.length,
                            });
                        }
                    }
                    setBidsData(bids);
                } catch (error) {
                    console.error('Erro ao processar dados de lances:', error);
                }
            }
        };

        fetchBidsData();
    }, [selectedAuction]);

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

    const processDataForChart = (bids) => {
        const xAxisData = bids.map((_, index) => index + 1);
        const seriesData = bids.map(bid => bid.bidCount);

        return { xAxisData, seriesData };
    };

    const { xAxisData, seriesData } = processDataForChart(bidsData);

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full bg-white rounded-lg shadow-lg p-4"
        >
            <div className="w-full h-full flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedAuction?.title ? `${selectedAuction.title} - Análise de Lances` : 'Selecione um leilão'}
                </h2>
                
                {!selectedAuction ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Selecione um leilão para visualizar o gráfico</p>
                    </div>
                ) : bidsData.length > 0 ? (
                    <div className="flex-1">
                        <LineChart
                            xAxis={[{ 
                                data: xAxisData, 
                                label: 'Lotes',
                                tickSize: 2,
                                tickRotation: 0
                            }]}
                            series={[
                                {
                                    data: seriesData,
                                    label: 'Quantidade de Lances',
                                    area: true,
                                    color: '#21b3cd',
                                    showMark: true,
                                },
                            ]}
                            width={containerRef.current?.offsetWidth - 40 || 300}
                            height={containerRef.current?.offsetHeight - 100 || 300}
                            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                            grid={{ x: true, y: true }}
                            tooltip={{ trigger: 'axis' }}
                        />
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

export default PanelGraph;