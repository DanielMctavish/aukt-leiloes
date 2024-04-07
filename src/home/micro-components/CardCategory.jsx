

function CardCategory() {
  return (
    <div style={{
      backgroundImage: ``,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      width: '800px',
      height: '450px',
      backgroundRepeat: 'no-repeat',
      boxShadow: '1px 4px 12px 0px rgba(0, 0, 0, 0.25)'
    }} >

      <div className="lg:w-[524px] w-full 
      lg:h-[450px] h-full 
      lg:pl-10 pl-14 lg:pt-10 pt-20  
      bg-gradient-to-r from-[#1C1C1C] 
      via-[rgba(28, 28, 28, 0.71)] 
      to-transparent relative">
        
        <div className="text-[#FFF] text-shadow-[2px] lg:pl-14">
          <span className="text-[20px] lg:text-[22px] font-semibold block lg::mb-4 mb-2">

          </span>
          <div className='w-[270px]'>
            <span className="text-[12px] lg:text-[14px] leading-[1.47px] text-shadow-[2px]">

            </span>
          </div>

          <button className="block lg:mt-4 mt-2 w-[161px] lg:w-[161px] h-[36px] bg-[#012038] rounded-[2px] text-[#f2f2f2] text-[14px] font-normal">
            DAR UM LANCE
          </button>
        </div>

      </div>
    </div>
  );
}

export default CardCategory;
