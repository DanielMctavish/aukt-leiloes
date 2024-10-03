/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
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
    const [avatar, setAvatar] = useState(null)

    useEffect(() => {
        if (bid && bid.Client && bid.Client.client_avatar !== undefined) {
            setAvatar(avatarIndex[bid.Client.client_avatar])
        }
    }, [bid])

    if (!bid || !bid.Client) {
        return null; // Não renderiza nada se bid ou bid.Client não estiver definido
    }

    return (
        <div className="w-full h-[60px] flex justify-between items-center bg-[#ffffff] rounded-lg p-2 mb-2">
            <div className="flex justify-start items-center gap-2">
                <img src={avatar} alt="avatar" className="w-[40px] h-[40px] rounded-full" />
                <span className="text-[14px] font-bold">{bid.Client.nickname}</span>
            </div>
            <span className="text-[14px] font-bold">R$ {(bid.value).toFixed(2)}</span>
        </div>
    )
}

export default BidCard