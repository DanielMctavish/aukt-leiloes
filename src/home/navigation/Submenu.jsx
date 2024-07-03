import axios from 'axios';
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";


function Submenu() {
  const [allCategories, setAllCategories] = useState([])
  const [inputText, setInputText] = useState("")

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
        if (uniqueCategories.size < 12) {
          uniqueCategories.add(auction.categorie);
        }
      });

      setAllCategories(Array.from(uniqueCategories));
    } catch (error) {
      console.error("Erro ao buscar os leilões:", error);
    }
  };


  const handleSearchProduct = async (e) => {
    setInputText(e.target.value)
    //await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}`)
  }

  return (
    <section className="flex  items-center justify-center  w-full h-[70px] gap-3 md:mt-1 mt-12 z-[999]">

      <div className="lg:flex hidden gap-6 items-center justify-center sm:mb-0">
        {
          Array.isArray(allCategories) &&
          allCategories.map((categorie, i) => (
            <button key={i} className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
              {categorie}
            </button>
          ))
        }

      </div>

      <div className="relative flex justify-center items-center mt-0 lg:w-[22%] w-[98%] gap-3">
        <input
          type="text"
          value={inputText}
          onChange={handleSearchProduct}
          placeholder="Pesquise por item ou categoria"
          className="w-[90%] h-[30px] p-2 bg-[#d9d9d994] text-[#898383] text-[14px] rounded-md"
        />
        <span className="relative right-0 inset-y-0 flex items-center w-[32px] p-1 bg-[#022A33] rounded-md">
          <SearchIcon />
        </span>
      </div>

    </section>


  );
}

export default Submenu;