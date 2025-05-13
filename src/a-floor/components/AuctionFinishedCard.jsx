/* eslint-disable react/prop-types */
import logoWhite from "../../media/logos/logos-auk/logo_model01_white.png"

function AuctionFinishedCard() {
    return (
        <div className="w-full h-full flex items-center justify-center animate-scale-in">
            <div className="w-full max-w-2xl bg-red-50 rounded-xl shadow-lg overflow-hidden">
                {/* Header com logo e agradecimento */}
                <div className="bg-red-600 text-white p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute -left-4 -top-4 w-20 h-20 bg-red-500 rounded-full opacity-20" />
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-red-500 rounded-full opacity-20" />
                    </div>
                    <div className="relative z-10">
                        <img 
                            src={logoWhite}
                            alt="Logo" 
                            className="w-[100px] h-[0px] mx-auto mb-4 animate-pulse object-cover"
                        />
                        <h2 className="text-3xl font-bold mb-3">Leilão Finalizado!</h2>
                        <p className="text-xl opacity-90 mb-2">Muito obrigado pela sua participação</p>
                        <p className="text-lg opacity-75">Esperamos você no próximo leilão</p>
                    </div>
                </div>

                {/* Mensagem adicional */}
                <div className="p-8 text-center">
                    <p className="text-gray-600 text-lg mb-6">
                        Fique de olho em nosso site para mais oportunidades e leilões futuros.
                    </p>
                    <div className="inline-block bg-red-100 text-red-600 px-6 py-3 rounded-full font-medium">
                        Até a próxima!
                    </div>
                </div>
            </div>

            {/* Estilos */}
            <style>
                {`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .animate-pulse {
                    animation: pulse 2s infinite;
                }
                `}
            </style>
        </div>
    );
}

export default AuctionFinishedCard; 