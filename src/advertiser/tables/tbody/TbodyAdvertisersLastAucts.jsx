import { useEffect, useState } from "react";
import axios from "axios"

function TbodyAdvertisersLastAucts() {
    const [aucts, setAucts] = useState([])

    const sumAllProductsValue = (productsList) => {
        let sum = 0

        productsList.forEach(product => {
            sum += product.initial_value
        })

        return parseFloat(sum);
    }

    const getListCurrentAdvertiserAucts = async () => {

        const currentAdvertiserStorage = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        const configAuth = {
            headers: {
                "Authorization": `Bearer ${currentAdvertiserStorage.token}`
            }
        }


        try {
            const currentAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserStorage.email}`, configAuth)

            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${currentAdvertiser.data.id}`, configAuth)
                .then(result => {
                    setAucts(result.data)
                })

        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        getListCurrentAdvertiserAucts()
    }, [])

    const productsWithoutBids = (product_list) => {
        const isValid = product_list.filter(product => !product.Winner)
        if (isValid.length > 0) {
            return isValid.length
        } else {
            return 0
        }
    }
    const productsWithBids = (product_list) => {
        const isValid = product_list.filter(product => product.Winner)
        if (isValid.length > 0) {
            return isValid.length
        } else {
            return 0
        }
    }

    return (

        <tbody className=" overflow-y-auto">
            {aucts.map((auction, index) => (
                <tr className="border-b-[1px] border-[#a31010] text-zinc-600" key={index}>

                    <td className="px-6 py-4 text-left text-[14px] font-bold">{index + 1}</td>
                    <td className="px-6 py-4 text-left text-[14px] font-bold">{auction.nano_id}</td>
                    <td className="px-6 py-4 text-left flex justify-start items-center gap-2">
                        <img src={auction.auct_cover_img} alt="" className="w-[32px] h-[32px] object-cover shadow-sm shadow-zinc-600 rounded-full" />
                        <span className="text-zinc-400 font-bold text-[14px]">{auction.title}</span>
                    </td>
                    <td className="px-6 py-4 text-left text-[14px] font-bold">{auction.product_list.length}</td>
                    <td>{productsWithBids(auction.product_list)}</td>
                    <td>{productsWithoutBids(auction.product_list)}</td>
                    <td className="px-6 py-4 text-left text-[14px] font-bold">R$ {
                        sumAllProductsValue(auction.product_list).toFixed(2)
                    }</td>

                </tr>
            ))}
        </tbody>

    )
}

export default TbodyAdvertisersLastAucts;