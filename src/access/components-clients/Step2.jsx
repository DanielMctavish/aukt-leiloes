/* eslint-disable react/prop-types */

function Step2({ cep, setCep, state, setState, city, setCity, street, setStreet, number, setNumber, handleGetAddress, handleNextStep, handlePreviousStep }) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            <input
                type="text"
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={handleGetAddress}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="text"
                placeholder="Estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="text"
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="text"
                placeholder="Rua"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <input
                type="text"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePreviousStep(1)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors w-[48%]"
                >
                    Anterior
                </button>
                <button
                    onClick={() => handleNextStep(1)}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors w-[48%]"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}

export default Step2;