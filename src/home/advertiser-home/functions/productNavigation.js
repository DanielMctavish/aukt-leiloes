import axios from 'axios';

export const handleNextProduct = async (productId, currentAuct, setCurrentProduct, navigate) => {
    if (!currentAuct || !currentAuct.id || !productId) {
        console.error("Dados insuficientes para navegação");
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
            .filter(p => p && p.id)
            .sort((a, b) => {
                // Se tiverem lote, ordenar por lote
                if (a.lote && b.lote) {
                    const aLote = typeof a.lote === 'number' ? a.lote : Number(a.lote);
                    const bLote = typeof b.lote === 'number' ? b.lote : Number(b.lote);
                    return aLote - bLote;
                }
                // Caso contrário, ordenar por ID
                return a.id.localeCompare(b.id);
            });

        if (sortedProducts.length === 0) {
            console.error("Nenhum produto encontrado no leilão");
            return;
        }

        // Encontrar índice do produto atual
        const currentIndex = sortedProducts.findIndex(p => p.id === productId);
        
        if (currentIndex === -1) {
            console.error("Produto atual não encontrado na lista");
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
                    // Atualizar o estado e navegar
                    setCurrentProduct(updatedProductResponse.data);
                    navigate(`/advertiser/home/product/${nextProduct.id}`);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes do próximo produto:", error);
            }
        } else {
            console.log("Este é o último produto");
        }
    } catch (error) {
        console.error("Erro ao navegar para o próximo produto:", error);
    }
};

export const handlePrevProduct = async (productId, currentAuct, setCurrentProduct, navigate) => {
    if (!currentAuct || !currentAuct.id || !productId) {
        console.error("Dados insuficientes para navegação");
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
            .filter(p => p && p.id)
            .sort((a, b) => {
                // Se tiverem lote, ordenar por lote
                if (a.lote && b.lote) {
                    const aLote = typeof a.lote === 'number' ? a.lote : Number(a.lote);
                    const bLote = typeof b.lote === 'number' ? b.lote : Number(b.lote);
                    return aLote - bLote;
                }
                // Caso contrário, ordenar por ID
                return a.id.localeCompare(b.id);
            });

        if (sortedProducts.length === 0) {
            console.error("Nenhum produto encontrado no leilão");
            return;
        }

        // Encontrar índice do produto atual
        const currentIndex = sortedProducts.findIndex(p => p.id === productId);
        
        if (currentIndex === -1) {
            console.error("Produto atual não encontrado na lista");
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
                    // Atualizar o estado e navegar
                    setCurrentProduct(updatedProductResponse.data);
                    navigate(`/advertiser/home/product/${prevProduct.id}`);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes do produto anterior:", error);
            }
        } else {
            console.log("Este é o primeiro produto");
        }
    } catch (error) {
        console.error("Erro ao navegar para o produto anterior:", error);
    }
}; 