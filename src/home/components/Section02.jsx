import axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import videoSource from '../../media/videos/auk_display_video.mp4'; // Importa o vídeo diretamente
import { useEffect, useState } from "react";
import { ArrowLeft } from "@mui/icons-material"
import { useNavigate } from "react-router-dom";

function Section02() {
  const [products, setProducts] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
      params: {
        take: 12,
        bid_count_order: 'true'
      }
    }).then(result => {
      // console.log("products -> ", result.data)
      setProducts(result.data)
    })

  }


  return (
    <section className="bg-[#ececec] w-full h-[100vh] flex flex-col justify-center items-center overflow-x-hidden overflow-y-hidden p-3 gap-2">

      <div className="w-full h-[60vh] flex justify-around items-center">

        <span className='text-[#242424]'>pregão com alta tecnologia e velocidade</span>

        <video className='w-[60%] max-h-[96%] object-cover rounded-md brightness-[1.2]' autoPlay loop muted>
          <source src={videoSource} type="video/mp4" /> {/* Atualize para mp4 e use a variável importada */}
          Your browser does not support the video tag.
        </video>

      </div>

      <div className="w-[98%] flex flex-col gap-1 h-[30vh] bg-[#ffffff] justify-start items-start
      rounded-md shadow-lg shadow-[#09090926] overflow-hidden p-3">
        <span className="text-[22px] font-bold text-[#1c1c1c]">Produtos com mais lances da semana</span>
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

    </section>
  );
}

export default Section02;
