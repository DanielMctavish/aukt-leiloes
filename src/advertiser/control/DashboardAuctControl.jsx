/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client"; // Adicione esta linha
import ClientDetailModal from "./modal/ClientDetailModal";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import AuctionController from "./components/AuctionController";
import FloorMessageSet from "./components/FloorMessageSet";
import DisplayCurrentLote from "./components/DisplayCurrentLote";
import BidsListController from "./components/BidsListController";
import { selectLiveAuction, selectLiveGroup } from "../../features/auct/LiveSelected";
import { setRunning, setPaused } from "../../features/auct/controlButtonsSlice";
import AuctionsSelectorController from "./components/AuctionsSelectorController";
import { setAuctionList } from "../../features/auct/AuctionListSlice";

function DashboardAuctControl() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedAuction = useSelector(state => state.live.auction);
    const [auctionFinished, setAuctionFinished] = useState(false); // Novo estado para leilão finalizado

    useEffect(() => {
        const currentSession = localStorage.getItem("advertiser-session-aukt");

        if (!currentSession) {
            navigate("/");
            return;
        }

        const checkAuctionsStatus = async () => {
            try {
                const sessionData = JSON.parse(currentSession);
                const advertiserResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
                    headers: {
                        'Authorization': `Bearer ${sessionData.token}`
                    },
                    params: {
                        email: sessionData.email
                    }
                });

                const advertiser = advertiserResponse.data;
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                    headers: {
                        'Authorization': `Bearer ${sessionData.token}`
                    },
                    params: {
                        creator_id: advertiser.id // Use the creator_id from the advertiser response
                    }
                });

                const auctions = response.data;
                dispatch(setAuctionList(auctions)); // Dispatch the list of auctions

                const runningAuction = auctions.find(auction => auction.status === "live");
                const pausedAuction = auctions.find(auction => auction.status === "paused");

                if (runningAuction) {
                    dispatch(selectLiveAuction(runningAuction));
                    dispatch(selectLiveGroup(runningAuction.group));
                    dispatch(setRunning(true));
                    dispatch(setPaused(false));
                } else if (pausedAuction) {
                    dispatch(selectLiveAuction(pausedAuction));
                    dispatch(selectLiveGroup(pausedAuction.group));
                    dispatch(setRunning(false));
                    dispatch(setPaused(true));
                }
            } catch (error) {
                console.log("Error checking auctions status: ", error.message);
            }
        };

        const restorePausedAuction = () => {
            const pausedAuction = localStorage.getItem("paused-auction");
            const pausedGroup = localStorage.getItem("paused-group");

            if (pausedAuction && pausedGroup) {
                dispatch(selectLiveAuction(JSON.parse(pausedAuction)));
                dispatch(selectLiveGroup(pausedGroup));
                dispatch(setRunning(false));
                dispatch(setPaused(true));
            }
        };

        const webSocketFlow = () => {
            if (!selectedAuction) return; // Adicione esta linha para evitar erros quando selectedAuction for nulo

            const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
            socket.on(`${selectedAuction.id}-auct-finished`, () => {
                setAuctionFinished(true); // Atualiza o estado quando o leilão é finalizado
            });

            return () => {
                socket.disconnect();
            };
        };

        checkAuctionsStatus();
        restorePausedAuction();
        webSocketFlow(); // Inicia o WebSocket

    }, [dispatch, navigate, selectedAuction]);

    return (
        <div className="w-full lg:h-[100vh] h-[200vh] flex-col flex justify-start items-center
         bg-[#F4F4F4] overflow-hidden ">

            <ClientDetailModal />
            <AssideAdvertiser MenuSelected="menu-4" />

            <section className="w-full lg:h-[100vh] min-h-[200vh] flex flex-col justify-start items-center gap-2 relative">
                <NavAdvertiser />

                <div className="flex flex-col lg:w-[80%] w-full lg:h-[90vh] h-[200vh] shadow-lg shadow-[#1919192d]
                bg-gradient-to-b from-[#fff] to-[#e9e9e9] overflow-y-auto lg:mt-0 mt-[3vh] rounded-lg">

                    <div className="flex lg:flex-row flex-col w-full lg:min-h-[70vh] min-h-[100vh] bg-[#fff] p-1 gap-1">
                        <div className="flex flex-col lg:w-[50%] w-full h-full p-1 gap-1">
                            <AuctionsSelectorController />
                            {selectedAuction ? (
                                <AuctionController />
                            ) : (
                                <div className="flex bg-white w-full h-[50%] justify-center items-center rounded-md p-[1vh] shadow-lg shadow-[#12121244]">
                                    <span className="text-[18px] text-[#5d5d5d] font-bold">Selecione um leilão</span>
                                </div>
                            )}
                        </div>

                        <DisplayCurrentLote auctionFinished={auctionFinished} /> {/* Passa o estado para o componente */}
                    </div>

                    <div className="flex lg:flex-row flex-col w-full lg:min-h-[60vh] min-h-[100vh] p-1 gap-1">
                        <FloorMessageSet />
                        <BidsListController />
                    </div>

                </div>

            </section>

        </div>
    )
}

export default DashboardAuctControl;