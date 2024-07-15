import { useState } from "react";
import backgroundCategorie from "../../media/backgrounds/background-categories.jpg"
import CardMarked from "../micro-components/CardMarked";


function Section03() {
  const [activeCategory] = useState(null);


  return (
    <section className="w-full lg:h-[143vh] h-[200vh] mb-0 sm:mt-0 mt-0 flex flex-col ">

      {/* LEILÕES MARCADOS */}
      <div className="w-full lg:h-[43vh] h-[100vh] bg-[#1E1E1E] flex lg:flex-row items-center 
      justify-between flex-col">

        <div className="lg:w-[26%] w-full h-full text-[#fff] 
        text-shadow-[2px] bg-zinc-700 flex flex-col justify-center items-center p-3">

          <h2 className="text-[34px] font-semibold leading-normal tracking-wide">
            Leilões Marcados
          </h2>
          <span className="text-[#D7D7D7] text-[14px] flex h-auto w-[90%] text-justify">
            Nossa plataforma oferece uma seleção exclusiva de leilões com produtos anunciados por nossos parceiros e anunciantes cuidadosamente selecionados.
            Garantimos a qualidade e a procedência dos itens, proporcionando a você uma experiência de compra segura e confiável.
          </span>
          <span className="text-[#D7D7D7] text-[16px] flex h-auto w-[90%] text-justify mt-[1vh]">
            Nossos leilões apresentam uma variedade de produtos únicos e de alto valor, todos verificados para atender aos nossos rigorosos padrões.
          </span>
        </div>

        <CardMarked />

      </div>

      {/* CATEGORIAS */}
      <div
        className="w-full h-[100vh] lg:flex lg:flex-row flex-col lg:items-center lg:justify-center relative"
      >

        <img src={backgroundCategorie} alt="" className="w-full h-full object-cover absolute" />

        <div className="lg:w-[80%] w-full text-[#fff] lg:ml-16 ml-6 text-shadow-[2px]">

        </div>


        <div className="lg:w-[20%] w-full lg:h-full h-[100vh]  bg-[#f5f5f5b4] z-10 backdrop-blur-[12px]">

          <div className="items-center justify-center mb-4 lg:mb-0 lg:pl-7 pl-20 pt-10  ">
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${activeCategory === "Joia" ? "active" : ""
                }`}
            >
              Jóias e tesouros
            </span>

          </div>
        </div>

      </div>

    </section>
  );
}

export default Section03;
