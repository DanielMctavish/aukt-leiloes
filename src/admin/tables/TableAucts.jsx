import TbodyAucts from "./tbody/tbodyAucts";
import ArrowDown from "../statics-elements/arrowDown";

function TableAucts() {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-[.4px] border-zinc-300">
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Nº
              <ArrowDown  />
            </div>
          </th>
          <th className="lg:px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              ID-Leilão
              <ArrowDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Anunciante <ArrowDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Publicação <ArrowDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Arremate <ArrowDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Título <ArrowDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between" >
              Status <ArrowDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Vendas <ArrowDown />
            </div>
          </th>
        </tr>
      </thead>

      <TbodyAucts />
    </table>
  );
}

export default TableAucts;
