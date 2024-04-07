import Visits from "../dados/Visits.json";
import ArrowDown from "../statics-elements/arrowDown";

function AuctsVisits() {
  return (
    <div className="p-4">
      <table className="w-full bg-white min-h-[200px] overflow-y-auto">
      <thead>
        <tr className="border-b-[.4px] border-zinc-300 lg:flex lg:gap-16 hidden ">
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Nº
            <ArrowDown />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
           Nome
            <ArrowDown />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
           Empresa
            <ArrowDown />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
            Email
            <ArrowDown />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
           nº de Compras
            <ArrowDown />
          </th>
          <th className="px-6 py-3 text-left text-zinc-400 font-semibold">
           Total de Compras
            <ArrowDown />
          </th>
        </tr>
        
      </thead>
      <tbody>
        {Visits.map((produto) => (
          <tr key={produto.id} className="text-zinc-400 lg:border-b-[.4px] lg:border-zinc-300 flex flex-wrap lg:flex-nowrap lg:gap-16">
            <td className="px-6 py-4 text-left text-[14px] font-bold">
              {produto.numero}
            </td>
            <td className="px-6 lg:ml-7 py-4 text-left text-[14px] font-bold">
              {produto.nome}
            </td>
            <td className="lg:px-6 px-3 py-4 text-left flex justify-start items-center gap-2">
              <img
                src={produto.imagem}
                alt=""
                className="w-[32px] h-[32px] object-cover shadow-sm shadow-zinc-600 rounded-full"
              />
              <span className=" font-bold text-[14px]">{produto.empresa}</span>
            </td>
            <td className="px-6 py-4 text-left text-[14px] font-bold lg:flex hidden">
              {produto.email}
            </td>
            <td className="px-6 py-4 text-left text-[14px] font-bold lg:flex hidden">
              {produto.nºcompras}
            </td>
            <td className="px-10 ml-16 py-4 text-left text-[14px] font-bold lg:flex hidden">
              {produto.total}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default AuctsVisits;
