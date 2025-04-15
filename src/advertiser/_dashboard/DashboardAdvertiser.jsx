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
        return (
            <div className="w-full h-[100vh] flex flex-col justify-center 
                items-center overflow-y-auto bg-[#0D1733] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                <span className="mt-4">Carregando...</span>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white">
            <NavAdvertiser />
            <AssideAdvertiser MenuSelected="menu-1" />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 
                pt-20 sm:pt-24 pb-8 z-[0]">
                
                {/* Auction Selection Section */}
                <section className="w-full mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 
                        overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="min-w-max p-4">
                            <AuctionSelection />
                        </div>
                    </div>
                </section>

                {/* Charts Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Graph Panel */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Gráfico de Desempenho</h2>
                        <div className="h-[300px] sm:h-[400px]">
                            <PanelGraph />
                        </div>
                    </div>

                    {/* Statistics Circle */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h2>
                        <div className="h-[300px] sm:h-[400px]">
                            <CircleStatisticDisplay />
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos Leilões</h2>
                    <div className="overflow-x-auto">
                        <LastAdvertisersAuctsTable />
                    </div>
                </section>
            </main>
        </div>
    )
}
