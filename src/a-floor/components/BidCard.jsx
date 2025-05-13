/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls"

// Convertendo o objeto de URLs em um array
const avatarIndex = Object.values(avatarClientsUrls)

function BidCard({ bid, isHighestBid }) {
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
        <div className={`w-full h-[60px] flex justify-between items-center ${isHighestBid ? 'bg-green-50' : 'bg-[#ffffff]'} 
            rounded-lg p-2 mb-2 relative transition-colors duration-300`}>
            <div className="flex justify-start items-center gap-2">
                <img src={avatar} alt="avatar" className="w-[40px] h-[40px] rounded-full" />
                <span className="text-[14px] font-bold">{bid.Client.nickname}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="text-[14px] font-bold">R$ {(bid.value).toFixed(2)}</span>
                {isHighestBid && (
                    <span className="text-[10px] font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        Maior Lance
                    </span>
                )}
            </div>
        </div>
    )
}

export default BidCard