/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    PlayArrow,
    SkipNext,
    PauseCircleFilledOutlined,
    AccessTime,
    PlayCircleFilledWhite,
    OpenInNew,
    HourglassEmpty,
    Speed,
    Check
} from "@mui/icons-material";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    handlePlayAuction,
    handlePauseAuction,
    handleResumeAuction,
    handleNextProduct,
    handleAddTime,
    killAuction,
    changeProductTime
} from "../control-usecases/auctionControlUseCases";


function AuctionController() {
    const [cookieSession, setCookieSession] = useState(null);
    const [loadNext, setLoadNext] = useState(false);
    const [remainingLots, setRemainingLots] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [loteTimeValue, setLoteTimeValue] = useState(0); // Mudando valor inicial para 0
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [hasSetTime, setHasSetTime] = useState(false); // Novo estado para controlar se o tempo foi definido
    const [isPlayLoading, setIsPlayLoading] = useState(false); // Estado para controlar o loading do botão play
    const debounceTimerRef = useRef(null); // Referência para o timer de debounce
    const successTimeoutRef = useRef(null);
    const generalAUK = useSelector(state => state.generalAUK);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const session = localStorage.getItem('advertiser-session-aukt');
        if (!session) {
            navigate('/advertiser/login');
            return;
        }
        setCookieSession(JSON.parse(session));
    }, [navigate]);

    // Atualiza o valor do input range quando o leilão muda
    useEffect(() => {
        if (generalAUK.auct && generalAUK.auct.product_timer_seconds) {
            setLoteTimeValue(generalAUK.auct.product_timer_seconds);
        }
    }, [generalAUK.auct]);

    // Calcular o tempo estimado restante com base nos lotes e no produto atual
    useEffect(() => {

        // console.log('generalAUK.auct --> ', generalAUK.auct);

        if (generalAUK.auct && generalAUK.auct.product_list) {
            // Filtrar produtos que não têm vencedor (winner_id)
            const productsWithoutWinner = generalAUK.auct.product_list.filter(
                product => !product.winner_id
            );

            // Ordenar produtos pelo número do lote para garantir a sequência correta
            const sortedProducts = [...productsWithoutWinner].sort(
                (a, b) => (a.lote || 0) - (b.lote || 0)
            );

            if (generalAUK.currentProduct && generalAUK.currentProduct.lote) {
                // Filtrar produtos com número de lote maior ou igual ao atual
                // (incluindo o lote atual)
                const remainingProducts = sortedProducts.filter(
                    product => (product.lote || 0) >= (generalAUK.currentProduct.lote || 0)
                );

                setRemainingLots(remainingProducts.length);

                // Calcular o tempo estimado usando o valor atual de tempo por lote
                const totalSeconds = remainingProducts.length * (generalAUK.auct.product_timer_seconds || loteTimeValue);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                setEstimatedTime({ hours, minutes, seconds });
            } else {
                // Se não houver produto atual, considerar todos os produtos sem vencedor
                setRemainingLots(sortedProducts.length);

                const totalSeconds = sortedProducts.length * (generalAUK.auct.product_timer_seconds || loteTimeValue);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                setEstimatedTime({ hours, minutes, seconds });
            }
        } else {
            // Se não há leilão ou produtos, zerar os valores
            setRemainingLots(0);
            setEstimatedTime({ hours: 0, minutes: 0, seconds: 0 });
        }
    }, [generalAUK.auct, generalAUK.currentProduct, loteTimeValue]);

    const isRunning = generalAUK.status === 'live';
    const isPaused = generalAUK.status === 'paused';
    const isFinished = generalAUK.status === 'finished';

    const playAuction = useCallback(async () => {
        setIsPlayLoading(true);
        try {
            await handlePlayAuction(generalAUK.auct, generalAUK.group, cookieSession, dispatch)();
        } finally {
            setIsPlayLoading(false);
        }
    }, [generalAUK.auct, generalAUK.group, cookieSession, dispatch]);

    const pauseAuction = useCallback(() => {
        handlePauseAuction(generalAUK.auct, cookieSession, dispatch)();
    }, [generalAUK.auct, cookieSession, dispatch]);

    const resumeAuction = useCallback(() => {
        handleResumeAuction(generalAUK.auct, cookieSession, dispatch)();
    }, [generalAUK.auct, cookieSession, dispatch]);

    const nextProduct = useCallback(() => {
        handleNextProduct(generalAUK.auct, cookieSession, setLoadNext)();
    }, [generalAUK.auct, cookieSession]);

    const addTime = useCallback((time) => {
        handleAddTime(generalAUK.auct, cookieSession, time)();
    }, [generalAUK.auct, cookieSession]);

    const killAuctionHandler = useCallback(() => {
        killAuction(generalAUK.auct, cookieSession, dispatch)();
    }, [generalAUK.auct, cookieSession, dispatch]);

    // Função para abrir o pregão em uma nova janela
    const openAuctionFloor = useCallback(() => {
        if (generalAUK.auct && generalAUK.auct.id) {
            const floorUrl = `/floor/${generalAUK.auct.id}`;
            window.open(floorUrl, '_blank', 'noopener,noreferrer');
        }
    }, [generalAUK.auct]);

    useEffect(() => {
    }, [loadNext]);


    // Desabilitar botões se não houver leilão selecionado ou se o leilão estiver finalizado
    const isDisabled = !generalAUK.auct || isFinished;

    // Função para atualizar o valor do range de tempo por lote com debounce
    const handleChangeProductTime = async (e) => {
        // Verifica se o leilão está rodando e tem mais de 3 segundos restantes
        if (!isRunning || generalAUK.currentTimer <= 3) {
            return;
        }

        const newValue = e.target.value;
        setLoteTimeValue(newValue); // Atualiza o estado local imediatamente para feedback visual
        setHasSetTime(true); // Indica que o tempo foi definido

        // Limpa o timer anterior se existir
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Define um novo timer para fazer a chamada da API após 1500ms
        debounceTimerRef.current = setTimeout(async () => {
            try {
                await changeProductTime(generalAUK.auct, cookieSession, newValue);
                setShowSuccessMessage(true);
                // Limpa a mensagem de sucesso após 2 segundos
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 2000);
            } catch (error) {
                console.error('Erro ao atualizar o tempo do produto:', error);
            }
        }, 1500);
    };

    // Limpar os timers pendentes quando o componente for desmontado
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex w-full h-[50%] rounded-xl shadow-lg p-4 bg-orange-600">
            <div className="flex flex-col w-full h-full bg-gray-50 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#012038] text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <PlayArrow sx={{ fontSize: 20 }} />
                        </div>
                        <span className="font-medium">Painel de Controles</span>
                    </div>

                    {/* Botão Finalizar movido para o header */}
                    {generalAUK.auct && generalAUK.status === "live" && (
                        <button
                            onClick={killAuctionHandler}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
                                font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                        >
                            Finalizar Leilão
                        </button>
                    )}
                </div>

                {/* Tempo Estimado */}
                {generalAUK.auct && generalAUK.status !== "finished" && (
                    <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <HourglassEmpty className="text-blue-600" />
                            <span className="font-medium">Tempo Estimado Restante:</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <span className="font-semibold text-[#012038]">
                                    {remainingLots}
                                </span>
                                <span className="ml-1 text-gray-500">
                                    lotes restantes
                                </span>
                            </div>
                            <div className="px-3 py-1 bg-[#012038] text-white rounded-lg font-medium flex items-center">
                                {estimatedTime.hours > 0 && (
                                    <span>{estimatedTime.hours}h </span>
                                )}
                                {(estimatedTime.hours > 0 || estimatedTime.minutes > 0) && (
                                    <span>{estimatedTime.minutes}m </span>
                                )}
                                <span>{estimatedTime.seconds}s</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conteúdo Principal - Dividido em duas colunas */}
                <div className="flex w-full p-6 gap-6">
                    {/* Coluna Esquerda - 6 Botões de Controle */}
                    <div className="w-1/2 grid grid-cols-3 gap-3">
                        {/* Botão Iniciar */}
                        <button
                            onClick={playAuction}
                            disabled={isRunning || isPaused || isDisabled || !generalAUK.auct || isPlayLoading}
                            title={!generalAUK.auct ? "Selecione um leilão para iniciar" : "Iniciar Leilão"}
                            className={`flex items-center justify-center p-4 rounded-xl 
                                transition-all duration-200 relative
                                ${isRunning || isPaused || isDisabled || !generalAUK.auct || isPlayLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#139a0a] text-white hover:bg-[#37c72d] shadow-md'
                                }`}
                        >
                            {isPlayLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                            ) : (
                                <PlayArrow sx={{ fontSize: 28 }} />
                            )}
                        </button>

                        {/* Botão Próximo */}
                        {!loadNext ? (
                            <button
                                onClick={nextProduct}
                                disabled={!isRunning || isDisabled}
                                title="Próximo Lote"
                                className={`flex items-center justify-center p-4 rounded-xl 
                                    transition-all duration-200 ${!isRunning || isDisabled
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#012038] text-white hover:bg-[#266da4] shadow-md'
                                    }`}
                            >
                                <SkipNext sx={{ fontSize: 28 }} />
                            </button>
                        ) : (
                            <div className="flex items-center justify-center p-4 rounded-xl 
                                bg-[#1e3d54] text-white shadow-md">
                                <div className="animate-spin h-7 w-7 border-2 border-white border-t-transparent rounded-full" />
                            </div>
                        )}

                        {/* Botão Pausar/Retomar */}
                        {isPaused ? (
                            <button
                                onClick={resumeAuction}
                                disabled={isDisabled}
                                title="Retomar Leilão"
                                className={`flex items-center justify-center p-4 rounded-xl 
                                    transition-all duration-200 ${isDisabled
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#139a0a] text-white hover:bg-[#37c72d] shadow-md'
                                    }`}
                            >
                                <PlayCircleFilledWhite sx={{ fontSize: 28 }} />
                            </button>
                        ) : (
                            <button
                                onClick={pauseAuction}
                                disabled={!isRunning || isDisabled}
                                title="Pausar Leilão"
                                className={`flex items-center justify-center p-4 rounded-xl 
                                    transition-all duration-200 ${!isRunning || isDisabled
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#012038] text-white hover:bg-[#266da4] shadow-md'
                                    }`}
                            >
                                <PauseCircleFilledOutlined sx={{ fontSize: 28 }} />
                            </button>
                        )}

                        {/* Botões de Tempo */}
                        {[5, 15, 30].map((time) => (
                            <button
                                key={time}
                                onClick={() => addTime(time)}
                                disabled={!isRunning || isDisabled}
                                title={`Adicionar ${time} segundos`}
                                className={`flex items-center justify-center p-4 rounded-xl 
                                    transition-all duration-200 ${!isRunning || isDisabled
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#012038] text-white hover:bg-[#266da4] shadow-md'
                                    }`}
                            >
                                <div className="relative">
                                    <AccessTime sx={{ fontSize: 28 }} />
                                    <div className="absolute -top-1 -right-1 bg-white text-[#012038] rounded-full 
                                        text-xs font-bold w-4 h-4 flex items-center justify-center">
                                        {time}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Coluna Direita - Botão Ir para Pregão e espaço para futuro input range */}
                    <div className="w-1/2 flex flex-col gap-3">
                        {/* Botão Ir para Pregão */}
                        <button
                            onClick={openAuctionFloor}
                            disabled={isDisabled}
                            title="Abrir Pregão"
                            className={`flex items-center justify-center p-4 gap-3 rounded-xl 
                                transition-all duration-200 ${isDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#082338] text-white hover:bg-[#0e3456] shadow-md'
                                }`}
                        >
                            <OpenInNew sx={{ fontSize: 28 }} />
                            <span>ir pra pregão</span>
                        </button>

                        {/* Espaço reservado para futuro input range */}
                        <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-1 text-[#012038]">
                                    <Speed sx={{ fontSize: 18 }} className="text-blue-600" />
                                    <span className="text-sm font-medium">Tempo por lote:</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {showSuccessMessage && (
                                        <div className="flex items-center gap-1 text-green-600 text-[12px] text-sm animate-fade-in-out">
                                            <Check sx={{ fontSize: 12 }} />
                                            <span className="text-[12px]">Tempo atualizado</span>
                                        </div>
                                    )}
                                    {!hasSetTime && !isRunning && (
                                        <div className="text-amber-600 text-[12px] animate-pulse">
                                            Defina o tempo antes de iniciar
                                        </div>
                                    )}
                                    <span className="font-bold text-sm bg-[#012038] text-white px-2 py-0.5 rounded-lg">
                                        {loteTimeValue}s
                                    </span>
                                </div>
                            </div>

                            <style>
                                {`
                                @keyframes fadeInOut {
                                    0% { opacity: 0; transform: translateY(-5px); }
                                    10% { opacity: 1; transform: translateY(0); }
                                    90% { opacity: 1; transform: translateY(0); }
                                    100% { opacity: 0; transform: translateY(-5px); }
                                }
                                .animate-fade-in-out {
                                    animation: fadeInOut 2s ease-in-out;
                                }
                                `}
                            </style>

                            <div className="flex items-center w-full">
                                <span className="text-[10px] text-gray-500 mr-1 w-5 text-right">1s</span>
                                <div className="relative flex-1">
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={loteTimeValue}
                                        onChange={handleChangeProductTime}
                                        disabled={!isRunning || generalAUK.currentTimer <= 3}
                                        className={`w-full h-1.5 rounded-full appearance-none cursor-pointer relative z-10
                                            ${(!isRunning || generalAUK.currentTimer <= 3) ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'bg-gray-200'}
                                            [&::-webkit-slider-thumb]:appearance-none 
                                            [&::-webkit-slider-thumb]:h-4 
                                            [&::-webkit-slider-thumb]:w-4 
                                            [&::-webkit-slider-thumb]:rounded-full 
                                            [&::-webkit-slider-thumb]:bg-[#012038] 
                                            [&::-webkit-slider-thumb]:border-2 
                                            [&::-webkit-slider-thumb]:border-white 
                                            [&::-webkit-slider-thumb]:shadow-md
                                            ${(!isRunning || generalAUK.currentTimer <= 3) ? '[&::-webkit-slider-thumb]:opacity-60' : ''}
                                            [&::-moz-range-thumb]:appearance-none 
                                            [&::-moz-range-thumb]:h-4 
                                            [&::-moz-range-thumb]:w-4 
                                            [&::-moz-range-thumb]:rounded-full 
                                            [&::-moz-range-thumb]:bg-[#012038] 
                                            [&::-moz-range-thumb]:border-2 
                                            [&::-moz-range-thumb]:border-white 
                                            [&::-moz-range-thumb]:shadow-md
                                            ${(!isRunning || generalAUK.currentTimer <= 3) ? '[&::-moz-range-thumb]:opacity-60' : ''}
                                            [&:hover]:cursor-pointer
                                            ${(!isRunning || generalAUK.currentTimer <= 3) ? '[&:hover]:cursor-not-allowed' : ''}`}
                                    />

                                    {/* Área aumentada para facilitar o clique */}
                                    <div className="absolute top-[-10px] left-0 w-full h-[30px] z-0"></div>

                                    {/* Marcadores simplificados - posicionados atrás do slider */}
                                    <div className={`absolute w-full top-2 flex justify-between px-0.5 pointer-events-none z-0 
                                        ${isRunning ? 'opacity-60' : ''}`}>
                                        {[1, 50, 100].map((mark) => (
                                            <div key={mark} className="flex flex-col items-center">
                                                <div className="w-px h-1 bg-gray-400"></div>
                                                <span className="text-[8px] text-gray-500 mt-0.5">
                                                    {mark === 1 ? 'Rápido' : mark === 100 ? 'Lento' : ''}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 ml-1 w-5">100s</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensagem de Finalizado */}
                {isFinished && (
                    <div className="text-center py-4 text-green-600 font-medium bg-green-50 border-t border-green-100">
                        Leilão finalizado com sucesso
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuctionController;