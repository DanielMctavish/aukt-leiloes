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
        return null;
    }

    return (
        <div className="w-full h-[20vh] bg-[#d2d2d2ad] backdrop-blur-lg rounded-2xl 
            shadow-xl shadow-[#1414143a] border-t-[2px] border-[#e3e3e3] overflow-hidden"
        >
            {/* Título */}
            <div className="px-4 py-2 bg-white/10 border-b border-white/20">
                <span className="text-gray-700 text-sm font-medium">
                    Lotes do Grupo
                </span>
            </div>

            {/* Container dos Lotes */}
            <div className="h-[calc(100%-40px)] px-4 py-2 overflow-x-auto">
                <div className="flex gap-3 h-full items-center">
                    {productLots.map((lot, index) => {
                        const isCurrentLot = currentProduct && lot.id === currentProduct.id;
                        const isCurrentGroup = currentProduct && lot.group === currentProduct.group;

                        if (!isCurrentGroup) return null;

                        return (
                            <div
                                key={index}
                                className={`
                                    lot-item flex-shrink-0
                                    ${isCurrentLot 
                                        ? 'w-[100px] h-[100px] ring-2 ring-[#13326b] ring-offset-2 ring-offset-[#d2d2d2]' 
                                        : 'w-[80px] h-[80px] opacity-75 hover:opacity-100'
                                    }
                                    relative rounded-lg overflow-hidden
                                    transition-all duration-300 ease-in-out
                                    transform hover:scale-105 cursor-pointer
                                    bg-white shadow-md
                                `}
                            >
                                <img
                                    src={lot.cover_img_url}
                                    alt={`Lote ${lot.lote}`}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Número do Lote */}
                                <div className={`
                                    absolute inset-0 flex items-end justify-start p-1
                                    bg-gradient-to-t from-[#13326b]/80 to-transparent
                                    transition-opacity duration-300
                                    ${isCurrentLot ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
                                `}>
                                    <span className="text-white text-sm font-bold px-2 py-1 rounded-md"
                                        style={{ textShadow: "1px 2px 1px #60e0ee" }}>
                                        #{lot.lote}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default FloorLots


