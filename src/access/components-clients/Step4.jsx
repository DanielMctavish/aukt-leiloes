import React from "react";

function Step4({ nickname, setNickname, handleRegisterNewClient, handlePreviousStep }) {
    return (
        <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
            <h1 className="text-left font-bold text-[23px]">apelido para o pregão (nickname)</h1>

            <div className="flex flex-col justify-start items-start">
                <span>Apelido</span>
                <input type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-[300px] h-[41px] p-2 border-[1px] 
                border-white bg-transparent rounded-md" />
            </div>

            <button onClick={handleRegisterNewClient} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#1F8220]">
                registrar</button>
            <button onClick={() => handlePreviousStep(3)}>anterior</button>
        </div>
    );
}

export default Step4;