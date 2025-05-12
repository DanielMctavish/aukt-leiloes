/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDropDown, Logout, Person, Menu as MenuIcon } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAdvertiserInformations } from "../functions/GetAdvertiserInformations";
import io from 'socket.io-client';
import axios from "axios";

function NavAdvertiser() {
  const [AdvertiserInfor, setAdvertiserInfor] = useState({});
  const [contextMenu, setContextMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const updateNotifications = useCallback((newBid) => {
    if (newBid?.body) {
      const bid = newBid.body;
      const product = bid.Product[0];
      
      setNotifications(prev => [{
        id: Date.now(),
        auctionId: bid.auct_id,
        productTitle: product.title,
        productImage: product.cover_img_url,
        bidValue: new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(bid.value),
        bidderName: bid.Client.name,
        timestamp: new Date(),
        read: false
      }, ...prev]);
    }
  }, []);

  useEffect(() => {
    getAdvertiserInformations(setAdvertiserInfor);
  }, []);

  // Buscar leilões do anunciante e configurar websocket
  useEffect(() => {
    const fetchAdvertiserAuctions = async () => {
      if (AdvertiserInfor.id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
              params: { creator_id: AdvertiserInfor.id }
            }
          );
          webSocketFlow(response.data);
        } catch (error) {
          console.error("Erro ao buscar leilões:", error);
        }
      }
    };

    fetchAdvertiserAuctions();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [AdvertiserInfor.id]);

  const webSocketFlow = (auctions) => {
    const socket = io(import.meta.env.VITE_APP_BACKEND_WEBSOCKET);
    socketRef.current = socket;

    auctions.forEach(auction => {
      const eventName = `${auction.id}-bid-cataloged`;
      console.log("Escutando evento:", eventName);

      socket.on(eventName, (message) => {
        console.log(`Novo lance catalogado no leilão ${auction.id}:`, message);
        const newBid = message.data;
        updateNotifications(newBid, auction.title);
      });
    });
  };

  const handleLogout = () => {
    // Limpar o localStorage
    localStorage.removeItem('advertiser-session-aukt');
    // Redirecionar para a página de login
    navigate('/');
  };

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <nav className="w-full bg-white shadow-md fixed left-0 z-[500] flex justify-center items-center">
      <div className="min-w-[94%] px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <MenuIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Logo/Welcome Section - Adaptado para mobile */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-base lg:text-xl font-semibold text-gray-800 truncate">
                <span className="hidden sm:inline">Bem vindo, </span>
                {AdvertiserInfor.name}
              </span>
              <span className="hidden lg:inline ml-2 text-sm text-gray-500">
                {AdvertiserInfor.nano_id}
              </span>
            </div>
          </div>

          {/* Warning Badge - Responsivo */}
          {AdvertiserInfor.police_status === 'WARNED' && (
            <div className="hidden sm:flex items-center">
              <div className="px-3 py-1 bg-red-50 text-red-700 rounded-full flex items-center">
                <WarningIcon className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Conta sob aviso</span>
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              >
                <NotificationsIcon className="text-gray-600" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                    bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Dropdown de Notificações - Adaptado para mobile */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-lg py-2 
                  border border-gray-100 max-h-[80vh] overflow-y-auto mx-4 sm:mx-0">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notificações</h3>
                    {notifications.some(n => !n.read) && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-gray-100">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <img 
                              src={notification.productImage} 
                              alt={notification.productTitle}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  Novo lance em {notification.productTitle}
                                </p>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {notification.bidderName} deu um lance de {notification.bidValue}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Nenhuma notificação
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown - Adaptado para mobile */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setContextMenu(!contextMenu)}
                className="flex items-center gap-2 p-1.5 lg:p-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                <img
                  src={AdvertiserInfor.url_profile_cover}
                  alt="Profile"
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="hidden lg:inline font-medium text-gray-700">{AdvertiserInfor.name}</span>
                <ArrowDropDown className={`transition-transform duration-200 ${contextMenu ? 'rotate-180' : ''}`} />
              </button>

              {contextMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 
                  border border-gray-100 transform transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{AdvertiserInfor.name}</p>
                    <p className="text-sm text-gray-500">{AdvertiserInfor.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => navigate('/advertiser/profile')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 
                        flex items-center gap-2 transition-colors"
                    >
                      <Person className="text-gray-400" />
                      Perfil
                    </button>
                  </div>

                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 
                        flex items-center gap-2 transition-colors"
                    >
                      <Logout className="text-red-400" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Warning Badge */}
        {AdvertiserInfor.police_status === 'WARNED' && (
          <div className="sm:hidden px-4 pb-2">
            <div className="px-3 py-1 bg-red-50 text-red-700 rounded-full flex items-center justify-center">
              <WarningIcon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Conta sob aviso</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavAdvertiser;
