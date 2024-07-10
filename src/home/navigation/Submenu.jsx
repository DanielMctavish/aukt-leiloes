import axios from 'axios';
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function Submenu() {
  const [searchedProducts, setSearchedProducts] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [inputText, setInputText] = useState()

  const navigate = useNavigate()

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
    const currentSearch = e.target.value;
    setInputText(currentSearch)

    try {
      await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-title?title=${currentSearch}`)
        .then(response => {
          //console.log("produtos encontrados -> ", response.data)
          setSearchedProducts(response.data)
        })
    } catch (error) {
      console.log("error at get auctions -> ", error.message)
    }

  }

  const handleRedirectToProduct = async (product_id) => {
    navigate(`/advertiser/home/product/${product_id}`)
  }

  useEffect(() => { }, [inputText, searchedProducts])

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
        {
          inputText &&
          <div className='flex flex-col w-[86%] min-h-[5vh] bg-[#ece8e8] 
          absolute mt-[14.6vh] ml-[-5vh] p-1 rounded-md text-zinc-600 shadow-lg shadow-[#13131360]'>
            {
              Array.isArray(searchedProducts) &&
              searchedProducts.map((product, i) => (
                <div key={i}
                  onClick={() => handleRedirectToProduct(product.id)}
                  className="flex justify-between p-1 text-[#312d2d] text-[12px] 
                cursor-pointer hover:bg-[#fff] rounded-md gap-2 border-b-[1px] border-[#bbbbbb]">
                  <img src={product.cover_img_url} alt="" className='w-[30px] h-[30px] object-cover rounded-md' />
                  <span> {product.title}</span>
                </div>
              ))
            }
          </div>
        }
        <span className="relative right-0 inset-y-0 flex items-center w-[32px] p-1 bg-[#022A33] rounded-md">
          <SearchIcon />
        </span>
      </div>

    </section>


  );
}

export default Submenu;