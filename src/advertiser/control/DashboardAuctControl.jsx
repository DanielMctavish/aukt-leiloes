/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ClientDetailModal from "./modal/ClientDetailModal";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import AuctionController from "./components/AuctionController";
import DisplayCurrentLote from "./components/DisplayCurrentLote";
import BidsListController from "./components/BidsListController";
import AuctionsSelectorController from "./components/AuctionsSelectorController";
import { setAuct, setStatus } from "../../features/auct/generalAUKSlice";
import FloorMessageSet from "./components/FloorMessageSet";

function DashboardAuctControl() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const generalAUK = useSelector(state => state.generalAUK);

    useEffect(() => {
        const currentSession = localStorage.getItem("advertiser-session-aukt");

        if (!currentSession) {
            navigate("/");
            return;
        }

        const fetchLiveAuction = async () => {
            try {
                const sessionData = JSON.parse(currentSession);
                
                // Primeiro, busca o ID do anunciante logado
                const advertiserResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
                    headers: { 'Authorization': `Bearer ${sessionData.token}` },
                    params: { email: sessionData.email }
                });
                
                const advertiserId = advertiserResponse.data.id;
                
                // Busca leilões com status "live" e filtra por creator_id (anunciante)
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                    headers: { 'Authorization': `Bearer ${sessionData.token}` },
                    params: { 
                        status: 'live',
                        creator_id: advertiserId
                    }
                });
                
                if (response.data && response.data.length > 0) {
                    const liveAuction = response.data[0]; // Assume que o primeiro item é o leilão ao vivo
                    dispatch(setAuct(liveAuction));
                    dispatch(setStatus('live'));
                }
            } catch (error) {
                console.error("Error fetching live auction:", error);
            }
        };

        if (!generalAUK.auct) {
            fetchLiveAuction();
        }
    }, [dispatch, navigate, generalAUK.auct]);

    return (
        <div className="w-full h-[100vh] flex-col flex justify-start items-center overflow-hidden ">
            <ClientDetailModal />
            <AssideAdvertiser MenuSelected="menu-4" />

            <section className="w-full flex flex-col justify-start items-center gap-2 relative  z-10">
                <NavAdvertiser />

                <div className="flex flex-col lg:w-[80%] w-full h-[90vh]  mt-[8vh]
                shadow-lg shadow-[#1919192d] bg-gradient-to-b from-[#fff] to-[#e9e9e900] 
                overflow-y-auto rounded-lg">

                    <div className="flex lg:flex-row flex-col w-full lg:min-h-[75vh] min-h-[120vh] bg-[#fff] p-1 gap-1">
                        <div className="flex flex-col lg:w-[50%] w-full h-full p-1 gap-1">
                            <AuctionsSelectorController />
                            <AuctionController />
                        </div>
                        <DisplayCurrentLote />
                    </div>

                    <div className="flex lg:flex-row flex-col w-full lg:min-h-[40vh] min-h-[100vh] p-1 gap-1">
                        <FloorMessageSet />
                        <BidsListController />
                    </div>

                </div>

            </section>
        </div>
    );
}

export default DashboardAuctControl;