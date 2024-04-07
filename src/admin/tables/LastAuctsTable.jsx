import AuctsTableInfo from "./tbody/tbodyLastAucts";
import ArrowDown
 from "../statics-elements/arrowDown";
function LastAuctsTable() {
  return (
    <table className="w-full bg-white">
      <thead>
        <tr className="border-b-[.4px] border-zinc-300">
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Nº
            <ArrowDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            ID - Leilão
            <ArrowDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Anunciante
            <ArrowDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Arremate
            <ArrowDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Título
            <ArrowDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Ficha
            <ArrowDown  />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Venda
            <ArrowDown  />
          </th>
        </tr>
      </thead>

      <AuctsTableInfo />
    </table>
  );
}

export default LastAuctsTable;
