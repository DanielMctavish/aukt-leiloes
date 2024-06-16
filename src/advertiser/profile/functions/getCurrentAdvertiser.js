import axios from "axios"

//00
const getCurrentAdvertiser = async (refsData, setsData) => {

    const { refState, refCity, refStreet, refNumber, refCep } = refsData
    const { setCurrentAdvertiser, setName, setCpf, setEmail, setCompany, setCNPJ } = setsData

    const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentSession.email}`, {
        headers: {
            'Authorization': `Bearer ${currentSession.token}`
        }
    }).then(result => {
        setCurrentAdvertiser(result.data)
        setName(result.data.name)
        setCpf(result.data.CPF)
        setEmail(result.data.email)
        setCompany(result.data.company_name)
        setCNPJ(result.data.CNPJ)

        const address = JSON.parse(result.data.address)
        refCep.current.value = address.cep
        refState.current.value = address.state
        refCity.current.value = address.city
        refStreet.current.value = address.street
        refNumber.current.value = address.number
    })
}


export default getCurrentAdvertiser;