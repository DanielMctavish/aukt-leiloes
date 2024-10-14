/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { ArrowDropDown } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { getAdvertiserInformations } from "../functions/GetAdvertiserInformations";
import "../styles/AdvertiserStyle.css"

function NavAdvertiser({ path }) {
  const [AdvertiserInfor, setAdvertiserInfor] = useState({});

  useEffect(() => {
    getAdvertiserInformations(setAdvertiserInfor);
  }, []);

  return (
    <nav className={`
        ml-0
        nav-auk
        lg:left-auto
        left-[34%]
        lg:bottom-0
        bottom-[6%]
        relative
        lg:w-full
        lg:h-[72px]
        h-[2vh]
        lg:bg-[#FFFFFF]
        lg:shadow-lg
        lg:shadow-[#1b1b1b23] 
        flex-row
        flex
        lg:justify-center
        justify-start 
        items-center 
        gap-2 
        text-[12px]
        cursor-pointer
        ${AdvertiserInfor.police_status === 'WARNED' ? 'bg-orange-400' : ''}
      `}
    >
      <section
        className="
            w-[98%] 
            lg:h-[72px]
            h-[100vh] 
            flex 
            flex-row 
            lg:justify-between
            justify-start 
            items-center
            lg:gap-0
            gap-3"
      >
        <div className="flex justify-center items-center gap-3">
          <span className="text-[22px] font-bold lg:flex hidden ml-[60px]">
            Bem vindo, {AdvertiserInfor.name}!
          </span>

          <span className="text-[22px]  font-bold lg:flex hidden">
            {AdvertiserInfor.nano_id}
          </span>
        </div>

        <span className="flex text-[12px]">
          {path}
        </span>

        {AdvertiserInfor.police_status === 'WARNED' && (
          <div className="flex items-center text-red-700 font-bold">
            <WarningIcon className="mr-2" />
            <span>Conta sob aviso</span>
          </div>
        )}

        <section className="flex flex-row justify-center items-center gap-6">
          <span>
            <NotificationsIcon />
          </span>
          <img
            src={AdvertiserInfor.url_profile_cover}
            alt="foto-perfil"
            className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden object-cover"
          />
          <span className="font-semibold text-[18px] lg:flex hidden">
            {AdvertiserInfor.name}
          </span>
          <span className="lg:flex hidden">
            <ArrowDropDown />
          </span>
        </section>
      </section>
    </nav>
  );
}

export default NavAdvertiser;
