/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import avatar_01 from "../../../media/avatar-floor/avatar_01.png";
import avatar_02 from "../../../media/avatar-floor/avatar_02.png";
import avatar_03 from "../../../media/avatar-floor/avatar_03.png";
import avatar_04 from "../../../media/avatar-floor/avatar_04.png";
import avatar_05 from "../../../media/avatar-floor/avatar_05.png";
import avatar_06 from "../../../media/avatar-floor/avatar_06.png";
import avatar_07 from "../../../media/avatar-floor/avatar_07.png";
import avatar_08 from "../../../media/avatar-floor/avatar_08.png";
import avatar_09 from "../../../media/avatar-floor/Avatar_09.png";
import avatar_10 from "../../../media/avatar-floor/Avatar_10.png";
import avatar_11 from "../../../media/avatar-floor/Avatar_11.png";
import avatar_12 from "../../../media/avatar-floor/Avatar_12.png";
import avatar_13 from "../../../media/avatar-floor/Avatar_13.png";
import avatar_14 from "../../../media/avatar-floor/Avatar_14.png";
import avatar_15 from "../../../media/avatar-floor/Avatar_15.png";
import avatar_16 from "../../../media/avatar-floor/Avatar_16.png";
import avatar_17 from "../../../media/avatar-floor/Avatar_17.png";
import avatar_18 from "../../../media/avatar-floor/Avatar_18.png";
import avatar_19 from "../../../media/avatar-floor/Avatar_19.png";
import avatar_20 from "../../../media/avatar-floor/Avatar_20.png";
import avatar_21 from "../../../media/avatar-floor/Avatar_21.png";
import avatar_22 from "../../../media/avatar-floor/Avatar_22.png";
import avatar_23 from "../../../media/avatar-floor/Avatar_23.png";
import avatar_24 from "../../../media/avatar-floor/Avatar_24.png";
import avatar_25 from "../../../media/avatar-floor/Avatar_25.png";
import avatar_26 from "../../../media/avatar-floor/Avatar_26.png";
import avatar_27 from "../../../media/avatar-floor/Avatar_27.png";
import avatar_28 from "../../../media/avatar-floor/Avatar_28.png";
import avatar_29 from "../../../media/avatar-floor/Avatar_29.png";
import avatar_30 from "../../../media/avatar-floor/Avatar_30.png";
import avatar_31 from "../../../media/avatar-floor/Avatar_31.png";
import avatar_32 from "../../../media/avatar-floor/Avatar_32.png";
import avatar_33 from "../../../media/avatar-floor/Avatar_33.png";
import avatar_34 from "../../../media/avatar-floor/Avatar_34.png";
import avatar_35 from "../../../media/avatar-floor/Avatar_35.png";
import avatar_36 from "../../../media/avatar-floor/Avatar_36.png";
import avatar_37 from "../../../media/avatar-floor/Avatar_37.png";
import avatar_38 from "../../../media/avatar-floor/Avatar_38.png";
import avatar_39 from "../../../media/avatar-floor/Avatar_39.png";
import avatar_40 from "../../../media/avatar-floor/Avatar_40.png";
import avatar_41 from "../../../media/avatar-floor/Avatar_41.png";
import avatar_42 from "../../../media/avatar-floor/Avatar_42.png";
import avatar_43 from "../../../media/avatar-floor/Avatar_43.png";
import avatar_44 from "../../../media/avatar-floor/Avatar_44.png";
import avatar_45 from "../../../media/avatar-floor/Avatar_45.png";
import avatar_46 from "../../../media/avatar-floor/Avatar_46.png";
import avatar_47 from "../../../media/avatar-floor/Avatar_47.png";
import avatar_48 from "../../../media/avatar-floor/Avatar_48.png";
import avatar_49 from "../../../media/avatar-floor/Avatar_49.png";
import avatar_50 from "../../../media/avatar-floor/Avatar_50.png";
import avatar_51 from "../../../media/avatar-floor/Avatar_51.png";
import avatar_52 from "../../../media/avatar-floor/Avatar_52.png";
import avatar_53 from "../../../media/avatar-floor/Avatar_53.png";
import avatar_54 from "../../../media/avatar-floor/Avatar_54.png";
import avatar_55 from "../../../media/avatar-floor/Avatar_55.png";
import avatar_56 from "../../../media/avatar-floor/Avatar_56.png";
import avatar_57 from "../../../media/avatar-floor/Avatar_57.png";
import avatar_58 from "../../../media/avatar-floor/Avatar_58.png";

const avatarIndex = [
    avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08,
    avatar_09, avatar_10, avatar_11, avatar_12, avatar_13, avatar_14, avatar_15, avatar_16,
    avatar_17, avatar_18, avatar_19, avatar_20, avatar_21, avatar_22, avatar_23, avatar_24,
    avatar_25, avatar_26, avatar_27, avatar_28, avatar_29, avatar_30, avatar_31, avatar_32,
    avatar_33, avatar_34, avatar_35, avatar_36, avatar_37, avatar_38, avatar_39, avatar_40,
    avatar_41, avatar_42, avatar_43, avatar_44, avatar_45, avatar_46, avatar_47, avatar_48,
    avatar_49, avatar_50, avatar_51, avatar_52, avatar_53, avatar_54, avatar_55, avatar_56,
    avatar_57, avatar_58
];

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