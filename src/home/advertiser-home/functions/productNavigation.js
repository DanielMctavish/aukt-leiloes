import axios from 'axios';

export const handleNextProduct = async (currentAuct, currentProduct, setCurrentProduct, setBidInformations, navigate, showMessage) => {
    try {
        // Primeiro, buscar todos os produtos do leilão
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
            params: {
                auct_id: currentAuct.id,
            }
        });

        const products = response.data.products || response.data;
        const sortedProducts = products.sort((a, b) => a.lote - b.lote);
        const currentIndex = sortedProducts.findIndex(p => p.id === currentProduct.id);

        if (currentIndex < sortedProducts.length - 1) {
            const nextProduct = sortedProducts[currentIndex + 1];

            // Buscar informações atualizadas do próximo produto
            const updatedProductResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${nextProduct.id}`
            );

            const updatedProduct = updatedProductResponse.data;
            setCurrentProduct(updatedProduct);
            setBidInformations(updatedProduct.Bid || []);
            navigate(`/advertiser/home/product/${updatedProduct.id}`);
        }
    } catch (error) {
        console.error("Erro ao buscar próximo produto:", error);
    }
};

export const handlePrevProduct = async (currentAuct, currentProduct, setCurrentProduct, setBidInformations, navigate, showMessage) => {
    try {
        // Buscar todos os produtos do leilão
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
            params: {
                auct_id: currentAuct.id,
                status: true // Adiciona filtro para garantir produtos ativos
            }
        });

        if (!response.data) {
            console.error("Nenhum dado retornado da API");
            return;
        }

        // Garantir que temos um array de produtos
        const products = Array.isArray(response.data) ? response.data : 
                       (response.data.products || []);

        // Ordenar produtos por número do lote e garantir que são números
        const sortedProducts = products
            .filter(p => p && typeof p.lote === 'number') // Garante que lote é número
            .sort((a, b) => a.lote - b.lote);

        // Encontrar índice do produto atual
        const currentIndex = sortedProducts.findIndex(p => p.id === currentProduct.id);

        if (currentIndex > 0) {
            const prevProduct = sortedProducts[currentIndex - 1];

            try {
                // Buscar informações detalhadas do produto anterior
                const updatedProductResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${prevProduct.id}`
                );

                if (updatedProductResponse.data) {
                    setCurrentProduct(updatedProductResponse.data);
                    setBidInformations(updatedProductResponse.data.Bid || []);
                    navigate(`/advertiser/home/product/${updatedProductResponse.data.id}`);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes do produto anterior:", error);
                showMessage("Erro ao carregar produto anterior", "error");
            }
        } else {
            showMessage("Este é o primeiro lote", "info");
        }
    } catch (error) {
        console.error("Erro ao buscar lista de produtos:", error);
        showMessage("Erro ao navegar entre produtos", "error");
    }
}; 