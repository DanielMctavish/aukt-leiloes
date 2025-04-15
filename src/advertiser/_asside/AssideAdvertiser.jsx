/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import logo_aukt_blue from "../../media/logos/logos-auk/aukt_blue.png";
import logo_auk_white from "../../media/logos/logos-auk/logo_model01_white.png"
import { Leaderboard, Event, Gavel, Web, Visibility, Close as CloseIcon } from "@mui/icons-material"
import {
  Group,
  AccountBalanceWallet,
  Person,
  Logout,
  Gamepad,
  Receipt,
  Menu as MenuIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function AssideAdvertiser(props) {
  const [desktopMenuVisible, setDesktopMenuVisible] = useState(false)
  const [intervalMouse, setIntervalMouse] = useState(null)
  const [advertiserId, setAdvertiserId] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)

  const menuDesktopRef = useRef()
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const menuBtn = document.querySelector(`#${props.MenuSelected}`);
    if (menuBtn) {
      menuBtn.style.background = "linear-gradient(90deg, #4D5BD4 0.03%, #76D057 99.17%)";
      menuBtn.style.border = "solid 1px #bdc3fe4d"
      menuBtn.style.borderRadius = "4px";
    }

    const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'))
    if (currentLocalAdvertiser) {
      verifyAdvertiserSession(currentLocalAdvertiser)
    } else {
      navigate('/advertiser/login')
    }
  }, [])

  const verifyAdvertiserSession = async (currentLocalAdvertiser) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentLocalAdvertiser.email}`, {
        headers: {
          'Authorization': `Bearer ${currentLocalAdvertiser.token}`
        }
      })
      setAdvertiserId(response.data.id)
    } catch (err) {
      console.error('Erro ao verificar sessão do anunciante:', err.response)
      localStorage.removeItem('advertiser-session-aukt')
      navigate('/advertiser/login')
    }
  }

  function handleClick(route) {
    if (route === "/advertiser/templates" && advertiserId) {
      navigate(`/advertiser/templates/${advertiserId}`);
    } else {
      navigate(route);
    }
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
      <button 
        onClick={() => setDesktopMenuVisible(!desktopMenuVisible)}
        className={`fixed z-[999] bg-[#fff] hover:bg-[#e4e4e4d4] 
          ${isMobile ? 'w-[50px] h-[50px]' : 'hover:w-[60px] hover:h-[60px]'} 
          mt-[1vh] top-1 left-1 cursor-pointer rounded-[12px] 
          ${desktopMenuVisible ? 'hidden' : 'flex'} 
          ${isMobile ? 'w-[50px] h-[50px]' : 'w-[40px] h-[40px]'}
          transition-all duration-[.3s]
          justify-center items-center shadow-lg shadow-[#0b0b0b18]`}>
        {isMobile ? (
          <MenuIcon className="text-[#012038] w-6 h-6" />
        ) : (
          <img src={logo_aukt_blue} alt="Menu" className="w-[30px] h-[30px] object-cover" />
        )}
      </button>

      {isMobile && desktopMenuVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setDesktopMenuVisible(false)}
        />
      )}

      <div className={`flex h-[100vh] fixed left-0 z-[999] lg:w-auto w-[100%] 
        transition-all duration-[.3s] ${desktopMenuVisible ? 'ml-0' : 'ml-[-100%]'}`}>

        <nav
          ref={menuDesktopRef}
          onMouseLeave={isMobile ? null : handleMouseLeave}
          onMouseEnter={isMobile ? null : handleMouseEnter}
          className={`lg:min-w-[273px] fixed z-[999] w-[85%] h-[100%] lg:block 
            bg-[#012038eb] transition-all duration-[0.3s] 
            ${desktopMenuVisible ? 'flex translate-x-0' : 'translate-x-[-100%]'} 
            flex-col justify-start items-center gap-3 p-2 relative backdrop-blur-[12px]`}
        >
          {isMobile && (
            <button 
              onClick={() => setDesktopMenuVisible(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          )}

          {!isMobile && (
            <span onClick={() => setDesktopMenuVisible(!desktopMenuVisible)}
              className="absolute text-white top-1 right-1 cursor-pointer">
              <Visibility />
            </span>
          )}

          <section className="w-full flex justify-center items-center p-2 mt-4">
            <img
              src={logo_aukt_blue}
              alt="Logo-auk"
              className="w-[100px] object-cover cursor-pointer hover:brightness-[1.2]"
              onClick={() => { 
                navigate("/")
                isMobile && setDesktopMenuVisible(false)
              }}
            />
          </section>

          <div className="w-full flex flex-col gap-2 mt-6">
            {[
              { id: "menu-1", icon: <Leaderboard />, text: "Dashboard", route: "/advertiser/dashboard" },
              { id: "menu-2", icon: <Event />, text: "Criar Evento", route: "/advertiser/create-auct" },
              { id: "menu-3", icon: <img src={logo_auk_white} alt="" className="object-cover w-[40px] ml-[-10px]" />, text: "Leilões", route: "/advertiser/auctions" },
              { id: "menu-4", icon: <Gamepad />, text: "Controles", route: "/advertiser/auctions-controls" },
              { id: "menu-5", icon: <Gavel />, text: "Arrematantes", route: "/advertiser/arrematantes" },
              { id: "menu-6", icon: <Group />, text: "Clientes", route: "/advertiser/clients" },
              { id: "menu-7", icon: <AccountBalanceWallet />, text: "Carteira", route: "/advertiser/wallet" },
              { id: "menu-11", icon: <Receipt />, text: "Transações", route: "/advertiser/transactions" },
              { id: "menu-8", icon: <Web />, text: "Site e template", route: "/advertiser/templates" }
            ].map((item) => (
              <button
                key={item.id}
                id={item.id}
                className="w-full flex justify-between items-center p-3 text-white 
                  border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] 
                  transition-all rounded-md active:bg-white/20"
                onClick={() => {
                  if (item.route === "/advertiser/templates" && advertiserId) {
                    navigate(`/advertiser/templates/${advertiserId}`);
                  } else {
                    navigate(item.route);
                  }
                  isMobile && setDesktopMenuVisible(false);
                }}
              >
                {item.icon}
                <span className="flex-1 text-left ml-3">{item.text}</span>
              </button>
            ))}
          </div>

          <div className="w-full flex justify-start items-center p-2 text-zinc-300 mt-7">
            <span>Configuração e suporte</span>
          </div>

          <button
            id="menu-9"
            className="w-full flex justify-between items-center p-3 text-white 
              border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] 
              transition-all rounded-md active:bg-white/20"
            onClick={() => {
              handleClick("/advertiser/profile")
              isMobile && setDesktopMenuVisible(false)
            }}
          >
            <Person />
            <span className="flex-1 text-left ml-3">Perfil</span>
          </button>

          <button
            id="menu-10"
            onClick={() => {
              handleLogoutAdveriser()
              isMobile && setDesktopMenuVisible(false)
            }}
            className="w-full flex justify-between items-center p-3 text-white 
              border-[1px] border-[#ffffff09] hover:border-[#ffffff8a] 
              transition-all rounded-md active:bg-white/20"
          >
            <Logout />
            <span className="flex-1 text-left ml-3">Logout</span>
          </button>

        </nav>
      </div>
    </>
  );
}

export default AssideAdvertiser;
