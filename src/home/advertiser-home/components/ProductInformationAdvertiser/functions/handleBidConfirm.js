/* eslint-disable no-unreachable */
import { handleBidproduct } from '../../../functions/handleBidproduct.js';

// Função para realizar um lance
const handleBidConfirm = async ({
    bidValue,
    productId,
    clientId,
    auctId,
    isLoadingBid,
    setIsloadingBid,
    currentSession,
    setIsModalOn,
    onBidSuccess,
    setAutoBidLimit,
    showMessage,
    isAutoBid = false // Novo parâmetro para indicar se é lance automático
}) => {
    try {

        console.log("observando bidValue --> ", bidValue)
        // Verificar sessão
        if (!currentSession?.token) {
            setIsModalOn(true); // Abrir modal de login
            return;
        }

        // Validar se já está carregando
        if (isLoadingBid) {
            return;
        }

        setIsloadingBid(true);

        // Se for lance automático, o valor do lance é fornecido em bidValue (que neste caso é o valor limite)
        // O lance automático inicial é controlado pelo backend com base no valor atual do produto
        const result = await handleBidproduct(
            bidValue, // Este valor é o limite no caso de lance automático ou o valor do lance normal
            null, // messageRef não é mais necessário, usando showMessage
            { id: productId }, // currentProduct
            { id: clientId }, // currentClient
            { id: auctId }, // currentAuct
            currentSession,
            () => {}, // setBidValue não é mais necessário aqui
            setIsloadingBid,
            isAutoBid, // Indica se é lance automático
            true, // bidInCataloge
            showMessage,
            bidValue // Sempre passa o bidValue como limite
        );

        if (result) {
            // Lance bem-sucedido
            if (isAutoBid) {
                setAutoBidLimit(0);
            }
            
            // Chamar callback de sucesso
            onBidSuccess();
            
            // Mostrar mensagem de sucesso
            showMessage(`Parabéns! Seu lance ${isAutoBid ? 'automático ' : ''}foi registrado`, "success");
        }
    } catch (error) {
        console.error("Erro ao dar lance:", error);
        showMessage(error.response?.data?.message || "Ocorreu um erro ao processar seu lance. Tente novamente.", "error");
    } finally {
        setIsloadingBid(false);
    }
};

export default handleBidConfirm;