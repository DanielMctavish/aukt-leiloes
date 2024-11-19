/* eslint-disable no-unreachable */
import axios from "axios"

//01
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
    currentAdvertiserProfileFile,
    currentAdvertiserCompanyFile,
    currentAdvertiser
) => {

    //const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

    const { refState, refCity, refStreet, refNumber, refCep } = refsData
    const { password, confirmPassword } = passData

    if (!password || !confirmPassword) {
        setMessageDisplay("Crie uma nova senha para poder alterar usuário... ")

        setTimeout(() => {
            setMessageDisplay(false)
        }, 3000);

        return
    }


    if (!name || !email
        || !refState.current.value || !refCity.current.value
        || !refStreet.current.value || !refNumber.current.value
        || !refCep.current.value) {
        setMessageDisplay("Preencha todos os campos")

        setTimeout(() => {
            setMessageDisplay(false)
        }, 3000);

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

    async function* deleteImagesAdvertiser(currentAdvertiser) {
        try {
            // Inclui o ID e a URL na requisição de deleção
            if (currentAdvertiser)
                await axios.delete(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/delete-profile`, {
                    params: {
                        url: currentAdvertiser.url_profile_cover,
                        id: currentAdvertiser.id
                    }
                });
            yield "deleted profile"; // Gera uma mensagem após a deleção
        } catch (error) {
            return error
        }

        try {
            // Inclui o ID e a URL na requisição de deleção
            if (currentAdvertiser)
                await axios.delete(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/delete-logo-company`, {
                    params: {
                        url: currentAdvertiser.url_profile_company_logo_cover,
                        id: currentAdvertiser.id
                    }
                });
            yield "deleted company"; // Gera uma mensagem após a deleção
        } catch (error) {
            return error
        }
    }


    const executeDeletion = async () => {
        for await (const message of deleteImagesAdvertiser()) {
            return message
        }
    };

    try {

        let currentProfile;
        let currentCompany;

        // Upload do profile
        if (currentAdvertiserProfileFile !== "none") {
            if (currentAdvertiserProfileFile !== "none" && currentAdvertiser.url_profile_cover) {
                await executeDeletion();
            }

            const formDataSingleProfile = new FormData();
            formDataSingleProfile.append("aukt-profile-advertiser", currentAdvertiserProfileFile);

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/upload-cover-profile?adv_id=${currentAdvertiser.id}`, formDataSingleProfile)
                .then(response => {
                    currentProfile = response.data.body;
                }).catch(response => {
                    throw new Error(`Error at upload profile: ${response.data}`);
                });

        }

        // Upload do company
        if (currentAdvertiserCompanyFile !== "none") {
            if (currentAdvertiser.url_profile_company_logo_cover) {
                deleteImagesAdvertiser()
            }

            const formDataSingleCompany = new FormData();
            formDataSingleCompany.append("aukt-company-advertiser", currentAdvertiserCompanyFile);

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/upload-logo-company?adv_id=${currentAdvertiser.id}`, formDataSingleCompany)
                .then(response => {
                    currentCompany = response.data.body;
                }).catch(response => {
                    throw new Error(`Error at upload company: ${response.data}`);
                });

        }

        // Atualização
        await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/update-advertiser?adv_id=${currentAdvertiser.id}`, {
            name: name,
            CPF: cpf,
            CNPJ: CNPJ,
            company_name: company_name,
            email: email,
            password: password,
            address: JSON.stringify(addressInformations),
            url_profile_cover: currentProfile,
            url_profile_company_logo_cover: currentCompany
        }).then(() => {
            setMessageDisplay("Usuário criado com sucesso!");
            setIsisEditing(false);
        }).catch(error => {
            throw new Error(`Error at update advertiser: ${error.message}`);
        });

    } catch (error) {
        setIsisEditing(false);
    }


}

export default handleEditAdvertiser;