import React from "react";

function Step1({ name, setName, cpf, setCpf, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, phone, setPhone, handleNextStep }) {
    const formatCPF = (value) => {
        const cpfNumbers = value.replace(/\D/g, '');
        return cpfNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatPhone = (value) => {
        const phoneNumbers = value.replace(/\D/g, '');
        if (phoneNumbers.length <= 10) {
            return phoneNumbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phoneNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const handleCPFChange = (e) => {
        const formattedCPF = formatCPF(e.target.value);
        setCpf(formattedCPF);
    };

    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhone(e.target.value);
        setPhone(formattedPhone);
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={handleCPFChange}
                maxLength={14}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="tel"
                placeholder="Telefone/WhatsApp"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <button
                onClick={() => handleNextStep(0)}
                className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
                Próximo
            </button>
        </div>
    );
}

export default Step1;