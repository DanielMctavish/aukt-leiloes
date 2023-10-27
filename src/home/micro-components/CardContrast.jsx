import React from "react";

function CardContrast(props) {
  return (
      <div class="w-[361px] h-[337px] flex-shrink-0 border-2 items-center justify-center pt-4 border-gray-300 rounded-[2px] bg-[#EEEEEE]">
         <span className="w-[270px] h-[213px]">
            <img src={props.imagem} alt="" className="object-cover pl-10" /></span>
           <span className="text-[#003A67] text-[14px] leading-[0.28px] font-normal block pl-6 pt-7 ">{props.title}</span>
            <span className="text-[#949494] text-[12px] font-normal leading-[0.24px] pl-6 pt-7">{props.body}</span>
      </div>

  );
}

export default CardContrast;
