/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo_aukt_green from "../../media/logos/logos-auk/aukt_greengreen.png";
import { 
  Dashboard, 
  LocalAtm, 
  AccountBalanceWallet, 
  Person, 
  Logout, 
  Gavel, 
  Timeline, 
  Menu as MenuIcon,
  Close 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: "menu-1", icon: <Dashboard />, label: "Dashboard", route: "/client/dashboard" },
  { id: "menu-2", icon: <LocalAtm />, label: "Lances", route: "/client/bids" },
  { id: "menu-3", icon: <Timeline />, label: "Minha Jornada", route: "/client/aucts" },
  { id: "menu-8", icon: <Gavel />, label: "Cartelas", route: "/client/cartelas" },
  { id: "menu-5", icon: <AccountBalanceWallet />, label: "Carteira", route: "/client/wallet" },
  { id: "menu-6", icon: <Person />, label: "Perfil", route: "/client/profile" },
  { id: "menu-7", icon: <Logout />, label: "Logout", route: "/logout" },
];

function AssideClient({ MenuSelected }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Fechar sidebar ao clicar fora (para dispositivos móveis)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isSidebarOpen && e.target.closest('.sidebar') === null) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSidebarOpen]);

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogoutClient();
    } else {
      navigate(route);
      setIsSidebarOpen(false); // Fechar sidebar ao navegar (para mobile)
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClient = () => {
    localStorage.removeItem("client-auk-session-login");
    navigate("/");
  };

  return (
    <div className="flex">
      {/* Botão Toggle Mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full
          bg-white shadow-lg hover:bg-gray-50
          transition-all duration-200 active:scale-95"
        aria-label="Menu"
      >
        <MenuIcon className="text-green-600" style={{ fontSize: "24px" }} />
      </button>

      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        sidebar
        fixed top-0 left-0 h-screen w-[280px]
        bg-gradient-to-b from-[#0e3a1a] via-[#144b26] to-[#144b26]
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-all duration-300 ease-out
        z-50 lg:translate-x-0 lg:relative lg:w-72
        flex flex-col shadow-xl
      `}>
        {/* Botão Fechar Mobile */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 right-4 text-white/80 
            p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Fechar menu"
        >
          <Close fontSize="small" />
        </button>

        {/* Logo */}
        <div className="flex justify-center items-center h-24 border-b border-white/10 backdrop-blur-sm bg-black/5">
          <img
            src={logo_aukt_green}
            alt="Logo Aukt"
            onClick={() => navigate("/")}
            className="w-24 lg:w-32 object-contain cursor-pointer 
              hover:scale-105 transition-transform duration-200 drop-shadow-md"
          />
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  id={item.id}
                  onClick={() => handleClick(item.route)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 
                    rounded-xl transition-all duration-200
                    ${MenuSelected === item.id 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md' 
                      : 'text-gray-200 hover:bg-white/10'}
                    active:scale-[0.98]
                  `}
                >
                  <span className="text-[22px]">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                  
                  {/* Indicador de menu ativo */}
                  {MenuSelected === item.id && (
                    <span className="ml-auto w-1.5 h-6 rounded-full bg-white/80"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-xs text-white/80">
              Conectado
            </p>
          </div>
          <p className="text-xs text-center text-white/60">
            © 2024 AUKT. Todos os direitos reservados
          </p>
        </div>
      </nav>

      {/* Estilos CSS para a scrollbar personalizada */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.25);
          }
        `}
      </style>
    </div>
  );
}

export default AssideClient;
