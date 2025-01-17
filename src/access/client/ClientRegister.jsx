import axios from "axios";
import logoAukGreen from "../../media/logos/logos-auk/aukt_greengreen.png";
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
import avatar_09 from "../../media/avatar-floor/Avatar_09.png";
import avatar_10 from "../../media/avatar-floor/Avatar_10.png";
import avatar_11 from "../../media/avatar-floor/Avatar_11.png";
import avatar_12 from "../../media/avatar-floor/Avatar_12.png";
import avatar_13 from "../../media/avatar-floor/Avatar_13.png";
import avatar_14 from "../../media/avatar-floor/Avatar_14.png";
import avatar_15 from "../../media/avatar-floor/Avatar_15.png";
import avatar_16 from "../../media/avatar-floor/Avatar_16.png";
import avatar_17 from "../../media/avatar-floor/Avatar_17.png";
import avatar_18 from "../../media/avatar-floor/Avatar_18.png";
import avatar_19 from "../../media/avatar-floor/Avatar_19.png";
import avatar_20 from "../../media/avatar-floor/Avatar_20.png";
import avatar_21 from "../../media/avatar-floor/Avatar_21.png";
import avatar_22 from "../../media/avatar-floor/Avatar_22.png";
import avatar_23 from "../../media/avatar-floor/Avatar_23.png";
import avatar_24 from "../../media/avatar-floor/Avatar_24.png";
import avatar_25 from "../../media/avatar-floor/Avatar_25.png";
import avatar_26 from "../../media/avatar-floor/Avatar_26.png";
import avatar_27 from "../../media/avatar-floor/Avatar_27.png";
import avatar_28 from "../../media/avatar-floor/Avatar_28.png";
import avatar_29 from "../../media/avatar-floor/Avatar_29.png";
import avatar_30 from "../../media/avatar-floor/Avatar_30.png";
import avatar_31 from "../../media/avatar-floor/Avatar_31.png";
import avatar_32 from "../../media/avatar-floor/Avatar_32.png";
import avatar_33 from "../../media/avatar-floor/Avatar_33.png";
import avatar_34 from "../../media/avatar-floor/Avatar_34.png";
import avatar_35 from "../../media/avatar-floor/Avatar_35.png";
import avatar_36 from "../../media/avatar-floor/Avatar_36.png";
import avatar_37 from "../../media/avatar-floor/Avatar_37.png";
import avatar_38 from "../../media/avatar-floor/Avatar_38.png";
import avatar_39 from "../../media/avatar-floor/Avatar_39.png";
import avatar_40 from "../../media/avatar-floor/Avatar_40.png";
import avatar_41 from "../../media/avatar-floor/Avatar_41.png";
import avatar_42 from "../../media/avatar-floor/Avatar_42.png";
import avatar_43 from "../../media/avatar-floor/Avatar_43.png";
import avatar_44 from "../../media/avatar-floor/Avatar_44.png";
import avatar_45 from "../../media/avatar-floor/Avatar_45.png";
import avatar_46 from "../../media/avatar-floor/Avatar_46.png";
import avatar_47 from "../../media/avatar-floor/Avatar_47.png";
import avatar_48 from "../../media/avatar-floor/Avatar_48.png";
import avatar_49 from "../../media/avatar-floor/Avatar_49.png";
import avatar_50 from "../../media/avatar-floor/Avatar_50.png";
import avatar_51 from "../../media/avatar-floor/Avatar_51.png";
import avatar_52 from "../../media/avatar-floor/Avatar_52.png";
import avatar_53 from "../../media/avatar-floor/Avatar_53.png";
import avatar_54 from "../../media/avatar-floor/Avatar_54.png";
import avatar_55 from "../../media/avatar-floor/Avatar_55.png";
import avatar_56 from "../../media/avatar-floor/Avatar_56.png";
import avatar_57 from "../../media/avatar-floor/Avatar_57.png";
import avatar_58 from "../../media/avatar-floor/Avatar_58.png";

const avatares_pessoas = [
    avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08,
    avatar_09, avatar_10, avatar_11, avatar_12, avatar_13, avatar_14, avatar_15, avatar_16,
    avatar_17, avatar_18, avatar_19, avatar_20, avatar_21, avatar_22, avatar_23, avatar_24,
    avatar_25, avatar_26, avatar_27, avatar_28, avatar_29, avatar_30, avatar_31, avatar_32,
    avatar_33, avatar_34, avatar_35, avatar_36, avatar_37, avatar_38, avatar_39, avatar_40,
    avatar_41, avatar_42, avatar_43, avatar_44, avatar_45, avatar_46, avatar_47, avatar_48,
    avatar_49, avatar_50, avatar_51, avatar_52, avatar_53, avatar_54, avatar_55, avatar_56,
    avatar_57, avatar_58
];

export default function ClientRegister() {
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
            <div className="w-full h-screen bg-gradient-to-br from-[#e7e7e7] to-[#474747] 
                flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl 
                    flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 
                        rounded-full animate-spin"/>
                    <p className="text-white text-lg">Criando sua conta...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#e7e7e7] to-[#474747] 
            flex flex-col justify-center items-center gap-6 relative p-4 md:p-8">
            

            {/* Logo superior */}
            <img 
                src={logoAukGreen} 
                alt="logo-aukt" 
                onClick={() => navigate("/")} 
                className="w-16 h-16 object-cover absolute top-4 left-6 cursor-pointer 
                    hover:scale-105 transition-transform duration-300 z-10
                    md:block hidden" 
            />

            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-[#ffffff74] backdrop-blur-md rounded-2xl 
                    shadow-2xl p-6 md:p-8 relative z-10"
            >
                {/* Cabeçalho */}
                <div className="flex flex-col items-center mb-8">
                    <img src={logoAukGreen} className="w-20 md:w-24 mb-6" alt="Logo" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                        {stepComponents[nextMenu].title}
                    </h2>
                </div>

                {/* Indicador de progresso */}
                <div className="flex justify-center mb-8 overflow-x-auto px-4">
                    <div className="flex items-center gap-2 md:gap-4">
                        {stepComponents.map((step, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`
                                    flex flex-col items-center
                                    ${index === nextMenu ? 'text-green-600' : 'text-gray-400'}
                                `}>
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center
                                        transition-all duration-300
                                        ${index === nextMenu 
                                            ? 'bg-green-500 text-white' 
                                            : index < nextMenu 
                                                ? 'bg-green-700 text-white' 
                                                : 'bg-gray-700/50 text-gray-300'}
                                    `}>
                                        {step.icon}
                                    </div>
                                    <span className="text-xs mt-2 hidden md:block">
                                        {step.title}
                                    </span>
                                </div>
                                {index < stepComponents.length - 1 && (
                                    <div className={`
                                        w-12 md:w-20 h-[2px] mx-1
                                        ${index < nextMenu ? 'bg-green-500' : 'bg-gray-600'}
                                    `}/>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conteúdo do Step */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={nextMenu}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#222] backdrop-blur-md rounded-xl p-6 md:p-8"
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

                {/* Link para login */}
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => navigate("/client/login")} 
                        className="text-gray-600 hover:text-white transition-colors text-sm md:text-base"
                    >
                        Já tem uma conta? <span className="underline">Entrar</span>
                    </button>
                </div>
            </motion.section>

            {/* Modal de Erro */}
            <AnimatePresence>
                {missingFields.length > 0 && (
                    <ErrorModal missingFields={missingFields} clearErrors={clearErrors} />
                )}
            </AnimatePresence>
        </div>
    );
}