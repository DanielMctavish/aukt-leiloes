import NavAdmin from "./navigation/NavAdmin"
import PanelGraph from "./panels/PanelGraph"
import PanelLives from "./panels/PanelLives"
import PanelUsers from "./panels/PanelUsers"

function AdminDashboard() {

    return (
        <div className="w-full h-[100vh] bg-[#F3F3F3] text-zinc-600 overflow-hidden">
            <NavAdmin />
            <section className="w-full h-[96vh] bg-[#82ffb2] flex justify-center items-center gap-3">

                <nav className="w-[20%] h-[90vh] bg-red-100">

                </nav>

                <section className="w-[77%] h-[90vh] bg-red-100 flex flex-col justify-between items-center">

                    <section className="w-full h-[50%] bg-cyan-300 flex justify-between items-center p-2">
                        <PanelUsers />
                        <PanelUsers />
                        <PanelUsers />
                        <PanelLives />
                    </section>

                    <section className="w-full h-[50%] bg-cyan-600 flex justify-center items-center p-1">
                        <PanelGraph />
                    </section>

                </section>

            </section>
        </div>
    )
}

export default AdminDashboard