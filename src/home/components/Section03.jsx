import axios from "axios"
import diversidadeDisplay from "../../media/display/diversidade.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Email } from "@mui/icons-material"


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

        <img src={diversidadeDisplay} alt="mãos unidas" className="w-[60%] h-[98%] object-cover rounded-md" />

        {/*Texto dev  */}
        <div className="flex w-[40%] h-[90%] flex-col justify-around items-start gap-2 p-4">
          <h2 className="text-[34px] font-bold text-[#0D1733]">Anuncie seus produtos em nossos leilões</h2>
          <h3 className="text-[24px] font-semibold text-[#0D1733]">Seus produtos bem apresentados!</h3>
          <p className="text-[18px] text-[#0D1733]">
            Tem produtos para leilão? Nossa plataforma moderna e inovadora é o lugar perfeito para você! Selecionamos cautelosamente nossos anunciantes para garantir a melhor experiência de compra e venda.
            Aproveite a oportunidade de alcançar um público amplo e diversificado. Entre em contato conosco e descubra como podemos ajudar a destacar seus itens. Nosso time está pronto para fornecer todos os detalhes e orientá-lo no processo.
          </p>
          <label className="text-[14px] font-semibold text-[#0D1733]">DIGITE SEU EMAIL:</label>
          <div className="flex items-center bg-[#0D1733] p-2 rounded-md shadow-md w-[400px]">
            <Email sx={{ color: "#ffffff" }} />
            <input type="email" className="bg-[#f0f0f0] text-[#0D1733] p-2 rounded-md ml-2 w-full"
              placeholder="seu email aqui" />
          </div>
        </div>

      </div>

    </section>
  );
}

export default Section03;
