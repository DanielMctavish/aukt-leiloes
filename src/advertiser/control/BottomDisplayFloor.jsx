/* eslint-disable react/prop-types */


function BottomDisplayFloor({ selectedAuction, timer }) {

    return (
        <div className="flex w-[80%] h-[12%] justify-between 
                            items-center mt-2 border-t-[1px] border-zinc-300 relative">
            <span className="font-bold text-[22px] absolute right-1 text-[#213F7E]">{selectedAuction.product_timer_seconds - timer}</span>
        </div>
    )
}

export default BottomDisplayFloor;