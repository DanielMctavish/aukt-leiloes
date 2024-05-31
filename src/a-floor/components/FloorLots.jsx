/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs"
import { useEffect, useState } from "react"


function FloorLots({ products, currentProduct }) {
    const [productLots, setProductsLots] = useState([1])

    useEffect(() => {
        const newOrderProducts = products?.sort((a, b) => {
            return dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
        })
        setProductsLots(newOrderProducts)
    }, [products])

    return (
        <div className="w-full h-[20vh] 
        flex rounded-[22px] justify-start items-center relative p-3 
        gap-3 overflow-x-auto overflow-y-hidden bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-t-[2px] border-[#e3e3e3] z-[2]">

            {
                Array.isArray(productLots) ? productLots.map((lot, index) => {

                    if (lot.group !== currentProduct.group) return false;

                    if (lot.id === currentProduct.id) {
                        return (
                            <div key={index} className="min-w-[120px] h-[120px] bg-white overflow-hidden
                            flex justify-center items-center relative rounded-md shadow-xl shadow-[#16161632]">
                                <span style={{textShadow:"1px 2px 1px #60e0ee"}} 
                                className="absolute text-zinc-100 bg-[#13326b] p-2 font-bold rounded-lg text-[16px] bottom-1 left-1">
                                    {index + 1}
                                </span>
                                <img src={lot.cover_img_url} alt=""
                                    className="object-cover w-full h-full" />
                            </div>
                        )
                    }
                    return (
                        <div key={index} className="min-w-[100px] h-[100px] bg-[#c4c4c4] opacity-60
                        flex justify-center items-center relative rounded-md saturate-0 overflow-hidden">
                            <img src={lot.cover_img_url} alt=""
                                className="object-cover w-full h-full" />
                        </div>
                    )
                }) : ''
            }

        </div>
    )
}

export default FloorLots