import axios from "axios"

const handleBidproduct = async (bidValue, 
    messageRef, currentProduct,
    currentClient, currentAuct, 
    sessionClient, setBidValue, 
    setIsloadingBid, isAutoBidEnabled) => {

    if (messageRef && bidValue <= 0 || typeof parseInt(bidValue) !== 'number' || !bidValue) {
        messageRef.current.style.display = "flex"
        messageRef.current.style.transition = "1s"
        messageRef.current.innerHTML = "O valor do lance deve ser maior que 0"
        messageRef.current.style.color = "red"

        setTimeout(() => {
            messageRef.current.style.display = "none"
        }, 6000);

        return
    }

    if (messageRef && bidValue <= currentProduct.initial_value) {
        messageRef.current.style.display = "flex"
        messageRef.current.style.transition = "1s"
        messageRef.current.innerHTML = "O valor do lance deve ser maior que o valor atual"
        messageRef.current.style.color = "#bd9202"

        setTimeout(() => {
            messageRef.current.style.display = "none"
        }, 6000);

        return
    }

    setIsloadingBid && setIsloadingBid(true)

    try {
        const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`, {
            value: parseFloat(bidValue),
            client_id: currentClient.id,
            auct_id: currentAuct.id,
            Product: currentProduct,
            Client: currentClient,
            product_id: currentProduct.id,
            cover_auto: isAutoBidEnabled // Incluindo a informação de lance automático
        }, {
            headers: {
                "Authorization": `Bearer ${sessionClient.token}`
            }
        });

        if (messageRef) {
            messageRef.current.style.display = "flex"
            messageRef.current.innerHTML = `Parabéns! Seu lance ${isAutoBidEnabled ? 'automático ' : ''}foi registrado`
            messageRef.current.style.color = "#105500"
        }
        setTimeout(() => {
            messageRef.current.style.display = "none"
        }, 6000);
        
        if (setBidValue) {
            setBidValue(response.data.value)
        }

        setIsloadingBid && setIsloadingBid(false)

        return response.data; // Retornando os dados do lance para uso posterior, se necessário

    } catch (error) {
        setIsloadingBid && setIsloadingBid(false)
        
        if (messageRef) {
            messageRef.current.style.display = "flex"
            messageRef.current.innerHTML = "Erro ao registrar o lance. Tente novamente."
            messageRef.current.style.color = "red"
        }
        setTimeout(() => {
            messageRef.current.style.display = "none"
        }, 6000);

        throw error; // Lançando o erro para ser tratado no componente chamador, se necessário
    }
}

export { handleBidproduct }