import React from "react";

function Step2({ cep, setCep, state, setState, city, setCity, street, setStreet, number, setNumber, handleGetAddress, handleNextStep, handlePreviousStep }) {
    return (
        <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
            <h1 className="text-left font-bold text-[33px] w-[300px]">Seu Endereço</h1>

            <div onChange={handleGetAddress} className="flex flex-col justify-start items-start">
                <span>Cep</span>
                <input type="text" value={cep} onChange={(e) => setCep(e.target.value)}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>Estado</span>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>Cidade</span>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>Rua</span>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <span>número</span>
                <input type="text" value={number} onChange={(e) => setNumber(e.target.value)}
                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
            </div>

            <button onClick={() => handlePreviousStep(1)}>anterior</button>
            <button onClick={() => handleNextStep(1)}>próximo</button>
        </div>
    );
}

export default Step2;