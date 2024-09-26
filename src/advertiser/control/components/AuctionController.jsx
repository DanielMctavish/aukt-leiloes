/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { PlayArrow, SkipNext, PauseCircleFilledOutlined, AccessTime, PlayCircleFilledWhite } from "@mui/icons-material";
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

    const isRunning = generalAUK.status === 'live';
    const isPaused = generalAUK.status === 'paused';
    const isFinished = generalAUK.status === 'finished';

    const playAuction = useCallback(() => {
        console.log('observando grupo -> ',generalAUK.group);
        handlePlayAuction(generalAUK.auct, generalAUK.group, cookieSession, dispatch)();
    }, [generalAUK.auct, generalAUK.group, cookieSession, dispatch]);

    const pauseAuction = useCallback(() => {
        handlePauseAuction(generalAUK.auct, cookieSession, dispatch)();
    }, [generalAUK.auct, cookieSession, dispatch]);

    const resumeAuction = useCallback(() => {
        handleResumeAuction(generalAUK.auct, cookieSession, dispatch)();
    }, [generalAUK.auct, cookieSession, dispatch]);

    const nextProduct = useCallback(() => {
        handleNextProduct(generalAUK.auct, cookieSession)();
    }, [generalAUK.auct, cookieSession]);

    const addTime = useCallback((time) => {
        handleAddTime(generalAUK.auct, cookieSession, time)();
    }, [generalAUK.auct, cookieSession]);

    const killAuctionHandler = useCallback(() => {
        killAuction(generalAUK.auct, cookieSession, dispatch)();
    }, [generalAUK.auct, cookieSession, dispatch]);

    // Desabilitar botões se não houver leilão selecionado ou se o leilão estiver finalizado
    const isDisabled = !generalAUK.auct || isFinished;

    return (
        <div className="flex bg-white w-full h-[40%] justify-center items-center rounded-md p-[1vh] shadow-lg shadow-[#12121244]">
            <div className="flex flex-col w-full h-full bg-white rounded-md overflow-hidden shadow-lg shadow-[#12121244]">
                <span className="flex w-full h-[46px] bg-[#012038] text-white p-2 font-bold text-[14px]">Painel de controles</span>
                <div className="grid grid-cols-3 gap-2 p-4">
                    
                    <button onClick={playAuction} 
                    disabled={isRunning || isDisabled} className={`w-full h-[60px] p-2 text-white rounded-md flex 
                    justify-center items-center gap-2 ${isRunning || isDisabled ? 'bg-gray-400' : 'bg-[#139a0a] hover:bg-[#37c72d]'}`}>
                        <PlayArrow sx={{ fontSize: "33px" }} />
                        <span className="text-[14px]">Iniciar</span>
                    </button>

                    <button onClick={nextProduct} 
                    disabled={!isRunning || isDisabled}
                    className="bg-[#012038] hover:bg-[#266da4] w-full h-[60px] p-2 text-white 
                    rounded-md flex justify-center items-center gap-2 disabled:bg-gray-400">
                        <SkipNext sx={{ fontSize: "33px" }} />
                        <span>Próximo</span>
                    </button>

                    {isPaused ? (
                        <button onClick={resumeAuction} 
                        disabled={isDisabled}
                        className="bg-[#139a0a] hover:bg-[#37c72d] 
                        w-full h-[60px] p-2 text-white rounded-md flex justify-center items-center gap-2 disabled:bg-gray-400">
                            <PlayCircleFilledWhite sx={{ fontSize: "33px" }} />
                            <span>Retomar</span>
                        </button>
                    ) : (
                        <button onClick={pauseAuction} 
                        disabled={!isRunning || isDisabled}
                        className="bg-[#012038] hover:bg-[#266da4] w-full h-[60px] p-2 text-white rounded-md flex justify-center items-center gap-2 disabled:bg-gray-400">
                            <PauseCircleFilledOutlined sx={{ fontSize: "33px" }} />
                            <span>Pausar</span>
                        </button>
                    )}

                    <button onClick={() => addTime(5)} 
                    disabled={!isRunning || isDisabled}
                    className="bg-[#012038] hover:bg-[#266da4] w-full h-[60px] p-2 text-white rounded-md flex justify-center items-center gap-1 disabled:bg-gray-400">
                        <AccessTime sx={{ fontSize: "33px" }} />
                        <span>+5s</span>
                    </button>

                    <button onClick={() => addTime(15)} 
                    disabled={!isRunning || isDisabled}
                    className="bg-[#012038] hover:bg-[#266da4] w-full h-[60px] p-2 text-white rounded-md flex justify-center items-center gap-1 disabled:bg-gray-400">
                        <AccessTime sx={{ fontSize: "33px" }} />
                        <span>+15s</span>
                    </button>

                    <button onClick={() => addTime(30)} 
                    disabled={!isRunning || isDisabled}
                    className="bg-[#012038] hover:bg-[#266da4] w-full h-[60px] p-2 text-white rounded-md flex justify-center items-center gap-1 disabled:bg-gray-400">
                        <AccessTime sx={{ fontSize: "33px" }} />
                        <span>+30s</span>
                    </button>

                    {generalAUK.auct && generalAUK.status === "live" && (
                        <button onClick={killAuctionHandler} 
                        className="col-span-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                            Finalizar Leilão
                        </button>
                    )}

                    {isFinished && (
                        <div className="col-span-3 text-center text-green-600 font-bold mt-2">
                            Leilão finalizado
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuctionController;