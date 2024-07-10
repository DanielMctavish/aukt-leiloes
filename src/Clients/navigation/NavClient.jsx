/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDropDown } from "@mui/icons-material";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
//import { useNavigate } from "react-router-dom";
import avatar_01 from "../../media/avatar-floor/avatar_01.png";
import avatar_02 from "../../media/avatar-floor/avatar_02.png";
import avatar_03 from "../../media/avatar-floor/avatar_03.png";
import avatar_04 from "../../media/avatar-floor/avatar_04.png";
import avatar_05 from "../../media/avatar-floor/avatar_05.png";
import avatar_06 from "../../media/avatar-floor/avatar_06.png";
import avatar_07 from "../../media/avatar-floor/avatar_07.png";
import avatar_08 from "../../media/avatar-floor/avatar_08.png";

const avatars = [
  avatar_01,
  avatar_02,
  avatar_03,
  avatar_04,
  avatar_05,
  avatar_06,
  avatar_07,
  avatar_08
];

function NavClient({ currentClient }) {
  const [avatarSrc, setAvatarSrc] = useState("");

  useEffect(() => {
    if (currentClient && currentClient.client_avatar) {
      setAvatarSrc(avatars[currentClient.client_avatar]);
    }
    console.log("dentro do nav cliente -> ", currentClient.client_avatar);
  }, [currentClient]);

  return (
    <nav
      className="
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
       lg:bg-[#eefff4]
        lg:shadow-lg
        lg:shadow-[#1b1b1b23] 
        flex-row
        flex
        lg:justify-center
        justify-start 
        items-center 
        gap-2 
        text-zinc-800 
        text-[12px]
        cursor-pointer"
    >
      <section
        className="
            lg:w-[97%] 
            w-full 
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
        <span className="text-[22px] font-bold lg:flex hidden">
          Bem vindo, {currentClient.nickname} !
        </span>

        <section className="flex flex-row justify-center items-center gap-6 ">
          <span>
            <NotificationsIcon />
          </span>
          <img
            src={avatarSrc}
            alt="foto-perfil"
            className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden object-cover"
          />
          <span className="font-semibold text-[18px] lg:flex hidden">
            {currentClient && currentClient.name}
          </span>
          <span className="lg:flex hidden">
            <ArrowDropDown />
          </span>
        </section>
      </section>
    </nav>
  );
}

export default NavClient;
