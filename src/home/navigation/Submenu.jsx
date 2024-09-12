import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, ExpandMore, ExpandLess } from "@mui/icons-material";

const Submenu = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getCurrentCategories();
  }, []);

  const getCurrentCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`);
      const allAuctions = response.data;
      const uniqueCategories = new Set();

      allAuctions.forEach(auction => {
        if (uniqueCategories.size < 6) {
          uniqueCategories.add(auction.categorie);
        }
      });

      setAllCategories(Array.from(uniqueCategories));
    } catch (error) {
      console.error("Erro ao buscar os leilões:", error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="fixed top-[62px] w-full z-[99] bg-[#E4E4E4] text-[#022A33] shadow-md">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="hidden lg:flex items-center space-x-4 flex-grow">
            {Array.isArray(allCategories) &&
              allCategories.map((categorie, i) => (
                <button
                  key={i}
                  className="text-[#002949] text-sm font-bold whitespace-nowrap hover:text-[#0D1733] transition-colors duration-200"
                >
                  {categorie}
                </button>
              ))}
          </div>
          <button
            onClick={toggleExpand}
            className="flex items-center justify-center w-full lg:w-auto gap-2 p-2 hover:bg-white transition-colors duration-200"
          >
            <Menu className="text-[#002949]" />
            <span className="font-bold whitespace-nowrap">Todas as categorias</span>
            {isExpanded ? <ExpandLess className="lg:hidden" /> : <ExpandMore className="lg:hidden" />}
          </button>
        </div>
      </div>
      
      {/* Mobile expanded categories */}
      <div className={`lg:hidden ${isExpanded ? 'block' : 'hidden'} px-4 py-2 bg-white`}>
        {Array.isArray(allCategories) &&
          allCategories.map((categorie, i) => (
            <button
              key={i}
              className="block w-full text-left text-[#002949] text-sm font-bold py-2 hover:bg-[#E4E4E4] transition-colors duration-200"
            >
              {categorie}
            </button>
          ))}
      </div>
    </section>
  );
};

export default Submenu;