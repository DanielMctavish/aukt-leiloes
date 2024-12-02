/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { ArrowDropDown, Logout, Person } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAdvertiserInformations } from "../functions/GetAdvertiserInformations";
import "../styles/AdvertiserStyle.css"

function NavAdvertiser({ path }) {
  const [AdvertiserInfor, setAdvertiserInfor] = useState({});
  const [contextMenu, setContextMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAdvertiserInformations(setAdvertiserInfor);
  }, []);

  useEffect(() => {
    // Fechar menu ao clicar fora
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = () => {
    setContextMenu(!contextMenu);
  };

  const handleLogout = () => {
    // Limpar o localStorage
    localStorage.removeItem('advertiser-session-aukt');
    // Redirecionar para a página de login
    navigate('/');
  };

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
          <div className="relative" ref={menuRef}>
            <div 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={handleContextMenu}
            >
              <img
                src={AdvertiserInfor.url_profile_cover}
                alt="foto-perfil"
                className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden object-cover"
              />
              <span className="font-semibold text-[18px] lg:flex hidden">
                {AdvertiserInfor.name}
              </span>
              <ArrowDropDown className={`transition-transform duration-200 ${contextMenu ? 'rotate-180' : ''}`} />
            </div>

            {contextMenu && (
              <div className="absolute right-0 top-full mt-2 w-[250px] bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{AdvertiserInfor.name}</p>
                  <p className="text-sm text-gray-500">{AdvertiserInfor.email}</p>
                </div>
                
                <div className="py-1">
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => navigate('/advertiser/profile')}
                  >
                    <Person className="text-gray-400" />
                    Perfil
                  </button>
                  
                  {/* <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => navigate('/advertiser/settings')}
                  >
                    <Settings className="text-gray-400" />
                    Configurações
                  </button> */}
                </div>

                <div className="border-t border-gray-100">
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <Logout className="text-red-400" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

    </nav>
  );
}

export default NavAdvertiser;
