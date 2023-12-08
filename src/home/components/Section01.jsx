/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Submenu from "../navigation/Submenu";
import ArrowLeft from "../medias/vector/arrow-left.svg";
import ArrowRight from "../medias/vector/arrow-right.svg";

function Section01() {
  const [offset, setOffset] = useState(0);
  const [cardsSelecteds, setCardsSelecteds] = useState([]);

  const myCards = [
    {
      title: "primeiro card1",
      body: "conteúdo do card1",
      urlCover:
        "https://cdn.motor1.com/images/mgl/Znnm7r/s1/ferrari-sp48-unica.webp",
    },
    {
      title: "primeiro card2",
      body: "conteúdo do card2",
      urlCover:
        "https://fotos-jornaldocarro-estadao.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2022/09/19125632/Ferrari-Purosangue-2.jpg",
    },
    {
      title: "primeiro card3",
      body: "conteúdo do card3",
      urlCover:
        "https://m.media-amazon.com/images/I/81meftoQVJL._AC_UF894,1000_QL80_.jpg",
    },
    {
      title: "primeiro card4",
      body: "conteúdo do card4",
      urlCover:
        "https://m.media-amazon.com/images/I/71hdwN+riFL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      title: "primeiro card5",
      body: "conteúdo do card5",
      urlCover:
        "https://a-static.mlcdn.com.br/450x450/kit-4-beyblade-burst-com-lancador-rantaro-daigo-shu-e-outros-lianfa-toys/sandrapresentes/131987245p/a9d09d53d21ca135b055fd62879ce28a.jpeg",
    },
  ];
  useEffect(() => {
    mapCards();
  }, [offset]);

  function mapCards() {
    const newCards = myCards
      .map((card, index) => {
        const cardIndex = (offset + index) % myCards.length;
        return myCards[cardIndex];
      })
      .slice(0, 3);
    setCardsSelecteds(newCards);
  }

  const handlePrevCard = () => {
    const newOffset = (offset - 1 + myCards.length) % myCards.length;
    setOffset(newOffset);
  };

  const handleNextCard = () => {
    const newOffset = (offset + 1) % myCards.length;
    setOffset(newOffset);
  };

  useEffect(() => {
    const handleBoundaryOffset = () => {
      if (offset < 0) {
        setOffset(myCards.length - 1);
      } else if (offset >= myCards.length) {
        setOffset(0);
      }
    };

    handleBoundaryOffset();
  }, [offset, myCards.length]);

  return (
    <section className="lg:mt-2 mt-10 lg:mb-10 bg-[#FFFFFF]">
      <Submenu />
      <div className="w-full h-[80vh] flex justify-center items-center overflow-hidden gap-6">
        <div className="absolute lg:top-1/2 z-30 top-1/1 transform -translate-y-1/2 lg:left-[42vh] left-0">
          <button
            className="px-4 py-2 rounded cursor-pointer"
            onClick={handlePrevCard}
          >
            <img src={ArrowLeft} alt="left" />
          </button>
        </div>
        {cardsSelecteds.map((card, index) => (
          <div
            key={index}
            className="lg:min-w-[900px] min-w-[90%] h-[90%] 
    overflow-hidden flex flex=col justify-center 
    items-center gap-3 rounded-lg relative bg-zinc-200"
          >
            <div
              className={`flex justify-center items-center h-[100%] overflow-hidden`}
            >
              <img
                src={card.urlCover}
                alt=""
                className="object-cover rounded-lg h-[100%]"
              />
            </div>

            <div
              className="absolute  text-[#FFF] bg-zinc-300/60 flex flex-col justify-center items-center p-3
    lg:mr-60 text-shadow-md font-inter lg:pb-[70px] overflow-hidden rounded-md"
            >
              <h1 className="lg:text-[22px] text-[16px] lg:mb-2 font-bold overflow-hidden drop-shadow-md shadow-[#060606]">
                {card.title}
              </h1>
              <p className="lg:text-[14px] text-[12px] block lg:mb-8 font-semibold tracking-widest overflow-hidden">
                {card.body}
              </p>
              <button className="w-[161px] h-[36px] bg-[#012038] rounded-[2px] text-[#f2f2f2] text-[14px] font-normal`">
                DAR UM LANCE
              </button>
            </div>
          </div>
        ))}
        <div className="absolute lg:top-1/2 top-1/1 transform -translate-y-1/2 lg:right-80 right-0">
          <button
            className="px-4 py-2 rounded cursor-pointer"
            onClick={handleNextCard}
          >
            <img src={ArrowRight} alt="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Section01;
