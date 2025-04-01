import React from 'react';
import { Close } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

function AdvertiserLoginFooterModal({ isVisible, onClose }) {
    const navigate = useNavigate();

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#92ffb8] to-[#003026] p-4 shadow-lg z-[10000]">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
                <p className="text-white text-lg">
                    Esta área é para anunciantes apenas. Caso você queira adquirir um produto, 
                    <button 
                        onClick={() => navigate('/client/register')} 
                        className="underline ml-1 font-bold hover:text-gray-200"
                    >
                        clique aqui para se cadastrar como cliente.
                    </button>
                </p>
                <button 
                    onClick={onClose}
                    className="bg-white text-[#003026] px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Entendi
                </button>
            </div>
        </div>
    );
}

export default AdvertiserLoginFooterModal;