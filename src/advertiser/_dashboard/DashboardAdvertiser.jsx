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
        return <div>Carregando...</div>
    }

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto bg-white">
            <AssideAdvertiser MenuSelected="menu-1" />

            <section className="w-full min-h-[130vh] flex flex-col justify-start items-center overflow-y-auto gap-2">
                <NavAdvertiser />

                <section className="w-full flex p-2 gap-3 min-h-[20vh] justify-around items-center overflow-x-auto">
                    <AuctionSelection />
                </section>

                <section className="w-full h-auto flex flex-col lg:flex-row justify-center items-center lg:gap-2 md:mt-0 mt-3 p-2 gap-1">
                    {/* Gráfico */}
                    <div className="lg:w-[58%] w-full h-[40vh] bg-[#fff] rounded-md shadow-lg shadow-[#17171722]">
                        <PanelGraph />
                    </div>
                    {/* Círculo de estatística */}
                    <CircleStatisticDisplay />
                </section>

                <section className="w-full p-3">
                    <LastAdvertisersAuctsTable />
                </section>
            </section>
        </div>
    )
}
