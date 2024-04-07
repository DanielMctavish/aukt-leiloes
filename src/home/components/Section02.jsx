import React from "react";
import CardContrast from "../micro-components/CardContrast";
import Car from "../medias/backgrounds/car.png";

function Section02() {
  const cardItems = [
    {
      imagem: Car,
      title: "CARRO MINIATURA REPLICA - PORSCHE",
      body: "CAR Lengendarys",
    },
    {
      imagem: Car,
      title: "CARRO MINIATURA REPLICA - PORSCHE",
      body: "CAR Lengendarys",
    },
    {
      imagem: Car,
      title: "CARRO MINIATURA REPLICA - PORSCHE",
      body: "CAR Lengendarys",
    },
    {
      imagem: Car,
      title: "CARRO MINIATURA REPLICA - PORSCHE",
      body: "CAR Lengendarys",
    },
    {
      imagem: Car,
      title: "CARRO MINIATURA REPLICA - PORSCHE",
      body: "CAR Lengendarys",
    },
    {
      imagem: Car,
      title: "CARRO MINIATURA REPLICA - PORSCHE",
      body: "CAR Lengendarys",
    },
  ];
  return (
    <section className="bg-[#D9D9D9] w-full h-full overflow-x-hidden overflow-y-hidden pt-[100px]">
      <div className="flex flex-col items-center justify-center  ">
        <h2 className="bg-[#E2E2E2] lg:w-[1260px] h-[48px] p-4 text-[#012038] text-[22px] font-bold leading-[14px]">
          NOSSOS DESTAQUES (ao vivo)
        </h2>

        <div className="pt-4 lg:grid grid-cols-3 gap-24  lg:w-[1260px] w-full">
          <div className="lg:w-[442px] h-[802px] w-full" id="Section02">
            <div
              className="w-[397px] h-[300px] flex-shrink-0 pt-10 items-center justify-center"
              style={{
                background:
                  "linear-gradient(185deg, #171717 7.88%, rgba(0, 0, 0, 0.40) 50.54%, rgba(21, 21, 21, 0.00) 88.14%)",
              }}
            >
              <h2 className="text-center text-[#fff] text-[22px] font-bold leading-[2px] mb-6">
                ANUNCIE SEU PRODUTO
              </h2>
              <div className="w-[240px]  h-[163px] text-[#D7D7D7] text-[10px] ml-[76px] text-justify">
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipisci elit, sed
                  eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrum exercitationem ullam
                  corporis suscipit laboriosam.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:grid grid-cols-2 pt-7 lg:pl-0 pl-4 gap-6 lg:w-[807px] lg:max-h-[800px] max-h-[780px] overflow-y-auto custom-scrollbar">
            {cardItems.map((card, index) => (
              <CardContrast key={index} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section02;
