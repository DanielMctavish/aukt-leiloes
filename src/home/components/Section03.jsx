import axios from "axios"
import diversidadeDisplay from "../../media/display/diversidade.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Email } from "@mui/icons-material"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Section03() {
  const [products, setProducts] = useState([])
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
      params: {
        take: 8,
      }
    });
    setProducts(result.data);
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Implement email submission logic here
    setEmail('');
  }

  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center gap-8 bg-gradient-to-b from-[#ececec] to-[#ffffff] py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl lg:text-3xl font-bold text-[#0D1733] text-center">Produtos Recentes</h2>

      <div className="w-full">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                className="flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <img src={product.cover_img_url} alt={product.title} className='w-full h-48 object-cover' />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-[#0D1733] mb-2">{product.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 items-center">
        <img src={diversidadeDisplay} alt="mãos unidas" className="w-full lg:w-1/2 h-auto object-cover rounded-lg shadow-lg" />

        <div className="w-full lg:w-1/2 flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#0D1733]">Anuncie seus produtos em nossos leilões</h2>
          <h3 className="text-xl font-semibold text-[#0D1733]">Seus produtos bem apresentados!</h3>
          <p className="text-base text-[#0D1733]">
            Tem produtos para leilão? Nossa plataforma moderna e inovadora é o lugar perfeito para você! Selecionamos cautelosamente nossos anunciantes para garantir a melhor experiência de compra e venda.
            Aproveite a oportunidade de alcançar um público amplo e diversificado. Entre em contato conosco e descubra como podemos ajudar a destacar seus itens. Nosso time está pronto para fornecer todos os detalhes e orientá-lo no processo.
          </p>
          <form onSubmit={handleEmailSubmit} className="mt-4">
            <label htmlFor="email" className="block text-sm font-semibold text-[#0D1733] mb-2">DIGITE SEU EMAIL:</label>
            <div className="flex items-center bg-[#0D1733] p-2 rounded-md shadow-md">
              <Email sx={{ color: "#ffffff" }} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#f0f0f0] text-[#0D1733] p-2 rounded-md ml-2 w-full"
                placeholder="seu email aqui"
                required
              />
              <button type="submit" className="ml-2 bg-[#005699] text-white px-4 py-2 rounded-md hover:bg-[#004477] transition-colors duration-300">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Section03;
