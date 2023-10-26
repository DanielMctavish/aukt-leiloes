import React from "react";
import SearchIcon from "@mui/icons-material/Search";


function Submenu() {
  return (
    <section className="flex space-x-16 items-center justify-center">
      <div className="space-x-6 items-center justify-center">
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Indumentária
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Arquitetura
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Miniaturas
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Relíquias
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Perfumes
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Armamentos (réplicas)
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Jóias
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Jogos
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Livros
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Espelhos
        </button>
        <button className="text-[#002949] text-[12px] leading-normal cursor-pointer">
          Esculturas
        </button>
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Pesquise por item ou categoria"
          className="w-[270px] h-[30px] pr-12 p-2 bg-[#D9D9D9] text-[#898383] text-[14px]"
        />
        <span className="absolute right-0 inset-y-0 flex items-center w-[32px] p-1 bg-[#022A33]">
          <SearchIcon />
        </span>
      </div>
    </section>
  );
}

export default Submenu;