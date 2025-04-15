/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Gavel,
  Person,
  Search,
  Close,
  Info as InfoIcon,
  ContactSupport,
  Event
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import logoAuk from '../../media/logos/logos-auk/aukt_blue.png';
import { getAdvertiserInformations } from '../../advertiser/functions/GetAdvertiserInformations';
import { getClientInformations } from '../../Clients/functions/getClientInformations';
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls";

// Convertendo o objeto de URLs em um array
const avatares_pessoas = Object.values(avatarClientsUrls);

const Navigation = () => {
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);
  const [currentClient, setCurrentClient] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      // Carregar informações do anunciante
      getAdvertiserInformations(setCurrentAdvertiser);

      // Carregar informações completas do cliente
      const clientSession = localStorage.getItem('client-auk-session-login');
      if (clientSession) {
        await getClientInformations(
          navigate,
          null,
          setCurrentClient,
          null,
          null,
          null,
          null
        );
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Bloquear o scroll quando o menu mobile está aberto
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Fechar o menu ao abrir a pesquisa
    if (!isSearchOpen) setIsMenuOpen(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const menuItems = [
    { title: "Leilões", icon: <Gavel />, path: "/floor/hub" },
    { title: "Sobre", icon: <InfoIcon />, path: "/sobre" },
    { title: "Agenda", icon: <Event />, path: "/agenda" },
    { title: "Suporte", icon: <ContactSupport />, path: "/ajuda" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#001828] to-[#012038] text-white fixed w-full z-50 left-0 shadow-lg">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <img className="h-8 w-auto" src={logoAuk} alt="AUK Leilões" />
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {menuItems.map((item, index) => (
                  <button 
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="px-3 py-2 rounded-md text-sm font-medium 
                      text-gray-300 hover:bg-[#0D1733] hover:text-white
                      transition-all duration-200 flex items-center gap-1.5"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-3">
              <button 
                onClick={toggleSearch} 
                className="p-1.5 rounded-full hover:bg-[#0D1733] focus:outline-none
                  transition-all duration-200 relative overflow-hidden group"
              >
                <Search sx={{ fontSize: "24px" }} />
                <span className="absolute inset-0 bg-green-500/20 transform scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
              </button>
              
              <button 
                onClick={() => navigate('/floor/hub')} 
                className="p-1.5 rounded-full hover:bg-[#0D1733] focus:outline-none
                  transition-all duration-200 relative overflow-hidden group"
              >
                <Gavel sx={{ fontSize: "24px" }} />
                <span className="absolute inset-0 bg-green-500/20 transform scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
              </button>
              
              {currentAdvertiser && currentAdvertiser.url_profile_cover ? (
                <div className="relative cursor-pointer overflow-hidden rounded-full
                  border-2 border-transparent hover:border-gray-200/50 transition-all duration-300" 
                  onClick={() => navigate('/select-login')}
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={currentAdvertiser.url_profile_cover}
                    alt="Perfil"
                  />
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-full" onClick={() => navigate('/select-login')}>
                  <Person
                    sx={{ fontSize: "33px" }}
                    className="p-1 rounded-full hover:bg-[#0D1733] cursor-pointer
                      transition-all duration-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleSearch}
              className="inline-flex items-center justify-center p-2 
                rounded-full text-white hover:bg-[#0D1733] focus:outline-none
                transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 
                rounded-full text-white hover:bg-[#0D1733] focus:outline-none
                transition-all duration-200"
            >
              {isMenuOpen ? (
                <Close className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-16 bg-[#001828]/95 backdrop-blur-sm z-40"
          >
            <div className="h-full overflow-y-auto pb-20">
              <div className="px-4 py-6 space-y-5">
                {/* Profile section - Agora usando o sistema de avatares correto */}
                <div className={`flex items-center p-4 rounded-xl mb-6 ${
                  currentClient 
                    ? 'bg-gradient-to-br from-[#247557]/80 to-[#194037]/80' 
                    : 'bg-[#012b43]/80'
                }`}>
                  {currentClient ? (
                    // Avatar do cliente usando o sistema de avatares
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                      <img
                        src={avatares_pessoas[currentClient.client_avatar]}
                        alt="Avatar do Cliente"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : currentAdvertiser && currentAdvertiser.url_profile_cover ? (
                    // Avatar do anunciante
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={currentAdvertiser.url_profile_cover}
                      alt="Perfil do Anunciante"
                    />
                  ) : (
                    // Ícone padrão para visitante
                    <div className="bg-[#0D1733] rounded-full p-2">
                      <Person sx={{ fontSize: "32px" }} />
                    </div>
                  )}
                  
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">
                      {currentClient?.nickname || currentAdvertiser?.name || 'Visitante'}
                    </h3>
                    <p className="text-sm text-gray-300 opacity-80">
                      {currentClient ? 'Cliente' : currentAdvertiser ? 'Sua conta' : 'Entre ou cadastre-se'}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/select-login')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      currentClient 
                        ? 'bg-[#247557] hover:bg-[#2d8d69]' 
                        : 'bg-[#0D1733] hover:bg-[#1a2a4d]'
                    }`}
                  >
                    {currentClient || currentAdvertiser ? 'Perfil' : 'Entrar'}
                  </button>
                </div>
                
                {/* Navigation Items */}
                <div className="grid gap-2">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => navigateTo(item.path)}
                      className="flex items-center px-4 py-3 rounded-xl text-left
                        hover:bg-[#0D1733] transition-all duration-200 w-full
                        text-gray-100 group"
                    >
                      <div className="bg-[#0D1733] p-2 rounded-lg mr-4 
                        group-hover:bg-[#1a2a4d] transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-base font-medium">{item.title}</span>
                    </motion.button>
                  ))}
                </div>
                
                {/* Version info and extras */}
                <div className="pt-6 mt-6 border-t border-[#0D1733]">
                  <div className="px-4 text-center">
                    <p className="text-xs text-gray-400">
                      Aukt Leilões © {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            {/* Overlay com blur */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
              onClick={toggleSearch}
            />

            {/* Modal Content */}
            <div className="relative min-h-screen flex items-start justify-center p-4">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-full max-w-2xl mt-[10vh] bg-white rounded-2xl shadow-2xl 
                  transform transition-all duration-300 ease-in-out"
              >
                {/* Search Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Buscar Produtos
                    </h2>
                    <button
                      onClick={toggleSearch}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Close className="text-gray-500" />
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 
                      focus-within:border-[#012038] focus-within:ring-1 focus-within:ring-[#012038] 
                      transition-all duration-200">
                      <Search className="ml-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Digite o que você procura..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full py-3 px-4 bg-transparent outline-none text-gray-800 
                          placeholder-gray-400 text-base"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="p-2 hover:bg-gray-200 rounded-full mx-1"
                        >
                          <Close fontSize="small" className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search Tips */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Pressione Enter ou clique em Buscar
                    </p>
                  </div>

                  {/* Quick Categories */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Buscas populares</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Relógio', 'Coupe', 'Ferrari', 'Funko', 'Horse', 'Espelho'].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearch({ preventDefault: () => { } });
                          }}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                            hover:bg-gray-200 transition-colors duration-200 capitalize"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                  <button
                    onClick={handleSearch}
                    disabled={searchQuery.trim().length < 3}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200
                      ${searchQuery.trim().length >= 3
                        ? 'bg-[#012038] text-white hover:bg-[#023161]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Buscar
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
