import {ArrowDropDown} from "@mui/icons-material"
import TbodyAdvertisersLastAucts from "./tbody/TbodyAdvertisersLastAucts";

function LastAdvertisersAuctsTable() {
  return (
    <table className="w-full bg-[#ffffff] overflow-hidden rounded-[12px]">
      <thead>
        <tr className="border-b-[.4px] border-zinc-300 bg-[#012038] text-white">
          <th className="px-6 py-3 text-left font-semibold">
            Nº
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left font-semibold">
            ID - Leilão
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left font-semibold">
            título
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left font-semibold">
            lotes quant.
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left font-semibold">
            lotes com lance
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left font-semibold">
            lotes sem lance
            <ArrowDropDown  />
          </th>
          <th className="px-6 py-3 text-left font-semibold">
            Avaliação
            <ArrowDropDown  />
          </th>
        </tr>
      </thead>

      <TbodyAdvertisersLastAucts />
    </table>
  );
}

export default LastAdvertisersAuctsTable;
