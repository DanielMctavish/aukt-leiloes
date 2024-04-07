

function PanelUsers() {

    return (
        <div className="lg:w-[27%] w-full h-[354px] bg-white rounded-[6px] shadow-lg shadow-[#1b1b1b2e] flex flex-col justify-start items-center p-2 gap-2">

            <span className="w-full h-[42px] bg-[#035A6E] text-white rounded-lg flex justify-center items-center">Resumo usuários</span>
            <section className="w-full h-[90%] flex justify-between items-start">

                <div className="w-[33%] h-[40%] border-[1px] border-zinc-300 rounded-[12px] flex flex-col justify-start items-center">
                    <span className="text-[12px] font-bold text-zinc-600">anunciantes</span>
                </div>
                <div className="w-[33%] h-[40%] border-[1px] border-zinc-300 rounded-[12px] flex flex-col justify-start items-center">
                    <span className="text-[12px] font-bold text-zinc-600">clientes</span>
                </div>
                <div className="w-[33%] h-[40%] border-[1px] border-zinc-300 rounded-[12px] flex flex-col justify-start items-center">
                    <span className="text-[12px] font-bold text-zinc-600">administradores</span>
                </div>

            </section>

        </div>
    )
}

export default PanelUsers;