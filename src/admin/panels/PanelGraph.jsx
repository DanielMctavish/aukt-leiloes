import { useSelector } from 'react-redux';
import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from 'react';

function PanelGraph() {
    const selectedAuction = useSelector((state) => state.selectedToGraph.auction);
    const [bidsData, setBidsData] = useState([]);

    useEffect(() => {
        const fetchBidsData = () => {
            if (selectedAuction) {
                try {
                    const bids = [];
                    for (const product of selectedAuction.product_list) {
                        console.log("Product:", product); // Log do produto para depuração
                        if (product.Bid) {
                            bids.push({
                                productId: product.id,
                                productName: product.name || product.title || `Lote ${product.id}`, // Verifique diferentes campos para o nome do produto
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

    const processDataForChart = (bids) => {
        const xAxisData = bids.map((_, index) => index + 1); // Usar índices numéricos para representar os lotes
        const seriesData = bids.map(bid => bid.bidCount);

        return { xAxisData, seriesData };
    };

    const { xAxisData, seriesData } = processDataForChart(bidsData);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center relative">
            <LineChart
                xAxis={[{ data: xAxisData, label: 'Lote' }]}
                series={[
                    {
                        data: seriesData,
                        label: 'Quantidade de Lances',
                        area: true,
                        color: '#21b3cd',
                    },
                ]}
                width={900}
                height={600}
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                grid={{ x: true, y: true }}
                tooltip
            />
        </div>
    );
}

export default PanelGraph;