/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo_aukt from "../../media/logo_aukt.png";
import AppsIcon from "@mui/icons-material/Apps";
import {
  Dashboard,
  LocalAtm,
  Group,
  AccountBalanceWallet,
  Person,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function AssideAdmin(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const menuBtn = document.querySelector(`#${props.MenuSelected}`);
    if (menuBtn) {
      menuBtn.style.background =
        "linear-gradient(90deg, #4D5BD4 0.03%, #FC9F9F 99.17%)";
      menuBtn.style.borderRadius = "4px";
    }
  }, []);

  //console.log('observando props... ->>', props.MenuSelected);

  const navigate = useNavigate();

  function handleClick(route) {
    navigate(route);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Botão clicado!");
  };

  const handleVoltarClick = () => {
    setIsSidebarOpen(false);
  };
  const iconStyle = {
    fontSize: "64px",
  };
  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 text-[#141414] block cursor-pointer"
      >
        <AppsIcon style={{ fontSize: "40px" }} />
      </button>
      {isSidebarOpen ? (
        <nav className="bg-[#D8DEE8;] h-screen z-30 fixed top-0 p-4 w-full">
          <div className="bg-[#181818] rounded-md shadow-lg shadow-[#000000] h-full flex flex-col pt-[90px]">
            <div className="flex flex-wrap justify-center items-center gap-6 ">
              <button
                onClick={() => handleClick("/admin/dashboard")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Dashboard style={iconStyle} />
                <span className="mt-1 text-xs">Dashboard</span>
              </button>
              <button
                onClick={() => handleClick("/admin/aucts")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <LocalAtm style={iconStyle} />
                <span className="mt-1 text-xs">Leilões</span>
              </button>
              <button
                onClick={() => handleClick("/admin/advertisers")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Group style={iconStyle} />
                <span className="mt-1 text-xs">Anunciantes</span>
              </button>
              <button
                onClick={() => handleClick("/admin/clients")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Group style={iconStyle} />
                <span className="mt-1 text-xs">Clientes</span>
              </button>
              <button
                onClick={() => handleClick("/admin/profile")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Person style={iconStyle} />
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
                onClick={() => handleClick("/logout")}
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
        className={` lg:w-[253px] h-[100vh] lg:block hidden bg-[#161616] flex-col justify-start items-center gap-3`}
      >
        <img
          src={logo_aukt}
          alt="Logo-auk"
          className="w-[120px] object-cover"
        />
        <button
          id="menu-1"
          className="w-full flex justify-between items-center p-2 text-white mt-6"
          onClick={() => handleClick("/admin/dashboard")}
        >
          <Dashboard />
          <span>Dashboard</span>
        </button>
        <button
          id="menu-2"
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={() => handleClick("/admin/aucts")}
        >
          <LocalAtm />
          <span>Leilões</span>
        </button>
        <button
          id="menu-3"
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={() => handleClick("/admin/advertisers")}
        >
          <Group />
          <span>Anunciantes</span>
        </button>
        <button
          id="menu-4"
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={() => handleClick("/admin/clients")}
        >
          <Group />
          <span>Clientes</span>
        </button>
        <button
          id="menu-5"
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={() => handleClick("/admin/wallet")}
        >
          <AccountBalanceWallet />
          <span>Carteira</span>
        </button>

        <div className="w-full flex justify-start items-center p-2 text-zinc-300 mt-7">
          <span>Configuração e suporte</span>
        </div>

        <button
          id="menu-6"
          className="w-full flex justify-between items-center p-2 text-white mt-6"
          onClick={() => handleClick("/admin/profile")}
        >
          <Person />
          <span>Perfil</span>
        </button>
        <button
          id="menu-7"
          className="w-full flex justify-between items-center p-2 text-white"
        >
          <Logout />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default AssideAdmin;
