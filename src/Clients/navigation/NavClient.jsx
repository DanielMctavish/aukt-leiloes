/* eslint-disable react/prop-types */
import { ArrowDropDown, NotificationsNone, Settings, AccountBalanceWallet, Logout, Gavel } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//avatares import
const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

const avatares_pessoas = importAllAvatars()

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
