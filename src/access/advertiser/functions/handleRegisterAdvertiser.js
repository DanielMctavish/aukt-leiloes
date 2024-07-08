import axios from "axios";

const handleRegisterAdvertiser = async (data) => {

    const { refName, refEmail, refPassword, refPasswordConfirm,
        refState, refCity, refStreet, refNumber, refCep,
        refCompanyName, cpf, cnpj, setMessageDisplay, navigate } = data;

    if (!refName.current.value || !refEmail.current.value
        || !refPassword.current.value || !refPasswordConfirm.current.value
        || !refState.current.value || !refCity.current.value
        || !refStreet.current.value || !refNumber.current.value
        || !refCep.current.value) {
        setMessageDisplay("Preencha todos os campos")
        return
    }

    if (refPassword.current.value !== refPasswordConfirm.current.value) {
        setMessageDisplay("As senhas não conferem")
        return
    }

    const addressInformations = {
        state: refState.current.value,
        city: refCity.current.value,
        street: refStreet.current.value,
        number: refNumber.current.value,
        cep: refCep.current.value
    }

    await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/create-advertiser`, {
        name: refName.current.value,
        CPF: cpf,
        CNPJ: cnpj,
        company_name: refCompanyName.current.value,
        company_adress: JSON.stringify(addressInformations),
        email: refEmail.current.value,
        password: refPassword.current.value,
        address: JSON.stringify(addressInformations)
    }).then((res) => {

        setMessageDisplay("Usuário criado com sucesso!")
        console.log(res.data);
        navigate("/advertiser/login")

    }).catch(err => {
        console.log(err.response);
    })
}

export { handleRegisterAdvertiser }