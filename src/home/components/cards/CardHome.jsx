/* eslint-disable react/prop-types */


export const CardHome = (props) => (
  <div
    key={props.index}
    className="lg:min-w-[900px] min-w-[90%] h-[90%] overflow-hidden flex flex=col justify-center items-center gap-3 rounded-lg relative"
  >
    <div className={`flex justify-center items-center h-[100%] overflow-hidden`}>
       <img
        src={props.card.urlCover}
        alt=""
        className="object-cover rounded-lg h-[100%]"
      />
    </div>
    <div className="absolute lg:w-[400px] w-[200px]  text-[#FFF] lg:mr-60 text-shadow-md font-inter lg:pb-[70px] overflow-hidden">
      <h1 className="lg:text-[22px] text-[16px] lg:mb-2 font-bold overflow-hidden">
        {props.card.title}
      </h1>
      <p className="lg:text-[14px] text-[12px] block lg:mb-8 font-semibold tracking-widest overflow-hidden">
        {props.card.body}
      </p>
      <button className="w-[161px] h-[36px] bg-[#012038] rounded-[2px] text-[#f2f2f2] text-[14px] font-normal`">
        DAR UM LANCE
      </button>
    </div>
  </div>
);
