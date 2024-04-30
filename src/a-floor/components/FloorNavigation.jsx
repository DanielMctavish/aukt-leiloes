/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom"
import { AccountCircle, Notifications } from "@mui/icons-material";
import "./floorStyles.css";
import DisplayClock from "./DisplayClock";
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"

function FloorNavigation() {
    const navigate = useNavigate()

    return (
        <div className="w-full min-h-[100px] rounded-[22px] 
        flex justify-between p-3 items-center bg-[#d2d2d291] 
        backdrop-blur-md shadow-xl shadow-[#1414143a] 
        border-b-[2px] border-[#e3e3e3] z-[2]">

            <img src={aukLogo} alt="" className="w-[63px] object-cover cursor-pointer hover:brightness-[1.2]" onClick={() => { navigate("/") }} />

            <DisplayClock />

            <div className="flex gap-3 text-[#012038] justify-center items-center">
                <span className="cursor-pointer">
                    <Notifications />
                </span>
                <span>
                    <AccountCircle style={{ fontSize: "36px" }} />
                </span>
                <span>usuário tal</span>
            </div>
        </div>
    );
}

export default FloorNavigation;
