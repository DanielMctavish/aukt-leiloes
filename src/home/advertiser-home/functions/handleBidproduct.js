import axios from "axios"

const handleBidproduct = async (
    bidValue,
    messageRef, 
    currentProduct,
    currentClient, 
    currentAuct,
    sessionClient, 
    setBidValue,
    setIsloadingBid, 
    isAutoBidEnabled, 
    isBidOnCataloge,
    showMessage,
    autoBidLimit
) => {
    // Validações iniciais
    if (!currentClient || !currentProduct || !sessionClient) {
        showMessage("Dados inválidos para realizar o lance", "error");
        return null;
    }

    // Obter o valor atual do produto
    const currentValue = currentProduct.real_value || currentProduct.initial_value;
    const increment = getIncrementValue(currentValue);
    
    // Se for lance automático, o primeiro lance será o valor atual + incremento
    // Se for lance manual, será o valor informado pelo usuário (bidValue)
    const actualBidValue = isAutoBidEnabled ? 
        currentValue + increment  // Valor do lance para lance automático
        : bidValue;               // Valor do lance para lance manual

    // Validação do valor do lance
    if (actualBidValue <= currentValue) {
        showMessage(`O valor do lance deve ser maior que ${currentValue}`, "error");
        if (setIsloadingBid) {
            setIsloadingBid(false);
        }
        return null;
    }

    // Validação do limite do lance automático
    if (isAutoBidEnabled && (!autoBidLimit || autoBidLimit <= actualBidValue)) {
        showMessage("O valor limite do lance automático deve ser maior que o valor do lance atual", "warning");
        return null;
    }

    if (setIsloadingBid) {
        setIsloadingBid(true);
    }

    try {
        // Para lance automático, enviamos o actualBidValue como valor do lance e autoBidLimit como limite
        // Para lance normal, enviamos apenas o bidValue
        const response = await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`,
            {
                value: parseFloat(actualBidValue),
                client_id: currentClient.id,
                auct_id: currentAuct.id,
                Product: currentProduct,
                Client: currentClient,
                product_id: currentProduct.id,
                cover_auto: isAutoBidEnabled,
                cover_auto_limit: isAutoBidEnabled ? parseFloat(autoBidLimit) : null
            },
            {
                params: {
                    bidInCataloge: Boolean(isBidOnCataloge)
                },
                headers: {
                    "Authorization": `Bearer ${sessionClient.token}`
                }
            }
        );

        console.log("observando response ao criar lance -> ", response.data);

        showMessage(`Parabéns! Seu lance ${isAutoBidEnabled ? 'automático ' : ''}foi registrado`, "success");

        return response.data;

    } catch (error) {
        console.error('Erro ao dar lance:', error);
        showMessage(error.response?.data?.message || "Erro ao registrar o lance. Tente novamente.", "error");
        throw error;
    } finally {
        if (setIsloadingBid) {
            setIsloadingBid(false);
        }
    }
}

// Função para calcular o incremento de lance com base no valor atual
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

export { handleBidproduct }