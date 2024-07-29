/* eslint-disable react/prop-types */
import { ArrowDropDown } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useRef, useState } from "react";
import { getAdvertiserInformations } from "../functions/GetAdvertiserInformations";
import "../styles/AdvertiserStyle.css"

function NavAdvertiser({ path }) {
  const [AdvertiserInfor, setAdvertiserInfor] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("dark-mode-advertiser-auct");
    return savedMode === "true"; 
  });

  const refNav = useRef()

  useEffect(() => {
    getAdvertiserInformations(setAdvertiserInfor);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      refNav.current.style.transition = "1s"
      refNav.current.style.background = "#535353"
      refNav.current.style.color = "#e0e0e0"
      localStorage.setItem("dark-mode-advertiser-auct", "true");
    } else {
      document.documentElement.classList.remove('dark');
      refNav.current.style.background = "#ffffff"
      refNav.current.style.color = "#2b2b2b"
      localStorage.setItem("dark-mode-advertiser-auct", "false");
    }
  }, [darkMode]);

  return (
    <nav className="
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
        cursor-pointer"
      ref={refNav}
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
          <span className="text-[22px] font-bold lg:flex hidden">
            Bem vindo, {AdvertiserInfor.name}!
          </span>

          <span className="text-[22px]  font-bold lg:flex hidden">
            {AdvertiserInfor.nano_id}
          </span>
        </div>

        <span className="flex text-[12px]">
          {path}
        </span>

        <div className="flex items-center">
          <span className="mr-2">Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <section className="flex flex-row justify-center items-center gap-6">
          <span>
            <NotificationsIcon  />
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
