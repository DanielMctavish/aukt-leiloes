import {ArrowDropDown} from "@mui/icons-material"
import TbodyAdvertiserAucts from "./tbody/TbodyAdvertiserAucts";

function TableAdvertiserAucts() {
  return (
    <table className="w-[98%] lg:bg-white lg:p-4 lg:ml-2">
      <thead>
        <tr className="border-b-[.4px] border-zinc-300">
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Nº
              <ArrowDropDown  />
            </div>
          </th>
          <th className="lg:px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              ID-Leilão
              <ArrowDropDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Anunciante <ArrowDropDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Publicação <ArrowDropDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Arremate <ArrowDropDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Título <ArrowDropDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between" >
              Status <ArrowDropDown />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            <div className="flex items-center justify-between">
              Vendas <ArrowDropDown />
            </div>
          </th>
        </tr>
      </thead>

      <TbodyAdvertiserAucts />
    </table>
  );
}

export default TableAdvertiserAucts;
