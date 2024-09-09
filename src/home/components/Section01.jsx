/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import { useNavigate } from "react-router-dom"
import aukWhite from "../../media/logos/logos-auk/logo_model01_white.png"
import { Gavel, LiveTv, ShoppingCart, AttachMoney, LibraryBooks, CheckCircle } from "@mui/icons-material"

function Section01() {
  const [cardsSelecteds, setCardsSelecteds] = useState([]);
  const [counters, setCounters] = useState({});
  const [productCounters, setProductCounters] = useState({ count: 0, countWithBid: 0 }); // Novo useState

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    getCountersAuct();
    getProductCounters();
  }, []);

  const getProducts = async () => {
    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
      params: {
        take: 12,
        bid_count_order: 'true'
      }
    }).then(response => {
      setCardsSelecteds(response.data);
    });
  };

  const getCountersAuct = async () => {
    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/counter`).then(response => {
      console.log("response counters -> ", response.data);
      setCounters(prevCounters => ({ ...prevCounters, ...response.data }));
    });
  };

  const getProductCounters = async () => {
    try {
      const [countProducts, countProductsWithBids] = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/count-products`),
        axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/count-products-with-bids`)
      ]);

      setProductCounters({
        count: countProducts.data.countAll,
        countWithBid: countProductsWithBids.data.countAll
      });
    } catch (error) {
      console.log("Error fetching product counters:", error);
    }
  };

  useEffect(() => { }, [counters]);

  return (
    <section className="flex flex-col w-full h-[100vh] 
    justify-start items-center gap-1
    bg-gradient-to-b from-[#000000]  to-[#0D1733] relative overflow-hidden">

      <div className="flex flex-col w-full justify-center items-center  h-[20vh] relative mt-[12vh]">

        <img src={aukWhite} alt="" className="object-cover h-[80%] ml-[-3vh] flex justify-center" />

        <div className="flex flex-col w-full justify-center items-center">
          <span className="text-[26px] font-bold">AUK Leilões</span>
          <span className="text-[16px]">Grandes Oportunidades Esperam por Você</span>
        </div>

      </div>

      {/* CARDS DE PRODUTOS */}
      <div className="w-full flex justify-center items-center overflow-hidden gap-6 h-[40vh] ">

        <Swiper
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 3,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 4,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 12,
            },
          }} >

          {cardsSelecteds.map((card, index) => (
            <SwiperSlide key={index}>
              <div
                className="flex-1 h-full 
      overflow-hidden flex justify-center  slide-item-img 
       items-center gap-3 rounded-lg relative ">

                <img
                  src={card ? card.cover_img_url : ""}
                  className="h-[300px] flex-1 object-cover rounded-md"
                />

                <div className="absolute backdrop-blur-md text-[#FFF] bg-zinc-300/60 border-[#ffffff55] border-[1px] 
            flex flex-col justify-center items-center p-3 text-shadow-md font-inter w-full h-full z-20
            overflow-hidden rounded-md opacity-0 hover:opacity-100 transition duration-[.3s]">

                  <h1 className="lg:text-[22px] text-[16px] lg:mb-2 font-bold overflow-hidden drop-shadow-md shadow-[#060606]">
                    {card.title}
                  </h1>
                  <p className="lg:text-[14px] text-[12px] block lg:mb-8 font-semibold tracking-widest overflow-hidden h-[70%] overflow-y-auto">
                    {card.description}
                  </p>
                  <button onClick={() => navigate(`/advertiser/home/product/${card.id}`)}
                    className="w-[161px] h-[36px] bg-[#012038] rounded-[2px] text-[#f2f2f2] text-[14px] font-normal hover:space-x-3">
                    ver este lote
                  </button>

                </div>

              </div>
            </SwiperSlide>

          ))}

        </Swiper>


      </div>

      <div className="flex flex-col w-full h-[30vh] justify-center items-center gap-3">
        <div className="flex lg:w-[70%] w-[98%] min-h-[14vh]  text-[#e1e1e1] justify-around items-center">

          <div className="flex flex-col gap-3 justify-center items-center">
            <Gavel sx={{ fontSize: "33px" }} />
            <span className="text-[14px]">Leilões Registrados</span>
            <span className="font-bold text-[22px]">{counters.countAll}</span>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <LiveTv sx={{ fontSize: "33px" }} />
            <span className="text-[14px]">Ao vivo</span>
            <span className="font-bold text-[#ff5050] text-[22px]">{counters.countLive}</span>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <LibraryBooks sx={{ fontSize: "33px" }} />
            <span className="text-[14px]">Catalogado</span>
            <span className="font-bold text-[#1c7ea4] text-[22px]">{counters.countCataloged}</span>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <CheckCircle sx={{ fontSize: "33px" }} />
            <span className="text-[14px]">Finalizado</span>
            <span className="font-bold text-[#2ada2f] text-[22px]">{counters.countFinished}</span>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <ShoppingCart sx={{ fontSize: "33px" }} />
            <span className="text-[14px]">Produtos criados</span>
            <span className="font-bold text-[22px]">{productCounters.count}</span>

          </div>

          <div className="flex flex-col gap-3 justify-center items-center">
            <AttachMoney sx={{ fontSize: "33px" }} />
            <span className="text-[14px]">Produtos com Lances</span>
            <span className="font-bold text-[22px]">{productCounters.countWithBid}</span>
          </div>

        </div>
      </div>

    </section>

  );
}

export default Section01;
