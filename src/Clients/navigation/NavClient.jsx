/* eslint-disable react/prop-types */
import { ArrowDropDown, NotificationsNone, Settings, AccountBalanceWallet, Logout, Gavel } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//avatares import
import avatar_01 from "../../media/avatar-floor/avatar_01.png";
import avatar_02 from "../../media/avatar-floor/avatar_02.png";
import avatar_03 from "../../media/avatar-floor/avatar_03.png";
import avatar_04 from "../../media/avatar-floor/avatar_04.png";
import avatar_05 from "../../media/avatar-floor/avatar_05.png";
import avatar_06 from "../../media/avatar-floor/avatar_06.png";
import avatar_07 from "../../media/avatar-floor/avatar_07.png";
import avatar_08 from "../../media/avatar-floor/avatar_08.png";
import avatar_09 from "../../media/avatar-floor/Avatar_09.png";
import avatar_10 from "../../media/avatar-floor/Avatar_10.png";
import avatar_11 from "../../media/avatar-floor/Avatar_11.png";
import avatar_12 from "../../media/avatar-floor/Avatar_12.png";
import avatar_13 from "../../media/avatar-floor/Avatar_13.png";
import avatar_14 from "../../media/avatar-floor/Avatar_14.png";
import avatar_15 from "../../media/avatar-floor/Avatar_15.png";
import avatar_16 from "../../media/avatar-floor/Avatar_16.png";
import avatar_17 from "../../media/avatar-floor/Avatar_17.png";
import avatar_18 from "../../media/avatar-floor/Avatar_18.png";
import avatar_19 from "../../media/avatar-floor/Avatar_19.png";
import avatar_20 from "../../media/avatar-floor/Avatar_20.png";
import avatar_21 from "../../media/avatar-floor/Avatar_21.png";
import avatar_22 from "../../media/avatar-floor/Avatar_22.png";
import avatar_23 from "../../media/avatar-floor/Avatar_23.png";
import avatar_24 from "../../media/avatar-floor/Avatar_24.png";
import avatar_25 from "../../media/avatar-floor/Avatar_25.png";
import avatar_26 from "../../media/avatar-floor/Avatar_26.png";
import avatar_27 from "../../media/avatar-floor/Avatar_27.png";
import avatar_28 from "../../media/avatar-floor/Avatar_28.png";
import avatar_29 from "../../media/avatar-floor/Avatar_29.png";
import avatar_30 from "../../media/avatar-floor/Avatar_30.png";
import avatar_31 from "../../media/avatar-floor/Avatar_31.png";
import avatar_32 from "../../media/avatar-floor/Avatar_32.png";
import avatar_33 from "../../media/avatar-floor/Avatar_33.png";
import avatar_34 from "../../media/avatar-floor/Avatar_34.png";
import avatar_35 from "../../media/avatar-floor/Avatar_35.png";
import avatar_36 from "../../media/avatar-floor/Avatar_36.png";
import avatar_37 from "../../media/avatar-floor/Avatar_37.png";
import avatar_38 from "../../media/avatar-floor/Avatar_38.png";
import avatar_39 from "../../media/avatar-floor/Avatar_39.png";
import avatar_40 from "../../media/avatar-floor/Avatar_40.png";
import avatar_41 from "../../media/avatar-floor/Avatar_41.png";
import avatar_42 from "../../media/avatar-floor/Avatar_42.png";
import avatar_43 from "../../media/avatar-floor/Avatar_43.png";
import avatar_44 from "../../media/avatar-floor/Avatar_44.png";
import avatar_45 from "../../media/avatar-floor/Avatar_45.png";
import avatar_46 from "../../media/avatar-floor/Avatar_46.png";
import avatar_47 from "../../media/avatar-floor/Avatar_47.png";
import avatar_48 from "../../media/avatar-floor/Avatar_48.png";
import avatar_49 from "../../media/avatar-floor/Avatar_49.png";
import avatar_50 from "../../media/avatar-floor/Avatar_50.png";
import avatar_51 from "../../media/avatar-floor/Avatar_51.png";
import avatar_52 from "../../media/avatar-floor/Avatar_52.png";
import avatar_53 from "../../media/avatar-floor/Avatar_53.png";
import avatar_54 from "../../media/avatar-floor/Avatar_54.png";
import avatar_55 from "../../media/avatar-floor/Avatar_55.png";
import avatar_56 from "../../media/avatar-floor/Avatar_56.png";
import avatar_57 from "../../media/avatar-floor/Avatar_57.png";
import avatar_58 from "../../media/avatar-floor/Avatar_58.png";

const avatares_pessoas = [
    avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08,
    avatar_09, avatar_10, avatar_11, avatar_12, avatar_13, avatar_14, avatar_15, avatar_16,
    avatar_17, avatar_18, avatar_19, avatar_20, avatar_21, avatar_22, avatar_23, avatar_24,
    avatar_25, avatar_26, avatar_27, avatar_28, avatar_29, avatar_30, avatar_31, avatar_32,
    avatar_33, avatar_34, avatar_35, avatar_36, avatar_37, avatar_38, avatar_39, avatar_40,
    avatar_41, avatar_42, avatar_43, avatar_44, avatar_45, avatar_46, avatar_47, avatar_48,
    avatar_49, avatar_50, avatar_51, avatar_52, avatar_53, avatar_54, avatar_55, avatar_56,
    avatar_57, avatar_58
];

function NavClient({ currentClient }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-4 py-2">
            <div className="flex items-center justify-between">
                {/* Boas-vindas - Visível apenas em Desktop */}
                <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
                    Bem vindo, <span className="text-green-600">{currentClient?.nickname}</span>!
                </h1>

                {/* Container direito */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* Botão de Notificações */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <NotificationsNone className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <button onClick={()=>navigate("/floor/hub")} className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Gavel className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Botão de Configurações */}
                    <button 
                        onClick={() => navigate('/client/profile')}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors hidden md:block"
                    >
                        <Settings className="text-gray-600" />
                    </button>

                    {/* Perfil do Usuário */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 shadow-md">
                                <img
                                    src={currentClient && avatares_pessoas[currentClient.client_avatar]}
                                    alt="Perfil"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info do Usuário - Visível apenas em Desktop */}
                            <div className="hidden md:block text-left">
                                <h2 className="text-sm font-medium text-gray-800">
                                    {currentClient?.name}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {currentClient?.email}
                                </p>
                            </div>

                            <ArrowDropDown className="text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div 
                                className="absolute right-0 top-[calc(100%+4px)] w-48 bg-white rounded-xl shadow-xl 
                                    border border-gray-100 py-2 z-[999] transform-gpu"
                                style={{ 
                                    filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))'
                                }}
                            >
                                {/* Seta do dropdown */}
                                <div className="absolute -top-2 right-5 w-4 h-4 bg-white rotate-45 border-t border-l 
                                    border-gray-100 z-[-1]" 
                                />

                                <div className="md:hidden px-4 py-2 border-b border-gray-100">
                                    <h3 className="text-sm font-medium text-gray-800">
                                        {currentClient?.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {currentClient?.email}
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        navigate('/client/profile');
                                        setShowDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 
                                        hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <Settings className="text-gray-400 text-base" />
                                    Meu Perfil
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        navigate('/client/wallet');
                                        setShowDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 
                                        hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <AccountBalanceWallet className="text-gray-400 text-base" />
                                    Carteira
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        navigate('/client/settings');
                                        setShowDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 
                                        hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <Settings className="text-gray-400 text-base" />
                                    Configurações
                                </button>
                                
                                <div className="border-t border-gray-100 my-1"></div>
                                
                                <button 
                                    onClick={() => {
                                        localStorage.removeItem('client-auk-session-login');
                                        navigate('/client/login');
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 
                                        hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <Logout className="text-red-400 text-base" />
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavClient;
