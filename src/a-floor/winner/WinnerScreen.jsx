/* eslint-disable react/prop-types */
import { useEffect } from "react";
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls"

// Convertendo o objeto de URLs em um array
const avatarIndex = Object.values(avatarClientsUrls)

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