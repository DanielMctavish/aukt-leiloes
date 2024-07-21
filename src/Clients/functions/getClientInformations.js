import axios from "axios";


export const getClientInformations = async (navigate, getBidsByClient, setCurrentClient,
    setAllBids, setBidsWinners, setBudget, currentClient) => {

    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
    if (!currentSessionClient) {
        navigate("/client/login");
    }

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
        headers: {
            "Authorization": `Bearer ${currentSessionClient.token}`
        }
    }).then((response) => {
        // console.log("dashboard client found -> ", response.data)
        getBidsByClient &&
            getBidsByClient(response.data.id, currentClient,
                setAllBids, setBidsWinners, setBudget);

        setCurrentClient(response.data);
    }).catch(() => {
        localStorage.removeItem("client-auk-session-login");
        navigate("/client/login");
    });

};