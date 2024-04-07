import NavClient from "../navigation/NavClient";
import AssideClient from "../Asside/AssideClient";
import { useState } from "react";
import ClientTables from "../tables/ClientTables";

function DashboardClient() {
    const [arrematesRecents, setArrematesRecents] = useState([1, 2, 3, 4, 5, 6])

    

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideClient />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 text-zinc-600">

                <NavClient />

                <section className="flex flex-col justify-between w-[98%] h-[30%] bg-white rounded-md shadow-md shadow-[#17171734] p-2">

                    <div className="flex w-full justify-start items-center gap-6">
                        <img src="" alt="" className="object-cover w-[70px] h-[70px] bg-zinc-200 rounded-full" />
                        <div className="flex flex-col justify-start items-center gap-3">
                            <span>nome do usuário</span>
                            <span>email do usuário</span>
                        </div>
                    </div>

                    <div className="flex w-full h-[60%] justify-between items-center">
                        <div className="bg-[#E9EFFA] w-[33%] h-[80%] p-2 rounded-md"></div>
                        <div className="bg-[#E9EFFA] w-[33%] h-[80%] p-2 rounded-md"></div>
                        <div className="bg-[#E9EFFA] w-[33%] h-[80%] p-2 rounded-md"></div>
                    </div>

                </section>

                <section className="flex flex-col w-[98%] h-[60%] bg-white rounded-md shadow-md shadow-[#17171734] p-2">

                    <div className="flex flex-col justify-around items-start w-full h-[50%]">
                        <span className="font-bold">Arremates Recentes</span>
                        <div className="flex w-full justify-around items-center">
                            {
                                arrematesRecents.map((arremate, index) => {
                                    return (
                                        <span className="flex w-[200px] h-[200px] bg-[#ccffe6] rounded-md justify-center items-center" key={index}>
                                            {arremate}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-[50%] relative">
                        <span className="font-bold">Ultimas Participações</span>
                        <ClientTables />
                    </div>

                </section>

            </section>

        </div>
    )
}

export default DashboardClient;