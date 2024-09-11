import axios from "axios";
import { selectLiveAuction, selectLiveGroup } from "../../../features/auct/LiveSelected";
import { setRunning, setPaused } from "../../../features/auct/controlButtonsSlice";
import { setStatus, resetGeneralAUK } from "../../../features/auct/generalAUKSlice";

export const handlePlayAuction = (selectedAuction, selectedGroup, cookieSession, dispatch) => async () => {
    if (!selectedAuction || !selectedGroup) {
        alert("É necessário selecionar um leilão e um grupo.");
        return null;
    }

    console.log("Iniciando leilão...");
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/start-auct`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                group: selectedGroup
            }
        });
        console.log("Play Auction Response:", response.data);
        dispatch(setStatus('live'));
        // Adicione aqui qualquer outra ação necessária após iniciar o leilão
    } catch (error) {
        console.error("Play Auction Error:", error.message);
        alert("Erro ao iniciar o leilão. Por favor, tente novamente.");
    }
};

export const handlePauseAuction = (selectedAuction, cookieSession, dispatch) => async () => {
    console.log("Pausando leilão...");
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/pause-product-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });
        console.log("Pause Auction Response:", response.data);
        dispatch(setStatus('paused'));
    } catch (error) {
        console.error("Pause Auction Error:", error.message);
        alert("Erro ao pausar o leilão. Por favor, tente novamente.");
    }
};

export const handleResumeAuction = (selectedAuction, cookieSession, dispatch) => async () => {
    console.log("Retomando leilão...");
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/resume-floor`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });
        console.log("Resume Auction Response:", response.data);
        dispatch(setStatus('live'));
    } catch (error) {
        console.error("Resume Auction Error:", error.message);
        alert("Erro ao retomar o leilão. Por favor, tente novamente.");
    }
};

export const handleNextProduct = (selectedAuction, cookieSession) => async () => {
    console.log("Passando para o próximo lote...");
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/next-product`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });
        console.log("Next Product Response:", response.data);
    } catch (error) {
        console.error("Next Product Error:", error.message);
        alert("Erro ao passar para o próximo lote. Por favor, tente novamente.");
    }
};

export const handleAddTime = (selectedAuction, cookieSession, time) => async () => {
    console.log(`Adicionando ${time} segundos...`);
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/change-product-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                time: time
            }
        });
        console.log(`Add ${time} Seconds Response:`, response.data);
    } catch (error) {
        console.error(`Add ${time} Seconds Error:`, error.message);
        alert(`Erro ao adicionar ${time} segundos. Por favor, tente novamente.`);
    }
};

export const killAuction = (selectedAuction, cookieSession, dispatch) => async () => {
    if (!cookieSession) return;

    console.log("Finalizando leilão...");
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/kill-auct`, {
            headers: {
                'Authorization': `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        });
        console.log("Kill Auction Response:", response.data);
        
        // Resetar o estado do generalAUK
        dispatch(resetGeneralAUK());
        
        // Notificar todos os componentes que o leilão foi finalizado
        dispatch(setStatus('finished'));
        
        alert("Leilão finalizado com sucesso.");
    } catch (error) {
        console.error("Kill Auction Error:", error.message);
        alert("Erro ao finalizar o leilão. Por favor, tente novamente.");
    }
};