import axios from 'axios';

export const handleNextProduct = async (currentAuct, currentProduct, setCurrentProduct, setBidInformations, navigate, showMessage) => {
    if (!currentAuct || !currentAuct.id || !currentProduct || !currentProduct.id) {
        console.error("Dados insuficientes para navegação");
        showMessage && showMessage("Não foi possível navegar para o próximo lote", "error");
        return;
    }

    try {
        // Buscar todos os produtos do leilão
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
            params: {
                auct_id: currentAuct.id,
            }
        });

        console.log("response on next product", response.data)

        // Garantir que temos um array de produtos
        let products = [];
        if (response.data) {
            products = Array.isArray(response.data) ? response.data : 
                     (response.data.products || []);
        }

        // Filtrar produtos inválidos e ordenar por número do lote
        const sortedProducts = products
            .filter(p => p && p.id && (typeof p.lote === 'number' || !isNaN(Number(p.lote))))
            .map(p => ({...p, lote: Number(p.lote)})) // Converter lote para número
            .sort((a, b) => a.lote - b.lote);

        if (sortedProducts.length === 0) {
            console.error("Nenhum produto encontrado no leilão");
            showMessage && showMessage("Não foram encontrados produtos para navegar", "error");
            return;
        }

        // Encontrar índice do produto atual
        const currentIndex = sortedProducts.findIndex(p => p.id === currentProduct.id);
        
        if (currentIndex === -1) {
            console.error("Produto atual não encontrado na lista");
            showMessage && showMessage("Produto atual não encontrado", "error");
            return;
        }

        // Verificar se há próximo produto
        if (currentIndex < sortedProducts.length - 1) {
            const nextProduct = sortedProducts[currentIndex + 1];

            try {
                // Buscar informações detalhadas do próximo produto
                const updatedProductResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${nextProduct.id}`
                );

                if (updatedProductResponse.data) {
                    setCurrentProduct(updatedProductResponse.data);
                    setBidInformations(updatedProductResponse.data.Bid || []);
                    navigate(`/advertiser/home/product/${updatedProductResponse.data.id}`);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes do próximo produto:", error);
                showMessage && showMessage("Erro ao carregar próximo produto", "error");
            }
        } else {
            showMessage && showMessage("Este é o último lote", "info");
        }
    } catch (error) {
        console.error("Erro ao navegar para o próximo produto:", error);
        showMessage && showMessage("Erro ao navegar entre produtos", "error");
    }
};

export const handlePrevProduct = async (currentAuct, currentProduct, setCurrentProduct, setBidInformations, navigate, showMessage) => {
    if (!currentAuct || !currentAuct.id || !currentProduct || !currentProduct.id) {
        console.error("Dados insuficientes para navegação");
        showMessage && showMessage("Não foi possível navegar para o lote anterior", "error");
        return;
    }

    try {
        // Buscar todos os produtos do leilão
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
            params: {
                auct_id: currentAuct.id,
            }
        });

        // Garantir que temos um array de produtos
        let products = [];
        if (response.data) {
            products = Array.isArray(response.data) ? response.data : 
                     (response.data.products || []);
        }

        // Filtrar produtos inválidos e ordenar por número do lote
        const sortedProducts = products
            .filter(p => p && p.id && (typeof p.lote === 'number' || !isNaN(Number(p.lote))))
            .map(p => ({...p, lote: Number(p.lote)})) // Converter lote para número
            .sort((a, b) => a.lote - b.lote);

        if (sortedProducts.length === 0) {
            console.error("Nenhum produto encontrado no leilão");
            showMessage && showMessage("Não foram encontrados produtos para navegar", "error");
            return;
        }

        // Encontrar índice do produto atual
        const currentIndex = sortedProducts.findIndex(p => p.id === currentProduct.id);
        
        if (currentIndex === -1) {
            console.error("Produto atual não encontrado na lista");
            showMessage && showMessage("Produto atual não encontrado", "error");
            return;
        }

        // Verificar se há produto anterior
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
                showMessage && showMessage("Erro ao carregar produto anterior", "error");
            }
        } else {
            showMessage && showMessage("Este é o primeiro lote", "info");
        }
    } catch (error) {
        console.error("Erro ao navegar para o produto anterior:", error);
        showMessage && showMessage("Erro ao navegar entre produtos", "error");
    }
}; 