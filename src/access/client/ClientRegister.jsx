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
import { motion, AnimatePresence } from "framer-motion";
import { Person, Home, Face, EmojiEvents } from '@mui/icons-material';

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

    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g,'');	
        if(cpf == '') return false;	
        // Elimina CPFs invalidos conhecidos	
        if (cpf.length != 11 || 
            cpf == "00000000000" || 
            cpf == "11111111111" || 
            cpf == "22222222222" || 
            cpf == "33333333333" || 
            cpf == "44444444444" || 
            cpf == "55555555555" || 
            cpf == "66666666666" || 
            cpf == "77777777777" || 
            cpf == "88888888888" || 
            cpf == "99999999999")
                return false;		
        // Valida 1o digito	
        let add = 0;	
        for (let i=0; i < 9; i ++)		
            add += parseInt(cpf.charAt(i)) * (10 - i);	
            let rev = 11 - (add % 11);	
            if (rev == 10 || rev == 11)		
                rev = 0;	
            if (rev != parseInt(cpf.charAt(9)))		
                return false;		
        // Valida 2o digito	
        add = 0;	
        for (let i = 0; i < 10; i ++)		
            add += parseInt(cpf.charAt(i)) * (11 - i);	
        rev = 11 - (add % 11);	
        if (rev == 10 || rev == 11)	
            rev = 0;	
        if (rev != parseInt(cpf.charAt(10)))
            return false;		
        return true;   
    }

    const validatePhone = (phone) => {
        const phoneRegex = /^(\+55|55)?(\d{2})?\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    const handleRegisterNewClient = async () => {
        if (!name || !cpf || !email || !password || !confirmPassword || !phone) {
            alert('Preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não conferem');
            return;
        }

        if (!validateCPF(cpf)) {
            alert('CPF inválido');
            return;
        }

        if (!validatePhone(phone)) {
            alert('Número de telefone/WhatsApp inválido');
            return;
        }

        setIsCreating(true);

        try {
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
                    phone: phone
                })
            });
            navigate("/client/dashboard");
        } catch (err) {
            alert('Erro ao criar cliente. Por favor, tente novamente.');
        } finally {
            setIsCreating(false);
        }
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
            return err
        });
    };

    const validateStep = (step) => {
        let missing = [];
        if (step === 0) {
            if (!name) missing.push("Nome");
            if (!cpf) missing.push("CPF");
            else if (!validateCPF(cpf)) missing.push("CPF válido");
            if (!email) missing.push("Email");
            if (!password) missing.push("Senha");
            if (!confirmPassword) missing.push("Confirmar Senha");
            if (!phone) missing.push("Telefone/WhatsApp");
            else if (!validatePhone(phone)) missing.push("Telefone/WhatsApp válido");
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

    const stepComponents = [
        { component: Step1, icon: <Person />, title: "Informações Pessoais" },
        { component: Step2, icon: <Home />, title: "Endereço" },
        { component: Step3, icon: <Face />, title: "Escolha seu Avatar" },
        { component: Step4, icon: <EmojiEvents />, title: "Escolha seu Apelido" },
    ];

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
        <div className="text-white w-full min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex flex-col 
        justify-center items-center gap-6 relative p-8">
            <img src={bgRegister} alt="" className="absolute w-full h-full object-cover opacity-40 filter blur-[2px]" />

            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-[80%] w-[95%] bg-[#24755799] bg-opacity-40 backdrop-blur-md rounded-xl shadow-2xl p-8 relative overflow-hidden"
            >
                <div className="flex flex-col items-center mb-8">
                    <img src={logoAukGreen} className="w-24 mb-4" alt="Logo" />
                    <h2 className="text-3xl font-bold">{stepComponents[nextMenu].title}</h2>
                </div>

                <div className="flex justify-center mb-8">
                    {stepComponents.map((step, index) => (
                        <div key={index} className={`flex flex-col items-center mx-4 ${index === nextMenu ? 'text-green-400' : 'text-gray-400'}`}>
                            {step.icon}
                            <div className={`h-1 w-16 mt-2 ${index === nextMenu ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={nextMenu}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                    >
                        {stepComponents[nextMenu].component({
                            name,
                            setName,
                            cpf,
                            setCpf,
                            email,
                            setEmail,
                            password,
                            setPassword,
                            confirmPassword,
                            setConfirmPassword,
                            phone,
                            setPhone,
                            cep,
                            setCep,
                            state,
                            setState,
                            city,
                            setCity,
                            street,
                            setStreet,
                            number,
                            setNumber,
                            clientAvatar,
                            setClientAvatar,
                            avatares_pessoas,
                            nickname,
                            setNickname,
                            handleRegisterNewClient,
                            handleGetAddress,
                            handleNextStep,
                            handlePreviousStep,
                        })}
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-center mt-8">
                    <button onClick={() => navigate("/client/login")} className="text-green-300 hover:text-green-100 transition-colors">
                        Já tem uma conta? Entrar
                    </button>
                </div>
            </motion.section>

            <AnimatePresence>
                {missingFields.length > 0 && (
                    <ErrorModal missingFields={missingFields} clearErrors={clearErrors} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default ClientRegister;