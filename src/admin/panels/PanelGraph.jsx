import { GraphElement } from "./GraphElement"

function PanelGraph() {

    return (
        <div className="w-full lg:h-[97%] h-[300px] flex justify-center items-center gap-1">

            <section className="w-[180px] h-[100%] bg-cyan-600 text-white p-2 flex flex-col justify-start items-center">

                <h2 className="text-[22px]">2023</h2>

                <section className="w-full h-[90%] text-[14px] text-left flex flex-col justify-between items-start bg-zinc-600">
                    <div className="w-full h-[90%] flex flex-col justify-between">
                        <span>R$ 250.000</span>
                        <span>R$ 100.000</span>
                        <span>R$ 50.000</span>
                        <span>R$ 10.000</span>
                        <span>R$ 1.000</span>
                        <span>R$ 0</span>
                    </div>
                </section>

            </section>

            <section className="w-[90%] h-[100%] flex flex-col justify-start items-center p-2 text-white">

                <div className="text-[14px] w-full bg-amber-200 p-1 flex justify-start items-center gap-2">
                    <button className="p-1 bg-[#008AD8] rounded-lg">anunciantes</button>
                    <button className="p-1 bg-[#D87400] rounded-lg">clientes</button>
                    <button className="p-1 bg-[#AE53F5] rounded-lg">administradores</button>
                </div>

                <section className="w-full h-[90%]">

                    <section className="w-full h-[90%] border-[1px] border-dashed flex justify-between items-center graph-area">
                       
                        <GraphElement />
                    </section>

                    <div className="w-full h-[10%] flex justify-between items-center bg-red-300 gap-1">
                        <span className="bg-cyan-600 w-screen">Jan</span>
                        <span className="bg-cyan-600 w-screen">Fev</span>
                        <span className="bg-cyan-600 w-screen">Mar</span>
                        <span className="bg-cyan-600 w-screen">Abr</span>
                        <span className="bg-cyan-600 w-screen">Mai</span>
                        <span className="bg-cyan-600 w-screen">Jun</span>
                        <span className="bg-cyan-600 w-screen">Jul</span>
                        <span className="bg-cyan-600 w-screen">Ago</span>
                        <span className="bg-cyan-600 w-screen">Set</span>
                        <span className="bg-cyan-600 w-screen">Out</span>
                        <span className="bg-cyan-600 w-screen">Nov</span>
                        <span className="bg-cyan-600 w-screen">Dez</span>
                    </div>

                </section>

            </section>

        </div>
    )
}

export default PanelGraph