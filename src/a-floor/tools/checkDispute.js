/* eslint-disable no-async-promise-executor */
import axios from "axios";

async function checkDispute(auct_id, deadline) {
    return new Promise(async (resolve, reject) => {
        // Se o deadline for menor que 4 segundos, tenta adicionar tempo
        console.log(deadline);
        if (deadline <= 4) {
            try {
                await axios.get(`${import.meta.env.VITE_APP_CONTROLLER_API}/controller/add-time`, {
                    params: {
                        auct_id: auct_id,
                        seconds: 3
                    }
                });
                console.log("Acréscimo de tempo adicionado com sucesso.");
                resolve(true);
            } catch (error) {
                console.log("Erro ao adicionar tempo na disputa:", error.message);
                reject(new Error("Falha ao adicionar tempo"));
            }
        } else {
            // Não é necessário adicionar tempo
            reject(new Error("Não é necessário adicionar tempo"));
        }
    });
}

export default checkDispute;