/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Person, Business, LocationOn, Lock } from "@mui/icons-material";
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
            return err
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
        <div className="w-[96%] h-[90%] flex flex-col justify-start items-center relative bg-white rounded-lg shadow-lg overflow-y-auto">
            {/* Modais */}
            <ModAuthPassword authorization={isAuth} set={setIsAuth} setPassword={setPassword} setConfirmPassword={setConfirmPassword} setChangeAuthorized={setChangeAuthorized} />
            <ModChangePassword authorization={changeAuthorized} set={setChangeAuthorized} setPassword={setPassword} setConfirmPassword={setConfirmPassword} setPassReady={setPassReady} />

            {/* Mensagem de erro/sucesso */}
            {messageDisplay && (
                <div className="flex justify-center items-center w-[80%] h-[40px] bg-red-500 text-white rounded-lg absolute top-4 z-10 shadow-lg transition-all duration-300">
                    {messageDisplay}
                </div>
            )}

            {/* Cabeçalho com imagens */}
            <div className="w-full min-h-[320px] bg-gradient-to-r from-[#012038] via-[#012038]/80 to-[#012038] 
                relative flex justify-center items-center gap-8 p-8">
                <UploadProfileFile />
                <UploadCompanyFile currentAdvertiser={currentAdvertiser} />
            </div>

            {/* Formulário principal */}
            <section className="w-full flex p-8 justify-around items-start gap-8">
                {/* Informações Pessoais */}
                <div className="flex flex-col gap-6 flex-1">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-[#012038] mb-4">
                        <Person /> Informações Pessoais
                    </h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">CPF</label>
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Endereço */}
                <div className="flex flex-col gap-6 flex-1">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-[#012038] mb-4">
                        <LocationOn /> Endereço
                    </h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">CEP</label>
                        <input
                            onChange={handleGetAddress}
                            ref={refCep}
                            type="text"
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600">Estado</label>
                            <input
                                ref={refState}
                                type="text"
                                className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600">Cidade</label>
                            <input
                                ref={refCity}
                                type="text"
                                className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">Rua</label>
                        <input
                            ref={refStreet}
                            type="text"
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">Número</label>
                        <input
                            ref={refNumber}
                            type="text"
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Informações da Empresa e Botões */}
                <div className="flex flex-col gap-6 flex-1">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-[#012038] mb-4">
                        <Business /> Informações da Empresa
                    </h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">Nome da empresa</label>
                        <input
                            onChange={(e) => setCompany(e.target.value)}
                            type="text"
                            value={company_name}
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">CNPJ</label>
                        <input
                            onChange={(e) => setCNPJ(e.target.value)}
                            type="text"
                            value={CNPJ}
                            className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#012038] outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <button
                            onClick={async () => {
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
                                        currentAdvertiser
                                    );
                                });
                            }}
                            className="w-full p-3 bg-[#012038] text-white rounded-lg hover:bg-[#012038]/90 
                            transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            <Business />
                            Editar anunciante
                        </button>

                        <button
                            onClick={() => setIsAuth(true)}
                            className={`w-full p-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2
                                ${passReady ?
                                    'bg-green-500 text-white hover:bg-green-600' :
                                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <Lock />
                            {passReady ? 'Senha alterada' : 'Alterar senha'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FormProfile;
