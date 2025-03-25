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

        console.log("observando o generalAUK -> ", generalAUK)

        if (!currentSession) {
            navigate("/");
            return;
        }

        const fetchLiveAuction = async () => {
            try {
                const sessionData = JSON.parse(currentSession);
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                    headers: { 'Authorization': `Bearer ${sessionData.token}` },
                    params: { status: 'live' }
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
        <div className="w-full lg:h-[100vh] h-[200vh] flex-col flex justify-start items-center bg-[#F4F4F4] overflow-hidden">
            <ClientDetailModal />
            <AssideAdvertiser MenuSelected="menu-4" />

            <section className="w-full lg:h-[100vh] min-h-[200vh] flex flex-col justify-start items-center gap-2 relative">
                <NavAdvertiser />

                <div className="flex flex-col lg:w-[80%] w-full lg:h-[90vh] h-[200vh] shadow-lg shadow-[#1919192d] bg-gradient-to-b from-[#fff] to-[#e9e9e9] overflow-y-auto lg:mt-0 mt-[3vh] rounded-lg">
                    <div className="flex lg:flex-row flex-col w-full lg:min-h-[70vh] min-h-[100vh] bg-[#fff] p-1 gap-1">
                        <div className="flex flex-col lg:w-[50%] w-full h-full p-1 gap-1">
                            <AuctionsSelectorController />
                            <AuctionController />
                        </div>
                        <DisplayCurrentLote />
                    </div>

                    <div className="flex lg:flex-row flex-col w-full lg:min-h-[60vh] min-h-[100vh] p-1 gap-1">
                        <FloorMessageSet/>
                        <BidsListController />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DashboardAuctControl;