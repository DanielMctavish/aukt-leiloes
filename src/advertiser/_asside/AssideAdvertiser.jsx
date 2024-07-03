/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo_aukt_blue from "../../media/logos/logos-auk/aukt_blue.png";
import logo_auk_white from "../../media/logos/logos-auk/logo_model01_white.png"
import AppsIcon from "@mui/icons-material/Apps";
import { Leaderboard, Event, Gavel, Web } from "@mui/icons-material"
import {
  Dashboard,
  LocalAtm,
  Group,
  AccountBalanceWallet,
  Person,
  Logout,
  Gamepad
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function AssideAdvertiser(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const menuBtn = document.querySelector(`#${props.MenuSelected}`);
    if (menuBtn) {
      menuBtn.style.background = "linear-gradient(90deg, #4D5BD4 0.03%, #76D057 99.17%)";
      menuBtn.style.border = "solid 1px #bdc3fe4d"
      menuBtn.style.borderRadius = "4px";
    }
  }, [])

  //console.log('observando props... ->>', props.MenuSelected);

  const navigate = useNavigate();

  function handleClick(route) {
    navigate(route);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleVoltarClick = () => {
    setIsSidebarOpen(false);
  }

  const handleLogoutAdveriser = () => {
    localStorage.removeItem("advertiser-session-aukt")
    navigate("/")
  }

  const iconStyle = {
    fontSize: "64px",
  }

  return (
    <div className="flex">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 text-[#191F2F] block cursor-pointer"
      >
        <AppsIcon style={{ fontSize: "40px" }} />
      </button>
      {isSidebarOpen ? (
        <nav className="bg-[#D8DEE8;] h-screen z-30 fixed top-0 p-4 w-full">
          <div className="bg-[#012038] rounded-md shadow-lg shadow-[#000000] h-full flex flex-col pt-[90px]">
            <div className="flex flex-wrap justify-center items-center gap-6 ">

              <button
                onClick={() => handleClick("/advertiser/dashboard")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Dashboard style={iconStyle} />
                <span className="mt-1 text-xs">Dashboard</span>
              </button>

              <button
                onClick={() => handleClick("/admin/create-auct")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <LocalAtm style={iconStyle} />
                <span className="mt-1 text-xs">Criar Evento</span>
              </button>

              <button
                onClick={() => handleClick("/admin/advertisers")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Group style={iconStyle} />
                <span className="mt-1 text-xs">Leilões</span>
              </button>

              <button
                onClick={() => handleClick("/advertiser/auctions-controls")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Gamepad style={iconStyle} />
                <span className="mt-1 text-xs">Controles</span>
              </button>

              <button
                onClick={() => handleClick("/admin/advertisers")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Gavel style={iconStyle} />
                <span className="mt-1 text-xs">Arremates</span>
              </button>

              <button
                onClick={() => handleClick("/admin/clients")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Group style={iconStyle} />
                <span className="mt-1 text-xs">Clientes</span>
              </button>

              <button
                id="menu-5"
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
                onClick={() => handleClick("/admin/wallet")}
              >
                <AccountBalanceWallet />
                <span>Carteira</span>
              </button>

              <button
                id="menu-7"
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
                onClick={handleLogoutAdveriser}
              >
                <Logout style={iconStyle} />
                <span className="mt-1 text-xs">Logout</span>
              </button>

            </div>
            <div className="absolute bottom-6 left-6 mb-6 ml-7">
              <button
                onClick={handleVoltarClick}
                className="text-[#FFFFFF] text-[15px]"
              >
                Voltar
              </button>
            </div>
          </div>
        </nav>
      ) : null}
      <nav
        className={` lg:min-w-[273px] h-[100vh] lg:block hidden bg-[#012038] flex-col justify-start items-center gap-3 p-2`}
      >
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
          onClick={() => handleClick("/advertiser/auctions")}
        >
          <Gavel />
          <span>Arremates</span>
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

  );
}

export default AssideAdvertiser;
