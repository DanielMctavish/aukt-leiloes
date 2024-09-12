/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

function FloorLots({ products, currentProduct }) {
    const [productLots, setProductsLots] = useState([])
    const [selectedLot, setSelectedLot] = useState(null)

    useEffect(() => {
        setProductsLots(products)
    }, [products])

   
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
        gap-3 bg-[#d2d2d2ad] 
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
                                : 'min-w-[100px] h-[100px] opacity-60 saturate-0'
                            }
                            flex justify-center items-center relative rounded-md 
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
                                object-cover w-full h-full
                                transition-all duration-300 ease-in-out
                                ${isCurrentLot ? 'hover:opacity-90' : 'hover:opacity-80 hover:saturate-50'}
                            `}
                        />

                    </div>
                )
            }) : null}


        </div>
    )
}

export default FloorLots


