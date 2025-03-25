import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Gavel,
  Person,
  Search,
  Close,
  EmojiEvents,
  LocalBar
} from '@mui/icons-material';
import logoAuk from '../../media/logos/logos-auk/aukt_blue.png';
import { getAdvertiserInformations } from '../../advertiser/functions/GetAdvertiserInformations';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const NavigationBirthday = () => {
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAdvertiserInformations(setCurrentAdvertiser);
    
    // Dispara confetti quando o componente é montado
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#003366', '#0066CC', '#0099FF', '#66CCFF', '#003399']
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#003366', '#0066CC', '#0099FF', '#66CCFF', '#003399']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }, []);

  // Função para disparar confetti aleatório quando o usuário clica em elementos
  const triggerConfetti = () => {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003366', '#0066CC', '#0099FF', '#66CCFF', '#003399']
    });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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

  return (
    <nav className="bg-gradient-to-r from-[#012038] to-[#0a4275] text-white fixed w-full z-50 shadow-lg">
      {/* Decoração de aniversário */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003366] via-[#0099FF] to-[#66CCFF]"></div>
      
      {/* Animação de martelinhos flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut" 
          }}
          className="absolute left-[10%] top-2"
        >
          <Gavel className="text-blue-300" fontSize="small" />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut",
            delay: 1 
          }}
          className="absolute left-[30%] top-3"
        >
          <Gavel className="text-blue-200" fontSize="small" />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -12, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3.5,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute left-[70%] top-4"
        >
          <Gavel className="text-blue-300" fontSize="small" />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute left-[90%] top-3"
        >
          <Gavel className="text-blue-200" fontSize="small" />
        </motion.div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 relative">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerConfetti}
              >
                <img className="h-8 w-auto" src={logoAuk} alt="AUK Leilões" />
                <motion.div 
                  className="absolute -top-2 -right-2 text-blue-300"
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <EmojiEvents fontSize="small" />
                </motion.div>
              </motion.div>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <motion.a 
                  href="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={triggerConfetti}
                >
                  Home
                </motion.a>
                <motion.span 
                  className="px-3 py-1 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md border border-blue-500 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={triggerConfetti}
                >
                  26 Anos!
                </motion.span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <motion.button 
                onClick={toggleSearch}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="p-1 rounded-full hover:bg-blue-800 focus:outline-none transition-colors"
              >
                <Search sx={{ fontSize: "24px" }} />
              </motion.button>
              <motion.button 
                onClick={() => navigate('/floor/hub')}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="ml-3 p-1 rounded-full hover:bg-blue-800 focus:outline-none transition-colors"
              >
                <Gavel sx={{ fontSize: "24px" }} />
              </motion.button>
              
              <div className="ml-3 relative">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                  onClick={() => {
                    triggerConfetti();
                    navigate('/select-login');
                  }}
                >
                  {currentAdvertiser && currentAdvertiser.url_profile_cover ? (
                    <div className="relative">
                      <img
                        className="h-8 w-8 rounded-full object-cover cursor-pointer border-2 border-blue-400"
                        src={currentAdvertiser.url_profile_cover}
                        alt=""
                      />
                      <motion.div 
                        className="absolute -top-2 -right-2 text-blue-300"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                      >
                        <LocalBar fontSize="small" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Person
                        sx={{ fontSize: "33px" }}
                        className="p-1 rounded-full hover:bg-blue-800 cursor-pointer"
                      />
                      <motion.div 
                        className="absolute -top-2 -right-2 text-blue-300"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                      >
                        <LocalBar fontSize="small" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none transition-colors"
            >
              <Menu className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} />
              <Close className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-900">
              <a href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white transition-colors">
                Home
              </a>
              <div className="flex justify-center my-2 ">
                <motion.span 
                  className="px-3 py-1 rounded-full bg-blue-700 text-white 
                  text-xs font-bold shadow-md border border-blue-500 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={triggerConfetti}
                >
                  26 Anos!
                </motion.span>
              </div>
            </div>
            <div className="pt-4 pb-3 border-t border-blue-800 bg-blue-900">
              <div className="flex items-center justify-around px-5">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSearch} 
                  className="p-1 rounded-full hover:bg-blue-800 focus:outline-none transition-colors"
                >
                  <Search />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/floor/hub')} 
                  className="p-1 rounded-full hover:bg-blue-800 focus:outline-none transition-colors"
                >
                  <Gavel />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerConfetti();
                    navigate('/select-login');
                  }} 
                  className="relative"
                >
                  {currentAdvertiser && currentAdvertiser.url_profile_cover ? (
                    <div className="relative">
                      <img
                        className="h-8 w-8 rounded-full cursor-pointer border-2 border-blue-400"
                        src={currentAdvertiser.url_profile_cover}
                        alt=""
                      />
                      <div className="absolute -top-2 -right-2 text-blue-300">
                        <LocalBar fontSize="small" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Person
                        className="p-1 rounded-full hover:bg-blue-800 cursor-pointer"
                      />
                      <div className="absolute -top-2 -right-2 text-blue-300">
                        <LocalBar fontSize="small" />
                      </div>
                    </div>
                  )}
                </motion.button>
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
            transition={{ duration: 0.3 }}
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
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -20 }}
                className="w-full max-w-2xl mt-[10vh] bg-white rounded-2xl shadow-2xl 
                  transform transition-all duration-300 ease-in-out relative overflow-hidden"
              >
                {/* Decoração de aniversário no modal */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003366] via-[#0099FF] to-[#66CCFF]"></div>
                
                {/* Search Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Buscar Produtos
                      </h2>
                      <motion.div 
                        animate={{ rotate: [0, 10, -10, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <EmojiEvents className="text-blue-600" fontSize="small" />
                      </motion.div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleSearch}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Close className="text-gray-500" />
                    </motion.button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 
                      focus-within:border-[#0a4275] focus-within:ring-1 focus-within:ring-[#0a4275] 
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
                      />
                      {searchQuery && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSearchQuery('')}
                          className="p-2 hover:bg-gray-200 rounded-full mx-1"
                        >
                          <Close fontSize="small" className="text-gray-400" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Search Tips */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Pressione Enter ou clique na lupa para buscar
                    </p>
                  </div>

                  {/* Quick Categories */}
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {["Relógio", "coupe", "ferrari", "Funko", "horse", "espelho"].map((term) => (
                        <motion.button
                          key={term}
                          whileHover={{ scale: 1.05, backgroundColor: "#0a4275", color: "white" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearch({ preventDefault: () => { } });
                            triggerConfetti();
                          }}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                            hover:bg-blue-800 hover:text-white transition-all duration-200"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      handleSearch(e);
                      if (searchQuery.trim().length >= 3) {
                        triggerConfetti();
                      }
                    }}
                    disabled={searchQuery.trim().length < 3}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200
                      ${searchQuery.trim().length >= 3
                        ? 'bg-gradient-to-r from-[#012038] to-[#0a4275] text-white shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Buscar
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavigationBirthday; 