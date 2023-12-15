import AssideAdvertiser from "../_asside/AssideAdvertiser"
import NavAdvertiser from "../_navigation/NavAdvertiser"
import TableAdvertiserAucts from "../tables/TableAdvertiserAucts"


export const AdvertiserAuctions = () => {

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <AssideAdvertiser MenuSelected="menu-3" />
            <section className="w-full h-[100vh] text-zinc-600 flex flex-col justify-start items-center">
                <NavAdvertiser />
                <section className="w-full h-[100%] flex p-2">
                    <TableAdvertiserAucts />
                </section>
            </section>
        </div>
    )
}