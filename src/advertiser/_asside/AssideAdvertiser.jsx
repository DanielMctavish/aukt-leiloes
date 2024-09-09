/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import logo_aukt_blue from "../../media/logos/logos-auk/aukt_blue.png";
import logo_auk_white from "../../media/logos/logos-auk/logo_model01_white.png"
import { Leaderboard, Event, Gavel, Web, Visibility } from "@mui/icons-material"
import {
  Group,
  AccountBalanceWallet,
  Person,
  Logout,
  Gamepad
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function AssideAdvertiser(props) {
  const [desktopMenuVisible, setDesktopMenuVisible] = useState(true)
  const [intervalMouse, setIntervalMouse] = useState(null)

  const menuDesktopRef = useRef()

  useEffect(() => {
    const menuBtn = document.querySelector(`#${props.MenuSelected}`);
    if (menuBtn) {
      menuBtn.style.background = "linear-gradient(90deg, #4D5BD4 0.03%, #76D057 99.17%)";
      menuBtn.style.border = "solid 1px #bdc3fe4d"
      menuBtn.style.borderRadius = "4px";
    }
  }, [])

  const navigate = useNavigate();

  function handleClick(route) {
    navigate(route);
  }

  const handleLogoutAdveriser = () => {
    localStorage.removeItem("advertiser-session-aukt")
    navigate("/")
  }

  const handleMouseLeave = () => {
    const interval = setTimeout(() => {
      setDesktopMenuVisible(false)
    }, 200);
    setIntervalMouse(interval)
  }

  const handleMouseEnter = () => {
    clearInterval(intervalMouse)
  }

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setDesktopMenuVisible(false)
      }
    })
  }, [])

  return (

    <>
      <span onClick={() => setDesktopMenuVisible(!desktopMenuVisible)}
        className={`fixed z-[9999] bg-[#fff] hover:bg-[#e4e4e4d4] hover:w-[60px] hover:h-[60px] top-1 left-1 cursor-pointer rounded-[12px] 
        ${desktopMenuVisible ? 'hidden w-[60px] h-[60px]' : 'flex w-[40px] h-[40px]'} transition-all duration-[.3s]
        justify-center items-center shadow-lg shadow-[#0b0b0b18]`}>

        <img src={logo_aukt_blue} alt="" className="w-[30px] h-[30px] object-cover" />

      </span>
      <div className={`flex h-[100vh] fixed left-0 z-[999] lg:w-auto w-[100%] 
    transition-all duration-[1s] ${desktopMenuVisible ? 'ml-0' : 'ml-[-200px]'}`}>



        <nav
          ref={menuDesktopRef}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className={`lg:min-w-[273px] w-[70%] h-[100%] lg:block bg-[#012038eb] transition-all duration-[0.6s] 
          ${desktopMenuVisible ? 'flex ml-[0px]' : 'hidden ml-[-300px]'} 
          flex-col justify-start items-center gap-3 p-2 relative backdrop-blur-[12px]`}
        >

          <span onClick={() => setDesktopMenuVisible(!desktopMenuVisible)}
            className="absolute text-white top-1 right-1 cursor-pointer">
            <Visibility />
          </span>

          <section className="w-full flex justify-center items-center p-2">
            <img
              src={logo_aukt_blue}
              alt="Logo-auk"
              className="w-[100px] object-cover cursor-pointer hover:brightness-[1.2]"
              onClick={() => { navigate("/") }}
            />
          </section>

          <button
            id="menu-1"
            className="w-full flex justify-between items-center p-2 text-white mt-6 border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
            onClick={() => handleClick("/advertiser/dashboard")}
          >
            <Leaderboard />
            <span>Dashboard</span>
          </button>

          <button
            id="menu-2"
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
            onClick={() => handleClick("/advertiser/create-auct")}
          >
            <Event />
            <span>Criar Evento</span>
          </button>

          <button
            id="menu-3"
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md relative"
            onClick={() => handleClick("/advertiser/auctions")}
          >
            <img src={logo_auk_white} alt="" className="object-cover w-[40px] ml-[-10px]" />
            <span>Leilões</span>
          </button>

          <button
            id="menu-4"
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md relative"
            onClick={() => handleClick("/advertiser/auctions-controls")}
          >
            <Gamepad />
            <span>Controles</span>
          </button>

          <button
            id="menu-5"
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
            onClick={() => handleClick("/advertiser/arrematantes")}
          >
            <Gavel />
            <span>Arrematantes</span>
          </button>

          <button
            id="menu-6"
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
            onClick={() => handleClick("/advertiser/clients")}
          >
            <Group />
            <span>Clientes</span>
          </button>

          <button
            id="menu-7"
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
            onClick={() => handleClick("/advertiser/wallet")}
          >
            <AccountBalanceWallet />
            <span>Carteira</span>
          </button>

          <button
            id="menu-8"
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
            onClick={() => handleClick("/advertiser/templates")}
          >
            <Web />
            <span>Site e template</span>
          </button>

          <div className="w-full flex justify-start items-center p-2 text-zinc-300 mt-7 ">
            <span>Configuração e suporte</span>
          </div>

          <button
            id="menu-9"
            className="w-full flex justify-between items-center p-2 text-white mt-6 border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
            onClick={() => handleClick("/advertiser/profile")}
          >
            <Person />
            <span>Perfil</span>
          </button>

          <button
            id="menu-10"
            onClick={handleLogoutAdveriser}
            className="w-full flex justify-between items-center p-2 text-white border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] transition-all rounded-md"
          >
            <Logout />
            <span>Logout</span>
          </button>

        </nav>
      </div>
    </>

  );
}

export default AssideAdvertiser;
