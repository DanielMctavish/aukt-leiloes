/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectedAuct } from "../../features/auct/SelectedAuct";
import { addResume } from "../../features/auct/ResumeAuctBalance";
import dayjs from "dayjs";
import PaginationAdvertiser from "./Pagination";

function TableAdvertiserAucts({ onRowClick }) {
  const [auctList, setAucts] = useState([])
  const stateAucts = useSelector(state => state.auctList)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [productsValueList, setProductsValueList] = useState([])
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
    if (!currentLocalAdvertiser) {
      navigate('/advertiser/login')
    }

    setAucts(stateAucts)
    getSumProducts()

  }, [stateAucts])


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAucts = auctList.slice(indexOfFirstItem, indexOfLastItem)


  const getSumProducts = () => {

    const sumProductsValues = auctList.map(auct => {
      return auct.product_list.reduce((total, product) => {
        return total + product.initial_value;
      }, 0);
    });

    setProductsValueList(sumProductsValues);

  };



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "cataloged":
        return "bg-[#6400C836] px-5 text-[#530e98]";
      case "finished":
        return "bg-[#00C81436] text-[#257500]";
      case "live":
        return "bg-[#C8000036] px-8 text-[#DD1C1C]";
      default:
        return "bg-gray-500 text-white";
    }
  };

  function handleClick(advertiser_id, auct_id, sum, value) {
    dispatch(selectedAuct({ auct_id }))
    dispatch(addResume({
      value_balance: value,
      initial_value_sum: sum
    }))
    onRowClick(advertiser_id, auct_id);
  }

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <section className="w-full flex flex-col justify-start items-center  absolute">

      <div className="flex flex-col justify-start items-center w-full bg-[#fff] gap-1">
        {currentAucts.length === 0 ?
          <span className="text-zinc-600">nenhum leilão criado</span>
          : currentAucts.map((auction, index) => {

            return (
              <div
                key={index}
                className="w-[98%] flex justify-between items-center gap-1 text-[12px] rounded-[12px]
                p-2 cursor-pointer hover:bg-[#2f7fa430] bg-[#e6e6e6]"
                onClick={() => handleClick(auction.advertiser_id, auction.id, productsValueList[index], auction.value)}
              >
                <div className="flex items-center justify-between flex-1 p-2">
                  {index + 1}
                </div>

                <div className="flex items-center justify-between flex-1  max-w-[180px]  p-2 overflow-x-auto">
                  {auction.title}
                </div>

                <div className="flex items-center justify-between flex-1  p-2 overflow-hidden font-bold">
                  {auction.nano_id}
                </div>

                <div className="flex items-center justify-start gap-2 flex-1  p-1 overflow-hidden">
                  <span className="font-bold">{auction.Advertiser.email}</span>
                </div>

                <div className="flex items-center justify-between flex-1  p-2 overflow-hidden">
                  {dayjs(auction.created_at).format("DD MM YYYY - HH:mm")}
                </div>

                <div className="flex items-center justify-between flex-1  p-2 overflow-hidden">
                  {auction.product_list.length}
                </div>

                <div className="flex-1  p-2 overflow-hidden flex justify-center items-center">
                  <span
                    className={`font-bold rounded-full p-[1px] text-[12px] px-4 cursor-pointer ${getStatusColor(
                      auction.status
                    )}`}
                  >
                    {auction.status}
                  </span>
                </div>

                <div className="text-center text-[14px] font-bold flex-1  p-2 overflow-hidden">
                  {formatCurrency(auction.value)}
                </div>

                <div className="text-center text-[16px] font-bold flex-1  p-2 overflow-hidden">
                  {productsValueList[0] ? formatCurrency(productsValueList[index]) : formatCurrency(0)}
                </div>

              </div>
            )
          })}
      </div>

      <div>

        <div className=" w-full flex lg:justify-center items-center p-3">
          <PaginationAdvertiser
            currentPage={currentPage}
            totalPages={Math.ceil(auctList.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>

      </div>

    </section>
  );
}

export default TableAdvertiserAucts;
