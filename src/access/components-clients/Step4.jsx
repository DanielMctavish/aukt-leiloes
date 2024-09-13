import React from "react";

function Step4({ nickname, setNickname, handleRegisterNewClient, handlePreviousStep }) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            <input
                type="text"
                placeholder="Escolha seu apelido"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePreviousStep(3)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors w-[48%]"
                >
                    Anterior
                </button>
                <button
                    onClick={handleRegisterNewClient}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors w-[48%]"
                >
                    Finalizar
                </button>
            </div>
        </div>
    );
}

export default Step4;