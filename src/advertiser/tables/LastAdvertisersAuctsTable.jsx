import {ArrowDropDown} from "@mui/icons-material"
import TbodyAdvertisersLastAucts from "./tbody/TbodyAdvertisersLastAucts";

function LastAdvertisersAuctsTable() {
  return (
    <table className="w-full bg-white rounded-md">
      <thead>
        <tr className="border-b-[.4px] border-zinc-300">
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Nº
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            ID - Leilão
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            título
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            lotes quant.
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Avaliação
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Estimativa
            <ArrowDropDown  />
          </th>
        </tr>
      </thead>

      <TbodyAdvertisersLastAucts />
    </table>
  );
}

export default LastAdvertisersAuctsTable;
