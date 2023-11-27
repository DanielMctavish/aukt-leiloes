import React, { useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import CardAuctsDetails from "./cards/cardAuctsDetails";
import AuctsDetailsProducts from "./AuctsDetails/AuctsDetailsProduct";
import InforAucts from "./AuctsDetails/inforAucts";


function AuctsDetail() {
  const [activeComponent, setActiveComponent] = useState("Produtos - Lista");

  const handleClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
      bg-[#D8DEE8] text-zinc-600 overflow-hidden
      flex justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-2" />
      <section className="w-full h-auto flex flex-col justify-start items-center ">
        <NavAdmin />

        <section className="w-full h-[full] mt-4 flex flex-col justify-center items-center gap-6">
          <div className="w-[96%] h-[80%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3">
            <InforAucts />
            <div>
              <CardAuctsDetails />
            </div>
          </div>
          <div className="flex flex-col w-full h-full pl-7">
            <nav className="flex bg-[#EEF1F6] w-[98%] text-[#51586B] text-[14px font-semibold] ">
              <button
                onClick={() => handleClick("Produtos - Lista")}
                className={`p-2 border border-solid border-gray-300 rounded-sm focus:outline-none ${
                  activeComponent === "Produtos - Lista" ? "bg-white" : ""
                }`}
              >
                <span className="p-6 ">Produtos - Lista</span>
              </button>
              <button
                onClick={() => handleClick("Produtos Leiloados")}
                className={`p-2 border border-solid border-gray-300 rounded-sm focus:outline-none ${
                  activeComponent === "Produtos Leiloados" ? "bg-white" : ""
                }`}
              >
                <span className="p-6 ">Produtos Leiloados</span>
              </button>
              <button
                onClick={() => handleClick("Produtos sem Lance")}
                className={`p-2 border border-solid border-gray-300 rounded-sm focus:outline-none ${
                  activeComponent === "Produtos sem Lance" ? "bg-white" : ""
                }`}
              >
                <span className="p-6 ">Produtos sem Lance</span>
              </button>
              <button
                onClick={() => handleClick("Visitas")}
                className={`p-2 border border-solid border-gray-300 rounded-sm focus:outline-none ${
                  activeComponent === "Visitas" ? "bg-white" : ""
                }`}
              >
                <span className="p-6 "> Visitas</span>
              </button>
            </nav>
            <div className="w-[98%] max-h-[44vh] overflow-y-auto custom-scrollbar">
              {activeComponent === "Produtos - Lista" && (
                <AuctsDetailsProducts />
              )}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default AuctsDetail;
