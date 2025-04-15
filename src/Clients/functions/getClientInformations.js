import axios from "axios";

export const getClientInformations = async (
    navigate, 
    getBidsByClient, 
    setCurrentClient,
    setAllBids, 
    setBidsWinners, 
    setBudget, 
    currentClient
) => {
    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
    
    if (!currentSessionClient) {
        if (navigate) {
            navigate("/client/login");
        }
        return null;
    }

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`,
            {
                headers: {
                    "Authorization": `Bearer ${currentSessionClient.token}`
                }
            }
        );

        if (getBidsByClient && setAllBids && setBidsWinners && setBudget) {
            getBidsByClient(
                response.data.id,
                currentClient,
                setAllBids,
                setBidsWinners,
                setBudget
            );
        }

        setCurrentClient(response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar informações do cliente:", error);
        localStorage.removeItem("client-auk-session-login");
        if (navigate) {
            navigate("/client/login");
        }
        return null;
    }
};

export default getClientInformations;