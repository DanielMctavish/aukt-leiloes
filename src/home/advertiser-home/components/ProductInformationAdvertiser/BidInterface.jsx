// Componente com a interface de lances
const BidInterface = ({ 
    currentSession, hasAutoBid, isAutoBidEnabled, disableAutoBid, isLoadingBid,
    handleSetBid, bidValue, formatCurrency, handleSetAutoBidLimit, autoBidLimit,
    handleBidConfirm, toggleAutoBid, props
}) => {
    // Renderizar interfaces diferentes dependendo do estado do produto e do usuário
    const renderBiddingInterface = () => {
        if (props.currentProduct.Winner) {
            return (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Este produto já foi arrematado!</h3>
                    <p className="text-lg text-gray-600 mb-4">
                        Não se preocupe, temos muitos outros itens incríveis esperando por você.
                        Continue explorando nosso catálogo para encontrar sua próxima aquisição especial!
                    </p>
                    <p className="text-md text-gray-500">
                        Dica: Fique de olho em nossos leilões futuros para não perder oportunidades únicas.
                    </p>
                </div>
            );
        }

        return currentSession ? (
            <div className='flex flex-col gap-3'>
                {/* Indicador de lance automático ativo */}
                {hasAutoBid && (
                    <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded-md mb-2">
                        <div className="flex items-center">
                            <div className="mr-2">
                                <div className="relative flex items-center">
                                    <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-green-700 font-medium">Lance automático ativo</p>
                                <p className="text-sm text-green-600">
                                    Seus lances serão feitos automaticamente quando outros usuários derem lances.
                                </p>
                            </div>
                            <button 
                                onClick={() => disableAutoBid()}
                                disabled={isLoadingBid}
                                className="bg-white border border-red-400 text-red-500 px-3 py-1 rounded-md 
                                    hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                                {isLoadingBid ? 'Desativando...' : 'Desativar'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Interface de lance */}
                <div className='flex gap-2 text-white font-bold'>
                    {!hasAutoBid && (
                        <>
                            {!isAutoBidEnabled ? (
                                <input
                                    onChange={handleSetBid}
                                    type="text"
                                    value={formatCurrency(bidValue)}
                                    className="w-[150px] h-[40px] bg-white rounded-[6px] text-[#1f1f1f] p-2"
                                    disabled={isLoadingBid}
                                    placeholder="Valor do lance"
                                />
                            ) : (
                                <input
                                    onChange={handleSetAutoBidLimit}
                                    type="text"
                                    value={formatCurrency(autoBidLimit)}
                                    className="w-[150px] h-[40px] bg-white rounded-[6px] text-[#1f1f1f] p-2"
                                    disabled={isLoadingBid}
                                    placeholder="Valor limite"
                                />
                            )}
                            <button
                                onClick={handleBidConfirm}
                                className={`w-[150px] h-[40px] rounded-md transition-colors ${isLoadingBid
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-[#141839] hover:bg-[#1e2456]'
                                    }`}
                                disabled={isLoadingBid}
                            >
                                {isLoadingBid ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                ) : (
                                    isAutoBidEnabled ? 'Ativar Auto Lance' : 'Fazer Lance'
                                )}
                            </button>
                        </>
                    )}

                    {!hasAutoBid && (
                        <div
                            onClick={!isLoadingBid ? toggleAutoBid : undefined}
                            className={`flex w-[260px] h-[40px] justify-center items-center gap-2 rounded-md cursor-pointer 
                            transition-all duration-300 ease-in-out
                            ${isAutoBidEnabled 
                                    ? 'bg-[#13a664] hover:bg-[#0a943d]'
                                    : 'bg-[#1399CF] hover:bg-[#0d7eaa]'}
                            ${isLoadingBid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span>
                                {isAutoBidEnabled ? 'Configurar Lance Automático' : 'Ativar Lances Automáticos'}
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Explicação do lance automático */}
                {isAutoBidEnabled && !hasAutoBid && (
                    <div className="bg-blue-50 p-3 rounded-md mt-2 text-sm text-blue-700">
                        <p>
                            <span className="font-medium">Lance Automático:</span> Defina um valor limite e o sistema 
                            dará lances por você automaticamente sempre que alguém superar seu lance, até o limite estabelecido.
                        </p>
                    </div>
                )}
            </div>
        ) : (
            <button
                onClick={() => props.setIsModalOn(true)}
                className="bg-[#9f9f9f] p-2 rounded-[6px] text-white hover:bg-[#8a8a8a] transition-colors"
            >
                Faça login para dar lances
            </button>
        );
    };

    return renderBiddingInterface();
};

export default BidInterface; 