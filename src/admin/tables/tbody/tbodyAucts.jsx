import  { useState } from "react";
import Aucts from "../../dados/Aucts.json";
import Pagination from "../Pagination";
import { useNavigate } from 'react-router-dom';

function TbodyAucts() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAucts = Aucts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Catálogo":
        return "bg-[#6400C836] px-5 text-[#B66CFF]";
      case "Finalizado":
        return "bg-[#00C81436] text-[#257500]";
      case "Live":
        return "bg-[#C8000036] px-8 text-[#DD1C1C]";
      default:
        return "bg-gray-500";
    }
  };

  const navigate = useNavigate();

  function handleClick(route) {
    navigate(route);
  }


  return (
    <>
      <tbody>
        {currentAucts.map((auction, index) => (
          <tr
            key={index}
            className={`border-b-[.4px] border-zinc-300 cursor-pointer ${
              index === currentAucts.length - 1 ? "border-b-0" : ""
            }`}
            onClick={() => handleClick("/admin/aucts/details")}
          >
            <td className="px-6 py-4 text-left text-[14px] font-bold">
              {auction.number}
            </td>
            <td className="px-6 py-4 text-left text-[14px] font-bold">
              {auction.id_aucts}
            </td>
            <td className="px-6 py-4 text-left flex justify-start items-center gap-2 ">
              <img
                src={auction.imagem}
                alt=""
                className="w-[32px] h-[32px] object-cover shadow-sm shadow-zinc-600 rounded-full"
              />
              <span className="text-zinc-400 font-bold text-[14px]">
                {auction.advertiser}
              </span>
            </td>
            <td className="px-6 py-4 text-left text-[14px] font-bold">
              {auction.date}
            </td>
            <td className="px-6 py-4 text-left text-[14px] font-bold">
              {auction.finis}
            </td>
            <td className="px-6 py-4 text-left text-[14px] font-bold">
              {auction.title}
            </td>
            <td className="px-6 py-4 text-left">
              <span
                className={`font-bold rounded-full p-2 text-[12px] px-4 cursor-pointer ${getStatusColor(
                  auction.status
                )}`}
              >
                {auction.status}
              </span>
            </td>
            <td className="px-6 py-4 text-left text-[14px] font-bold">
              {auction.sale}
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
                totalPages={Math.ceil(Aucts.length / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </div>
          </td>
        </tr>
      </tfoot>
    </>
  );
}

export default TbodyAucts;
