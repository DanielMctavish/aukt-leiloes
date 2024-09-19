import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAdvertiserInformations(setCurrentAdvertiser);
  }, []);

  const handleSearchProduct = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      setSearchedProducts([]);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-title?title=${query}`);
      setSearchedProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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
              {currentAdvertiser ? (
                <img
                  className="ml-3 h-8 w-8 rounded-full cursor-pointer"
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
              {currentAdvertiser ? (
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

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-4">
              <div className="flex items-center border-b border-gray-300 pb-2">
                <input
                  type="text"
                  placeholder="Pesquise por item ou categoria"
                  className="flex-grow outline-none text-black"
                  value={searchQuery}
                  onChange={handleSearchProduct}
                />
                <button onClick={toggleSearch} className="ml-2 text-gray-500 hover:text-gray-700">
                  <Close />
                </button>
              </div>
              <div className="mt-4 max-h-96 overflow-y-auto">
                {searchedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/advertiser/home/product/${product.id}`);
                      toggleSearch();
                    }}
                  >
                    <img src={product.cover_img_url} alt="" className="w-12 h-12 object-cover rounded-md mr-4" />
                    <span className="text-black">{product.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
