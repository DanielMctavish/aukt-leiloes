/* eslint-disable react/prop-types */
import iconUser from "../../media/avatar-floor/avatar_01.png"

function BidCard({ username, value }) {

    return (
        <div className="w-[98%] rounded-[16px] text-zinc-900
            flex justify-between relative mt-[4px] shadow-lg shadow-[#0000001d]
            bg-[#e3e3e3] items-center p-2">
            <img src={iconUser} alt="" className="w-[42px] object-cover rounded-full" />
            <span>{username}</span>
            <span className="font-light">R$ {value ? parseInt(value).toFixed(2) : 0}</span>
        </div>
    )
}

export default BidCard;