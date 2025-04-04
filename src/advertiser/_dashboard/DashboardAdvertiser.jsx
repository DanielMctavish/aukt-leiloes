/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import axios from "axios"
import PanelGraph from "../../admin/panels/PanelGraph"
import AssideAdvertiser from "../_asside/AssideAdvertiser"
import NavAdvertiser from "../_navigation/NavAdvertiser"
import LastAdvertisersAuctsTable from "../tables/LastAdvertisersAuctsTable"
import CircleStatisticDisplay from "./components/CircleStatisticDisplay"
import AuctionSelection from "./components/AuctionSelection"
import { useNavigate } from "react-router-dom"

export const DashboardAdvertiser = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'))
        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        } else {
            verifyAdvertiserSession(currentLocalAdvertiser)
        }
    }, [])

    const verifyAdvertiserSession = async (currentLocalAdvertiser) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentLocalAdvertiser.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentLocalAdvertiser.token}`
                }
            })

            const advertiserStatus = response.data.police_status
            if (advertiserStatus === 'BANNED' || advertiserStatus === 'SUSPENDED') {
                localStorage.removeItem('advertiser-session-aukt')
                navigate('/advertiser/login')
            }
        } catch (err) {
            console.error('Erro ao verificar sessão do anunciante:', err.response)
            localStorage.removeItem('advertiser-session-aukt')
            navigate('/advertiser/login')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="w-full h-[100vh] flex flex-col justify-center 
        items-center overflow-y-auto bg-[#0D1733] text-white">
            Carregando...
        </div>
    }

  

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto bg-white">

            <NavAdvertiser />
            <AssideAdvertiser MenuSelected="menu-1" />


            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[4vh] z-[0]">
                <section className="w-full h-auto flex flex-col justify-start items-center overflow-y-auto gap-2 relative">
                    <section className="w-full flex p-2 gap-3 min-h-[20vh] justify-around items-center overflow-x-auto">
                        <AuctionSelection />
                    </section>

                    <section className="w-full h-auto flex flex-col lg:flex-row justify-center items-stretch gap-4 p-4">
                        {/* Gráfico */}
                        <div className="lg:w-1/2 w-full h-[400px]">
                            <PanelGraph />
                        </div>
                        {/* Círculo de estatística */}
                        <div className="lg:w-1/2 w-full h-[400px]">
                            <CircleStatisticDisplay />
                        </div>
                    </section>

                    <section className="w-full p-3">
                        <LastAdvertisersAuctsTable />
                    </section>
                </section>
            </div>

        </div>
    )
}
