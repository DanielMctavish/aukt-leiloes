/* eslint-disable react/prop-types */
import { useEffect } from "react";
import av01 from "../../media/avatar-floor/avatar_01.png"
import av02 from "../../media/avatar-floor/avatar_02.png"
import av03 from "../../media/avatar-floor/avatar_03.png"
import av04 from "../../media/avatar-floor/avatar_04.png"
import av05 from "../../media/avatar-floor/avatar_05.png"
import av06 from "../../media/avatar-floor/avatar_06.png"
import av07 from "../../media/avatar-floor/avatar_07.png"
import av08 from "../../media/avatar-floor/avatar_08.png"

const avatarIndex = [av01, av02, av03, av04, av05, av06, av07, av08]

function WinnerScreen({ currentProduct, winner, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!currentProduct || !winner) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Produto Arrematado</h2>
                <img 
                    src={avatarIndex[winner.client_avatar]} 
                    alt="Winner avatar" 
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <p className="text-xl mb-2">{winner.nickname}</p>
                <p className="text-lg">Produto: {currentProduct.title}</p>
            </div>
        </div>
    );
}

export default WinnerScreen;