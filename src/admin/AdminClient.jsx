import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import AdvertisersTable from "./tables/AdvertisersTable";
import InputTable from "./tables/inputTable";

function AdminClient() {
  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-hidden
        flex justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-4" />
      <section className="w-full h-auto flex flex-col justify-start items-center ">
        <NavAdmin />
        <section className="w-[90%] pt-6 flex justify-center items-center gap-6">
          <div
            className="w-full bg-white  rounded-md 
                    shadow-lg shadow-[#17171722] flex 
                    flex-col "
          >
            <InputTable />
            <div className="py-2">
              <span className="px-6 py-3 text-left text-[#747474] font-semibold">
                Clientes
              </span>
            </div>
            <AdvertisersTable />
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminClient;
