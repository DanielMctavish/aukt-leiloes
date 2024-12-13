import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Gavel,
  Person,
  Search,
  Close
} from '@mui/icons-material';
import logoAuk from '../../media/logos/logos-auk/aukt_blue.png';
import { getAdvertiserInformations } from '../../advertiser/functions/GetAdvertiserInformations';

const Navigation = () => {
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAdvertiserInformations(setCurrentAdvertiser);
  }, []);


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
    <nav className="bg-[#012038] text-white fixed w-full z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src={logoAuk} alt="AUK Leilões" />
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#0D1733] hover:text-white">Home</a>
                {/* Add more navigation items here */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button onClick={toggleSearch} className="p-1 rounded-full hover:bg-[#0D1733] focus:outline-none">
                <Search sx={{ fontSize: "24px" }} />
              </button>
              <button onClick={() => navigate('/floor/hub')} className="ml-3 p-1 rounded-full hover:bg-[#0D1733] focus:outline-none">
                <Gavel sx={{ fontSize: "24px" }} />
              </button>
              {currentAdvertiser && currentAdvertiser.url_profile_cover ? (
                <img
                  className="ml-3 h-8 w-8 rounded-full object-cover cursor-pointer"
                  src={currentAdvertiser.url_profile_cover}
                  alt=""
                  onClick={() => navigate('/advertiser/login')}
                />
              ) : (
                <Person
                  sx={{ fontSize: "33px" }}
                  className="ml-3 h-8 w-8 p-1 rounded-full hover:bg-[#0D1733] cursor-pointer"
                  onClick={() => navigate('/advertiser/login')}
                />
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#0D1733] focus:outline-none"
            >
              <Menu className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} />
              <Close className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#0D1733] hover:text-white">Home</a>
          {/* Add more mobile navigation items here */}
        </div>
        <div className="pt-4 pb-3 border-t border-[#0D1733]">
          <div className="flex items-center px-5">
            <div className="flex items-center">
              <button onClick={toggleSearch} className="p-1 rounded-full hover:bg-[#0D1733] focus:outline-none">
                <Search />
              </button>
              <button onClick={() => navigate('/floor/hub')} className="ml-3 p-1 rounded-full hover:bg-[#0D1733] focus:outline-none">
                <Gavel />
              </button>
              {currentAdvertiser && currentAdvertiser.url_profile_cover ? (
                <img
                  className="ml-3 h-8 w-8 rounded-full cursor-pointer"
                  src={currentAdvertiser.url_profile_cover}
                  alt=""
                  onClick={() => navigate('/advertiser/login')}
                />
              ) : (
                <Person
                  className="ml-3 h-8 w-8 p-1 rounded-full hover:bg-[#0D1733] cursor-pointer"
                  onClick={() => navigate('/advertiser/login')}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay com blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleSearch}
          />

          {/* Modal Content */}
          <div className="relative min-h-screen flex items-start justify-center p-4">
            <div
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
                    Pressione Enter ou clique na lupa para buscar
                  </p>
                </div>

                {/* Quick Categories */}
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery('Relógio');
                        handleSearch({ preventDefault: () => { } });
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                        hover:bg-gray-200 transition-colors duration-200"
                    >
                      Relógio
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('coupe');
                        handleSearch({ preventDefault: () => { } });
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                        hover:bg-gray-200 transition-colors duration-200"
                    >
                      coupe
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('ferrari');
                        handleSearch({ preventDefault: () => { } });
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                        hover:bg-gray-200 transition-colors duration-200"
                    >
                      ferrari
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('Funko');
                        handleSearch({ preventDefault: () => { } });
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                        hover:bg-gray-200 transition-colors duration-200"
                    >
                      Funko
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('horse');
                        handleSearch({ preventDefault: () => { } });
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                        hover:bg-gray-200 transition-colors duration-200"
                    >
                      horse
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('espelho');
                        handleSearch({ preventDefault: () => { } });
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full 
                        hover:bg-gray-200 transition-colors duration-200"
                    >
                      espelho
                    </button>
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
