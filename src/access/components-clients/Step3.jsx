import React from "react";

function Step3({ clientAvatar, setClientAvatar, avatares_pessoas, handleNextStep, handlePreviousStep }) {
    return (
        <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
            <h1 className="text-left font-bold text-[23px]">selecione seu avatar</h1>
            <div className="flex flex-wrap w-[98%] max-h-[60vh] justify-center items-center gap-2 p-2">
                {avatares_pessoas.map((avatar, i) => (
                    <img src={avatar} alt=""
                        key={i}
                        onClick={() => setClientAvatar(i)}
                        className={`w-[100px] h-[100px] object-cover rounded-full cursor-pointer ${i === clientAvatar ? 'border-[3px] border-zinc-600' : ''}`} />
                ))}
            </div>

            <button onClick={() => handlePreviousStep(2)}>anterior</button>
            <button onClick={() => handleNextStep(2)}>próximo</button>
        </div>
    );
}

export default Step3;