/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Shield } from "@mui/icons-material";
//import { useNavigate } from "react-router-dom";
import ModAuthPassword from "./ModAuthPassword";
import ModChangePassword from "./ModChangePassword";
import UploadCompanyFile from "./UploadCompanyFile";
import UploadProfileFile from "./UploadProfileFile";
import handleEditAdvertiser from "../functions/handleEditAdvertiser";
import getCurrentAdvertiser from "../functions/getCurrentAdvertiser";
import { getFiles } from "../functions/MiddlewareTransferFile";

function FormProfile() {
    const [currentAdvertiser, setCurrentAdvertiser] = useState({});
    const [messageDisplay, setMessageDisplay] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [changeAuthorized, setChangeAuthorized] = useState(false);
    const [passReady, setPassReady] = useState(false);

    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [company_name, setCompany] = useState("");
    const [CNPJ, setCNPJ] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEditing, setIsisEditing] = useState(false);

    //const navigate = useNavigate();

    //Adress fields................................................................
    const refState = useRef();
    const refCity = useRef();
    const refStreet = useRef();
    const refNumber = useRef();
    const refCep = useRef();

    //OPERATIONS...................................................................................
    useEffect(() => {
        const setsData = { setCurrentAdvertiser, setName, setCpf, setEmail, setCompany, setCNPJ };
        getCurrentAdvertiser({ refState, refCity, refStreet, refNumber, refCep }, setsData);
    }, []);

    const refsData = { refState, refCity, refStreet, refNumber, refCep };
    const passData = { password, confirmPassword };

    const handleGetAddress = (event) => {
        const cep = event.target.value;
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        axios.get(url).then(res => {
            refState.current.value = res.data.uf;
            refCity.current.value = res.data.localidade;
            refStreet.current.value = res.data.logradouro;
        }).catch(err => {
            console.log(err.response);
        });
    };

    if (isEditing) {
        return (
            <div className="w-[96%] h-[90%] flex flex-col justify-center items-center relative bg-white rounded-md overflow-hidden">
                <h1>Editando Anunciante, aguarde...</h1>
            </div>
        );
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
                <UploadProfileFile />

                {/* Company image */}
                <UploadCompanyFile currentAdvertiser={currentAdvertiser} />

            </div>

            <section className="w-full h-[100%] flex p-3 justify-around items-center">
                {/* INFORMAÇÕES PESSOAIS */}
                <div className="flex flex-col gap-3 h-[90%] justify-between">
                    <div className="flex flex-col justify-start items-start">
                        <span>Nome</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>CPF</span>
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Email</span>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md"
                        />
                    </div>
                </div>

                {/* INFORMAÇÕES DE ENDEREÇO */}
                <div className="flex flex-col gap-3 h-[90%] justify-between">
                    <div className="flex flex-col justify-start items-start">
                        <span>Cep</span>
                        <input
                            onChange={handleGetAddress}
                            ref={refCep}
                            type="text"
                            className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Estado</span>
                        <input
                            onChange={(e) => refState.current.value = e.target.value}
                            ref={refState}
                            type="text"
                            className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Cidade</span>
                        <input
                            onChange={(e) => refCity.current.value = e.target.value}
                            ref={refCity}
                            type="text"
                            className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Rua</span>
                        <input
                            onChange={(e) => refStreet.current.value = e.target.value}
                            ref={refStreet}
                            type="text"
                            className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>número</span>
                        <input
                            onChange={(e) => refNumber.current.value = e.target.value}
                            ref={refNumber}
                            type="text"
                            className="w-[300px] h-[41px] p-2 border-[1px] border-[#D3D3D3] bg-transparent rounded-md"
                        />
                    </div>
                </div>

                {/* INFORMAÇÕES SOBRE EMPRESA E BOTÕES */}
                <div className="flex flex-col gap-3 h-[90%] justify-between">
                    <div className="flex flex-col justify-start items-start">
                        <span>Nome da empresa</span>
                        <input
                            onChange={(e) => setCompany(e.target.value)}
                            type="text"
                            value={company_name}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>CNPJ</span>
                        <input
                            onChange={(e) => setCNPJ(e.target.value)}
                            type="text"
                            value={CNPJ}
                            className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3] rounded-md"
                        />
                    </div>

                    <button onClick={async () => {

                        await getFiles().then(result => {
                            handleEditAdvertiser(
                                refsData,
                                name,
                                email,
                                cpf,
                                CNPJ,
                                company_name,
                                setMessageDisplay,
                                passData,
                                setIsisEditing,
                                result[0],
                                result[1],
                                currentAdvertiser);
                        });

                    }} className="flex justify-center items-center w-[270px] h-[34px] 
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
    );
}

export default FormProfile;
