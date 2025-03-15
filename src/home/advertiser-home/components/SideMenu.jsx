/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Person, Logout, Gavel } from '@mui/icons-material';
import logoAuk from '../../../media/logos/logos-auk/aukt_blue.png';

// Importação dos avatares
const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

// Inicializa os avatares uma única vez fora do componente
const avatares_pessoas = importAllAvatars();

function SideMenu({ 
    currentClient, 
    currentAdvertiser, 
    setIsModalOn 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [localClient, setLocalClient] = useState(currentClient);
    const navigate = useNavigate();
   
    // Atualiza o estado local quando currentClient mudar
    useEffect(() => {
        setLocalClient(currentClient);
    }, [currentClient]);

    useEffect(() => {
        // Listener para evento de logout
        const handleClientLogout = () => {
            // Atualizar estados locais
            setIsOpen(false);
            setLocalClient(null);
            
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
            setLocalClient(userData);
            
            // Disparar evento para atualizar outros componentes
            window.dispatchEvent(new CustomEvent('clientStateChanged', {
                detail: {
                    type: 'login',
                    data: userData
                }
            }));
        };

        // Listener para mudanças de estado do cliente
        const handleClientStateChanged = (event) => {
            const { type, data } = event.detail;
            if (type === 'login') {
                setLocalClient(data);
            } else if (type === 'logout') {
                setLocalClient(null);
            }
        };

        window.addEventListener('clientLogout', handleClientLogout);
        window.addEventListener('clientLoginSuccess', handleClientLogin);
        window.addEventListener('clientStateChanged', handleClientStateChanged);

        return () => {
            window.removeEventListener('clientLogout', handleClientLogout);
            window.removeEventListener('clientLoginSuccess', handleClientLogin);
            window.removeEventListener('clientStateChanged', handleClientStateChanged);
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
                        {localClient?.name ? (
                            <>
                                <button 
                                    onClick={() => {
                                        navigate("/client/dashboard");
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                                >
                                    <img 
                                        src={avatares_pessoas[localClient.client_avatar]} 
                                        alt="" 
                                        className="w-[25px] h-[25px] rounded-full"
                                    />
                                    <span className="text-gray-700 truncate">{localClient.name}</span>
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