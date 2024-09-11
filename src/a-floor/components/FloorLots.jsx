/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react"

function FloorLots({ products, currentProduct }) {
    const [productLots, setProductsLots] = useState([])
    const [selectedLot, setSelectedLot] = useState(null)
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setProductsLots(products)
    }, [products])

    const handleLotClick = useCallback((event, lot) => {
        event.stopPropagation(); // Impede a propagação do evento
        const rect = event.currentTarget.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        setModalPosition({
            x: rect.left + scrollX,
            y: rect.top + scrollY - 160 // Ajuste para posicionar o modal acima do item
        });
        setSelectedLot(lot);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setSelectedLot(null);
    }, []);

    // Adicione este useEffect para fechar o modal quando clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedLot && !event.target.closest('.lot-item')) {
                setSelectedLot(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedLot]);

    return (
        <div className="w-full h-[20vh] 
        flex rounded-[22px] justify-start items-center relative p-3 
        gap-3 overflow-x-auto overflow-y-hidden bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-t-[2px] border-[#e3e3e3] 
        transition-all duration-300 ease-in-out">
            {Array.isArray(productLots) ? productLots.map((lot, index) => {
                if (lot.group !== currentProduct.group) return null;

                const isCurrentLot = lot.id === currentProduct.id;

                return (
                    <div 
                        key={index} 
                        className={`
                            lot-item
                            ${isCurrentLot 
                                ? 'min-w-[120px] h-[120px] bg-white z-10' 
                                : 'min-w-[100px] h-[100px] bg-[#c4c4c4] opacity-60 saturate-0'
                            }
                            flex justify-center items-center relative rounded-md 
                            overflow-hidden shadow-lg
                            transform transition-all duration-300 ease-in-out
                            hover:scale-105 hover:shadow-xl cursor-pointer
                        `}
                        onClick={(e) => handleLotClick(e, lot)}
                    >
                        {isCurrentLot && (
                            <span 
                                style={{ textShadow: "1px 2px 1px #60e0ee" }}
                                className="absolute text-zinc-100 bg-[#13326b] p-2 font-bold rounded-lg text-[16px] bottom-1 left-1
                                transition-all duration-300 ease-in-out
                                transform hover:scale-110"
                            >
                                #{lot.lote}
                            </span>
                        )}
                        <img 
                            src={lot.cover_img_url} 
                            alt={`Lote ${lot.lote}`}
                            className={`
                                object-cover w-full h-full
                                transition-all duration-300 ease-in-out
                                ${isCurrentLot ? 'hover:opacity-90' : 'hover:opacity-80 hover:saturate-50'}
                            `}
                        />
                    </div>
                )
            }) : null}

            {selectedLot && (
                <div 
                    className="fixed bg-white p-4 rounded-lg shadow-xl z-[9999] max-w-xs"
                    style={{
                        left: `${modalPosition.x}px`,
                        top: `${modalPosition.y}px`,
                    }}
                >
                    <h3 className="font-bold text-lg mb-2">{selectedLot.title}</h3>
                    <p className="text-sm text-gray-600">{selectedLot.description}</p>
                </div>
            )}
        </div>
    )
}

export default FloorLots


