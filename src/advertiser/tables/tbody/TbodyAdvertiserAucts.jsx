/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import dayjs from "dayjs"
import axios from "axios"
import PaginationAdvertiser from "../Pagination";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { selectedAuct } from "../../../features/auct/SelectedAuct";

function TbodyAdvertiserAucts() {
  const [Aucts, setAucts] = useState([])
  const [productsValueList, setProductsValueList] = useState([])
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAucts = Aucts.slice(indexOfFirstItem, indexOfLastItem);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const currentAdvertiserStorage = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

  useEffect(() => {

    getAuctionsList()

  }, [])

  const getAuctionsList = async () => {

    const getAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserStorage.email}`)

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${getAdvertiser.data.id}`).then(response => {

      getSumProducts(response.data)
      setAucts(response.data)

    }).catch(err => {
      console.log('erro ao tentar lista leilões >>', err.response)
    })

  }

  const getSumProducts = (aucts) => {
    const sumProductsValues = aucts.map(auct => {
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



  function handleClick(route, id) {
    dispatch(selectedAuct({ auct_id: id }))
    navigate(route);
  }


  return (
    <>
      <div className="w-full">
        {currentAucts.length === 0 ?
          <span className="">nenhum leilão criado</span>
          : currentAucts.map((auction, index) => {

            return (
              <div
                key={index}
                className="w-full flex justify-between items-center gap-1 text-[12px] p-2 cursor-pointer hover:bg-[#2f7fa48d] hover:text-white"
                onClick={() => handleClick("/advertiser/auctions-details", auction.id)}
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
                  <img src={auction.Advertiser.url_profile_cover} alt="perfil do anunciante" className=" flex w-[20px] h-[20px] object-cover rounded-full" />
                  <span>{auction.Advertiser.email}</span>
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
                  {auction.value}
                </div>

                <div className="text-center text-[14px] font-bold min-w-[180px] p-2 overflow-hidden">
                  {productsValueList[index]}
                </div>

              </div>
            )
          })}
      </div>

      <div>

        <div className=" w-full flex lg:justify-center items-center">
          <PaginationAdvertiser
            currentPage={currentPage}
            totalPages={Math.ceil(Aucts.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>

      </div>
    </>
  );
}

export default TbodyAdvertiserAucts;
