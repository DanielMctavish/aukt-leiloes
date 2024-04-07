/* eslint-disable react-hooks/exhaustive-deps */
import { AccountCircle, Notifications } from "@mui/icons-material";
import "./floorStyles.css";
import DisplayClock from "./DisplayClock";



function FloorNavigation() {
    

    return (
        <div className="w-full min-h-[72px] flex justify-between p-3 items-center bg-white shadow-xl border-b-[1px] border-[#BABABA]">
            <span>Bem vindo, usuário!</span>

            <DisplayClock/>

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
