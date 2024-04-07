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



    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4] relative overflow-hidden">
            <AssideAdvertiser MenuSelected="menu-3" />
            <section className="w-full h-[100vh] text-zinc-600 flex flex-col justify-start items-center">
                <NavAdvertiser path='anunciante > leilões' />
                {/* PESQUISAS */}
                <div className="w-[97%] flex justify-start p-3">
                    <input type="text" placeholder="pesquisar ID" className="p-2 bg-transparent rounded-md border-[1px] border-zinc-300" />
                </div>
                <section className="w-full h-[100vh] flex p-2 overflow-hidden">
                    {/* {
                        aucts.length === 0 ?
                            <div className="w-full h-[100%] bg-white
                            rounded-2xl 
                            flex justify-center items-center 
                            shadow-md shadow-[#1113]">

                                <span>nenhum evento criado...</span>

                            </div> :
                            
                    } */}
                    <div className="w-[99%] bg-[#4e7fd9]/10 flex justify-start items-start overflow-x-auto relative">
                        <TableAdvertiserAucts />
                    </div>
                </section>
            </section>
        </div>
    )
}