/* eslint-disable react/prop-types */

const Step3 = ({ clientAvatar, setClientAvatar, avatares_pessoas, handleNextStep, handlePreviousStep }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Título da Seção */}
            <div className="text-center">
                <h3 className="text-white/90 text-lg mb-2">Escolha seu Avatar</h3>
                <p className="text-white/60 text-sm">
                    Selecione uma imagem que melhor representa você
                </p>
            </div>

            {/* Flex Container de Avatares */}
            <div className="flex flex-wrap justify-center gap-4 
                max-h-[400px] overflow-y-auto p-4 rounded-xl 
                bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md
                scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {avatares_pessoas.map((avatar, index) => (
                    <div 
                        key={index}
                        onClick={() => setClientAvatar(index + 1)}
                        className={`
                            w-16 h-16 relative group cursor-pointer
                            transition-all duration-500 ease-out
                            ${clientAvatar === index + 1 
                                ? 'ring-4 ring-green-500 scale-110 rotate-6 z-10' 
                                : 'ring-2 ring-white/20 hover:ring-white/40'
                            }
                            rounded-xl overflow-hidden
                            hover:shadow-xl hover:shadow-white/20
                            hover:scale-125 hover:rotate-6 hover:z-10
                            active:scale-95 active:rotate-0
                            group-hover:-translate-y-2
                        `}
                    >
                        <img 
                            src={avatar} 
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover
                                transition-transform duration-500
                                group-hover:scale-110"
                        />
                        
                        {/* Overlay de Seleção com Animação */}
                        <div className={`
                            absolute inset-0 flex items-center justify-center
                            transition-all duration-300
                            backdrop-blur-sm
                            ${clientAvatar === index + 1 
                                ? 'bg-green-500/20' 
                                : 'bg-black/0 group-hover:bg-white/10'
                            }
                            opacity-0 group-hover:opacity-100
                        `}>
                            {clientAvatar === index + 1 ? (
                                <div className="bg-green-500 text-white p-1.5 rounded-full
                                    shadow-lg transform scale-110 animate-bounce">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="transform scale-0 group-hover:scale-100 
                                    transition-transform duration-300 text-white text-xs
                                    bg-black/50 px-2 py-1 rounded-full">
                                    Selecionar
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between gap-4 mt-4">
                <button
                    onClick={() => handlePreviousStep(2)}
                    className="flex-1 py-3 px-4 bg-white/10 
                        text-white rounded-xl 
                        transition-all duration-300
                        hover:shadow-lg hover:shadow-white/10
                        hover:bg-white/20 hover:scale-105
                        active:scale-95"
                >
                    Voltar
                </button>
                <button
                    onClick={() => handleNextStep(2)}
                    className="flex-1 py-3 px-4 bg-green-500 
                        text-white rounded-xl 
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:shadow-lg hover:shadow-green-500/20
                        hover:bg-green-600 hover:scale-105
                        active:scale-95"
                    disabled={!clientAvatar}
                >
                    Próximo
                </button>
            </div>
        </div>
    );
};

export default Step3;