/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { PlayArrow, SkipNext, PauseCircleFilledOutlined, AccessTime, PlayCircleFilledWhite, OpenInNew, HourglassEmpty } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    handlePlayAuction,
    handlePauseAuction,
    handleResumeAuction,
    handleNextProduct,
    handleAddTime,
    killAuction
} from "../control-usecases/auctionControlUseCases";

function AuctionController() {
    const [cookieSession, setCookieSession] = useState(null);
    const [loadNext, setLoadNext] = useState(false);
    const [remainingLots, setRemainingLots] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
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

    // Calcular o tempo estimado restante com base nos lotes e no produto atual
    useEffect(() => {
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
                
                // Calcular o tempo estimado (30 segundos por lote)
                const totalSeconds = remainingProducts.length * 30;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                setEstimatedTime({ hours, minutes, seconds });
            } else {
                // Se não houver produto atual, considerar todos os produtos sem vencedor
                setRemainingLots(sortedProducts.length);
                
                const totalSeconds = sortedProducts.length * 30;
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
    }, [generalAUK.auct, generalAUK.currentProduct]);

    const isRunning = generalAUK.status === 'live';
    const isPaused = generalAUK.status === 'paused';
    const isFinished = generalAUK.status === 'finished';

    const playAuction = useCallback(() => {
        handlePlayAuction(generalAUK.auct, generalAUK.group, cookieSession, dispatch)();
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

    return (
        <div className="flex bg-white w-full h-[50%] rounded-xl shadow-lg p-4">
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

                {/* Grid de Botões */}
                <div className="grid grid-cols-3 gap-4 p-6">
                    {/* Botão Iniciar */}
                    <button 
                        onClick={playAuction}
                        disabled={isRunning || isDisabled} 
                        className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl 
                            font-medium transition-all duration-200 ${
                            isRunning || isDisabled 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#139a0a] text-white hover:bg-[#37c72d] shadow-md'
                        }`}
                    >
                        <PlayArrow sx={{ fontSize: 24 }} />
                        <span>Iniciar</span>
                    </button>

                    {/* Botão Próximo */}
                    {!loadNext ? (
                        <button 
                            onClick={nextProduct}
                            disabled={!isRunning || isDisabled}
                            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl 
                                font-medium transition-all duration-200 ${
                                !isRunning || isDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#012038] text-white hover:bg-[#266da4] shadow-md'
                                }`}
                        >
                            <SkipNext sx={{ fontSize: 24 }} />
                            <span>Próximo</span>
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl 
                            bg-[#1e3d54] text-white shadow-md">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            <span>Passando...</span>
                        </div>
                    )}

                    {/* Botão Pausar/Retomar */}
                    {isPaused ? (
                        <button 
                            onClick={resumeAuction}
                            disabled={isDisabled}
                            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl 
                                font-medium transition-all duration-200 ${
                                isDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#139a0a] text-white hover:bg-[#37c72d] shadow-md'
                                }`}
                        >
                            <PlayCircleFilledWhite sx={{ fontSize: 24 }} />
                            <span>Retomar</span>
                        </button>
                    ) : (
                        <button 
                            onClick={pauseAuction}
                            disabled={!isRunning || isDisabled}
                            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl 
                                font-medium transition-all duration-200 ${
                                !isRunning || isDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#012038] text-white hover:bg-[#266da4] shadow-md'
                                }`}
                        >
                            <PauseCircleFilledOutlined sx={{ fontSize: 24 }} />
                            <span>Pausar</span>
                        </button>
                    )}

                    {/* Botões de Tempo */}
                    {[5, 15, 30].map((time) => (
                        <button 
                            key={time}
                            onClick={() => addTime(time)}
                            disabled={!isRunning || isDisabled}
                            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl 
                                font-medium transition-all duration-200 ${
                                !isRunning || isDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#012038] text-white hover:bg-[#266da4] shadow-md'
                                }`}
                        >
                            <AccessTime sx={{ fontSize: 24 }} />
                            <span>+{time}s</span>
                        </button>
                    ))}

                    {/* Botão Ir para Pregão */}
                    <button 
                        onClick={openAuctionFloor}
                        disabled={isDisabled}
                        className={`col-span-3 flex items-center justify-center gap-2 px-4 py-4 rounded-xl 
                            font-medium transition-all duration-200 mt-2 ${
                            isDisabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#082338] text-white hover:from-blue-700 hover:to-indigo-700 shadow-md'
                            }`}
                    >
                        <OpenInNew sx={{ fontSize: 24 }} />
                        <span>Ir para Pregão</span>
                    </button>
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