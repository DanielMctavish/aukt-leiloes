/* eslint-disable react/prop-types */
import { useEffect } from "react"
import av01 from "../../media/avatar-floor/avatar_01.png"
import av02 from "../../media/avatar-floor/avatar_02.png"
import av03 from "../../media/avatar-floor/avatar_03.png"
import av04 from "../../media/avatar-floor/avatar_04.png"
import av05 from "../../media/avatar-floor/avatar_05.png"
import av06 from "../../media/avatar-floor/avatar_06.png"
import av07 from "../../media/avatar-floor/avatar_07.png"
import av08 from "../../media/avatar-floor/avatar_08.png"

const avatarIndex = [av01, av02, av03, av04, av05, av06, av07, av08]

function BidCard({ bid }) {
    useEffect(() => {}, [bid])

    return (
        <div className="w-[98%] rounded-[16px] text-zinc-900
            flex justify-between relative mt-[4px] shadow-lg shadow-[#0000001d]
            bg-[#e3e3e3] items-center p-2">
            <img src={avatarIndex[bid.Client.client_avatar]} alt="" className="w-[42px] object-cover rounded-full" />
            <span>{bid.Client.nickname}</span>
            <span className="font-light">R$ {bid.value ? parseInt(bid.value).toFixed(2) : 0}</span>
        </div>
    )
}

export default BidCard;