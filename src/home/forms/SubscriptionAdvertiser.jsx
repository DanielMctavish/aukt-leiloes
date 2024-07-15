import { useState } from "react";
import Navigation from "../navigation/Navigation";

const SubscriptionAdvertiser = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-[100vh] bg-gray-100 overflow-x-hidden relative">
            <span className="flex w-full absolute top-1 justify-center">
                <Navigation />
            </span>
            <div className="flex flex-col w-[60%] h-[86%] bg-white mt-6 overflow-y-auto justify-start items-center text-[#141414] p-6 rounded-lg shadow-lg">
                <h1 className="text-[28px] font-bold mb-4">Formulário de Admissão</h1>
                {formSubmitted ? (
                    <span className="text-green-600 text-lg font-semibold">Formulário enviado com sucesso!</span>
                ) : (
                    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                        <label className="flex flex-col w-full">
                            Nome do Negócio
                            <input type="text" className="border p-2 rounded mt-1 bg-transparent" required />
                        </label>
                        <label className="flex flex-col w-full">
                            CNPJ/CPF
                            <input type="text" className="border p-2 rounded mt-1 bg-transparent" required />
                        </label>
                        <label className="flex flex-col w-full">
                            Contato (telefone e email)
                            <input type="text" className="border p-2 rounded mt-1 bg-transparent" required />
                        </label>
                        <label className="flex flex-col w-full">
                            Tipos de Produtos para Leilão
                            <input type="text" className="border p-2 rounded mt-1 bg-transparent" required />
                        </label>
                        <label className="flex flex-col w-full">
                            Quantidade de Produtos Disponíveis
                            <input type="number" className="border p-2 rounded mt-1 bg-transparent" required />
                        </label>
                        <label className="flex flex-col w-full">
                            Valor Estimado dos Produtos
                            <input type="text" className="border p-2 rounded mt-1 bg-transparent" required />
                        </label>
                        <button type="submit" className="bg-[#343434] text-white p-2 rounded mt-4 hover:bg-blue-600 transition-all">
                            Enviar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SubscriptionAdvertiser;
