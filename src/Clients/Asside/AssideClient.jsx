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
  { id: "menu-2", icon: <LocalAtm />, label: "Arremates", route: "/client/arremates" },
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
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 text-[#141414] focus:outline-none"
      >
        <AppsIcon style={{ fontSize: "40px" }} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-[100vh] bg-[#143514] text-white w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static lg:w-64`}
      >
        {/* Close Button for Mobile */}
        <div className="flex justify-end lg:hidden p-4">
          <button onClick={toggleSidebar} className="focus:outline-none">
            ✕
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center mb-8">
          <img
            src={logo_aukt_green}
            alt="Logo-auk"
            onClick={() => navigate("/")}
            className="w-[100px] object-cover cursor-pointer"
          />
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                id={item.id}
                onClick={() => handleClick(item.route)}
                className={`flex items-center space-x-3 p-2 rounded-md w-full hover:bg-[#1dad24] transition-colors duration-200 ${
                  MenuSelected === item.id ? "bg-[#1dad24]" : ""
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default AssideClient;
