/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import av01 from "../../../media/avatar-floor/avatar_01.png";
import av02 from "../../../media/avatar-floor/avatar_02.png";
import av03 from "../../../media/avatar-floor/avatar_03.png";
import av04 from "../../../media/avatar-floor/avatar_04.png";
import av05 from "../../../media/avatar-floor/avatar_05.png";
import av06 from "../../../media/avatar-floor/avatar_06.png";
import av07 from "../../../media/avatar-floor/avatar_07.png";
import av08 from "../../../media/avatar-floor/avatar_08.png";

const avatarIndex = [av01, av02, av03, av04, av05, av06, av07, av08];

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

            <img src={avatarIndex[bid.Client.client_avatar]} alt="" className="w-[42px] object-cover rounded-full" />
            <div className="flex flex-col">
                <span>{bid.Client.name}</span>
                <span className="text-zinc-500 text-[12px]">{bid.Client.email}</span>
            </div>

            <div>
                <span>{address.street}, {address.number}, {address.city} - {address.state}</span>
                <span>{address.phone}</span> {/* Exibir o telefone */}
            </div>
            <span className="font-light">R$ {bid.value ? parseInt(bid.value).toFixed(2) : 0}</span>

        </div>
    );
}

export default BidDetailController;