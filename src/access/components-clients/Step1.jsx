import React, { memo, useCallback } from "react";

// Componente de Input otimizado
const Input = memo(({ 
    id, type, placeholder, value, onChange, maxLength, 
    label, autoComplete 
}) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-white/80 text-sm font-medium pl-1">
            {label}
        </label>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className="w-full p-2.5 rounded-lg bg-white/20 text-white placeholder-white/50
                border border-white/10 focus:border-green-500 focus:outline-none
                will-change-auto"
            autoComplete={autoComplete}
        />
    </div>
));

function Step1({ name, setName, cpf, setCpf, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, phone, setPhone, handleNextStep }) {
    const formatCPF = useCallback((value) => {
        const cpfNumbers = value.replace(/\D/g, '');
        return cpfNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }, []);

    const formatPhone = useCallback((value) => {
        const phoneNumbers = value.replace(/\D/g, '');
        if (phoneNumbers.length <= 10) {
            return phoneNumbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phoneNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }, []);

    const handleCPFChange = useCallback((e) => {
        const formattedCPF = formatCPF(e.target.value);
        setCpf(formattedCPF);
    }, [formatCPF, setCpf]);

    const handlePhoneChange = useCallback((e) => {
        const formattedPhone = formatPhone(e.target.value);
        setPhone(formattedPhone);
    }, [formatPhone, setPhone]);

    const handleNameChange = useCallback((e) => setName(e.target.value), [setName]);
    const handleEmailChange = useCallback((e) => setEmail(e.target.value), [setEmail]);
    const handlePasswordChange = useCallback((e) => setPassword(e.target.value), [setPassword]);
    const handleConfirmPasswordChange = useCallback((e) => setConfirmPassword(e.target.value), [setConfirmPassword]);
    const handleNextStepClick = useCallback(() => handleNextStep(0), [handleNextStep]);

    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            {/* Título da Seção */}
            <div className="text-center mb-1">
                <p className="text-white/60 text-sm">
                    Preencha seus dados pessoais para criar sua conta
                </p>
            </div>
            
            <div className="space-y-3">
                <Input
                    id="name"
                    type="text"
                    label="Nome completo"
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={handleNameChange}
                    autoComplete="name"
                />

                <Input
                    id="cpf"
                    type="text"
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                    autoComplete="off"
                />

                <Input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="seu-email@exemplo.com"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="email"
                />

                <Input
                    id="password"
                    type="password"
                    label="Senha"
                    placeholder="Sua senha segura"
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                />

                <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirmar senha"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    autoComplete="new-password"
                />

                <Input
                    id="phone"
                    type="tel"
                    label="Telefone/WhatsApp"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    autoComplete="tel"
                />
            </div>

            <button
                onClick={handleNextStepClick}
                className="mt-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600
                    font-medium text-base shadow-md"
            >
                Próximo
            </button>
        </div>
    );
}

export default memo(Step1);