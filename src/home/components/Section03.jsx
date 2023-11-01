import React, { useState } from "react";
import "./Home.css";
import CardMarked from "../micro-components/CardMarked";
import Car from "../medias/backgrounds/car.png";
import ArrowLeft from "../medias/vector/arrow-left.svg";
import ArrowRight from "../medias/vector/arrow-right.svg";

function Section03() {
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };
  
  return (
    <section className="sm:w-[1920px] h-full mb-0 sm:mt-0 mt-0 flex flex-col ">
      <div className="sm:w-[1920px] sm:h-[443px] bg-[#1E1E1E] flex items-center sm:justify-center sm:flex sm:mr-10 flex-col sm:flex-row">
        <div className="mt-0 sm:mb-[390px] ml-10">
          <h2 className=" text-[#FFFFFF1F] text-[18px] font-semibold leading-[7.11px]">
            A U K T
          </h2>
        </div>
        <div className="w-[280px] text-[#fff]  text-shadow-[2px] ">
          <h2 className="text-[44px] font-semibold leading-normal tracking-wide">
            Leilões Marcados
          </h2>
          <span className="text-[#D7D7D7] text-[10px] leading-[1.05px]">
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrum exercitationem ullam corporis suscipit
            laboriosam.
          </span>
        </div>
        <div className="sm:flex space-x-4 sm:mr-10 flex-col sm:flex-row sm:mt-0 mt-4">
          <img src={ArrowLeft} alt="Arrow Left" className="sm:flex hidden" />
          <CardMarked
            imagem={Car}
            title="Leilão antiguida..."
            subtitle="Promovido:"
            subtitleDate="Data:"
            body="LeilosNew"
            date="12/09/2023"
          />
          <CardMarked
            imagem={Car}
            title="Leilão antiguida..."
            subtitle="Promovido:"
            subtitleDate="Data:"
            body="LeilosNew"
            date="12/09/2023"
          />
          <CardMarked
            imagem={Car}
            title="Leilão antiguida..."
            subtitle="Promovido:"
            subtitleDate="Data:"
            body="LeilosNew"
            date="12/09/2023"
          />
          <CardMarked
            imagem={Car}
            title="Leilão antiguida..."
            subtitle="Promovido:"
            subtitleDate="Data:"
            body="LeilosNew"
            date="12/09/2023"
          />
          <img src={ArrowRight} alt="Arrow Right" className="sm:flex hidden" />
        </div>
      </div>

      <div
        className="sm:w-[1780px] sm:h-[660px] w-[400px] h-full sm:flex sm:flex-row flex-col sm:items-center sm:pl-[160px] sm:justify-center "
        id="section03"
      >
        <div className="sm:w-[410px] text-[#fff] sm:ml-16 ml-6 text-shadow-[2px]">
          <h2 className="sm:text-[38px] text-[20px] font-semibold text-shadow-[2px] leading-normal tracking-wide">
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
        <div class="sm:w-[975px] w-[390px] sm:h-[450px] h-auto pl-1 sm:mr-7 sm:ml-4 sm:mt-0 mt-4 rounded-[12px] bg-[#1D1D1D] relative">
          <div id="ferrari" class="relative">
            <img
              src={ArrowLeft}
              alt="Arrow Left"
              class="absolute left-0 sm:left-[-4px] top-[190px] z-20 transform[-50%]"
            />
            <div class="sm:w-[524px] w-[390px] sm:h-[450px] h-[380px] sm:pl-10 pl-14 sm:pt-10 pt-20 rounded-[12px] bg-gradient-to-r from-[#1C1C1C] via-[rgba(28, 28, 28, 0.71)] to-transparent relative">
              <div class="text-[#FFF] text-shadow-[2px] sm:pl-14">
                <span class="text-[20px] sm:text-[22px] font-semibold block sm:mb-4 mb-2">
                  Ferrari única
                </span>
                <span class="text-[12px] sm:text-[14px] leading-[1.47px] text-shadow-[2px]">
                  Lorem ipsum dolor sit amet, consectetur <br />
                  adipisci elit, sed eiusmod tempor incidunt ut
                  <br /> labore et dolore magna aliqua. Ut enim ad <br /> minim
                  veniam, quis nostrum <br /> exercitationem ullam corporis
                  suscipit <br />
                  laboriosam.
                </span>
                <button class="block sm:mt-4 mt-2 w-[161px] sm:w-[161px] h-[36px] bg-[#012038] rounded-[2px] text-[#f2f2f2] text-[14px] font-normal">
                  DAR UM LANCE
                </button>
              </div>
              <img
                src={ArrowRight}
                alt="Arrow Right"
                class="absolute right-0 sm:right-[-366px] top-[190px] z-20 transform[-50%]"
              />
            </div>
          </div>
        </div>

        <div className="sm:w-[250px] h-[660px]  bg-[#F5F5F5]">
          <div className="items-center justify-center mb-4 sm:mb-0 sm:pl-7 pl-20 pt-10  ">
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 1 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(1)}
            >
              Jóias e tesouros
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 2 ? 'active ' : 'active'
              }`}
              onClick={() => handleLinkClick(2)}
            >
              Veículos
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 3 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(3)}
            >
              Miniaturas
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 4 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(4)}
            >
              Roupas
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 5 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(5)}
            >
              Brinquedos
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 6 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(6)}
            >
              Antiguidades
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 7 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(7)}
            >
              Espadas
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 8 ? 'active pl-4' : ''
              }`}
              onClick={() => handleLinkClick(8)}
            >
              Réplicas
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 9 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(9)}
            >
              Quadros
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 10 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(10)}
            >
              Livros
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 11 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(12)}
            >
              Arte moderna
            </span>
            <span
              className={`text-[#828282] text-[16px] block leading-normal cursor-pointer mb-2 ${
                activeLink === 12 ? 'active' : ''
              }`}
              onClick={() => handleLinkClick(13)}
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
