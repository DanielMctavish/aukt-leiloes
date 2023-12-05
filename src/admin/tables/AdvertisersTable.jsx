import React, { useState } from "react";
import Visits from "../dados/Visits.json";
import ArrowDown from "../statics-elements/arrowDown";
import Pagination from "../tables/Pagination";

function AdvertisersTable() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisits = Visits.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <table className="w-full bg-[#D8DEE8] lg:bg-white min-h-[200px] overflow-y-auto">
        <thead>
          <tr className="border-b-[.4px] border-zinc-300">
            <th className="lg:px-6 py-3 text-left text-zinc-400 font-semibold">
              Nº
              <ArrowDown />
            </th>
            <th className="lg:px-6 px-2 py-3 text-left text-zinc-400 font-semibold">
              Nome
              <ArrowDown />
            </th>
            <th className="lg:px-6 py-4 text-left text-zinc-400 font-semibold">
              Empresa
              <ArrowDown />
            </th>
            <th className="lg:px-6 px-12 py-3 text-left text-zinc-400 font-semibold">
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
          {currentVisits.map((produto, index) => (
            <tr
              key={produto.id}
              className="text-zinc-400 lg:border-b-[.4px] border-zinc-300"
            >
              <td className="px-6 py-4 text-left text-[14px] font-bold">
                {produto.numero}
              </td>
              <td className="px-6 py-4 text-left text-[14px] font-bold">
                {produto.nome}
              </td>
              <td className="px-6 py-4 text-left flex justify-start items-center gap-2 ">
                <img
                  src={produto.imagem}
                  alt=""
                  className="w-[32px] h-[32px] object-cover shadow-sm shadow-zinc-600 rounded-full"
                />
                <span className=" font-bold text-[14px]">
                  {produto.empresa}
                </span>
              </td>
              <td className="px-6 py-4 text-left text-[14px] font-bold">
                {produto.email}
              </td>
              <td className="px-6 py-4 text-left text-[14px] font-bold">
                {produto.nºcompras}
              </td>
              <td className="px-6 py-4 text-left text-[14px] font-bold">
                {produto.total}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="8" className="p-4">
              <div className="flex lg:justify-center items-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(Visits.length / itemsPerPage)}
                  onPageChange={handlePageChange}
                />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AdvertisersTable;
