/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import Submenu from "../navigation/Submenu";
import ArrowLeft from "../medias/vector/arrow-left.svg";
import ArrowRight from "../medias/vector/arrow-right.svg";

function Section01() {
  const [cardsSelecteds, setCardsSelecteds] = useState([]);
  const [newCardsOrganization, setNewCardsOrganization] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list?offset=${15}`).then(response => {
      setCardsSelecteds(response.data)
    })

  }
  // PROXIMO CARD ........................................................................
  const handleNextCard = () => {
    const newCardsOrganization = [];
    let firstCard;

    for (const [index, card] of cardsSelecteds.entries()) {
      if (index === 0) {
        firstCard = card;
        continue;
      }
      newCardsOrganization.push(card);
    }

    newCardsOrganization.push(firstCard);
    setNewCardsOrganization(newCardsOrganization);
    setCardsSelecteds(newCardsOrganization);

  };

  //CARD ANTERIOR ................................................................................
  const handlePrevCard = () => {
    const newCardsOrganization = [...cardsSelecteds];
    const lastCard = newCardsOrganization.pop(); // Remove o último item do array
    newCardsOrganization.unshift(lastCard); // Adiciona o último item no início do array

    setNewCardsOrganization(newCardsOrganization);
    setCardsSelecteds(newCardsOrganization);

  };



  useEffect(() => {
    setCardsSelecteds(newCardsOrganization)
    //console.log("cards atuais -> ", cardsSelecteds)
  }, [newCardsOrganization])




  return (
    <section className="flex flex-col w-full bg-[#FFFFFF] relative overflow-hidden">

      <Submenu />


      {/* CARDS DE PRODUTOS */}
      <div className="w-full h-[80vh] flex justify-center items-center overflow-hidden gap-6">

        {/* ------------------------Botões de passagem de produto ------------------------*/}

        <div className="md:w-[220px] w-[50px] h-full flex justify-center items-center md:bg-gradient-to-r bg-transparent from-[#FFFFFF] to-[#ffffff00] absolute top-2 left-0 z-30">
          <button onClick={handlePrevCard} className="hover:opacity-100  opacity-40">
            <img src={ArrowLeft} alt="" />
          </button>
        </div>

        <div className="md:w-[220px] w-[50px] h-full flex justify-center items-center md:bg-gradient-to-l bg-transparent from-[#FFFFFF] to-[#ffffff00] absolute top-2 right-0 z-30">
          <button onClick={handleNextCard} className="hover:opacity-100  opacity-40">
            <img src={ArrowRight} alt="" />
          </button>
        </div>
        {/* --------------------------------------------------------------------------------- */}


        {cardsSelecteds.map((card, index) => (
          <div
            key={index}
            className="lg:min-w-[900px] min-w-[90%] h-[90%] 
            overflow-hidden flex justify-center 
            items-center gap-3 rounded-lg relative bg-zinc-200"
          >
            <div className={`flex justify-center items-center h-[100%] overflow-hidden`}>
              <img
                src={card ? card.cover_img_url : ""}
                className="object-cover rounded-lg h-[100%]"
              />
            </div>

            <div className="absolute backdrop-blur-md text-[#FFF] bg-zinc-300/60 border-[#ffffff55] border-[1px] 
            flex flex-col justify-center items-center p-3 
            text-shadow-md font-inter w-[60%] z-20
            overflow-hidden rounded-md opacity-20 hover:opacity-100 transition duration-[.3s]">
              <h1 className="lg:text-[22px] text-[16px] lg:mb-2 font-bold overflow-hidden drop-shadow-md shadow-[#060606]">
                {card.title}
              </h1>
              <p className="lg:text-[14px] text-[12px] block lg:mb-8 font-semibold tracking-widest overflow-hidden">
                {card.description}
              </p>
              <button onClick={() => navigate(`/advertiser/home/product/${card.id}`)}
                className="w-[161px] h-[36px] bg-[#012038] rounded-[2px] text-[#f2f2f2] text-[14px] font-normal hover:space-x-3">
                ver este lote
              </button>
            </div>

          </div>
        ))}

      </div>

    </section>

  );
}

export default Section01;
