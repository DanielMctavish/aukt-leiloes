/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Person, Logout, Gavel } from '@mui/icons-material';
import logoAuk from '../../../media/logos/logos-auk/aukt_blue.png';

function SideMenu({ 
    currentClient, 
    currentAdvertiser, 
    setIsModalOn,
    avatares_pessoas 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Listener para evento de logout
        const handleClientLogout = () => {
            // Atualizar estados locais
            setIsOpen(false);
            
            // Disparar evento para atualizar outros componentes
            window.dispatchEvent(new CustomEvent('clientStateChanged', {
                detail: {
                    type: 'logout',
                    data: null
                }
            }));
        };

        // Listener para evento de login
        const handleClientLogin = (event) => {
            const userData = event.detail;
            
            // Disparar evento para atualizar outros componentes
            window.dispatchEvent(new CustomEvent('clientStateChanged', {
                detail: {
                    type: 'login',
                    data: userData
                }
            }));
        };

        window.addEventListener('clientLogout', handleClientLogout);
        window.addEventListener('clientLoginSuccess', handleClientLogin);

        return () => {
            window.removeEventListener('clientLogout', handleClientLogout);
            window.removeEventListener('clientLoginSuccess', handleClientLogin);
        };
    }, []);

    const handleLogout = () => {
        // Remove dados do localStorage
        localStorage.removeItem("client-auk-session-login");
        localStorage.removeItem("client-auto-bid");
        
        // Dispara evento de logout
        window.dispatchEvent(new CustomEvent('clientLogout'));
        
        // Fecha o menu
        setIsOpen(false);
    };

    return (
        <div className="fixed left-4 top-4 z-[99]">
            {/* Botão do Menu com Context */}
            <div className="relative">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-[45px] h-[45px] rounded-full bg-white shadow-lg
                        flex justify-center items-center
                        hover:bg-gray-50 transition-all duration-300"
                >
                    <Menu sx={{ color: "#012038", fontSize: "1.5rem" }} />
                </button>

                {/* Menu de Context */}
                {isOpen && (
                    <div className="absolute left-0 top-[120%] w-[220px] bg-white rounded-xl shadow-xl
                        py-2 transform origin-top-left transition-all duration-300">
                        
                        {/* Botão Home */}
                        <button
                            onClick={() => {
                                navigate(`/advertiser/home/${currentAdvertiser?.id}`);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                        >
                            <img src={logoAuk} alt="Logo" className="w-[25px]" />
                            <span className="text-gray-700">Início</span>
                        </button>

                        {/* Botão Meus Lances */}
                        <button 
                            onClick={() => {
                                navigate("/client/bids");
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                        >
                            <Gavel sx={{ color: "#012038", fontSize: "1.2rem" }} />
                            <span className="text-gray-700">Meus Lances</span>
                        </button>

                        {/* Login/Perfil */}
                        {currentClient?.name ? (
                            <>
                                <button 
                                    onClick={() => {
                                        navigate("/client/dashboard");
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                                >
                                    <img 
                                        src={avatares_pessoas[currentClient.client_avatar]} 
                                        alt="" 
                                        className="w-[25px] h-[25px] rounded-full"
                                    />
                                    <span className="text-gray-700 truncate">{currentClient.name}</span>
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-red-500"
                                >
                                    <Logout sx={{ fontSize: "1.2rem" }} />
                                    <span>Sair</span>
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => {
                                    setIsModalOn(true);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                            >
                                <Person sx={{ color: "#012038", fontSize: "1.2rem" }} />
                                <span className="text-gray-700">Entrar</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SideMenu; 