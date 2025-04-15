/* eslint-disable react/prop-types */

import React from "react";

const Step4 = ({ nickname, setNickname, handleRegisterNewClient, handlePreviousStep }) => {
    return (
        <div className="flex flex-col gap-5 w-full max-w-md">
            {/* Título da Seção */}
            <div className="text-center mb-2">
                <p className="text-white/60 text-sm">
                    Escolha um apelido para ser identificado nos leilões
                </p>
            </div>
            
            <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="nickname" className="text-white/80 text-sm font-medium pl-1">
                        Apelido
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        placeholder="Como quer ser chamado nos leilões"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50
                            border border-white/10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500
                            transition-all duration-200"
                    />
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/70 text-sm">
                        Este apelido será exibido publicamente durante os leilões quando você der lances.
                        Escolha um nome que você se identifique e que seja adequado para o ambiente de leilões.
                    </p>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={() => handlePreviousStep(3)}
                    className="flex-1 py-3.5 bg-white/10 border border-white/20 text-white rounded-lg 
                        hover:bg-white/20 transition-colors font-medium text-base"
                >
                    Voltar
                </button>
                
                <button
                    onClick={handleRegisterNewClient}
                    className="flex-1 py-3.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors
                        font-medium text-base shadow-lg shadow-green-500/20 hover:shadow-green-500/40
                        transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    disabled={!nickname}
                >
                    Finalizar
                </button>
            </div>
        </div>
    );
};

export default Step4;