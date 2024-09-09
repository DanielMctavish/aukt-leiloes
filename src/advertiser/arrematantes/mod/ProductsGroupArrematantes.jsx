/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
function ProductsGroupArrematantes({ products }) {
    const [productsList, setProductList] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        setProductList(products)
    }, [products]) // Add products as a dependency

    const handleProductClick = (productId) => {
        navigate(`/advertiser/home/product/${productId}`);
    }

    return (
        <div className="flex flex-wrap min-w-[300px] h-auto bg-white 
        justify-start items-start p-2 gap-2
        absolute shadow-lg shadow-[#18181845] z-[99] rounded-md">
            {
                productsList.map(pro => (
                    <div key={pro.id} onClick={() => handleProductClick(pro.id)} className="cursor-pointer">
                        <img src={pro.cover_img_url}
                            className="min-w-[60px] h-[60px] object-cover rounded-full" />
                    </div>
                ))
            }
        </div>
    )
}

export default ProductsGroupArrematantes;