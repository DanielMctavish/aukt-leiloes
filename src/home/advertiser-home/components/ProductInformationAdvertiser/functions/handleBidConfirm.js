import { handleBidproduct } from '../../../functions/handleBidproduct.js';

// Função para realizar um lance
const handleBidConfirm = async ({
    bidValue,
    isAutoBidEnabled,
    autoBidLimit,
    setIsloadingBid,
    messageRef,
    props,
    setBidValue,
    fetchUpdatedProduct,
    checkAutoBid,
    setAutoBidLimit,
    showMessage
}) => {
    try {
        const session = JSON.parse(localStorage.getItem("client-auk-session-login"));
        if (!session?.token) {
            showMessage("Sessão inválida. Faça login novamente.", "error");
            return;
        }

        // Validar limite do lance automático
        if (isAutoBidEnabled && (!autoBidLimit || autoBidLimit <= bidValue)) {
            showMessage("O valor limite do lance automático deve ser maior que o valor do lance atual", "warning");
            return;
        }

        // Validar valor do lance apenas se houver lances anteriores
        if (props.currentProduct.Bid && props.currentProduct.Bid.length > 0) {

            console.log("condição atingida? ", props.currentProduct.Bid.length)

            const currentValue = props.currentProduct.Bid[0].value;

            if (currentValue >= props.currentProduct.initial_value) {
                showMessage("O valor do lance deve ser maior que o valor atual", "warning");
            }

        }

        setIsloadingBid(true);

        const result = await handleBidproduct(
            bidValue,
            messageRef,
            props.currentProduct,
            props.currentClient,
            props.currentAuct,
            session,
            setBidValue,
            setIsloadingBid,
            isAutoBidEnabled,
            true, // bidInCataloge
            showMessage,
            autoBidLimit // Passando o limite do lance automático
        );

        if (result) {
            // Lance bem-sucedido - buscar produto atualizado
            await fetchUpdatedProduct();

            // Resetar o limite do lance automático se necessário
            if (isAutoBidEnabled) {
                setAutoBidLimit(0);
            }

            // Verificar o status do lance automático
            await checkAutoBid();
        }
    } catch (error) {
        console.error("Erro ao dar lance:", error);
        showMessage("Ocorreu um erro ao processar seu lance. Tente novamente.", "error");
    } finally {
        setIsloadingBid(false);
    }
};

export default handleBidConfirm;