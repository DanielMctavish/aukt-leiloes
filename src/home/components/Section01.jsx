/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import { useNavigate } from "react-router-dom"
import aukWhite from "../../media/logos/logos-auk/logo_model01_white.png"

function Section01() {
  const [cardsSelecteds, setCardsSelecteds] = useState([]);
  const [sortedAuctions, setSortedAuctions] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
    listAuctions()
  }, [])

  const getProducts = async () => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
      params: {
        take: 12,
        bid_count_order: 'true'
      }
    }).then(response => {
      setCardsSelecteds(response.data)
    })

  }

  const listAuctions = async () => {

    try {
      await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
        params: {
          status: "cataloged",
        }
      }).then(response => {
        getSortedAuctions(response.data)
        // console.log("leilões -> ", response.data)
      })
    } catch (error) {
      console.log("Error loading page:", error.message);
    }

  }

  const getSortedAuctions = async (auctions) => {

    const updateAuctions = () => {
      setSortedAuctions([])

      let card01 = auctions[0] && auctions[Math.floor(Math.random() * 12)];
      let card02 = auctions[0] && auctions[Math.floor(Math.random() * 12)];
      let card03 = auctions[0] && auctions[Math.floor(Math.random() * 12)];

      // Atualiza o estado com os novos valores
      setSortedAuctions([card01, card02, card03]);
    };

    updateAuctions();
  };


  return (
    <section className="flex flex-col w-full h-[100vh] bg-gradient-to-b from-[#0D1733]  to-[#fff0] relative overflow-hidden">

      <div className="flex w-full justify-between items-center  h-[40vh] relative mt-[10vh]">

        <div className="flex justify-start items-center">
          <img src={aukWhite} alt="" className="object-cover w-[440px] ml-[-3vh]" />

          <div className="flex flex-col w-[440px] ml-[-8vh]">
            <span className="text-[46px] font-bold">AUK Leilões</span>
            <span className="text-[26px]">Grandes Oportunidades Esperam por Você</span>
          </div>
        </div>

        {/* CARDS DE PRODUTOS */}
        <div className="w-[60%] flex justify-center items-center overflow-hidden gap-6 ">

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
                slidesPerView: 3,
                spaceBetween: 12,
              },
            }} >

            {cardsSelecteds.map((card, index) => (
              <SwiperSlide key={index}>
                <div
                  className="flex-1 h-full 
                overflow-hidden flex justify-center  slide-item-img 
                 items-center gap-3 rounded-lg relative "
                >

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
      </div>

      <div className="flex w-full h-[60vh] justify-between items-center p-3 gap-3 text-[#191919]">

        {
          sortedAuctions.slice(0, 3).map(auction => (
            <div key={auction.id} className=" bg-white flex flex-col flex-1 h-[90%] 
            rounded-md shadow-lg shadow-[#1c1c1c37] p-2 relative">
              <div className="flex w-full h-[10vh]">
                <div className="flex flex-col">
                  <span className="text-[14px]">{auction.Advertiser.name}</span>
                  <span className="text-[22px] font-bold">{auction.title}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 flex-1 h-[90%] justify-around items-center">
                {
                  auction.product_list.slice(0, 4).map(product => (
                    <div
                      key={product.id}
                      className="flex justify-center items-center bg-white rounded-md shadow p-2 h-[180px] w-[180px]"
                    >
                      <div className="flex flex-col justify-center items-center">
                        <img
                          src={product.cover_img_url}
                          alt={product.title}
                          className="h-[120px] w-[120px] object-cover rounded-md mb-2"
                        />
                        <span className="text-center text-[10px]">{product.title}</span>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)} className="flex w-full justify-end p-3">
                <button className="h-[40px] p-2 bg-[#0D1733] rounded-md text-white">veja mais</button>
              </div>

            </div>
          ))
        }

      </div>

    </section>

  );
}

export default Section01;
