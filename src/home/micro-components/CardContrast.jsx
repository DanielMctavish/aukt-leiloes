function CardContrast() {


  return (
    <div
      className="lg:w-[361px] w-full lg:h-[337px] h-[80%] 
      flex-shrink-0 border-2 
      items-center justify-center 
      pt-4 border-gray-300 
      bg-[#EEEEEE] rounded-md"
    >
      <span className="w-[270px] h-[213px]">
        <img src='' alt="" className="object-cover pl-10" />
      </span>

      <div className="w-[100px] h-[32px] bg-[#F00] rounded-md 
      flex items-center justify-end ml-auto mr-4 mt-1 shadow-lg shadow-[#1a1a1a31]">

        <span className="text-[#FFF] text-[14px] font-bold leading-[0.24px] p-3">
          ON LIVE!
        </span>

      </div>

    </div>
  );
}

export default CardContrast;
