import axios from "axios"

const getAdvertiserInformations = async (setAdvertiserInfor) => {
    const currentAdvertiserSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

    if (!currentAdvertiserSession) return false

    const configAuth = {
        headers: {
            "Authorization": `Bearer ${currentAdvertiserSession.token}`
        }
    }

    try {
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserSession.email}`, configAuth).then(response => {
            setAdvertiserInfor(response.data)
        })
    } catch (error) {
        return error
    }

}

export { getAdvertiserInformations }