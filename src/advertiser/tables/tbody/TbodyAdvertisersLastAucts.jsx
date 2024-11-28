import { useEffect, useState } from "react";
import axios from "axios"

function TbodyAdvertisersLastAucts() {
    const [aucts, setAucts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const sumAllProductsValue = (productsList) => {
        let sum = 0

        productsList.forEach(product => {
            sum += product.initial_value
        })

        return parseFloat(sum);
    }

    const getListCurrentAdvertiserAucts = async () => {
        setIsLoading(true)
        const currentAdvertiserStorage = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        const configAuth = {
            headers: {
                "Authorization": `Bearer ${currentAdvertiserStorage.token}`
            }
        }

        try {
            const currentAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserStorage.email}`, configAuth)

            const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${currentAdvertiser.data.id}`, configAuth)
            
            setAucts(result.data)
        } catch (error) {
            console.error("Erro ao carregar leilões:", error)
        } finally {
            setIsLoading(false)
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

    if (isLoading) {
        return (
            <tbody>
                <tr>
                    <td colSpan="7" className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    if (aucts.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                        Nenhum leilão encontrado
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <tbody>
            {aucts.map((auction, index) => (
                <tr 
                    key={auction.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        {auction.nano_id}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <img 
                                    src={auction.auct_cover_img} 
                                    alt="" 
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                    {auction.title}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {auction.product_list.length}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {productsWithBids(auction.product_list)}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {productsWithoutBids(auction.product_list)}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(sumAllProductsValue(auction.product_list))}
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default TbodyAdvertisersLastAucts;