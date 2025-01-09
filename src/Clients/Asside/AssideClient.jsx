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

const menuItems = [
  { id: "menu-1", icon: <Dashboard />, label: "Dashboard", route: "/client/dashboard" },
  { id: "menu-2", icon: <LocalAtm />, label: "Lances", route: "/client/bids" }, // Restaurado "Lances"
  { id: "menu-3", icon: <Group />, label: "Leilões", route: "/client/aucts" },
  { id: "menu-8", icon: <Gavel />, label: "Cartelas", route: "/client/cartelas" },
  { id: "menu-5", icon: <AccountBalanceWallet />, label: "Carteira", route: "/client/wallet" },
  { id: "menu-6", icon: <Person />, label: "Perfil", route: "/client/profile" },
  { id: "menu-7", icon: <Logout />, label: "Logout", route: "/logout" },
];

function AssideClient({ MenuSelected }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Highlight the selected menu item
    if (MenuSelected) {
      const menuBtn = document.getElementById(MenuSelected);
      if (menuBtn) {
        menuBtn.style.background =
          "linear-gradient(90deg, #136f49 0.03%, #82e1be 99.17%)";
        menuBtn.style.borderRadius = "4px";
      }
    }
  }, [MenuSelected]);

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogoutClient();
    } else {
      navigate(route);
      setIsSidebarOpen(false); // Close sidebar on navigation (for mobile)
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg 
          bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white 
          transition-colors duration-200"
      >
        <AppsIcon className="text-gray-800" style={{ fontSize: "28px" }} />
      </button>

      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-screen w-72 
        bg-gradient-to-b from-[#143514] to-[#1c4a1c]
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
        z-50 lg:translate-x-0 lg:relative lg:w-72
        flex flex-col shadow-xl
      `}>
        {/* Botão Fechar Mobile */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 right-4 text-white/80 
            hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center items-center h-24 border-b border-white/10">
          <img
            src={logo_aukt_green}
            alt="Logo-auk"
            onClick={() => navigate("/")}
            className="w-32 object-contain cursor-pointer 
              hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  id={item.id}
                  onClick={() => handleClick(item.route)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 
                    rounded-xl transition-all duration-200
                    ${MenuSelected === item.id 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                      : 'text-gray-300 hover:bg-white/10'}
                  `}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-center text-white/60">
            © 2024 AUKT. Todos os direitos reservados
          </p>
        </div>
      </nav>
    </div>
  );
}

export default AssideClient;
