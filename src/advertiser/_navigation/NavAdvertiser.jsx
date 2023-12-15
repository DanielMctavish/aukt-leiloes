import {  ArrowDropDown } from "@mui/icons-material";
import UserInfor from "../data/userInfor";
//import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";

function NavAdvertiser() {
 // const [navigationMenu, setNavigationMenu] = useState(false);

  //const tailwindItems = "flex justify-center items-center p-2 gap-3"

  // const hideNavigation = () => {
  //   const navigationAuk = document.querySelector(".nav-auk");

  //   if (!navigationMenu) {
  //     navigationAuk.style.marginLeft = "-40vh";
  //     navigationAuk.style.transition = ".6s";
  //     setNavigationMenu(!navigationMenu);
  //   } else {
  //     navigationAuk.style.marginLeft = "0vh";
  //     navigationAuk.style.transition = ".2s";
  //     setNavigationMenu(!navigationMenu);
  //   }
  // };

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
       lg:bg-[#FFFFFF]
        lg:shadow-lg
        lg:shadow-[#1b1b1b23] 
        flex-row
        flex
        lg:justify-center
        justify-start 
        items-center 
        gap-2 
        text-white 
        text-[12px]
        cursor-pointer"
    >
      {UserInfor.map((auction, index) => (
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
          key={index}
        >
          <span className="text-[22px] text-zinc-600 font-bold lg:flex hidden">
            Bem vindo, {auction.firtName}!
          </span>

          <section className="flex flex-row justify-center items-center gap-6 text-zinc-600">
            <span>
              <NotificationsIcon className="text-[#012038]" />
            </span>
            <img
              src={auction.imagem}
              alt="foto-perfil"
              className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden object-cover"
            />
            <span className="text-[#012038] font-semibold text-[18px] lg:flex hidden">
              {auction.firtName}
            </span>
            <span className="lg:flex hidden">
              <ArrowDropDown />
            </span>
          </section>
        </section>
      ))}
    </nav>
  );
}

export default NavAdvertiser;

