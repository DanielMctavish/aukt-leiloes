/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom"
import { AccountCircle, Notifications } from "@mui/icons-material";
import "./floorStyles.css";
import DisplayClock from "./DisplayClock";
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"
import { useEffect, useState } from "react";

function FloorNavigation({ auction, group }) {
    const [currentClient, setCurrentClient] = useState({})
    const navigate = useNavigate()

    useEffect(() => {

        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        setCurrentClient(currentSession)

    }, [])


    return (
        <div className="w-full min-h-[100px] rounded-[22px] 
        flex justify-between p-3 items-center bg-[#d2d2d291] 
        backdrop-blur-md shadow-xl shadow-[#1414143a] 
        border-b-[2px] border-[#e3e3e3] z-[2] relative">

            <div className="flex justify-start items-center">
                <img src={aukLogo} alt="" className="w-[63px] object-cover cursor-pointer hover:brightness-[1.2]" onClick={() => { navigate("/") }} />

                {/* Etiqueta leilão....................................................................................................................... */}
                {
                    auction && (
                        <div className=" flex justify-start items-center gap-3 
                                        w-[400px] h-full relative left-[9vh] ml-[-83px]">

                            <img src={auction.auct_cover_img} alt="" className="w-[90px] h-[90px] object-cover rounded-lg" />
                            <div className="flex flex-col justify-start items-start w-[300px] h-[90px] bg-[#3c3c3c] rounded-lg p-2 text-white overflow-y-auto">
                                <h1 className="font-bold">{auction.title}</h1>
                                <p className="text-[12px]">
                                    {auction.descriptions_informations}
                                </p>
                            </div>
                            <span className="font-bold text-[33px]">
                                {group && group}
                            </span>

                        </div>
                    )
                }
            </div>

            <DisplayClock />

            <div className="flex gap-3 text-[#012038] justify-center items-center">
                <span className="cursor-pointer">
                    <Notifications />
                </span>
                <span>
                    <AccountCircle style={{ fontSize: "36px" }} />
                </span>
                <span className="lg:flex hidden">
                    {
                        currentClient ?
                            <span className="cursor-pointer" onClick={() => navigate("/client/dashboard")}>{currentClient.name}</span> :
                            <span className="cursor-pointer" onClick={() => navigate("/client/login")}>acessar</span>
                    }
                </span>
            </div>
        </div>
    );
}

export default FloorNavigation;
