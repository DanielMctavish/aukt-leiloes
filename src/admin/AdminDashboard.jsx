import NavAdmin from "./navigation/NavAdmin"
import PanelGraph from "./panels/PanelGraph"
import PanelLives from "./panels/PanelLives"
import PanelUsers from "./panels/PanelUsers"
import { Money, People, MonetizationOn } from "@mui/icons-material"

function AdminDashboard() {

    return (
        <div className="w-full lg:h-[100vh] h-auto bg-[#F3F3F3] text-zinc-600 overflow-hidden">
            <NavAdmin />
            <section className="w-full lg:h-[96vh] h-auto flex justify-center items-center gap-3">

                <nav className="w-[16%] h-[90vh] bg-[#012038] lg:flex flex-col hidden rounded-[6px] text-white p-3 gap-3">

                    <button className="w-full flex justify-between items-center">
                        <Money />
                        Transações
                    </button>

                    <button className="w-full flex justify-between items-center">
                        <People />
                        Anunciantes
                    </button>

                    <button className="w-full flex justify-between items-center">
                        <MonetizationOn />
                        Saques
                    </button>

                </nav>

                <section className="lg:mt-0 mt-[6vh] lg:w-[81%] w-full lg:h-[90vh] h-auto flex flex-col lg:justify-between justify-start items-center">

                    <section className="w-full lg:h-[50%] h-auto flex lg:flex-row flex-col lg:gap-0 gap-2 justify-between items-center p-2">
                        <PanelUsers />
                        <PanelUsers />
                        <PanelUsers />
                        <PanelLives />
                    </section>

                    <section className="w-full lg:h-[50%] h-auto flex justify-center items-center p-1">
                        <PanelGraph />
                    </section>

                </section>

            </section>
        </div>
    )
}

export default AdminDashboard