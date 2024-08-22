import axios from "axios"
import diversidadeDisplay from "../../media/display/diversidade.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@mui/icons-material"


function Section03() {
  const [products, setProducts] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])


  const getProducts = async () => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
      params: {
        take: 8,
      }
    }).then(result => {
      // console.log("products -> ", result.data)
      setProducts(result.data)
    })

  }

  return (
    <section className="w-full h-[100vh] flex flex-col justify-center items-center gap-2">

      <div className="w-[98%] flex flex-col gap-1 h-[30vh] bg-[#ffffff] justify-start items-start
      rounded-md shadow-lg shadow-[#09090926] overflow-hidden p-3">
        <span className="text-[22px] font-bold text-[#1c1c1c]">Produtos mais recentes</span>
        <div className="flex justify-start items-center w-full h-[30vh]">
          <ArrowLeft className='cursor-pointer text-[#121212]' sx={{ fontSize: "63px" }} />
          <Swiper spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
          >
            {
              products.map((product, index) => (
                <SwiperSlide key={index}>
                  <div onClick={() => navigate(`/advertiser/home/product/${product.id}`)} className="flex justify-around items-center gap-3 overflow-hidden cursor-pointer 
                  flex-1 h-full bg-[#ffffff] rounded-md shadow-md shadow-[#18181887]">
                    <img src={product.cover_img_url} alt={product.title} className='w-[100%] h-[20vh] object-cover' />
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </div>

      <div className="w-[98%] flex gap-1 h-[60vh] bg-[#ffffff] justify-start items-start
      rounded-md shadow-lg shadow-[#09090926] overflow-hidden p-3">
        <img src={diversidadeDisplay} alt="mãos unidas" className="w-[60%] h-[98%] object-cover rounded-md"/>
      </div>

    </section>
  );
}

export default Section03;
