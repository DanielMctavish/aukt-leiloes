/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import AssideAdvertiser from "../_asside/AssideAdvertiser"
import NavAdvertiser from "../_navigation/NavAdvertiser"
import TableAdvertiserAucts from "../tables/TableAdvertiserAucts"
import { useNavigate } from "react-router-dom"
import getAuctionsList from "../functions/GetAuctionsList"
import { listAuct } from "../../features/auct/AuctList"

export const AdvertiserAuctions = () => {
    const [auctList, setAucts] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        }

        getAuctionsList(currentLocalAdvertiser, setAucts)
    }, [])

    useEffect(() => {
        dispatch(listAuct(auctList))
    }, [auctList])

    const handleNavigateToDetails = (advertiser_id, auct_id) => {
        navigate(`/advertiser/auctions-details/${advertiser_id}/${auct_id}`)
    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-[#F4F4F4] relative">
            <AssideAdvertiser MenuSelected="menu-3" />
            <section className="w-full h-screen text-zinc-600 flex flex-col justify-start items-center relative z-10 overflow-y-auto">
                <NavAdvertiser path='anunciante > leilões' />
                <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4">
                    {/* PESQUISAS */}
                    <div className="w-full flex justify-between p-3 items-center">
                        <div className="flex items-center">
                            <input 
                                type="text" 
                                placeholder="Pesquisar por ID ou título" 
                                className="p-2 px-4 bg-white rounded-md border-[1px] border-zinc-300 min-w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button className="ml-2 bg-[#012038] text-white py-2 px-4 rounded-md hover:bg-[#012038]/90 transition-colors">
                                Buscar
                            </button>
                        </div>
                        <div className="text-sm text-gray-500">
                            {auctList.length} leilões encontrados
                        </div>
                    </div>
                    <section className="w-full flex p-2 flex-1">
                        <div className="w-full bg-[#ffffff] rounded-md shadow-lg shadow-[#1313135a] p-4 overflow-hidden">
                            <TableAdvertiserAucts onRowClick={handleNavigateToDetails} />
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
}