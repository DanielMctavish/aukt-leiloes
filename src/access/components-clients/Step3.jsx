/* eslint-disable react/prop-types */
import { memo } from "react";

// Componente de Avatar otimizado com memo para evitar re-renderizações desnecessárias
const Avatar = memo(({ avatar, index, isSelected, onSelect }) => (
    <div 
        key={index}
        onClick={onSelect}
        className={`
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 relative cursor-pointer
            transition-all duration-200 will-change-transform
            ${isSelected 
                ? 'ring-2 ring-green-500 scale-105 z-10' 
                : 'ring-1 ring-white/20 hover:ring-white/40'
            }
            rounded-lg overflow-hidden
            hover:shadow-md hover:shadow-white/10
            hover:scale-110 hover:z-10
            active:scale-95
        `}
    >
        <img 
            src={avatar} 
            alt={`Avatar ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
        />
        
        {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                <div className="bg-green-500 text-white p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        )}
    </div>
));

const Step3 = ({ clientAvatar, setClientAvatar, avatares_pessoas, handleNextStep, handlePreviousStep }) => {
    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            {/* Título da Seção */}
            <div className="text-center mb-1">
                <h3 className="text-white/90 text-lg mb-1">Escolha seu Avatar</h3>
                <p className="text-white/60 text-sm">
                    Selecione uma imagem que melhor representa você
                </p>
            </div>

            {/* Grid Container de Avatares - Otimizado para 5 colunas em mobile */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4
                max-h-[400px] overflow-y-auto p-3 rounded-xl 
                bg-white/10 backdrop-blur-none
                scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {avatares_pessoas.map((avatar, index) => (
                    <Avatar
                        key={index}
                        avatar={avatar}
                        index={index}
                        isSelected={clientAvatar === index + 1}
                        onSelect={() => setClientAvatar(index + 1)}
                    />
                ))}
            </div>

            {/* Botões de Navegação */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => handlePreviousStep(2)}
                    className="flex-1 py-3 px-4 bg-white/10 border border-white/20
                        text-white rounded-lg 
                        transition-colors duration-150
                        hover:bg-white/20"
                >
                    Voltar
                </button>
                <button
                    onClick={() => handleNextStep(2)}
                    className="flex-1 py-3 px-4 bg-green-500 
                        text-white rounded-lg 
                        transition-colors duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-green-600"
                    disabled={!clientAvatar}
                >
                    Próximo
                </button>
            </div>
        </div>
    );
};

export default Step3;