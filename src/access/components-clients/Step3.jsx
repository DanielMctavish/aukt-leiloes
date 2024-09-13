import React from "react";

function Step3({ clientAvatar, setClientAvatar, avatares_pessoas, handleNextStep, handlePreviousStep }) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="grid grid-cols-4 gap-4">
                {avatares_pessoas.map((avatar, index) => (
                    <img
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className={`w-20 h-20 rounded-full cursor-pointer transition-all ${clientAvatar === index ? 'border-4 border-green-500' : 'hover:opacity-80'}`}
                        onClick={() => setClientAvatar(index)}
                    />
                ))}
            </div>
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePreviousStep(2)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors w-[48%]"
                >
                    Anterior
                </button>
                <button
                    onClick={() => handleNextStep(2)}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors w-[48%]"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}

export default Step3;