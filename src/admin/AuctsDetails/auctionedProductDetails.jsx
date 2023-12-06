import React from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import User from "../dados/userInfor.json";

function auctionedProductDetails({ productId, DetailProduct }) {
  const selectedProduct = DetailProduct.find(
    (produto) => produto.id === productId
  );

  if (!selectedProduct) {
    return null;
  }
  return (
    <div className="flex flex-col lg:pl-6 gap-8 text-[#2C2C2C] bg-white">
      <div className="flex flex-col">
        <span className="font-semibold text-[16px]">
          14º LEILÃO DE ANTIGUIDADES E COLEÇÕES
        </span>
        <span className="text-[#B5B5B5] text-[14px] font-semibold">
          20 DE NOVEMBRO DE 2023
        </span>
      </div>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-24">
        <div className="flex items-center">
          <img
            src={selectedProduct.imagem}
            alt=""
            className="w-[44px] h-[44px] object-cover shadow-sm shadow-zinc-600 rounded-full"
          />
          <div className="ml-8">
            <span className="block text-[#B5B5B5] text-[14px] font-semibold">
              Produto Vendido
            </span>
            <span className="font-semibold">{selectedProduct.nome}</span>
          </div>
        </div>
        {User.map((auction) => (
          <div className="flex items-center">
            <img
              src={auction.imagem}
              alt=""
              className="w-[44px] h-[44px] object-cover shadow-sm shadow-zinc-600 rounded-full"
            />
            <div className="ml-8">
              <span className="block text-[#B5B5B5] text-[14px] font-semibold ">
                Arremetante
              </span>
              <span className="text-[#747474] uppercase">{auction.firtName} {auction.lastName}</span>
            </div>
          </div>
        ))}

        <div className="flex items-center text-[#012038]">
          <ReceiptIcon />
          <div className="ml-8">
            <span className="block text-[#B5B5B5] text-[14px] font-semibold">
              Recibo do Produto
            </span>
            <span className="text-[#747474] cursor-pointer">Ver</span>
          </div>
        </div>
        <div className="flex items-center justify-center bg-[#E9EFFA] rounded-sm w-[144px]">
          <span className="text-[#191F2F] font-bold">
            R$ {selectedProduct.valor}
          </span>
        </div>
      </div>
      <span className="font-medium">INFORMAÇÕES DE ENTREGA</span>
    </div>
  );
}

export default auctionedProductDetails;
