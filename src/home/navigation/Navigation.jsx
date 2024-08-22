import axios from "axios";
import {
  AccountCircle,
  Menu,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import hammer from "../../media/icons/Hammer.png"
import logoAuk from "../../media/logos/logos-auk/aukt_blue.png"
import logoAuk_white from "../../media/logos/logos-auk/logo_model01_white.png"
import { getAdvertiserInformations } from "../../advertiser/functions/GetAdvertiserInformations";

function Navigation() {
  const [currentAdvertiser, setCurrentAdvertiser] = useState(false)
  const [currentClient, setCurrentClient] = useState({})
  const [navigationMenu, setNavigationMenu] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState([])
  const [inputText, setInputText] = useState()

  const navigate = useNavigate()
  const tailwindItems = "flex justify-center items-center p-2 gap-3";

  useEffect(() => {
    getClientInformations()
    getAdvertiserInformations(setCurrentAdvertiser)
  }, [])

  const hideNavigation = () => {
    const navigationAuk = document.querySelector(".nav-auk");

    if (!navigationMenu) {
      navigationAuk.style.marginLeft = "-40vh";
      navigationAuk.style.transition = ".6s";
      setNavigationMenu(!navigationMenu);
    } else {
      navigationAuk.style.marginLeft = "0vh";
      navigationAuk.style.transition = ".2s";
      setNavigationMenu(!navigationMenu);
    }
  };

  const handleClientAccess = () => {
    navigate("/client/login")
  }

  const getClientInformations = async () => {
    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));

    try {

      await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
        headers: {
          "Authorization": `Bearer ${currentSessionClient.token}`
        }
      }).then((response) => {
        //console.log("dashboard client found -> ", response.data)
        setCurrentClient(response.data)
      })
    } catch (error) {
      console.log(error.message)
    }

  }

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



  useEffect(() => { }, [inputText, searchedProducts])

  return (
    <nav
      className="
        lg:ml-0 ml-[-40vh] nav-auk lg:left-auto left-0
        fixed lg:w-full w-[220px] lg:h-[62px]
        h-[100vh] bg-[#012038] lg:flex-col flex-row flex justify-center items-center
        gap-2 text-white text-[14px] cursor-pointer z-[100]"
    >
      {/* MENU MOBILE */}
      <span
        style={{ fontSize: "26px" }}
        className="
            shadow-lg shadow-[#1414146b] 
            fixed 
            top-1 
            right-1 
            lg:hidden 
            text-[#012038] 
            bg-white 
            p-2 
            rounded-md 
            z-[9999] 
            w-[44px] 
            h-[44px]
            flex 
            justify-center
            items-center"
        onClick={hideNavigation}
      >
        <Menu />
      </span>

      <div
        className="
            lg:w-[94%] 
            w-full 
            lg:h-[48px]
            h-[100vh] 
            flex 
            flex-col 
            lg:flex-row 
            justify-between 
            items-center"
      >
        <section
          className="
                lg:mt-0
                mt-[8vh]
                h-[42px] 
                lg:w-[80%]
                w-full
                lg:flex-row
                flex-col
                flex 
                justify-between 
                items-center 
                gap-2 
                text-white"
        >
          <div onClick={() => navigate("/")} className="flex items-center sm:mr-[100px] gap-2 w-[70%]">
            <img src={logoAuk} alt="" className="w-[60px] object-cover" />
            <span>AUK Leilões</span>
            <input type="text" onChange={handleSearchProduct} value={inputText}
              className="bg-white h-[30px] w-[80%] rounded-[12px] p-2 text-[#1c1c1c] font-bold ml-[6vh]"
              placeholder="Pesquise por item ou categoria" />

            {
              inputText &&
              <div className='flex flex-col w-[40%] min-h-[5vh] bg-[#f1f1f1] z-[900]
              absolute mt-[14.6vh] ml-[20vh] p-1 rounded-md text-zinc-600 shadow-lg shadow-[#13131360]'>
                {
                  Array.isArray(searchedProducts) &&
                  searchedProducts.map((product, i) => (
                    <button key={i}
                      onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                      className="flex justify-between p-1 text-[#312d2d] text-[12px] 
                      cursor-pointer hover:bg-[#fff] rounded-md gap-2 border-b-[1px] border-[#bbbbbb]">
                      <img src={product.cover_img_url} alt="" className='w-[30px] h-[30px] object-cover rounded-md' />
                      <span> {product.title}</span>
                    </button>
                  ))
                }
              </div>
            }

          </div>


        </section>

        <div className="flex gap-6 justify-center items-center ">

          {!currentAdvertiser ? <span className="w-[60px] h-[60px] flex justify-center items-center" onClick={() => navigate("/advertiser/login")}>
            <img src={logoAuk_white} alt="hammer" className="w-[48px] object-cover" />
          </span> :
            <span onClick={() => navigate("/advertiser/login")}>
              <img src={currentAdvertiser.url_profile_cover} alt=""
                className="w-[40px] h-[40px] object-cover rounded-full border-[3px] border-white" />
            </span>
          }

          <span className="w-[30px] h-[30px]" onClick={() => navigate("/floor/hub")}>
            <img src={hammer} alt="hammer" className="w-[30px] object-cover" />
          </span>

          <button
            onClick={handleClientAccess}
            className={tailwindItems}>
            <AccountCircle />
            <span>
              {
                currentClient.nickname ?
                  currentClient.nickname :
                  <span onClick={() => navigate("/client/login")}>entrar</span>
              }
            </span>
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navigation;
