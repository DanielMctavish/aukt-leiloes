import { ArrowDropDown } from "@mui/icons-material"
import TbodyAdvertisersLastAucts from "./tbody/TbodyAdvertisersLastAucts";

function LastAdvertisersAuctsTable() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#012038] text-white">
              <th className="px-6 py-4 text-left font-medium text-sm tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer">
                  Nº
                  <ArrowDropDown className="text-blue-300" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-medium text-sm tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer">
                  ID - Leilão
                  <ArrowDropDown className="text-blue-300" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-medium text-sm tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer">
                  Título
                  <ArrowDropDown className="text-blue-300" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-medium text-sm tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer">
                  Lotes Quant.
                  <ArrowDropDown className="text-blue-300" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-medium text-sm tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer">
                  Com Lance
                  <ArrowDropDown className="text-blue-300" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-medium text-sm tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer">
                  Sem Lance
                  <ArrowDropDown className="text-blue-300" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-medium text-sm tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer">
                  Avaliação
                  <ArrowDropDown className="text-blue-300" />
                </div>
              </th>
            </tr>
          </thead>

          <TbodyAdvertisersLastAucts />
        </table>
      </div>
    </div>
  );
}

export default LastAdvertisersAuctsTable;
