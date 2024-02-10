import { useEffect } from "react"
import PanelGraph from "../../admin/panels/PanelGraph"
import AssideAdvertiser from "../_asside/AssideAdvertiser"
import NavAdvertiser from "../_navigation/NavAdvertiser"
import LastAdvertisersAuctsTable from "../tables/LastAdvertisersAuctsTable"
import CircleStatisticDisplay from "./components/CircleStatisticDisplay"
import DisplayBalance from "./components/DisplayBalance"
import DisplayLive from "./components/DisplayLive"
import {useNavigate} from "react-router-dom"


export const DashboardAdvertiser = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        }
    })

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-1" />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
                <NavAdvertiser />

                <section className="w-full flex p-2 gap-3 h-[20vh] ">
                    {/* Display Saldo */}
                    <DisplayBalance />
                    {/* Display Ao vivo */}
                    <DisplayLive />
                </section>

                <section className="w-full h-auto flex justify-center items-center lg:gap-6  lg:flex-wrap lg:mt-0 mt-3 p-2">
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