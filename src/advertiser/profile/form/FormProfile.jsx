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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
            {/* Modais */}
            <ModAuthPassword authorization={isAuth} set={setIsAuth} setPassword={setPassword} setConfirmPassword={setConfirmPassword} setChangeAuthorized={setChangeAuthorized} />
            <ModChangePassword authorization={changeAuthorized} set={setChangeAuthorized} setPassword={setPassword} setConfirmPassword={setConfirmPassword} setPassReady={setPassReady} />

            {/* Mensagem de Feedback */}
            {messageDisplay && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`px-6 py-3 rounded-lg shadow-lg ${messageDisplay.includes('sucesso')
                        ? 'bg-green-500'
                        : 'bg-red-500'
                        } text-white`}>
                        {messageDisplay}
                    </div>
                </div>
            )}

            {/* Header com Banner e Fotos */}
            <div className="relative">
                {/* Banner com Logo da Empresa */}
                <div className="h-64 relative overflow-hidden flex justify-center items-center">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#012038] 
                    via-[#012038]/90 to-[#012038] flex justify-center items-center" />

                    {/* Logo da Empresa como Background */}
                    {currentAdvertiser.url_profile_company_logo_cover && (
                        <img src={currentAdvertiser.url_profile_company_logo_cover}
                            className="w-full object-cover opacity-40" />
                    )}

                    {/* Upload da Logo da Empresa */}
                    <div className="absolute top-4 right-4">
                        <UploadCompanyFile
                            currentAdvertiser={currentAdvertiser}
                            className="w-24 h-24 rounded-lg shadow-xl border-4 border-white"
                        />
                    </div>
                    {/* Foto do Perfil Sobreposta */}
                    {/* Nome do usuário abaixo da foto */}
                    <div className="absolute flex flex-col justify-center items-start left-[2vh]">
                        <UploadProfileFile currentAdvertiser={currentAdvertiser} />
                        <h2 className="text-xl font-bold text-[#7bc6ff]">
                            {currentAdvertiser.name}
                        </h2>
                        <p className="text-sm text-[#fff] text-center">
                            {currentAdvertiser.email}
                        </p>
                    </div>
                </div>

            </div>

            {/* Formulário Principal (com margin-top para compensar a foto do perfil) */}
            <div className="mt-32 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Informações Pessoais */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                            <Person className="text-[#012038]" />
                            <h2 className="text-xl font-bold text-[#012038]">
                                Informações Pessoais
                            </h2>
                        </div>

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
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                            <LocationOn className="text-[#012038]" />
                            <h2 className="text-xl font-bold text-[#012038]">
                                Endereço
                            </h2>
                        </div>

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

                    {/* Informações da Empresa */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                            <Business className="text-[#012038]" />
                            <h2 className="text-xl font-bold text-[#012038]">
                                Informações da Empresa
                            </h2>
                        </div>

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

                        {/* Botões */}
                        <div className="pt-6 space-y-4">
                            <button
                                onClick={async () => {
                                    await getFiles().then(() => {
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
                                            currentAdvertiser
                                        );
                                    });
                                }}
                                className="w-full p-4 bg-[#012038] text-white rounded-lg 
                                    hover:bg-[#012038]/90 transition-all duration-300 
                                    shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                                    flex items-center justify-center gap-2"
                            >
                                <Business />
                                Salvar Alterações
                            </button>

                            <button
                                onClick={() => setIsAuth(true)}
                                className={`w-full p-4 rounded-lg transition-all duration-300 
                                    shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                                    flex items-center justify-center gap-2
                                    ${passReady
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Lock />
                                {passReady ? 'Senha alterada' : 'Alterar senha'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormProfile;
