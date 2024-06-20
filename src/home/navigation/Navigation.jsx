import {
  Home,
  Help,
  People,
  EventAvailable,
  Category,
  AccountCircle,
  Menu,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import hammer from "../../media/icons/Hammer.png"
import logoAuk from "../../media/logos/logos-auk/aukt_blue.png"

function Navigation() {
  const [navigationMenu, setNavigationMenu] = useState(false);
  const navigate = useNavigate()

  const tailwindItems = "flex justify-center items-center p-2 gap-3";

  const hideNavigation = () => {
    const navigationAuk = document.querySelector(".nav-auk");

    if (!navigationMenu) {
      navigationAuk.style.marginLeft = "-40vh";
      navigationAuk.style.transition = ".6s";
      setNavigationMenu(!navigationMenu);
    } else {
      navigationAuk.style.marginLeft = "0vh";
      navigationAuk.style.transition = ".2s";
      setNavigationMenu(!navigationMenu);
    }
  };

  const handleClientAccess = () => {
    navigate("/client/login")
  }

  return (
    <nav
      className="
        lg:ml-0
        ml-[-40vh]
        nav-auk
        lg:left-auto
        left-0
        lg:relative
        fixed
        lg:w-full
        w-[220px] 
        lg:h-[48px]
        h-[100vh] 
        bg-[#012038] 
        lg:flex-col
        flex-row
        lg:flex
        sm:justify-center
        lg:justify-start 
        sm:items-center 
        gap-2 
        text-white 
        text-[12px]
        cursor-pointer
        z-30"
    >
      <span
        style={{ fontSize: "26px" }}
        className="flex 
            fixed 
            top-1 
            right-1 
            lg:hidden 
            text-[#012038] 
            bg-white 
            p-2 
            rounded-md 
            z-40 
            w-[44px] 
            h-[44px] 
            justify-center
            items-center"
        onClick={hideNavigation}
      >
        <Menu />
      </span>

      <div
        className="
            lg:w-[80%] 
            w-full 
            lg:h-[48px]
            h-[100vh] 
            flex 
            flex-col 
            lg:flex-row 
            justify-between 
            items-center"
      >
        <section
          className="
                lg:mt-0
                mt-[8vh]
                h-[42px] 
                lg:w-[60%]
                w-full
                lg:flex-row
                flex-col
                flex 
                justify-between 
                items-center 
                gap-2 
                text-white"
        >
          <div className="flex items-center sm:ml-[-120px] sm:mr-[100px]">
            <img src={logoAuk} alt="" className="w-[60px] object-cover"/>
          </div>
          <button className={tailwindItems}>
            <Home />
            HOME
          </button>
          <button className={tailwindItems}>
            <People />
            QUEM SOMOS
          </button>
          <button className={tailwindItems}>
            <Help />
            AJUDA
          </button>
          <button className={tailwindItems}>
            <EventAvailable />
            AGENDA
          </button>
          <button className={tailwindItems}>
            <Category />
            PRODUTOS
          </button>
        </section>

        <section className="flex gap-2 justify-center items-center">
          <span className="w-[30px] h-[30px]" onClick={() => navigate("/floor")}>
            <img src={hammer} alt="hammer" className="w-[30px] object-cover" />
          </span>
          <button
            onClick={handleClientAccess}
            className={tailwindItems}>
            <AccountCircle />
            entrar
          </button>
        </section>
      </div>
    </nav>
  );
}

export default Navigation;
