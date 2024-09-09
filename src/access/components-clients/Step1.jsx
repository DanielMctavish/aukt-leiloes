import React from "react";

function Step1({ name, setName, cpf, setCpf, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, phone, setPhone, handleNextStep }) {
    return (
        <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
            <h1 className="text-left font-bold text-[33px] w-[300px]">REGISTRE-SE!</h1>

            <div className="flex flex-col justify-start items-start">
                <span>nome</span>
                <input onChange={(e) => setName(e.target.value)} type="text" value={name}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>CPF</span>
                <input onChange={(e) => setCpf(e.target.value)} type="text" value={cpf}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>email</span>
                <input onChange={(e) => setEmail(e.target.value)} type="email" value={email}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>senha</span>
                <input onChange={(e) => setPassword(e.target.value)} type="password" value={password}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>confirmar senha</span>
                <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" value={confirmPassword}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>telefone/whatsapp</span>
                <input onChange={(e) => setPhone(e.target.value)} type="text" value={phone}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <button onClick={() => handleNextStep(0)}>próximo</button>
        </div>
    );
}

export default Step1;