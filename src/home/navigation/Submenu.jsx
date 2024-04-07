import React from "react";
import SearchIcon from "@mui/icons-material/Search";


function Submenu() {
  return (
    <section className="flex flex-col sm:flex-row ml-7 items-center justify-center sm:space-x-14">
  <div className="space-x-4 sm:space-x-8 flex-wrap items-center justify-center mb-4 sm:mb-0">
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Indumentária
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Arquitetura
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Miniaturas
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Relíquias
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Perfumes
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Armamentos (réplicas)
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Jóias
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Jogos
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Livros
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Espelhos
    </button>
    <button className="text-[#002949] text-[12px] leading-normal cursor-pointer mb-2 sm:mb-0 sm:mr-4">
      Esculturas
    </button>
  </div>

  <div className="relative flex items-center mt-0">
    <input
      type="text"
      placeholder="Pesquise por item ou categoria"
      className="w-full sm:w-[270px] h-[30px] pr-12 p-2 bg-[#D9D9D9] text-[#898383] text-[14px]"
    />
    <span className="absolute right-0 inset-y-0 flex items-center w-[32px] p-1 bg-[#022A33]">
    <SearchIcon />
    </span>
  </div>
</section>


  );
}

export default Submenu;