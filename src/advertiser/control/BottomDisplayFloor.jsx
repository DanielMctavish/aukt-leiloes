/* eslint-disable react/prop-types */

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

function BottomDisplayFloor({ selectedAuction, timer }) {
    const remainingTime = selectedAuction.product_timer_seconds - timer;

    return (
        <div className="flex w-[80%] h-[12%] justify-between 
                            items-center mt-2 border-t-[1px] border-zinc-300 relative">
            <span className="font-bold text-[22px] absolute right-1 text-[#213F7E]">{formatTime(remainingTime)}</span>
        </div>
    )
}

export default BottomDisplayFloor;
