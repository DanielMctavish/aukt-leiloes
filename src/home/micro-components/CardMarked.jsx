import React, {useState, useEffect} from "react";
import Alert from "../medias/vector/vector.svg";
import ArrowLeft from "../medias/vector/arrow-left.svg";
import ArrowRight from "../medias/vector/arrow-right.svg";
import Car from "../medias/backgrounds/car.png";

function CardMarked() {
  const [offset, setOffset] = useState(0);
  const [cardsSelecteds, setCardsSelecteds] = useState([]);
  const cardItems = [
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "13/09/2023",
    },
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "14/09/2023",
    },
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "15/09/2023",
    },
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "16/09/2023",
    },
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "13/09/2023",
    },
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "14/09/2023",
    },
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "15/09/2023",
    },
    {
      imagem: Car,
      title: "Leilão antiguida...",
      subtitle: "Promovido:",
      subtitleDate: "Data:",
      body: "LeilosNew",
      date: "16/09/2023",
    }
  ];
  useEffect(() => {
    mapCards();
  }, [offset]);

  function mapCards() {
    const newCards = cardItems
      .map((card, index) => {
        const cardIndex = (offset + index) % cardItems.length;
        return cardItems[cardIndex];
      })
      .slice(0, 4);
    setCardsSelecteds(newCards);
  }

  const handlePrevCard = () => {
    const newOffset = (offset - 1 + cardItems.length) % cardItems.length;
    setOffset(newOffset);
  };

  const handleNextCard = () => {
    const newOffset = (offset + 1) % cardItems.length;
    setOffset(newOffset);
  };

  useEffect(() => {
    const handleBoundaryOffset = () => {
      if (offset < 0) {
        setOffset(cardItems.length - 1);
      } else if (offset >= cardItems.length) {
        setOffset(0);
      }
    };

    handleBoundaryOffset();
  }, [offset, cardItems.length]);
  return (
    <div className="lg:flex space-x-4 lg:mr-10 flex-col lg:flex-row lg:mt-0 mt-">
      <img src={ArrowLeft} alt="Arrow Left" className=" cursor-pointer" onClick={handlePrevCard}/>
      {cardsSelecteds.map((card, index) => (
        <div
          key={index}
          className="relative w-[250px] h-[303px] bg-[#F5F5F5] sm:mb-0 mb-4"
        >
          <div className="absolute mt-[-14px] ml-[-14px]">
            <img src={Alert} alt="Alert" />
          </div>
          <span className="w-[192px] h-[185px] relative">
            <img src={card.imagem} alt="" className="object-cover p-8" />
          </span>
          <span className="text-[#474747] text-[22px] leading-[0.44px] text-center font-normal block">
            {card.title}
          </span>
          <div className="flex gap-[60px]">
            <div className="text-left mt-7 ml-10 leading-9">
              <span className="text-[#8D8D8D] text-[12px] font-normal block leading-[0.24px]">
                {card.subtitle}
              </span>
              <span className="text-[#8D8D8D] text-[12px] font-normal leading-[0.24px]">
                {card.subtitleDate}
              </span>
            </div>
            <div className="text-right mt-7 italic leading-9">
              <span className="text-[#8D8D8D] text-[12px] font-normal block leading-[0.24px]">
                {card.body}
              </span>
              <span className="text-[#949494] text-[10px] font-normal leading-[0.24px]">
                {card.date}
              </span>
            </div>
          </div>
        </div>
      ))}
      <img src={ArrowRight} alt="Arrow Right" className=" cursor-pointer" onClick={handleNextCard} />
    </div>
  );
}

export default CardMarked;
