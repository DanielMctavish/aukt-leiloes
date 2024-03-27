import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import ClientsTable from "../tables/ClientsTable";


function AdvertiserClients() {

    return (
        <div className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-x-hidden custom-scrollbar
        flex lg:flex-row flex-col justify-start items-start">

            <AssideAdvertiser MenuSelected="menu-5" />
            <section className="w-full h-[100vh] text-zinc-600 flex flex-col justify-start items-center">
                <NavAdvertiser />
                <section className="w-full h-[100%] flex p-2">
                    <ClientsTable/>
                </section>
            </section>

        </div>
    )
}

export default AdvertiserClients;