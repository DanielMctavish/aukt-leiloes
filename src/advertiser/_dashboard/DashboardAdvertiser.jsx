/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import axios from "axios"
import PanelGraph from "../../admin/panels/PanelGraph"
import AssideAdvertiser from "../_asside/AssideAdvertiser"
import NavAdvertiser from "../_navigation/NavAdvertiser"
import LastAdvertisersAuctsTable from "../tables/LastAdvertisersAuctsTable"
import CircleStatisticDisplay from "./components/CircleStatisticDisplay"
import DisplayBalance from "./components/DisplayBalance"
import DisplayLive from "./components/DisplayLive"
import { useNavigate } from "react-router-dom"


export const DashboardAdvertiser = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'))
        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        }

        verifyAdvertiserSession(currentLocalAdvertiser)
    }, [])

    const verifyAdvertiserSession = async (currentLocalAdvertiser) => {

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentLocalAdvertiser.email}`,{
            headers: {
                'Authorization': `Bearer ${currentLocalAdvertiser.token}`
            }
        })
            .then(() => {

                navigate('/advertiser/dashboard')

            }).catch(err => {
                localStorage.removeItem('advertiser-session-aukt')
                console.log('advertiser out!', err.response);
                navigate('/advertiser/login')
            })

    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-1" />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2">
                <NavAdvertiser />

                <section className="w-full flex p-2 gap-3 min-h-[20vh] justify-around items-center overflow-x-auto">
                    {/* Display Saldo */}
                    <DisplayBalance />
                    {/* Display Ao vivo */}
                    <DisplayLive />
                </section>

                <section className="w-full h-auto flex flex-col lg:flex-row justify-center items-center lg:gap-2 md:mt-0 mt-3 p-2 gap-1">
                    {/* Círculo de estatística */}
                    <CircleStatisticDisplay />

                    {/* Gráfico */}
                    <div className="lg:w-[58%] w-full h-[40vh] bg-[#fff] rounded-md shadow-lg shadow-[#17171722]">
                        <PanelGraph />
                    </div>
                </section>

                <section className="w-full p-3">
                    <LastAdvertisersAuctsTable />
                </section>

            </section>


        </div>
    )
}