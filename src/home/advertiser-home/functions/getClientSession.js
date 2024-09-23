import axios from "axios";

const getClientSession = async (setSessionsClient, setCurrentClient) => {
    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));

    // Verifique se currentSessionClient não é null
    if (currentSessionClient) {
        setSessionsClient(currentSessionClient);

        try {
            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
                headers: {
                    "Authorization": `Bearer ${currentSessionClient.token}`
                }
            });
            setCurrentClient(result.data);
        } catch (error) {
            console.log("Erro ao buscar cliente:", error);
            setCurrentClient(null); // Defina como null ou um valor padrão
        }
    } else {
        console.log("Nenhuma sessão de cliente encontrada.");
        setSessionsClient(null); // Defina como null ou um valor padrão
        setCurrentClient(null); // Defina como null ou um valor padrão
    }
}

export { getClientSession }