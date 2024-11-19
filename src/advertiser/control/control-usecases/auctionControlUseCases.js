import axios from "axios";
import { setStatus, resetGeneralAUK } from "../../../features/auct/generalAUKSlice";

export const handlePlayAuction = (selectedAuction, selectedGroup, cookieSession, dispatch) => async () => {
    if (!selectedAuction || !selectedGroup) {
        alert("É necessário selecionar um leilão e um grupo.");
        return null;
    }

    try {
         await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/start-auct`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                group: selectedGroup
            }
        });
        dispatch(setStatus('live'));
        // Adicione aqui qualquer outra ação necessária após iniciar o leilão
    } catch (error) {
        console.error("Play Auction Error:", error.message);
        alert("Erro ao iniciar o leilão. Por favor, tente novamente.");
    }
};

export const handlePauseAuction = (selectedAuction, cookieSession, dispatch) => async () => {
 
    try {
       await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/pause-product-time`, {
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
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/resume-floor`, {
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
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/next-product`, {
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


export const handleAddTime = (selectedAuction, cookieSession, time) => async () => {
  
    try {
       await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/change-product-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                time: time
            }
        });
       
    } catch (error) {
        alert(`Erro ao adicionar ${time} segundos. Por favor, tente novamente.`);
    }
};

export const killAuction = (selectedAuction, cookieSession, dispatch) => async () => {
    if (!cookieSession) return;

    try {
       await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/kill-auct`, {
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