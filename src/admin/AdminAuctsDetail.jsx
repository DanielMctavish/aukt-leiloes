import React, { useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import CardAuctsDetails from "./cards/cardAuctsDetails";
import AuctsDetailsProducts from "./AuctsDetails/AuctsDetailsProduct";
import InforAucts from "./AuctsDetails/inforAucts";
import AuctionedProduct from "./AuctsDetails/auctionedProduct";
import ProductWithoutBid from "./AuctsDetails/productWithoutBid";
import AuctsVisits from "./AuctsDetails/AuctsVisits";
import MenuIcon from "@mui/icons-material/Menu";

function AuctsDetail() {
  const [activeComponent, setActiveComponent] = useState("Produtos - Lista");
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const handleClick = (component) => {
    setActiveComponent(component);
    setMobileNavOpen(false);
  };

  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
      bg-[#D8DEE8] text-zinc-600 overflow-x-hidden custom-scrollbar
      flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-2" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center">
        <NavAdmin />

        <section className="w-full h-[full] mt-4 flex flex-col justify-center items-center gap-6">
          <div className="w-[96%] h-[80%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3">
            <InforAucts />
            <div>
              <CardAuctsDetails />
            </div>
          </div>
          <div className="flex flex-col lg:w-full w-[90%] h-full lg:mb-0 mb-9 pl-7 lg:bg-transparent bg-white lg:rounded-none rounded-lg">
            <button
              className="text-[22px] lg:hidden flex bg-[#EEF1F6] text-[#191F2F] w-[8%] mt-3 mb-4"
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
            >
              <MenuIcon />
            </button>

            {isMobileNavOpen && (
              <nav className="flex flex-col bg-[#EEF1F6] w-[80%] h-full mb-6 ml-5 text-[#51586B] text-[14px] font-semibold z-30">
                <button
                  onClick={() => {
                    handleClick("Produtos - Lista");
                    setMobileNavOpen(false);
                  }}
                  className={`p-2 border border-solid border-gray-300 rounded-sm focus:outline-none ${
                    activeComponent === "Produtos - Lista" ? "bg-white" : ""
                  }`}
                >
                  <span className="p-6">Produtos - Lista</span>
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
            )}
            <nav className="lg:flex hidden bg-[#EEF1F6] w-[98%] text-[#51586B] text-[14px font-semibold]">
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
            <div
              className="lg:w-[98%] w-full max-h-[42.3vh]  overflow-x-hidden overflow-y-auto custom-scrollbar bg-[#fff] rounded-b
                    shadow-lg shadow-[#17171722]"
            >
              {activeComponent === "Produtos - Lista" && (
                <AuctsDetailsProducts />
              )}
              {activeComponent === "Produtos Leiloados" && <AuctionedProduct />}
              {activeComponent === "Produtos sem Lance" && (
                <ProductWithoutBid />
              )}
              {activeComponent === "Visitas" && <AuctsVisits />}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default AuctsDetail;
