import { useEffect, useState } from "react"


function FloorLots() {
    const [productLots, setProductsLots] = useState([1])

    useEffect(() => {
        setProductsLots([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }, [])

    return (
        <div className="w-full h-[20vh] 
        flex rounded-[22px] justify-start items-center relative p-3 
        gap-3 overflow-x-auto overflow-y-hidden bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-t-[2px] border-[#e3e3e3] z-[2]">

            {
                productLots.map((lot, index) => {
                    return (
                        <div key={index} className="w-[120px] h-[120px] bg-white flex justify-center items-center relative rounded-md">
                            <span className="absolute text-zinc-600 text-[12px] top-2">lote 01</span>
                            <img src="https://http2.mlstatic.com/D_NQ_NP_687960-MLU72010442633_092023-O.webp" alt=""
                                className="object-cover w-[120px]" />
                        </div>
                    )
                })
            }

        </div>
    )
}

export default FloorLots