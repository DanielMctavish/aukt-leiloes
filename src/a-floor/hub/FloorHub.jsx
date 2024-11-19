/* eslint-disable react-hooks/exhaustive-deps */
import bg_hub from "../../media/backgrounds/background_hub.png"
import axios from "axios";
import { useEffect, useState } from "react";
import blueLogo from "../../media/logos/logos-auk/aukt_blue.png";
import { useNavigate } from "react-router-dom";

const FloorHub = () => {
    const [allAuctions, setAllAuctions] = useState({
        auctionLive: [],
        auctionCataloged: [],
    });
    const [currentClient, setCurrentClient] = useState();
    const navigate = useNavigate()

    useEffect(() => {
        getAllAuctions();
        getCurrentClientSession();
    }, []);

    const getAllAuctions = async () => {
        try {
            const catalogedResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus?status=cataloged`
            );
            const liveResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus?status=live`
            );

            setAllAuctions({
                auctionCataloged: catalogedResponse.data.filter(auct => auct.public === true),
                auctionLive: liveResponse.data.filter(auct => auct.public === true),
            });

        } catch (error) {
            console.error("Error at getting auctions: ", error.message);
        }
    };

    const getCurrentClientSession = async () => {
        const clientSession = JSON.parse(
            localStorage.getItem("client-auk-session-login")
        );

        if (clientSession) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${clientSession.email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${clientSession.token}`,
                        },
                    }
                );
                setCurrentClient(response.data);
            } catch (error) {
                console.error("Error at getting client: ", error.message);
            }
        }
    };

    useEffect(() => {
    }, [allAuctions, currentClient]);

    const renderAuctionCards = (auctions, label) => {
        return auctions.map((auction, i) => {
            const isVertical = i % 2 === 0; // Alternate between vertical and horizontal cards
            return (
                <div
                    key={i}
                    onClick={() => navigate(`/floor/${auction.id}`)}
                    className={`flex flex-col justify-center items-center relative bg-white rounded-[20px] gap-3 overflow-hidden
                        p-3 cursor-pointer hover:bg-blue-100 shadow-lg ${isVertical ? 'min-h-[400px]' : 'min-h-[300px]'}
                        ${label === 'live' ? 'border-[#6e1313] border-[4px]' : 'border-none'}
                        `}
                    style={{
                        gridColumn: isVertical ? 'span 1' : 'span 2',
                        gridRow: isVertical ? 'span 2' : 'span 1',
                    }}
                >
                    <span
                        className={`absolute top-2 right-2 text-white p-1 rounded-[20px] ${label === 'live' ? 'bg-[#6e1313]' : 'bg-[#10335f]'}`}
                    >
                        {label}
                    </span>
                    <img
                        src={auction.auct_cover_img}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div>
                        <h3>{auction.title}</h3>
                    </div>
                </div>
            );
        });
    };


    return (
        <div
            className="flex flex-col justify-start items-center w-full relative 
            h-[100vh] overflow-hidden bg-[#D8DEE8] text-[#2d2d2d]"
        >
            <img src={bg_hub} alt="" className="object-cover w-full h-[100vh] absolute opacity-70" />

            <nav
                className="flex justify-between items-center 
                border-[1px] border-[#e9e9e9] backdrop-blur-[4px]
                w-[96%] h-[60px] rounded-[12px] mt-[1vh] bg-[#e0e0e0a6] p-2 z-10"
            >
                <img
                    src={blueLogo}
                    alt="logo-azul-aukt"
                    className="w-[57px] object-cover cursor-pointer"
                    onClick={() => navigate("/")}
                />
                <span>{currentClient && currentClient.name}</span>
            </nav>

            <section
                className="grid grid-cols-4 gap-1 w-[70%] h-[80vh] justify-start bg-transparent 
                overflow-y-auto p-1 transition-all duration-[1s] mt-[6vh]"
            >
                {renderAuctionCards(allAuctions.auctionLive, "live")}
                {renderAuctionCards(allAuctions.auctionCataloged, "cataloged")}
            </section>

                <span className="text-[#51759A] z-10">leia nossos termos e condições, obrigado pela sua presença!</span>
        </div>
    );
};

export default FloorHub;
