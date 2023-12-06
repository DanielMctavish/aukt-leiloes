import React from "react";

function cardAuctsDetails() {
  const auctionDetailsArray = [
    {
      title: "STATUS",
      baseValue: "Em catálogo",
      text: "o Status pode variar de acordo com os eventos",
    },
    {
      title: "VALOR BASE",
      baseValue: "R$ 47.998,80",
    },
    {
        title: "VALOR VENDIDO",
        baseValue: "R$ 42.984,77 - 86%",
  
      },
  ];

  return (
    <div className="flex lg:flex-row flex-col w-full ml-2 mt-2">
      
  {auctionDetailsArray.map((auction, index) => (
    <div
      key={index}
      className="lg:w-[26%] w-full rounded-lg bg-[#E9EFFA] p-3 mb-3 mr-4 "
    >
      <span className="flex flex-col justify-start items-start  border-l-[4px] gap-1 border-[#314B8E]">
        <span className="text-[#848484] uppercase text-[16px] ml-4">{auction.title}</span>
        <span className="text-[#191F2F] text-[22px] ml-4">{auction.baseValue}</span>
       
      </span>
      <span className="text-[#10A55C] text-[10px] ml-20 ">{auction.text}</span>
    </div>
  ))}
</div>

  );
}

export default cardAuctsDetails;
