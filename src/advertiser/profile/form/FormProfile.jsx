import axios from "axios";
import { useRef, useState } from "react";
import { Shield } from "@mui/icons-material";
//import { useNavigate } from "react-router-dom";
import ModAuthPassword from "./ModAuthPassword";
import ModChangePassword from "./ModChangePassword";
import UploadCompanyFile from "./UploadCompanyFile";
import UploadProfileFile from "./UploadProfileFile";

function FormProfile() {
    const [messageDisplay, setMessageDisplay] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [changeAuthorized, setChangeAuthorized] = useState(false)
    const [passReady, setPassReady] = useState(false)

    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [email, setEmail] = useState("")
    const [company_name, setCompany] = useState("")
    const [CNPJ, setCNPJ] = useState("")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isEditing, setIsisEditing] = useState(false)

    const [currentAdvertiserProfileFile, setCurrentAdvertiserProfileFile] = useState()
    const [currentAdvertiserCompanyFile, setCurrentAdvertiserCompanyFile] = useState()


    //const navigate = useNavigate()

    //Adress fields................................................................
    const refState = useRef()
    const refCity = useRef()
    const refStreet = useRef()
    const refNumber = useRef()
    const refCep = useRef()

    //OPERATIONS...................................................................................
    //01
    const handleEditAdvertiser = async () => {

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
            const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

            const currentAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            })

            currentAdvertiserProfileFile &&
                await axios.delete(`${import.meta.env.VITE_APP_BACK}`)//delete current 
            currentAdvertiserCompanyFile &&
                await axios.delete(`${import.meta.env.VITE_APP_BACK}`)//delete current 

            let currentProfile;
            let currentCompany;

            currentAdvertiserProfileFile && //upload Profile
                await axios.post(`${import.meta.env.VITE_APP_BACK}/advertiser/upload-cover-profile?advertiser_id=${currentAdvertiser.data.id}`, {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }).then(response => {
                    currentProfile = response.data.body
                })

            currentAdvertiserCompanyFile && //upload company
                await axios.post(`${import.meta.env.VITE_APP_BACK}/advertiser/upload-logo-company?advertiser_id=${currentAdvertiser.data.id}`, {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }).then(response => {
                    currentCompany = response.data.body
                })

            await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/update?advertiser_id=${currentAdvertiser.data.id}`, {
                name: name,
                CPF: cpf,
                CNPJ: CNPJ,
                company_name: company_name,
                company_adress: JSON.stringify(addressInformations),
                email: email,
                password: password,
                address: JSON.stringify(addressInformations),
                url_profile_cover: currentProfile,
                url_profile_company_logo_cover: currentCompany
            }, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then((res) => {

                setMessageDisplay("Usuário criado com sucesso!")
                setIsisEditing(false)
                console.log(res.data);

            })

        } catch (error) {
            setIsisEditing(false)
        }

    }
    //02
    const handleGetAddress = (event) => {
        //console.log('observando target ->', event.target.value);
        //API CEP https://viacep.com.br/ws/53409400/json/
        const cep = event.target.value
        const url = `https://viacep.com.br/ws/${cep}/json/`
        axios.get(url).then(res => {
            console.log('res ai ->', res.data);
            refState.current.value = res.data.uf
            refCity.current.value = res.data.localidade
            refStreet.current.value = res.data.logradouro
        }).catch(err => {
            console.log(err.response);
        })

    }

    if (isEditing) {
        return (
            <div className="w-[96%] h-[90%] flex flex-col justify-center items-center relative bg-white rounded-md overflow-hidden">
                <h1>Editando Anunciante, aguarde...</h1>
            </div>
        )
    }

    return (
        <div className="w-[96%] h-[90%] flex flex-col justify-start items-center relative bg-white rounded-md overflow-hidden">
            {/* ........................AUTH CONFIRMATION.............................. */}
            <ModAuthPassword authorization={isAuth} set={setIsAuth} setPassword={setPassword} setConfirmPassword={setConfirmPassword} setChangeAuthorized={setChangeAuthorized} />
            <ModChangePassword authorization={changeAuthorized} set={setChangeAuthorized} setPassword={setPassword} setConfirmPassword={setConfirmPassword} setPassReady={setPassReady} />

            {messageDisplay && <span className="flex justify-center items-center w-[80%] h-[40px] bg-red-400 text-red-100 rounded-md absolute top-1 z-10">
                {messageDisplay}
            </span>}

            {/* CABEÇALHO */}
            <div className="w-full min-h-[320px] bg-gradient-to-r flex justify-center items-center 
            from-[#012038] via-[#76bff7] to-[#012038] relative gap-3">

                {/* Profile image */}

                <UploadProfileFile setCurrentAdvertiserProfileFile={setCurrentAdvertiserProfileFile} />

                {/* Company image */}

                <UploadCompanyFile setCurrentAdvertiserCompanyFile={setCurrentAdvertiserCompanyFile} />

            </div>

            <section className="w-full h-[100%] flex p-3 justify-around items-center">
                {/* INFORMAÇÕES PESSOAIS */}
                <div className="flex flex-col gap-3 h-[90%] justify-between">

                    <div onChange={(e) => setName(e.target.value)} className="flex flex-col justify-start items-start">
                        <span>Nome</span>
                        <input type="text" value={name}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md" />
                    </div>

                    <div onChange={(e) => setCpf(e.target.value)} className="flex flex-col justify-start items-start">
                        <span>CPF</span>
                        <input type="text" value={cpf}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md" />
                    </div>

                    <div onChange={(e) => setEmail(e.target.value)} className="flex flex-col justify-start items-start">
                        <span>Email</span>
                        <input type="text" value={email}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md" />
                    </div>

                </div>
                {/* INFORMAÇÕES DE ENDEREÇO */}
                <div className="flex flex-col gap-3 h-[90%] justify-between">

                    <div onChange={handleGetAddress} className="flex flex-col justify-start items-start">
                        <span>Cep</span>
                        <input ref={refCep} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Estado</span>
                        <input ref={refState} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Cidade</span>
                        <input ref={refCity} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Rua</span>
                        <input ref={refStreet} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>número</span>
                        <input ref={refNumber} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md" />
                    </div>

                </div>
                {/* INFORMAÇÕES SOBRE EMPRESA E BOTÕES */}
                <div className="flex flex-col gap-3 h-[90%] justify-between">

                    <div className="flex flex-col justify-start items-start">
                        <span>Nome da empresa</span>
                        <input onChange={(e) => setCompany(e.target.value)} type="text" value={company_name}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>CNPJ</span>
                        <input onChange={(e) => setCNPJ(e.target.value)} type="text" value={CNPJ}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md" />
                    </div>

                    <button onClick={handleEditAdvertiser} className="flex justify-center items-center w-[270px] h-[34px] 
                    bg-orange-600 text-white border-[1px] border-[#ffe4c5] rounded-md">
                        Editar anunciante
                    </button>
                    {
                        passReady ?
                            <button style={{ textShadow: "2px 2px 1px #1010106c" }} onClick={() => setIsAuth(true)} className="flex justify-between items-center w-[270px] h-[34px] 
                            bg-[#57df2a] border-[1px] border-[#c6ffbc] rounded-md p-2 text-white">
                                <Shield />
                                senha alterada
                            </button> :
                            <button onClick={() => setIsAuth(true)} className="flex justify-between items-center w-[270px] h-[34px] 
                            bg-transparent border-[1px] border-[#D3D3D3] rounded-md p-2">
                                <Shield />
                                Alterar senha
                            </button>
                    }


                </div>

            </section>

        </div>
    )
}

export default FormProfile;