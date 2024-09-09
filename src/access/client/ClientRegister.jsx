import axios from "axios";
import logoAukGreen from "../../media/logos/logos-auk/aukt_greengreen.png";
import bgRegister from "../../media/backgrounds/social_bg_wall.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components-clients/ErrorModal";
import Step1 from "../components-clients/Step1";
import Step2 from "../components-clients/Step2";
import Step3 from "../components-clients/Step3";
import Step4 from "../components-clients/Step4";
//avatares import
import avatar_01 from "../../media/avatar-floor/avatar_01.png";
import avatar_02 from "../../media/avatar-floor/avatar_02.png";
import avatar_03 from "../../media/avatar-floor/avatar_03.png";
import avatar_04 from "../../media/avatar-floor/avatar_04.png";
import avatar_05 from "../../media/avatar-floor/avatar_05.png";
import avatar_06 from "../../media/avatar-floor/avatar_06.png";
import avatar_07 from "../../media/avatar-floor/avatar_07.png";
import avatar_08 from "../../media/avatar-floor/avatar_08.png";

const avatares_pessoas = [avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08];

function ClientRegister() {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [nextMenu, setNextMenu] = useState(0);
    const [nickname, setNickname] = useState("");
    const [clientAvatar, setClientAvatar] = useState(0);
    const [phone, setPhone] = useState('');
    //Address states................................................................
    const [cep, setCep] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [missingFields, setMissingFields] = useState([]);

    const navigate = useNavigate();

    useEffect(() => { }, [cep, state, city, street, number, name, cpf, email, password, confirmPassword, nickname, clientAvatar, phone]);

    const handleRegisterNewClient = async () => {
        if (!name || !cpf || !email || !password || !confirmPassword || !phone) {
            alert('Preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não conferem');
            return;
        }

        setIsCreating(true);

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/create-client`, {
            name: name,
            cpf: cpf,
            email: email,
            password: password,
            client_avatar: clientAvatar,
            nickname: nickname,
            address: JSON.stringify({
                cep: cep,
                state: state,
                city: city,
                street: street,
                number: number,
                phone: phone // Inclua o telefone dentro do objeto address
            })
        }).then(() => {
            navigate("/client/dashboard");
            setIsCreating(false);
        }).catch(err => {
            console.log("erro ao tentar criar cliente -> ", err.response);
            setIsCreating(false);
        });
    };

    const handleGetAddress = (event) => {
        const cep = event.target.value;
        setCep(cep);
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        axios.get(url).then(res => {
            setState(res.data.uf);
            setCity(res.data.localidade);
            setStreet(res.data.logradouro);
        }).catch(err => {
            console.log(err.response);
        });
    };

    const validateStep = (step) => {
        let missing = [];
        if (step === 0) {
            if (!name) missing.push("Nome");
            if (!cpf) missing.push("CPF");
            if (!email) missing.push("Email");
            if (!password) missing.push("Senha");
            if (!confirmPassword) missing.push("Confirmar Senha");
            if (!phone) missing.push("Telefone/WhatsApp");
        } else if (step === 1) {
            if (!cep) missing.push("CEP");
            if (!state) missing.push("Estado");
            if (!city) missing.push("Cidade");
            if (!street) missing.push("Rua");
            if (!number) missing.push("Número");
        } else if (step === 3) {
            if (!nickname) missing.push("Apelido");
        }
        setMissingFields(missing);
        return missing.length === 0;
    };

    const handleNextStep = (step) => {
        if (validateStep(step)) {
            setNextMenu(step + 1);
        }
    };

    const handlePreviousStep = (step) => {
        setNextMenu(step - 1);
    };

    const clearErrors = () => {
        setMissingFields([]);
    };

    if (isCreating) {
        return (
            <div className="text-white w-full h-[100vh] bg-[#616161] flex flex-col justify-center items-center gap-3">
                <section className="w-[80%] h-[90vh] 
            flex bg-[#1F8220] rounded-[4px]
            justify-center items-center 
            relative overflow-hidden shadow-2xl">
                    <span>criando novo usuário!</span>
                </section>
            </div>
        );
    }

    return (
        <div className="text-white w-full h-[100vh] bg-[#535353] flex flex-col justify-center items-center gap-3 relative">
            <img src={bgRegister} alt="" className="absolute w-full h-[100%] object-cover opacity-70" />

            <section className="md:w-[60%] w-[90%] h-[90vh] 
            flex flex-col bg-[#1f8221ca] rounded-[4px]
            justify-center items-center backdrop-blur-md
            relative overflow-hidden shadow-2xl p-2">

                <section className="flex w-full h-full justify-center items-center">

                    {nextMenu === 0 && (
                        <Step1
                            name={name}
                            setName={setName}
                            cpf={cpf}
                            setCpf={setCpf}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            phone={phone}
                            setPhone={setPhone}
                            handleNextStep={handleNextStep}
                        />
                    )}

                    {nextMenu === 1 && (
                        <Step2
                            cep={cep}
                            setCep={setCep}
                            state={state}
                            setState={setState}
                            city={city}
                            setCity={setCity}
                            street={street}
                            setStreet={setStreet}
                            number={number}
                            setNumber={setNumber}
                            handleGetAddress={handleGetAddress}
                            handleNextStep={handleNextStep}
                            handlePreviousStep={handlePreviousStep}
                        />
                    )}

                    {nextMenu === 2 && (
                        <Step3
                            clientAvatar={clientAvatar}
                            setClientAvatar={setClientAvatar}
                            avatares_pessoas={avatares_pessoas}
                            handleNextStep={handleNextStep}
                            handlePreviousStep={handlePreviousStep}
                        />
                    )}

                    {nextMenu === 3 && (
                        <Step4
                            nickname={nickname}
                            setNickname={setNickname}
                            handleRegisterNewClient={handleRegisterNewClient}
                            handlePreviousStep={handlePreviousStep}
                        />
                    )}

                    <div className="flex flex-col justify-center items-center gap-1">
                        <img src={logoAukGreen} className="object-cover w-[100px]" />
                        <button onClick={() => navigate("/client/login")}>já tem uma conta? Entrar</button>
                    </div>
                </section>

            </section>

            {missingFields.length > 0 && (
                <ErrorModal missingFields={missingFields} clearErrors={clearErrors} />
            )}
        </div>
    );
}

export default ClientRegister;