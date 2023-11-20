/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Submenu from "../navigation/Submenu";
import ArrowLeft from "../medias/vector/arrow-left.svg";
import ArrowRight from "../medias/vector/arrow-right.svg";
import { CardHome } from "./cards/CardHome";
import cardItems from "./Data/CardItem.json";

function Section01() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const goToNextCard = () => {
    const nextIndex = (currentCardIndex + 1) % cardItems.length;
    console.log(`Next Index: ${nextIndex}`);
    setCurrentCardIndex(nextIndex);
  };

  const goToPreviousCard = () => {
    const previousIndex =
      (currentCardIndex - 1 + cardItems.length) % cardItems.length;
    console.log(`Previous Index: ${previousIndex}`);
    setCurrentCardIndex(previousIndex);
  };

  const cardItems = [

    { title: 'primeiro card1', body: 'conteúdo do card1', urlCover: 'https://cdn.motor1.com/images/mgl/Znnm7r/s1/ferrari-sp48-unica.webp' },
    { title: 'primeiro card2', body: 'conteúdo do card2', urlCover: 'https://fotos-jornaldocarro-estadao.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2022/09/19125632/Ferrari-Purosangue-2.jpg' },
    { title: 'primeiro card3', body: 'conteúdo do card3', urlCover: 'https://m.media-amazon.com/images/I/81meftoQVJL._AC_UF894,1000_QL80_.jpg' },
    { title: 'primeiro card4', body: 'conteúdo do card4', urlCover: 'https://m.media-amazon.com/images/I/71hdwN+riFL._AC_UF1000,1000_QL80_.jpg' },
    { title: 'primeiro card5', body: 'conteúdo do card5', urlCover: 'https://a-static.mlcdn.com.br/450x450/kit-4-beyblade-burst-com-lancador-rantaro-daigo-shu-e-outros-lianfa-toys/sandrapresentes/131987245p/a9d09d53d21ca135b055fd62879ce28a.jpeg' }

  ]

  return (
    <section className="lg:mt-2 mt-10 lg:mb-10 bg-[#FFFFFF]">
      <Submenu />
      <div className="w-full h-[80vh] flex justify-center items-center overflow-hidden gap-6">
        <div className="absolute lg:top-1/2 z-30 top-1/1 transform -translate-y-1/2 lg:left-[42vh] left-0">
          <button
            className="px-4 py-2 rounded cursor-pointer"
            onClick={goToPreviousCard}
          >
            <img src={ArrowLeft} alt="left" />
          </button>
        </div>
        {cardItems.map((card, index) => (
          <CardHome key={index} card={card} index={index} />
        ))}
        <div className="absolute lg:top-1/2 top-1/1 transform -translate-y-1/2 lg:right-80 right-0">
          <button
            className="px-4 py-2 rounded cursor-pointer"
            onClick={goToNextCard}
          >
            <img src={ArrowRight} alt="right" />
          </button>
        </div>
      </div>
    </section>
  );
}


export default Section01;
