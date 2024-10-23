/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo_aukt from "../../media/logos/logos-auk/logo_admin.png";
import AppsIcon from "@mui/icons-material/Apps";
import {
  Dashboard,
  LocalAtm,
  Group,
  AccountBalanceWallet,
  Person,
  Logout,
  Receipt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function AssideAdmin({ MenuSelected }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const menuBtn = document.querySelector(`#${MenuSelected}`);
    if (menuBtn) {
      menuBtn.style.background = "linear-gradient(90deg, #283394 0.03%, #15cb5b 99.17%)";
      menuBtn.style.borderRadius = "4px";
    }
  }, [MenuSelected]);

  const handleClick = (route) => {
    navigate(route);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('auct-admin-session');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: "menu-1", icon: Dashboard, text: "Dashboard", route: "/admin" },
    { id: "menu-2", icon: LocalAtm, text: "Leilões", route: "/admin/aucts" },
    { id: "menu-3", icon: Group, text: "Anunciantes", route: "/admin/advertisers" },
    { id: "menu-5", icon: AccountBalanceWallet, text: "Carteira", route: "/admin/wallet" },
    { id: "menu-6", icon: Person, text: "Perfil", route: "/admin/profile" },
    { id: "menu-transactions", icon: Receipt, text: "Transações", route: "/admin/transactions" },
    { id: "menu-7", icon: Logout, text: "Logout", onClick: handleLogoutAdmin },
  ];

  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => (
        <button
          key={item.id}
          id={item.id}
          className="w-full flex justify-between items-center p-2 text-white"
          onClick={item.onClick || (() => handleClick(item.route))}
        >
          <item.icon />
          <span>{item.text}</span>
        </button>
      ))}
    </>
  );

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 text-[#141414] block cursor-pointer"
      >
        <AppsIcon style={{ fontSize: "40px" }} />
      </button>

      <nav className={`
        ${isSidebarOpen ? 'fixed inset-0 z-30' : 'hidden lg:block'}
        lg:w-[253px] h-[100vh] bg-[#161616] flex flex-col justify-start items-center gap-3 p-2
      `}>
        <div className="flex justify-center items-center w-full">
          <img
            onClick={() => navigate("/")}
            src={logo_aukt}
            alt="Logo-auk"
            className="w-[90px] object-cover cursor-pointer"
          />
        </div>
        
        {renderMenuItems()}

        {isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute bottom-6 left-6 text-white text-[15px]"
          >
            Voltar
          </button>
        )}
      </nav>
    </>
  );
}

export default AssideAdmin;
