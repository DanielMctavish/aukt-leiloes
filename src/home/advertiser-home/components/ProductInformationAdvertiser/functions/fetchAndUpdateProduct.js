import axios from "axios";


// Função para buscar e atualizar o produto completo após um novo lance
const fetchAndUpdateProduct = async ({
    productId,
    props,
    currentSession,
    setLastBidClient,
    setBidValue,
    calculateNextBidValue
}) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${productId}`
        );
        
        if (response.data) {
            // console.log('Produto atualizado após evento de lance:', response.data);
            
            // Verificar se o usuário foi superado
            const clientId = props.currentClient?.id || currentSession?.id;
            
            // Se temos um usuário logado, produto teve lance e o último lance não é do usuário atual
            if (clientId && response.data.Bid && response.data.Bid.length > 0) {
                const lastBid = response.data.Bid[0]; // Último lance
                
                // Guardar o último cliente que deu lance
                setLastBidClient(lastBid.Client || null);
                
               
            }
            
            // Atualizar o produto no estado
            props.setCurrentProduct(response.data);
            
            // Atualizar o valor do lance sugerido
            const nextBidValue = calculateNextBidValue(response.data);
            setBidValue(nextBidValue);
            
            // Disparar evento personalizado para notificar outros componentes
            const event = new CustomEvent('productUpdated', {
                detail: { product: response.data }
            });
            window.dispatchEvent(event);
            
            // Atualizar lista de lances se necessário
            if (response.data.Bid) {
                props.setBidInformations(response.data.Bid);
            }
        }
    } catch (error) {
        console.error('Erro ao buscar produto atualizado após lance:', error);
    }
};

export default fetchAndUpdateProduct;