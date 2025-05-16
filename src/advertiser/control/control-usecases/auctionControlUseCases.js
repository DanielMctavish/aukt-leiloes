import axios from "axios";
import { setStatus, resetGeneralAUK } from "../../../features/auct/generalAUKSlice";

export const handlePlayAuction = (selectedAuction, selectedGroup, cookieSession, dispatch) => async () => {
    if (!selectedAuction || !selectedGroup) {
        alert("É necessário selecionar um leilão e um grupo.");
        return null;
    }

    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/play-auction`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                group: selectedGroup
            }
        });
        dispatch(setStatus('live'));
        return response;
    } catch (error) {
        console.error("Play Auction Error:", error.message);
        alert("Erro ao iniciar o leilão. Por favor, tente novamente.");
        throw error; // Re-throw the error so it can be caught by the component
    }
};

export const handlePauseAuction = (selectedAuction, cookieSession, dispatch) => async () => {

    try {
        await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/pause-auction`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });

        dispatch(setStatus('paused'));
    } catch (error) {

        alert("Erro ao pausar o leilão. Por favor, tente novamente.");
    }
};

export const handleResumeAuction = (selectedAuction, cookieSession, dispatch) => async () => {

    try {
        await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/resume-auction`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });

        dispatch(setStatus('live'));
    } catch (error) {
        alert("Erro ao retomar o leilão. Por favor, tente novamente.");
    }
};

export const handleNextProduct = (selectedAuction, cookieSession, setLoadNext) => async () => {

    setLoadNext(true);
    try {
        await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/skip-lote`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });

    } catch (error) {
        alert("Erro ao passar para o próximo lote.");
    } finally {
        setTimeout(() => {
            setLoadNext(false);
        }, 6000);
    }
};

export const handleAddTime = (auct_id, cookieSession, time) => async () => {

    try {
        await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/add-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: auct_id,
                seconds: time
            }
        });

        console.log("Tempo do leilão alterado com sucesso.");

    } catch (error) {
        alert(`Erro ao adicionar ${time} segundos. Por favor, tente novamente.`);
    }
};

export const killAuction = (selectedAuction, cookieSession, dispatch) => async () => {
    if (!cookieSession) return;

    try {
        await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/stop-auction`, {
            headers: {
                'Authorization': `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });

        // Resetar o estado do generalAUK
        dispatch(resetGeneralAUK());

        // Notificar todos os componentes que o leilão foi finalizado
        dispatch(setStatus('finished'));

        alert("Leilão finalizado com sucesso.");
    } catch (error) {
        alert("Erro ao finalizar o leilão. Por favor, tente novamente.");
    }
};

export const changeProductTime = async (selectedAuction, cookieSession, time) => {

    try {
        await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/change-product-time`, {
            params: {
                auct_id: selectedAuction.id,
                seconds: time
            }
        });

        console.log("Tempo do leilão alterado com sucesso.");
    } catch (error) {
        console.log("Erro ao tentar mudar o tempo do leilão", error);
    }
}

export const changeLote = async (cookieSession, selectedAuction, lote) => {

    try {
        await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/change-lote`, {
            headers: {
                'Authorization': `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                lote: lote
            }
        });

    } catch (error) {
        alert("Erro ao tentar mudar o lote do leilão");
    }

}