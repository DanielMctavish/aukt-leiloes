/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import dayjs from "dayjs"
import PaginationAdvertiser from "../Pagination";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { selectedAuct } from "../../../features/auct/SelectedAuct";
import { addResume } from "../../../features/auct/ResumeAuctBalance";

function TbodyAdvertiserAucts() {
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
        return "bg-[#6400C836] px-5 text-[#B66CFF]";
      case "Finalizado":
        return "bg-[#00C81436] text-[#257500]";
      case "Live":
        return "bg-[#C8000036] px-8 text-[#DD1C1C]";
      default:
        return "bg-gray-500";
    }
  };



  function handleClick(route, id, sum, value) {
    dispatch(selectedAuct({ auct_id: id }))
    dispatch(addResume({
      value_balance: value,
      initial_value_sum: sum
    }))
    navigate(route);
  }


  return (
    <>
      <div className="w-full">
        {currentAucts.length === 0 ?
          <span className="text-zinc-600">nenhum leilão criado</span>
          : currentAucts.map((auction, index) => {

            return (
              <div
                key={index}
                className="w-full flex justify-between items-center gap-1 text-[12px] p-2 cursor-pointer hover:bg-[#2f7fa48d] hover:text-white"
                onClick={() => handleClick("/advertiser/auctions-details", auction.id, productsValueList[index], auction.value)}
              >
                <div className="flex items-center justify-between min-w-[70px] p-2">
                  {index + 1}
                </div>

                <div className="flex items-center justify-between min-w-[180px] max-w-[180px]  p-2 overflow-x-auto">
                  {auction.title}
                </div>

                <div className="flex items-center justify-between min-w-[180px] p-2 overflow-hidden font-bold">
                  {auction.nano_id}
                </div>

                <div className="flex items-center justify-start gap-2 min-w-[180px] p-1 overflow-hidden">
                  <span className="font-bold">{auction.Advertiser.email}</span>
                </div>

                <div className="flex items-center justify-between min-w-[180px] p-2 overflow-hidden text-zinc-400">
                  {dayjs(auction.created_at).format("DD MM YYYY - HH:mm")}
                </div>

                <div className="flex items-center justify-between min-w-[180px] p-2 overflow-hidden">
                  {auction.product_list.length}
                </div>

                <div className="min-w-[180px] p-2 overflow-hidden flex justify-center items-center">
                  <span
                    className={`font-bold rounded-full p-[1px] text-[12px] px-4 cursor-pointer ${getStatusColor(
                      auction.status
                    )}`}
                  >
                    {auction.status}
                  </span>
                </div>

                <div className="text-center text-[14px] font-bold min-w-[180px] p-2 overflow-hidden">
                  R$ {typeof auction.value === 'number' ? auction.value.toFixed(2) : '0.00'}
                </div>


                <div className="text-center text-[14px] font-bold min-w-[180px] p-2 overflow-hidden">
                  R$ {productsValueList[0] ? productsValueList[index].toFixed(2) : '0.00'}
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
    </>
  );
}

export default TbodyAdvertiserAucts;
