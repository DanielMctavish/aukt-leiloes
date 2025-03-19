/* eslint-disable react/prop-types */


// Componente para gerenciar o sistema de notificações
const NotificationSystem = ({ 
    showOutbidNotification, setShowOutbidNotification, lastBidClient, hasAutoBid,
    getIncrementValue, props, setIsAutoBidEnabled, setAutoBidLimit, handleBidConfirm
}) => {
    if (!showOutbidNotification) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-[#ffffff88] border-l-4 border-red-500 
            shadow-lg rounded-lg p-4 transform transition-all duration-300 ease-in-out backdrop-blur-[6px]">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="relative">
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" 
                            style={{ animationDuration: '2s' }}></div>
                        <svg className="w-6 h-6 text-red-500 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        {hasAutoBid ? 'Lance automático superado!' : 'Seu lance foi superado!'}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>
                            {lastBidClient?.name 
                                ? `${lastBidClient.nickname} ${hasAutoBid ? 'superou seu lance automático!' : 'superou seu lance!'}`
                                : hasAutoBid 
                                    ? 'Seu lance automático foi superado! O limite definido foi atingido.'
                                    : 'Outro participante superou seu lance!'
                            }
                        </p>
                        {hasAutoBid && (
                            <p className="mt-1 text-xs text-red-600">
                                Seu lance automático atingiu o limite máximo definido.
                            </p>
                        )}
                    </div>
                    <div className="mt-3 flex space-x-2">
                        {hasAutoBid ? (
                            <>
                                <button
                                    onClick={() => {
                                        setShowOutbidNotification(false);
                                        setIsAutoBidEnabled(true);
                                        // Definir automaticamente um valor maior como sugestão
                                        const currentValue = props.currentProduct.real_value || props.currentProduct.initial_value;
                                        const incrementValue = getIncrementValue(currentValue);
                                        setAutoBidLimit(currentValue + incrementValue * 5); // Sugerir um valor 5x maior que o incremento
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent 
                                        text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 
                                        hover:bg-blue-700 focus:outline-none"
                                >
                                    Aumentar limite
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    setShowOutbidNotification(false);
                                    handleBidConfirm();
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent 
                                    text-xs font-medium rounded-md shadow-sm text-white bg-red-600 
                                    hover:bg-red-700 focus:outline-none"
                            >
                                Fazer novo lance
                            </button>
                        )}
                        <button
                            onClick={() => setShowOutbidNotification(false)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 
                                shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white 
                                hover:bg-gray-50 focus:outline-none"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSystem; 