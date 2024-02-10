import { useEffect, useState } from "react"
import axios from "axios"
import AssideAdvertiser from "../_asside/AssideAdvertiser"
import NavAdvertiser from "../_navigation/NavAdvertiser"
import TableAdvertiserAucts from "../tables/TableAdvertiserAucts"
import { useNavigate } from "react-router-dom"


export const AdvertiserAuctions = () => {
    const [aucts, setAucts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        }

        getAuctionsList(currentLocalAdvertiser)
    })

    const getAuctionsList = async (currentLocalAdvertiser) => {

        const currentAdvertiserStorage = JSON.parse(currentLocalAdvertiser)
        if (currentAdvertiserStorage) {
            const getAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}
            /advertiser/find-by-email?email=${currentAdvertiserStorage.email}`)
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${getAdvertiser.data.id}`)
                .then(response => {
                    setAucts(response.data)
                }).catch(err => {
                    console.log('erro ao tentar lista leilões >>', err.response)
                })
        }


    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <AssideAdvertiser MenuSelected="menu-3" />
            <section className="w-full h-[100vh] text-zinc-600 flex flex-col justify-start items-center">
                <NavAdvertiser />
                {/* PESQUISAS */}
                <div className="w-[97%] flex justify-start p-3">
                    <input type="text" placeholder="pesquisar ID" className="p-2 bg-transparent rounded-md border-[1px] border-zinc-300" />
                </div>
                <section className="w-full h-[100vh] flex p-2 overflow-hidden">
                    {
                        aucts.length === 0 ?
                            <div className="w-full h-[100%] bg-white
                            rounded-2xl 
                            flex justify-center items-center 
                            shadow-md shadow-[#1113]">

                                <span>nenhum evento criado...</span>

                            </div> :
                            <TableAdvertiserAucts />
                    }
                </section>
            </section>
        </div>
    )
}