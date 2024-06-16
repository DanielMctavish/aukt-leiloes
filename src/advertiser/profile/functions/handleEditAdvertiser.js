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

    try {
        // Operações de DELETE 
        // if (currentAdvertiser.url_profile_cover) {
        //     console.log("Deletando profile...");
        //     await axios.delete(`/api/advertiser/delete-profile?url=${currentAdvertiser.url_profile_cover}`);
        // }

        // if (currentAdvertiser.url_profile_company_logo_cover) {
        //     console.log("Deletando company...");
        //     await axios.delete(`/api/advertiser/delete-logo-company?url=${currentAdvertiser.url_profile_company_logo_cover}`);
        // }

        let currentProfile;
        let currentCompany;

        // Upload do profile
        if (currentAdvertiserProfileFile !== "none") {
            const formDataSingleProfile = new FormData();
            formDataSingleProfile.append("aukt-profile-advertiser", currentAdvertiserProfileFile);

            await axios.post(`/api/advertiser/upload-cover-profile?adv_id=${currentAdvertiser.id}`, formDataSingleProfile)
                .then(response => {
                    console.log("Profile successfully uploaded", response.data);
                    currentProfile = response.data.body;
                }).catch(response => {
                    console.error("Error at upload profile: ", response);
                    throw new Error(`Error at upload profile: ${response.data}`);
                });
                
        }

        // Upload do company
        if (currentAdvertiserCompanyFile !== "none") {
            const formDataSingleCompany = new FormData();
            formDataSingleCompany.append("aukt-company-advertiser", currentAdvertiserCompanyFile);

            await axios.post(`/api/advertiser/upload-logo-company?adv_id=${currentAdvertiser.id}`, formDataSingleCompany)
                .then(response => {
                    console.log("Company successfully uploaded", response.data);
                    currentCompany = response.data.body;
                }).catch(response => {
                    console.error("Error at upload company: ", response);
                    throw new Error(`Error at upload company: ${response.data}`);
                });

        }

        // Atualização
        await axios.patch(`/api/advertiser/update-advertiser?adv_id=${currentAdvertiser.id}`, {
            name: name,
            CPF: cpf,
            CNPJ: CNPJ,
            company_name: company_name,
            email: email,
            password: password,
            address: JSON.stringify(addressInformations),
            url_profile_cover: currentProfile,
            url_profile_company_logo_cover: currentCompany
        }).then(data => {
            setMessageDisplay("Usuário criado com sucesso!");
            setIsisEditing(false);
            console.log(data);
        }).catch(error => {
            throw new Error(`Error at update advertiser: ${error.message}`);
        });

    } catch (error) {
        setIsisEditing(false);
        console.log(error)
    }


}

export default handleEditAdvertiser;