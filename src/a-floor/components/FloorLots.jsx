/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

function FloorLots({ products, currentProduct }) {
    const [productLots, setProductsLots] = useState([])
    const [selectedLot, setSelectedLot] = useState(null)

    useEffect(() => {
        if (Array.isArray(products)) {
            setProductsLots(products)
        }
    }, [products])

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

    if (!Array.isArray(productLots)) {
        return null; // ou retorne um componente de fallback
    }

    return (
        <div className="w-full h-[20vh] 
        flex rounded-[22px] justify-start items-center relative p-3 
        bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-t-[2px] border-[#e3e3e3] 
        transition-all duration-300 ease-in-out
        overflow-x-auto">
            <div className="flex gap-3">
                {productLots.map((lot, index) => {
                    const isCurrentLot = currentProduct && lot.id === currentProduct.id;
                    const isCurrentGroup = currentProduct && lot.group === currentProduct.group;

                    return (
                        <div
                            key={index}
                            className={`
                                lot-item
                                ${isCurrentLot
                                    ? 'min-w-[120px] h-[120px] bg-white z-10'
                                    : 'min-w-[100px] h-[100px]'
                                }
                                ${!isCurrentGroup ? 'opacity-0 w-0 min-w-0 overflow-hidden' : ''}
                                flex-shrink-0 flex justify-center items-center relative rounded-md 
                                shadow-lg
                                transform transition-all duration-300 ease-in-out
                                hover:scale-105 cursor-pointer
                            `}
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
                                    object-cover w-full h-full rounded-md
                                    transition-all duration-300 ease-in-out
                                    ${isCurrentLot ? '' : 'filter grayscale'}
                                    ${isCurrentLot ? 'hover:opacity-90' : 'hover:opacity-80 hover:filter-none'}
                                `}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FloorLots


