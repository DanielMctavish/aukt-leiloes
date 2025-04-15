/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material';

function AdvertiserLoginFooterModal({ isVisible, onClose }) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        
        // Animação de entrada
        if (isVisible) {
            setTimeout(() => {
                setShowAnimation(true);
            }, 100);
        }
        
        return () => window.removeEventListener('resize', handleResize);
    }, [isVisible]);

    // Função para fechar com animação
    const handleClose = () => {
        setShowAnimation(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div 
            className={`fixed bottom-0 left-0 right-0 shadow-lg z-[10000] transition-all duration-300 ease-in-out ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
            <div 
                className="bg-gradient-to-r from-[#92ffb8] to-[#003026] p-4 sm:p-5 rounded-t-xl sm:rounded-t-2xl relative"
                style={{
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)'
                }}
            >
                {/* Container para limitar largura e centralizar conteúdo */}
                <div className="flex flex-col sm:flex-row justify-between items-center max-w-4xl mx-auto gap-4 sm:gap-6">
                    {/* Texto */}
                    <p className={`text-white ${isMobile ? 'text-center text-sm' : 'text-lg'} leading-relaxed`}>
                        Esta área é para anunciantes apenas. Caso você queira adquirir um produto, 
                        <button 
                            onClick={() => navigate('/client/register')} 
                            className="underline ml-1 font-bold hover:text-gray-200"
                        >
                            clique aqui para se cadastrar como cliente.
                        </button>
                    </p>
                    
                    {/* Botão */}
                    <button 
                        onClick={handleClose}
                        className="bg-white text-[#003026] px-6 py-2 rounded-full hover:bg-gray-100 active:bg-gray-200 
                            transition-all duration-200 font-medium shadow-md hover:shadow-lg 
                            flex items-center gap-2 min-w-[120px] justify-center"
                    >
                        <span>Entendi</span>
                        {isMobile && <Close fontSize="small" />}
                    </button>
                </div>
                
                {/* Indicador de deslize para fechar (mobile) */}
                {isMobile && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full" />
                )}
            </div>
        </div>
    );
}

export default AdvertiserLoginFooterModal;