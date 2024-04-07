import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import TableAucts from "./tables/TableAucts";
import InputTable from "./tables/inputTable";

function AdminAuctions() {

  return (
    <div
      className="w-full lg:h-[100vh] h-auto
    bg-[#D8DEE8] text-zinc-600  overflow-x-hidden custom-scrollbar
     flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-2" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center">
        <NavAdmin />

        <section className="w-[90%] h-full pt-6 flex lg:justify-center lg:items-center lg:gap-6 lg:flex-row flex-col">
          <div
            className="w-full bg-[#D8DEE8] lg:bg-white rounded-md 
                    lg:shadow-lg lg:shadow-[#17171722] flex 
                    flex-col"
          >
            <InputTable />
            <div className="py-2">
              <span className="lg:inline hidden  px-6 py-3 text-left text-[#747474] font-semibold">
                Leilões realizados
              </span>
            </div>
            <TableAucts />
          </div>
        </section>
      </section>
    </div>
  );
  
}

export default AdminAuctions;
