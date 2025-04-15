/* eslint-disable react/prop-types */

const Step2 = ({ 
    cep, setCep, 
    state, setState, 
    city, setCity, 
    street, setStreet, 
    number, setNumber, 
    handleNextStep, 
    handlePreviousStep,
    handleGetAddress
}) => {
    return (
        <div className="flex flex-col gap-5 w-full max-w-md">
            {/* Título da Seção */}
            <div className="text-center mb-2">
                <p className="text-white/60 text-sm">
                    Informe seu endereço para completar o cadastro
                </p>
            </div>
            
            <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="cep" className="text-white/80 text-sm font-medium pl-1">
                        CEP
                    </label>
                    <input
                        id="cep"
                        type="text"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        onBlur={handleGetAddress}
                        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50
                            border border-white/10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500
                            transition-all duration-200"
                        autoComplete="postal-code"
                    />
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label htmlFor="state" className="text-white/80 text-sm font-medium pl-1">
                            Estado
                        </label>
                        <input
                            id="state"
                            type="text"
                            placeholder="UF"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50
                                border border-white/10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500
                                transition-all duration-200"
                            autoComplete="address-level1"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 flex-[2.5]">
                        <label htmlFor="city" className="text-white/80 text-sm font-medium pl-1">
                            Cidade
                        </label>
                        <input
                            id="city"
                            type="text"
                            placeholder="Sua cidade"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50
                                border border-white/10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500
                                transition-all duration-200"
                            autoComplete="address-level2"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="street" className="text-white/80 text-sm font-medium pl-1">
                        Rua
                    </label>
                    <input
                        id="street"
                        type="text"
                        placeholder="Nome da rua"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50
                            border border-white/10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500
                            transition-all duration-200"
                        autoComplete="street-address"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="number" className="text-white/80 text-sm font-medium pl-1">
                        Número
                    </label>
                    <input
                        id="number"
                        type="text"
                        placeholder="Número"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50
                            border border-white/10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500
                            transition-all duration-200"
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => handlePreviousStep(1)}
                    className="flex-1 py-3.5 bg-white/10 border border-white/20 text-white rounded-lg 
                        hover:bg-white/20 transition-colors font-medium text-base"
                >
                    Voltar
                </button>
                
                <button
                    onClick={() => handleNextStep(1)}
                    className="flex-1 py-3.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors
                        font-medium text-base shadow-lg shadow-green-500/20 hover:shadow-green-500/40
                        transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
};

export default Step2;