import axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import videoSource from '../../media/videos/auk_display_video2.mp4'; // Importa o vídeo diretamente
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "@mui/icons-material"
import { useNavigate } from "react-router-dom";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Section02() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
        params: {
          take: 12,
          bid_count_order: 'true'
        }
      });
      setProducts(result.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  return (
    <section className="bg-[#ececec] w-full min-h-screen flex flex-col justify-center items-center overflow-x-hidden overflow-y-hidden p-3 gap-4">
      <div className="w-full flex flex-col lg:flex-row justify-around items-center gap-4 lg:gap-8">
        <span className='text-[#242424] text-lg lg:text-xl font-semibold text-center lg:text-left mb-4 lg:mb-0'>
          Pregão com alta tecnologia e velocidade
        </span>
        <div className="w-full lg:w-[60%] aspect-video">
          <video className='w-full h-full object-cover rounded-md brightness-[1.2]' autoPlay loop muted playsInline>
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="w-full lg:w-[98%] flex flex-col gap-4 bg-white rounded-md shadow-lg shadow-[#09090926] overflow-hidden p-4">
        <h2 className="text-xl lg:text-2xl font-bold text-[#1c1c1c]">Produtos com mais lances da semana</h2>
        <div className="relative">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 5, spaceBetween: 40 },
            }}
          >
            {products.map((product, index) => (
              <SwiperSlide key={index}>
                <div 
                  onClick={() => navigate(`/advertiser/home/product/${product.id}`)} 
                  className="flex flex-col justify-between items-center gap-2 overflow-hidden cursor-pointer 
                             h-full bg-white rounded-md shadow-md shadow-[#18181887] p-2 transition-transform duration-300 hover:scale-105"
                >
                  <img src={product.cover_img_url} alt={product.title} className='w-full aspect-square object-cover rounded-md' />
                  <h3 className="text-sm font-semibold text-center mt-2">{product.title}</h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev text-[#121212] hidden lg:flex">
            <ArrowLeft sx={{ fontSize: "40px" }} />
          </div>
          <div className="swiper-button-next text-[#121212] hidden lg:flex">
            <ArrowRight sx={{ fontSize: "40px" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section02;
