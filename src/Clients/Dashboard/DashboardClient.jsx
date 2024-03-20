import NavClient from "../navigation/NavClient";
import AssideClient from "../Asside/AssideClient";

function DashboardClient() {

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideClient />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 text-zinc-600">

                <NavClient />

                <section className="flex w-[98%] h-[30%] bg-white rounded-md shadow-md shadow-[#17171734] p-2">
                    <div className="flex w-full justify-start items-center gap-6">
                        <img src="" alt="" className="object-cover w-[70px] h-[70px] bg-zinc-200 rounded-full" />
                        <div className="flex flex-col justify-start items-center gap-3">
                            <span>nome do usuário</span>
                            <span>email do usuário</span>
                        </div>
                    </div>
                </section>

                <section className="flex w-[98%] h-[60%] bg-white rounded-md shadow-md shadow-[#17171734]">

                </section>

            </section>

        </div>
    )
}

export default DashboardClient;