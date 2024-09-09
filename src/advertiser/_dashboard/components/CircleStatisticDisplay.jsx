import { useSelector } from 'react-redux';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axios from 'axios';

function CircleStatisticDisplay() {
    const selectedAuction = useSelector((state) => state.selectedToGraph.auction);
    const [productData, setProductData] = useState([]);
    const [numProducts, setNumProducts] = useState(4); // Estado para o número de produtos a serem exibidos

    useEffect(() => {
        const fetchProductData = async () => {
            if (selectedAuction) {
                try {
                    const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'));
                    if (!currentLocalAdvertiser) {
                        throw new Error('Advertiser not logged in');
                    }

                    // Fetch all auctions for the advertiser
                    const auctionsResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                        params: { creator_id: currentLocalAdvertiser.id },
                        headers: {
                            'Authorization': `Bearer ${currentLocalAdvertiser.token}`
                        }
                    });

                    const allAuctions = auctionsResponse.data;
                    const productCounts = {};

                    for (const auction of allAuctions) {
                        for (const product of auction.product_list) {
                            const productName = product.name || product.title || `Produto ${product.id}`;
                            if (!productCounts[productName]) {
                                productCounts[productName] = 0;
                            }
                            productCounts[productName] += product.Bid ? product.Bid.length : 0;
                        }
                    }

                    const data = Object.keys(productCounts).map(productName => ({
                        id: productName,
                        value: productCounts[productName],
                        label: productName,
                    }));

                    // Ordenar os produtos por quantidade de lances e pegar os primeiros conforme o estado numProducts
                    const topProducts = data.sort((a, b) => b.value - a.value).slice(0, numProducts);
                    setProductData(topProducts);
                } catch (error) {
                    console.error('Erro ao processar dados de produtos:', error);
                }
            }
        };

        fetchProductData();
    }, [selectedAuction, numProducts]);

    const handleNumProductsChange = (event) => {
        setNumProducts(parseInt(event.target.value, 10));
    };

    return (
        <div className="w-full lg:w-[40%] h-[40vh] 
        p-4 bg-[#fff] text-zinc-600 
        shadow-lg shadow-[#17171722] relative 
        rounded-md
        flex flex-col justify-center items-center gap-4">

            <h2 className="w-full flex justify-start p-2 text-lg font-semibold">Top Produtos com Mais Lances</h2>
            <div className="w-full flex justify-end p-2">
                <label htmlFor="numProducts" className="mr-2">Mostrar top:</label>
                <select id="numProducts" value={numProducts} 
                onChange={handleNumProductsChange} className="p-1 border rounded bg-[#fff]">
                    {[...Array(8).keys()].map(i => (
                        <option key={i + 3} value={i + 3}>{i + 3}</option>
                    ))}
                </select>
            </div>
            <div className="w-full h-full flex justify-center items-center">
                <PieChart
                    series={[
                        {
                            data: productData,
                            innerRadius: 60,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            startAngle: -45,
                            endAngle: 360,
                            cx: '20%',
                            cy: '30%',
                        }
                    ]}
                />
            </div>
        </div>
    );
}

export default CircleStatisticDisplay;
