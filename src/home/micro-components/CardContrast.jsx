function CardContrast() {
  

  return (
    <div
      className="w-[361px] h-[337px] 
      flex-shrink-0 border-2 
      items-center justify-center 
      pt-4 border-gray-300 
      rounded-[2px] bg-[#EEEEEE]"
    >
      <span className="w-[270px] h-[213px]">
        <img src='' alt="" className="object-cover pl-10" />
      </span>
      <span className="text-[#003A67] text-[14px] leading-[0.28px] font-normal block pl-6 pt-7 ">
        
      </span>
      <span className="text-[#949494] text-[12px] font-normal leading-[0.24px] pl-6 pt-7">
        
      </span>
      <div className="w-[68px] h-[15px] bg-[#F00] rounded-[2px] flex items-center justify-end ml-auto mr-4 mt-7">
        <span className="text-[#FFF] text-[12px] font-bold leading-[0.24px] p-2">
          ON LIVE!
        </span>
      </div>
    </div>
  );
}

export default CardContrast;
