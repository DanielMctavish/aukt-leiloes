/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

const avatarIndex = importAllAvatars()

function BidDetailController({ bid }) {
    const [address, setAddress] = useState({});

    useEffect(() => {
        if (bid.Client.address) {
            try {
                const parsedAddress = JSON.parse(bid.Client.address);
                setAddress(parsedAddress);
            } catch (error) {
                console.error("Error parsing address:", error);
            }
        }
    }, [bid]);

    return (
        <div className="w-[98%] rounded-[16px] text-zinc-900 cursor-pointer
            flex justify-between relative mt-[4px] shadow-lg shadow-[#0000001d]
            bg-[#e3e3e3] hover:bg-[#d8d8d8] items-center p-2 gap-3">

            <img 
                src={avatarIndex[bid.Client.client_avatar]} 
                alt="" 
                className="w-[42px] h-[42px] object-cover rounded-full border-2 border-green-500/20" 
            />
            
            <div className="flex flex-col">
                <span className="font-medium">{bid.Client.name}</span>
                <span className="text-zinc-500 text-[12px]">{bid.Client.email}</span>
            </div>

            <div className="flex flex-col text-sm">
                <span className="text-zinc-600">
                    {address.street}, {address.number}, {address.city} - {address.state}
                </span>
                <span className="text-zinc-500 text-[12px]">{address.phone}</span>
            </div>
            
            <span className="font-medium text-green-600">
                R$ {bid.value ? parseInt(bid.value).toFixed(2) : 0}
            </span>
        </div>
    );
}

export default BidDetailController;