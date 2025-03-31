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
                {/* PESQUISAS */}
                <div className="w-[97%] flex justify-start p-3">
                    <input type="text" placeholder="pesquisar ID" 
                    className="p-2 bg-transparent rounded-md border-[1px] border-zinc-300" />
                </div>
                <section className="w-full flex p-2 flex-1">
                    <div className="w-full bg-[#ffffff] flex justify-start items-start relative 
                    overflow-x-auto rounded-md shadow-lg shadow-[#1313135a] p-2">
                        <TableAdvertiserAucts onRowClick={handleNavigateToDetails} />
                    </div>
                </section>
            </section>
        </div>
    )
}