/* eslint-disable no-unreachable */
import axios from "axios"

const handleEditAdvertiser = async (
    refsData,
    name,
    email,
    cpf,
    CNPJ,
    company_name,
    setMessageDisplay,
    passData,
    setIsisEditing,
    currentAdvertiser
) => {
    const { refState, refCity, refStreet, refNumber, refCep } = refsData
    const { password, confirmPassword } = passData

   
    if (!password || !confirmPassword) {
        setMessageDisplay("Crie uma nova senha para poder alterar usuário... ")
        setTimeout(() => setMessageDisplay(false), 3000);
        return
    }

    if (!name || !email || !refState.current.value || !refCity.current.value
        || !refStreet.current.value || !refNumber.current.value || !refCep.current.value) {
        setMessageDisplay("Preencha todos os campos")
        setTimeout(() => setMessageDisplay(false), 3000);
        return
    }

    if (password !== confirmPassword) {
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

    setIsisEditing(true)

    try {
        // Atualização do anunciante
        await axios.patch(
            `${import.meta.env.VITE_APP_BACKEND_API}/advertiser/update-advertiser?advertiserId=${currentAdvertiser.id}`,
            {
                name,
                CPF: cpf,
                CNPJ,
                company_name,
                email,
                password: passData.password,
                address: JSON.stringify(addressInformations),
                url_profile_cover: currentAdvertiser.url_profile_cover,
                url_profile_company_logo_cover: currentAdvertiser.url_profile_company_logo_cover
            }
        );

        setMessageDisplay("Perfil atualizado com sucesso!");
        setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
        console.error("Erro na atualização:", error);
        setMessageDisplay("Erro ao atualizar perfil. Tente novamente.");
    } finally {
        setIsisEditing(false);
    }
}

export default handleEditAdvertiser;