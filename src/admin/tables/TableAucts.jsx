import TbodyAucts from "./tbody/tbodyAucts";

function TableAucts() {
  return (
    <table className="w-[98%] bg-white ml-4">
      <thead>
        <tr className="border-b-[.4px] border-zinc-300">
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Nº
          </th>

          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            ID - Leilão
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Anunciante
          </th>

          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Publicação
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Arremate
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Título
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Status
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Vendas
          </th>
        </tr>
      </thead>

      <TbodyAucts />
    </table>
  );
}

export default TableAucts;
