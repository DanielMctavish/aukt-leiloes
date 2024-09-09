/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { PlayArrow, SkipNext, PauseCircleFilledOutlined, AccessTime, PlayCircleFilledWhite } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLiveAuction, selectLiveGroup } from "../../../features/auct/LiveSelected";
import { setRunning, setPaused } from "../../../features/auct/controlButtonsSlice";

function AuctionController() {
    const [cookieSession, setCookieSession] = useState(null);
    const stateLive = useSelector(state => state.live);
    const { auction: selectedAuction, group: selectedGroup } = stateLive;
    const isRunning = useSelector(state => state.controlButtons.isRunning);
    const isPaused = useSelector(state => state.controlButtons.isPaused);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const session = localStorage.getItem('advertiser-session-aukt');
        if (!session) {
            navigate('/advertiser/login');
            return null;
        }
        setCookieSession(JSON.parse(session)); // Certifique-se de que o session é um objeto

        if (selectedAuction && selectedGroup) {
            dispatch(setRunning(selectedAuction.status === "live"));
            dispatch(setPaused(selectedAuction.status === "paused"));
        }
    }, [selectedAuction, selectedGroup, dispatch, navigate]);

    const handlePlayAuction = async () => {
        if (!selectedAuction || !selectedGroup) {
            alert("É necessário selecionar um leilão e um grupo.");
            return null;
        }

        console.log("Iniciando leilão...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/start-auct`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                group: selectedGroup
            }
        }).then(response => {
            console.log("Play Auction Response:", response.data);
            dispatch(setRunning(true));
            dispatch(setPaused(false));
            dispatch(selectLiveAuction({ ...selectedAuction, status: "live" }));
            localStorage.removeItem("paused-auction");
            localStorage.removeItem("paused-group");
        }).catch(error => {
            console.log("Play Auction Error:", error.message);
        });
    };

    const handlePauseAuction = async () => {
        console.log("Pausando leilão...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/pause-product-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        }).then(response => {
            console.log("Pause Auction Response:", response.data);
            dispatch(setPaused(true));
            dispatch(setRunning(false));
            dispatch(selectLiveAuction({ ...selectedAuction, status: "paused" }));
            localStorage.setItem("paused-auction", JSON.stringify(selectedAuction));
            localStorage.setItem("paused-group", selectedGroup);
        }).catch(error => {
            console.log("Pause Auction Error:", error.message);
        });
    };

    const handleResumeAuction = async () => {
        console.log("Retomando leilão...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/resume-floor`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        }).then(response => {
            console.log("Resume Auction Response:", response.data);
            dispatch(setPaused(false));
            dispatch(setRunning(true));
            dispatch(selectLiveAuction({ ...selectedAuction, status: "live" }));
            localStorage.removeItem("paused-auction");
            localStorage.removeItem("paused-group");
        }).catch(error => {
            console.log("Resume Auction Error:", error.message);
        });
    };

    const handleNextProduct = async () => {
        console.log("Passando para o próximo lote...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/next-product`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        }).then(response => {
            console.log("Next Product Response:", response.data);
        }).catch(error => {
            console.log("Next Product Error:", error.message);
        });
    };

    const handleAdd5 = async () => {
        console.log("Adicionando 5 segundos...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/change-product-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                time: 5
            }
        }).then(response => {
            console.log("Add 5 Seconds Response:", response.data);
        }).catch(error => {
            console.log("Add 5 Seconds Error:", error.message);
        });
    };

    const handleAdd15 = async () => {
        console.log("Adicionando 15 segundos...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/change-product-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                time: 15
            }
        }).then(response => {
            console.log("Add 15 Seconds Response:", response.data);
        }).catch(error => {
            console.log("Add 15 Seconds Error:", error.message);
        });
    };

    const handleAdd30 = async () => {
        console.log("Adicionando 30 segundos...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/change-product-time`, {
            headers: {
                Authorization: `Bearer ${cookieSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
                time: 30
            }
        }).then(response => {
            console.log("Add 30 Seconds Response:", response.data);
        }).catch(error => {
            console.log("Add 30 Seconds Error:", error.message);
        });
    };

    const killAuction = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"));
        console.log("Matando leilão...");
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/kill-auct`, {
            headers: {
                'Authorization': `Bearer ${currentSession.token}`
            },
            params: {
                auct_id: selectedAuction.id,
            }
        }).then(response => {
            console.log("Kill Auction Response:", response.data);
            dispatch(selectLiveAuction(null));
            dispatch(selectLiveGroup(null));
            dispatch(setRunning(false));
            dispatch(setPaused(false));
            localStorage.removeItem("paused-auction");
            localStorage.removeItem("paused-group");
        }).catch(error => {
            console.log("Kill Auction Error:", error.message);
        });
    };

    if (!selectedAuction || !selectedGroup) {
        return null; // Não renderiza os controles se um leilão e um grupo não forem selecionados
    }

    return (
        <div className="flex bg-white w-full h-[40%] justify-center items-center rounded-md p-[1vh]  shadow-lg shadow-[#12121244]">

            <div className="flex flex-col w-full h-full bg-white rounded-md overflow-hidden shadow-lg shadow-[#12121244]">
                <span className="flex w-full h-[46px] bg-[#012038] text-white p-2 font-bold text-[14px]">Painel de controles</span>
                <div className="flex flex-wrap justify-center items-center w-full h-[78%] gap-1">

                    <button onClick={handlePlayAuction} disabled={isRunning} className={`w-[140px] lg:h-[60px] p-2 text-white rounded-md flex justify-center items-center gap-2 ${isRunning ? 'bg-gray-400' : 'bg-[#139a0a] hover:bg-[#37c72d]'}`}>
                        <PlayArrow sx={{ fontSize: "33px" }} />
                        <span className="text-[14px]">iniciar leilão</span>
                    </button>

                    <button onClick={handleNextProduct} className="bg-[#012038] hover:bg-[#266da4] w-[140px] lg:h-[60px] p-2 text-white 
                    rounded-md flex justify-center items-center gap-2">
                        <SkipNext sx={{ fontSize: "33px" }} />
                        <span>passar lote</span>
                    </button>

                    {isPaused ? (
                        <button onClick={handleResumeAuction} className="bg-[#139a0a] hover:bg-[#37c72d] w-[140px] lg:h/[60px] p-2 text-white 
                        rounded-md flex justify-center items-center gap-2">
                            <PlayCircleFilledWhite sx={{ fontSize: "33px" }} />
                            <span>retomar leilão</span>
                        </button>
                    ) : (
                        <button onClick={handlePauseAuction}
                            className="bg-[#012038] hover:bg-[#266da4] w-[140px] lg:h/[60px] p-2 text-white 
                        rounded-md flex justify-center items-center gap-2">
                            <PauseCircleFilledOutlined sx={{ fontSize: "33px" }} />
                            <span>pausar</span>
                        </button>
                    )}

                    <button onClick={handleAdd5} className="bg-[#012038] hover:bg-[#266da4] w/[140px] lg:h/[60px] p-2 text-white 
                    rounded-md flex justify-center items-center gap-1">
                        <AccessTime sx={{ fontSize: "33px" }} />
                        <span>+5</span>
                    </button>

                    <button onClick={handleAdd15} className="bg-[#012038] hover:bg-[#266da4] w/[140px] lg:h/[60px] p-2 text-white 
                    rounded-md flex justify-center items-center gap-1">
                        <AccessTime sx={{ fontSize: "33px" }} />
                        <span>+10</span>
                    </button>

                    <button onClick={handleAdd30} className="bg-[#012038] hover:bg-[#266da4] w/[140px] lg:h/[60px] p-2 text-white 
                    rounded-md flex justify-center items-center gap-1">
                        <AccessTime sx={{ fontSize: "33px" }} />
                        <span>+30</span>
                    </button>

                    {selectedAuction && selectedAuction.status === "live" && (
                        <button onClick={killAuction} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                            Matar Leilão
                        </button>
                    )}

                </div>
            </div>

        </div>
    )
}

export default AuctionController;