import { useEffect, useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import TimerComponent from "./statics-elements/TimerComponent";
import PanelGraph from "./panels/PanelGraph";
import AuctsTableInfo from "./tables/tbody/tbodyLastAucts";
import LastAuctsTable from "./tables/LastAuctsTable";
import TableAucts from "./tables/TableAucts";
import InputTable from "./tables/inputTable";

function AdminAuctions() {
  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
    bg-[#D8DEE8] text-zinc-600 overflow-hidden
    flex justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-1" />
      <section className="w-full h-auto flex flex-col justify-start items-center ">
        <NavAdmin />

        <section className="w-[90%] pt-6 flex justify-center items-center gap-6">
          <table className="w-full bg-white ">
            <InputTable />
            <div className="py-2">
              <span className="px-6 py-3 text-left text-[#747474] font-semibold">
                Leilões realizados
              </span>
            </div>
            <TableAucts />
          </table>
        </section>
      </section>
    </div>
  );
}

export default AdminAuctions;
