import React from "react";
import Alert from "../medias/vector/vector.svg";

function CardMarked(props) {
  return (
    <div  key={props.index} className="relative w-[250px] h-[303px] bg-[#F5F5F5] sm:mb-0 mb-4">
      <div className="absolute mt-[-14px] ml-[-14px]">
        <img src={Alert} alt="Alert" />
      </div>
      <span className="w-[192px] h-[185px] relative">
        <img src={props.card.imagem} alt="" className="object-cover p-8" />
      </span>
      <span className="text-[#474747] text-[22px] leading-[0.44px] text-center font-normal block">
        {props.card.title}
      </span>
     <div className="flex gap-[60px]">
     <div className="text-left mt-7 ml-10 leading-9">
      <span className="text-[#8D8D8D] text-[12px] font-normal block leading-[0.24px]">
        {props.card.subtitle}
      </span>
      <span className="text-[#8D8D8D] text-[12px] font-normal leading-[0.24px]">
        {props.card.subtitleDate}
      </span>
      </div>
      <div className="text-right mt-7 italic leading-9">
      <span className="text-[#8D8D8D] text-[12px] font-normal block leading-[0.24px]">
        {props.card.body}
      </span>
      <span className="text-[#949494] text-[10px] font-normal leading-[0.24px]">
        {props.card.date}
      </span>
      </div>
     </div>
    </div>
  );
}

export default CardMarked;
