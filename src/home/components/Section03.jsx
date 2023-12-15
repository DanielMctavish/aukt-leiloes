import { useState } from "react";
import "./Home.css";
import CardMarked from "../micro-components/CardMarked";

import Ferrari from "../medias/backgrounds/ferrari.png";
import ArrowLeft from "../medias/vector/arrow-left.svg";
import ArrowRight from "../medias/vector/arrow-right.svg";
import CardCategory from "../micro-components/CardCategory";

function Section03() {
  

  const cardCategories = [
    {
      category: "veiculos",
      imagem: Ferrari,
      title: "Ferrari única",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Joia",
      imagem:
        "https://media.istockphoto.com/id/1338646661/pt/foto/gold-jewelry-diamond-rings-show-in-luxury-retail-store-window-display-showcase.jpg?s=612x612&w=0&k=20&c=8uyKDciZmhnia-ZehC06M810kk8cF_BJy4c0J3rhzAE=",
      title: "Joias",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Miniaturas",
      imagem:
        "https://www.engeplus.com.br/cache/noticia/0125/0125179/125179--1097825.jpg",
      title: "Miniaturas",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Roupas",
      imagem:
        "https://img.freepik.com/fotos-gratis/loja-de-roupas-loja-de-roupas-em-cabide-na-boutique-loja-moderna_1150-8886.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1699228800&semt=ais",
      title: "Roupas",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Brinquedos",
      imagem:
        "https://cdn.awsli.com.br/600x450/1300/1300531/produto/149205099/brinquedo-pista-carrinho-infantil-educativo-madeira-cidade-1-wwksjy.jpg",
      title: "Brinquedos",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Antiguidades",
      imagem:
        "https://d26lpennugtm8s.cloudfront.net/stores/001/230/454/rte/_G241670-HDR.jpg",
      title: "Antiguidades",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Espadas",
      imagem:
        "https://cdn.awsli.com.br/600x1000/2515/2515067/produto/183668587a72c355107.jpg",
      title: "Espadas",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Replicas",
      imagem:
        "https://media.gazetadopovo.com.br/2019/07/17174556/ferrari-lamborghini-itajai-falso-11-952x540.jpg",
      title: "Replicas",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Quadros",
      imagem:
        "https://67064.cdn.simplo7.net/static/67064/sku/quadros-cidades-quadro-decorativo-3-telas-paisagem-cidade-pintura-de-paris-franca-p-1685120859846.jpg",
      title: "Quadros",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Livro",
      imagem:
        "https://www.bienaldolivrojf.com.br/wp-content/uploads/2023/07/Fotos-livros-cores-escada-conhecimento.webp",
      title: "Livro",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Arte",
      imagem:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuvZ4hJEkQ711qR4kvxQK8wV9awLFBD4brgA&usqp=CAU",
      title: "Arte Moderna",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      category: "Musica",
      imagem:
        "https://i0.wp.com/www.sabra.org.br/site/wp-content/uploads/2020/04/instrumentos-musicais-voce-sabe-quais-sao-os-mais-tocados-no-mundo-20191202180617.jpg.jpg?fit=800%2C600&ssl=1",
      title: "Intrumento Musical",
      body: " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setCurrentIndex(0);
    setActiveCategory(category);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cardCategories.length);
    setActiveCategory(null);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cardCategories.length - 1 : prevIndex - 1
    );
    setActiveCategory(null);
  };

  const currentCard = activeCategory
  ? cardCategories.find((category) => category.category === activeCategory)
  : cardCategories[currentIndex];


  return (
    <section className="w-full h-full mb-0 sm:mt-0 mt-0 flex flex-col ">
      <div className="w-full lg:h-[443px] bg-[#1E1E1E] flex items-center lg:justify-center lg:flex flex-col lg:flex-row">
        <div className="mt-0 lg:mb-[390px] ml-10">
          <h2 className=" text-[#FFFFFF1F] text-[18px] font-semibold leading-[7.11px]">
            A U K T
          </h2>
        </div>
        <div className="w-[280px] text-[#fff]  text-shadow-[2px] ">
          <h2 className="text-[44px] font-semibold leading-normal tracking-wide">
            Leilões Marcados
          </h2>
          <span className="text-[#D7D7D7] text-[10px] leading-[1.05px]">
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiulgod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrum exercitationem ullam corporis suscipit
            laboriosam.
          </span>
        </div>
        <div>
          <CardMarked />
        </div>
      </div>

      <div
        className="w-full lg:h-[660px] h-full lg:flex lg:flex-row flex-col lg:items-center lg:justify-center "
        id="section03"
      >
        <div className="lg:w-[410px] w-full text-[#fff] lg:ml-16 ml-6 text-shadow-[2px]">
          <h2 className="lg:text-[38px] text-[20px] font-semibold text-shadow-[2px] leading-normal tracking-wide">
            Produtos em <br />
            leilão por categoria
          </h2>
          <span className="text-[#D7D7D7] text-[10px] leading-[1.05px]">
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrum exercitationem ullam corporis suscipit
            laboriosam.
          </span>
        </div>
        <div className="lg:w-[975px] w-full lg:h-[450px] h-auto pl-2 lg:mr-7 lg:ml-4 lg:mt-0 mt-4 rounded-[12px] bg-[#1D1D1D] relative">
          <img
            src={ArrowLeft}
            alt="Arrow Left"
            className="absolute left-2 top-[190px] z-20 transform[-50%] cursor-pointer"
            onClick={handlePrev}
          />
          <CardCategory card={currentCard} />
          <img
            src={ArrowRight}
            alt="Arrow Right"
            className="absolute right-0 top-[190px] z-20 transform[-50%] cursor-pointer"
            onClick={handleNext}
          />
        </div>

        <div className="lg:w-[250px] h-[660px]  bg-[#F5F5F5]">
          <div className="items-center justify-center mb-4 lg:mb-0 lg:pl-7 pl-20 pt-10  ">
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Joia" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Joia")}
            >
              Jóias e tesouros
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "veiculos" ? "active" : "active"
              }`}
              onClick={() => handleCategoryClick("veiculos")}
            >
              Veículos
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Miniaturas" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Miniaturas")}
            >
              Miniaturas
            </span>

            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Roupas" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Roupas")}
            >
              Roupas
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Brinquedos" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Brinquedos")}
            >
              Brinquedos
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Antiguidades" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Antiguidades")}
            >
              Antiguidades
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Espadas" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Espadas")}
            >
              Espadas
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Replicas" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Replicas")}
            >
              Réplicas
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Quadros" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Quadros")}
            >
              Quadros
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Livro" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Livro")}
            >
              Livros
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Arte" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Arte")}
            >
              Arte moderna
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeCategory === "Musica" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Musica")}
            >
              Instrumento Musical
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section03;
