import axios from "axios";

const getClientSession = async (setSessionsClient, setCurrentClient) => {

    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
    setSessionsClient(currentSessionClient)

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
        headers: {
            "Authorization": `Bearer ${currentSessionClient.token}`
        }
    }).then(result => {
        setCurrentClient(result.data)
    })

}

export { getClientSession }