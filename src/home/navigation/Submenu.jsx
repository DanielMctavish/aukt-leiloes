import axios from 'axios';
import { Menu } from "@mui/icons-material";
import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';


function Submenu() {
  const [allCategories, setAllCategories] = useState([])

  // const navigate = useNavigate()

  useEffect(() => {
    getCurrentCategories();
  }, []);

  const getCurrentCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`);
      //console.log("todos os leilões da plataforma -> ", response.data);

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

  return (
    <section className="flex  items-center justify-center fixed top-[62px] 
    w-full h-[40px] gap-3 z-[99] bg-[#E4E4E4] text-[#022A33] p-3">

      <div className="lg:flex hidden gap-6 items-center justify-between flex-1">
        {
          Array.isArray(allCategories) &&
          allCategories.map((categorie, i) => (
            <button key={i} className="text-[#002949] text-[14px] font-bold leading-normal 
            cursor-pointer mb-2 sm:mb-0 sm:mr-4">
              {categorie}
            </button>
          ))
        }

      </div>

      <div className="relative flex justify-center items-center mt-0 w-[200px] gap-3 cursor-pointer hover:bg-white">
        <span className="relative right-0 inset-y-0 flex items-center w-[32px] p-1  rounded-md">
          <Menu />
        </span>
        <span className='font-bold'>todas as categorias</span>
      </div>

    </section>


  );
}

export default Submenu;