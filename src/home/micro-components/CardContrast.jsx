/* eslint-disable react/prop-types */


function CardContrast({ auction }) {

  return (
    <div
      className="lg:w-[361px] w-full lg:h-[337px] h-[80%] 
      flex-shrink-0 border-2 relative overflow-hidden
      items-center justify-center 
     border-gray-300 
      bg-[#EEEEEE] rounded-md"
    >
      <img src={auction.auct_cover_img} alt="" className="flex absolute w-full h-[100%] object-cover" />

      <div className="w-[100px] h-[32px] bg-[#F00] rounded-md relative
      flex items-center justify-end ml-auto mr-4 mt-1 shadow-lg shadow-[#1a1a1a31]">
        <span className="text-[#FFF] text-[14px] font-bold leading-[0.24px] p-3">
          ON LIVE!
        </span>

      </div>

    </div>
  );
}

export default CardContrast;
