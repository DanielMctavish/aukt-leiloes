/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo_aukt_green from "../../media/logos/logos-auk/aukt_greengreen.png";
import AppsIcon from "@mui/icons-material/Apps";
import {
  Dashboard,
  LocalAtm,
  Group,
  AccountBalanceWallet,
  Person,
  Logout,
  Gavel,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function AssideClient(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const menuBtn = document.querySelector(`#${props.MenuSelected}`);
    if (menuBtn) {
      menuBtn.style.background =
        "linear-gradient(90deg, #136f49 0.03%, #82e1be 99.17%)";
      menuBtn.style.borderRadius = "4px";
    }
  }, []);

  //console.log('observando props... ->>', props.MenuSelected);


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

  const handleLogoutClient = () => {
    localStorage.removeItem('client-auk-session-login')
    navigate('/')
  }

  return (

    <div>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 text-[#141414] block cursor-pointer"
      >
        <AppsIcon style={{ fontSize: "40px" }} />
      </button>
      {isSidebarOpen ? (
        <nav className="bg-[#143514] h-screen z-30 fixed top-0 p-4 w-full">

          <div className="bg-[#143514] rounded-md shadow-lg shadow-[#000000] h-full flex flex-col pt-[90px]">
            <div className="flex flex-wrap justify-center items-center gap-6 ">

              <button
                id="menu-1"
                onClick={() => handleClick("/client/dashboard")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Dashboard style={iconStyle} />
                <span className="mt-1 text-xs">Dashboard</span>
              </button>

              <button
                id="menu-2"
                onClick={() => handleClick("/client/arremates")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <LocalAtm style={iconStyle} />
                <span className="mt-1 text-xs">Arremates</span>
              </button>

              <button
                id="menu-3"
                onClick={() => handleClick("/client/aucts")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Group style={iconStyle} />
                <span className="mt-1 text-xs">Leilões</span>
              </button>

              <button
                id="menu-4"
                onClick={() => handleClick("/admin/profile")}
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
              >
                <Person style={iconStyle} />
              </button>

              <button
                id="menu-5"
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
                onClick={() => handleClick("/client/wallet")}
              >
                <AccountBalanceWallet />
                <span>Carteira</span>
              </button>

              <button
                className="w-[80px] h-[80px] flex flex-col items-center p-2 text-white m-2"
                onClick={handleLogoutClient}
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
      {/* DESKTOP VERSION */}
      <nav
        className={` lg:w-[253px] h-[100vh] lg:block hidden bg-[#143514] flex-col justify-start items-center gap-3 p-1`}
      >
        <div className="w-full p-2 flex justify-center items-center">
          <img
            src={logo_aukt_green}
            alt="Logo-auk"
            onClick={() => navigate("/")}
            className="w-[100px] object-cover cursor-pointer"
          />
        </div>

        <button
          id="menu-1"
          className="w-full flex justify-between items-center p-2 text-white mt-6"
          onClick={() => handleClick("/client/dashboard")}
        >
          <Dashboard />
          <span>Dashboard</span>
        </button>

        <button
          id="menu-2"
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={() => handleClick("/client/auctioned")}
        >
          <LocalAtm />
          <span>Arremates</span>
        </button>

        <button
          id="menu-3"
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={() => handleClick("/client/bids")}
        >
          <Gavel />
          <span>Lances</span>
        </button>

        <button
          id="menu-4"
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={() => handleClick("/client/aucts")}
        >
          <Group />
          <span>Leilões</span>
        </button>

        <button
          id="menu-5"
          className="w-full flex justify-between items-center p-2 text-white"
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
          onClick={() => handleClick("/client/profile")}
        >
          <Person />
          <span>Perfil</span>
        </button>

        <button
          onClick={handleLogoutClient}
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

export default AssideClient;
