import axios from "axios";
import logoAukGreen from "../../media/logos/logos-auk/aukt_greengreen.png";
import { useState, useCallback, memo } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components-clients/ErrorModal";
import Step1 from "../components-clients/Step1";
import Step2 from "../components-clients/Step2";
import Step3 from "../components-clients/Step3";
import Step4 from "../components-clients/Step4";
import { motion, AnimatePresence } from "framer-motion";
import { Person, Home, Face, EmojiEvents, ArrowBack } from '@mui/icons-material';
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls";
import PropTypes from 'prop-types';

// Convertendo o objeto de URLs em um array
const avatares_pessoas = Object.values(avatarClientsUrls);

// Componente de carregamento memorizado para evitar re-renderizações desnecessárias
const LoadingScreen = memo(() => (
    <div className="w-full h-screen bg-gradient-to-br from-[#e7e7e7] to-[#474747] 
        flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl 
            flex flex-col items-center gap-4 mx-4">
            <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 
                rounded-full animate-spin"/>
            <p className="text-white text-base sm:text-lg text-center">Criando sua conta...</p>
        </div>
    </div>
));
LoadingScreen.displayName = 'LoadingScreen';

// Componente de Progresso simplificado e memorizado
const ProgressIndicator = memo(({ steps, currentStep }) => (
    <div className="flex justify-center mb-4 sm:mb-6 overflow-x-auto px-1 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    <div className={`
                        flex flex-col items-center
                        ${index === currentStep ? 'text-green-600' : 'text-gray-400'}
                    `}>
                        <div className={`
                            w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                            ${index === currentStep 
                                ? 'bg-green-500 text-white' 
                                : index < currentStep 
                                    ? 'bg-green-700 text-white' 
                                    : 'bg-gray-700/50 text-gray-300'}
                        `}>
                            {step.icon}
                        </div>
                        <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-center hidden xs:block max-w-[60px]">
                            {step.title}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`
                            w-4 sm:w-8 md:w-20 h-[2px] mx-1
                            ${index < currentStep ? 'bg-green-500' : 'bg-gray-600'}
                        `}/>
                    )}
                </div>
            ))}
        </div>
    </div>
));
ProgressIndicator.displayName = 'ProgressIndicator';

ProgressIndicator.propTypes = {
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node.isRequired,
            title: PropTypes.string.isRequired,
            component: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.object  // Permitir componentes como objetos também
            ]).isRequired
        })
    ).isRequired,
    currentStep: PropTypes.number.isRequired
};

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

    const validateCPF = useCallback((cpf) => {
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
    }, []);

    const validatePhone = useCallback((phone) => {
        const phoneRegex = /^(\+55|55)?(\d{2})?\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }, []);

    const handleRegisterNewClient = useCallback(async () => {
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
    }, [name, cpf, email, password, confirmPassword, clientAvatar, nickname, phone, cep, state, city, street, number, validateCPF, validatePhone, navigate]);

    const handleGetAddress = useCallback((event) => {
        const cep = event.target.value;
        setCep(cep);
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        axios.get(url).then(res => {
            setState(res.data.uf);
            setCity(res.data.localidade);
            setStreet(res.data.logradouro);
        }).catch(err => {
            return err;
        });
    }, []);

    const validateStep = useCallback((step) => {
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
    }, [name, cpf, email, password, confirmPassword, phone, cep, state, city, street, number, nickname, validateCPF, validatePhone]);

    const handleNextStep = useCallback((step) => {
        if (validateStep(step)) {
            setNextMenu(step + 1);
        }
    }, [validateStep]);

    const handlePreviousStep = useCallback((step) => {
        setNextMenu(step - 1);
    }, []);

    const clearErrors = useCallback(() => {
        setMissingFields([]);
    }, []);

    const stepComponents = [
        { component: Step1, icon: <Person />, title: "Informações Pessoais" },
        { component: Step2, icon: <Home />, title: "Endereço" },
        { component: Step3, icon: <Face />, title: "Escolha seu Avatar" },
        { component: Step4, icon: <EmojiEvents />, title: "Escolha seu Apelido" },
    ];

    if (isCreating) {
        return <LoadingScreen />;
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#e7e7e7] to-[#474747] 
            flex flex-col justify-center items-center gap-4 sm:gap-6 relative px-3 py-6 sm:p-4 md:p-8">
            
            {/* Header com botão voltar para mobile */}
            <div className="flex w-full justify-between items-center fixed top-0 left-0 px-4 py-3 bg-black/10 backdrop-blur-md z-20 md:hidden">
                <button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-white"
                >
                    <ArrowBack className="text-white" />
                    <span>Voltar</span>
                </button>
                <img src={logoAukGreen} className="w-10 h-10" alt="Logo" />
            </div>

            {/* Logo superior para desktop */}
            <img 
                src={logoAukGreen} 
                alt="logo-aukt" 
                onClick={() => navigate("/")} 
                className="w-16 h-16 object-cover absolute top-4 left-6 cursor-pointer 
                    hover:scale-105 transition-transform duration-200 z-10
                    md:block hidden" 
            />

            <div 
                className="w-full max-w-4xl bg-[#ffffff74] backdrop-blur-md rounded-2xl 
                    shadow-2xl p-4 sm:p-6 md:p-8 relative z-10 mt-12 md:mt-0"
            >
                {/* Cabeçalho */}
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <img src={logoAukGreen} className="w-16 md:w-24 mb-4 md:mb-6 hidden md:block" alt="Logo" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
                        {stepComponents[nextMenu].title}
                    </h2>
                </div>

                {/* Indicador de progresso otimizado */}
                <ProgressIndicator steps={stepComponents} currentStep={nextMenu} />

                {/* Conteúdo do Step com animações simplificadas */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={nextMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="bg-[#222] backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 will-change-auto"
                    >
                        {React.createElement(stepComponents[nextMenu].component, {
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
                <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
                    <button 
                        onClick={() => navigate("/client/login")} 
                        className="text-gray-600 hover:text-white transition-colors text-sm md:text-base py-2"
                    >
                        Já tem uma conta? <span className="underline font-semibold">Entrar</span>
                    </button>
                </div>
            </div>

            {/* Modal de Erro */}
            <AnimatePresence>
                {missingFields.length > 0 && (
                    <ErrorModal missingFields={missingFields} clearErrors={clearErrors} />
                )}
            </AnimatePresence>
        </div>
    );
}