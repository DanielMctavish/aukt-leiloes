import React, { useState } from "react";
import DetailProduct from "../dados/DetailProduct.json";
import ArrowDown from "../statics-elements/arrowDown";
import AuctionedProductDetails from "./auctionedProductDetails";

function auctionedProduct({ userImage, userName}) {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleProductClick = (produto) => {
    setSelectedProductId(produto.id);
  };

  const handleCloseDetails = () => {
    setSelectedProductId(null);
  };
  return (
    <div>
      {selectedProductId ? (
        <div className="p-8 relative" >
          <span
            onClick={handleCloseDetails}
            className="cursor-pointer absolute top-0 right-0 p-2 text-[12px]"
          >
            X
          </span>
          <AuctionedProductDetails
            productId={selectedProductId}
            DetailProduct={DetailProduct}
            userImage={userImage}
            userName={userName}
          />
        </div>
      ) : (
        <table className="w-full bg-white min-h-[200px] overflow-y-auto">
          <thead>
            <tr className="lg:flex lg:gap-16 hidden">
              <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
                Nº
                <ArrowDown />
              </th>
              <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
                Produto
                <ArrowDown />
              </th>
              <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
                Quantidade
                <ArrowDown />
              </th>
              <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
                Valor
                <ArrowDown />
              </th>
              <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
                Ações
                <ArrowDown />
              </th>
            </tr>
          </thead>
          <tbody>
            {DetailProduct.map((produto) => (
              <tr key={produto.id} className="text-zinc-400 flex flex-wrap lg:flex-nowrap lg:gap-16">
                <td className="px-6 py-4 text-left text-[14px] font-bold" onClick={() => handleProductClick(produto)}>
                  {produto.numero}
                </td>
                <td className="px-10 py-4 text-left flex justify-start items-center gap-2" onClick={() => handleProductClick(produto)}>
                  <img
                    src={produto.imagem}
                    alt=""
                    className="w-[32px] h-[32px] object-cover shadow-sm shadow-zinc-600 rounded-full"
                  />
                  <span className=" font-bold text-[14px]">{produto.nome}</span>
                </td>
                <td className="px-6 py-4 text-left text-[14px] font-bold lg:flex hidden">
                  {produto.quantidade}
                </td>
                <td className="px-6 ml-16 py-4 text-left text-[14px] font-bold lg:flex hidden">
                  R$ {produto.valor}
                </td>
                <td className="px-2 py-4 text-left space-x-3 lg:flex hidden">
                  <span
                    className="bg-[#EEF1F7] px-5 text-[#747474 font-bold rounded-full p-2 text-[12px] cursor-pointer"
                    onClick={() => handleProductClick(produto)}
                  >
                    {produto.ver}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default auctionedProduct;
