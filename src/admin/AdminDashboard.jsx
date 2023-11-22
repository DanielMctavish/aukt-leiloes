import { useEffect, useState } from "react"
import AssideAdmin from "./asside/AssideAdmin"
import NavAdmin from "./navigation/NavAdmin"
import TimerComponent from "./statics-elements/TimerComponent"
import PanelGraph from "./panels/PanelGraph"
import LastAuctsTable from "./tables/LastAuctsTable"
// import PanelLives from "./panels/PanelLives"
// import PanelUsers from "./panels/PanelUsers"
// import { Money, People, MonetizationOn } from "@mui/icons-material"

function AdminDashboard() {
    const [usersCount, setUsersCount] = useState({})
    const [usersPorcentage, setUsersPorcentage] = useState({ porcentageAdvertiser: '', porcentageClients: '', porcentageAdms: '' })
    const [totalUsers, setTotalUsers] = useState()

    useEffect(() => {
        // INPUT DO GRAFICO CIRCULAR................................................
        GetStaticUsers(800, 50100, 200)
    }, [])

    const GetStaticUsers = (advertisers, clients, adms) => {
        setUsersCount({
            advertisers,
            clients,
            adms
        })

        const totalUsers = advertisers + clients + adms
        const porcentage_advertisers = (advertisers / totalUsers) * 100
        const porcentage_clients = (clients / totalUsers) * 100
        const porcentage_adms = (adms / totalUsers) * 100


        setUsersPorcentage({
            porcentageAdvertiser: porcentage_advertisers,
            porcentageClients: porcentage_clients,
            porcentageAdms: porcentage_adms
        })

        setTotalUsers(totalUsers)

    }

    return (
        <div className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-hidden
        flex justify-start items-start">
            <AssideAdmin MenuSelected="menu-1" />
            <section className="w-full h-[100vh] flex flex-col justify-start items-center">
                <NavAdmin />

                <section className="w-[90%] h-[20vh] flex justify-center items-center gap-6">

                    {/* Display Saldo */}
                    <div className="w-[30%] h-[80%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3">
                        <div className="flex flex-col justify-start items-start gap-3 border-l-[4px] border-[#314B8E]">
                            <span className="text-[16px] ml-3">Carteira</span>
                            <span className="text-[22px] ml-3">R$ 20.000,00</span>
                        </div>
                        <span className="text-[#10A55C] text-[12px]">12,8% + em relação a semana anterior</span>
                    </div>

                    {/* Display Ao vivo */}
                    <div className="w-[70%] h-[80%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3 relative">
                        <h2 className="bg-[#FA3A3A]/40 text-[#AF0000] p-1 rounded-full w-[80px] font-bold text-center">ao vivo</h2>
                    </div>

                </section>

                <section className="w-[90%] h-[40vh] flex justify-center items-center gap-6">
                    {/* Círculo de estatística */}
                    <div className="w-[40%] h-[90%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] relative">

                        <TimerComponent
                            advertiser_percentage={usersPorcentage.porcentageAdvertiser}
                            clients_percentage={usersPorcentage.porcentageClients}
                            adms_percentage={usersPorcentage.porcentageAdms}
                            totalUsers={totalUsers} />

                        <div className="w-[48%] h-[80%] absolute right-0 top-7 flex flex-col justify-between items-center p-6">

                            <div className="w-full flex flex-col justify-start gap-3 text-[14px]">
                                <span>Anunciantes - {
                                    typeof usersPorcentage.porcentageAdvertiser === 'number' ?
                                        (usersPorcentage.porcentageAdvertiser).toFixed(1) : ''
                                }%</span>
                                <li className="text-[#000000] ml-3">{usersCount.advertisers}</li>
                            </div>

                            <div className="w-full flex flex-col justify-start gap-3 text-[14px]">
                                <span>Clientes - {
                                    typeof usersPorcentage.porcentageClients === 'number' ?
                                        (usersPorcentage.porcentageClients).toFixed(1) : ''
                                }%</span>
                                <li className="text-[#6400C8] ml-3">{usersCount.clients}</li>
                            </div>

                            <div className="w-full flex flex-col justify-start gap-3 text-[14px]">
                                <span>Administradores - {
                                    typeof usersPorcentage.porcentageAdms === 'number' ?
                                        (usersPorcentage.porcentageAdms).toFixed(1) : ''
                                }%</span>
                                <li className="text-[#D87400] ml-3">{usersCount.adms}</li>
                            </div>

                        </div>

                    </div>
                    {/* Gráfico */}
                    <div className="w-[60%] h-[90%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722]">
                        <PanelGraph />
                    </div>
                </section>

                <section className="w-[90%] h-[40vh] flex flex-col justify-start items-start">

                    {/* Tabela de Ultimos Leilões realizados */}
                    <div className="w-full h-[80%] bg-[#fff] rounded-md 
                    shadow-lg shadow-[#17171722] flex 
                    flex-col justify-start items-center">

                        <div className="w-full p-3">
                            <h2>Últimos leilões realizados.</h2>
                        </div>
                        {/* INPUT INFORMAÇÔES DE TABELAS */}
                        <LastAuctsTable />

                    </div>

                </section>

            </section>
        </div>
    )
}

export default AdminDashboard