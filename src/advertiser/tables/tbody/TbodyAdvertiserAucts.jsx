/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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

  useEffect(() => {

    getAuctionsList()

  }, [])

  const getAuctionsList = async () => {

    const currentAdvertiserStorage = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
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
      <tbody>
        {currentAucts.length === 0 ?
          <div className="">nenhum leilão criado</div>
          : currentAucts.map((auction, index) => (
            <tr
              key={index}
              className={`border-b-[.4px] hover:bg-[#223a54]/70
            transition-all hover:shadow-lg shadow-[#00000077]  
            hover:text-white border-zinc-300 
            cursor-pointer ${index === currentAucts.length - 1 ? "border-b-0" : ""
                }`}
              onClick={() => handleClick("/advertiser/auctions-details", auction.id)}
            >
              <td className="p-2 text-center text-[14px] font-bold">
                {index + 1}
              </td>
              <td className="p-2 text-center text-[14px] font-bold">
                {auction.title}
              </td>
              <td className=" text-center">
                <span className="text-zinc-400 font-bold text-[14px]">
                  {auction.nano_id}
                </span>
              </td>
              <td className="p-2 text-center text-[14px] font-bold">
                {auction.advertiser_id}
              </td>
              <td className="p-2 text-center text-[14px] font-bold">
                {auction.created_at}
              </td>
              <td className="p-2 text-center text-[14px] font-bold">
                {auction.product_list.length}
              </td>
              <td className="p-2 text-center">
                <span
                  className={`font-bold rounded-full p-2 text-[12px] px-4 cursor-pointer ${getStatusColor(
                    auction.status
                  )}`}
                >
                  {auction.status}
                </span>
              </td>
              <td className="text-center text-[14px] font-bold">
                {auction.value}
              </td>
              <td className="text-center text-[14px] font-bold">
                {productsValueList[index]}
              </td>
            </tr>
          ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="8" className="p-4">
            <div className="flex lg:justify-center items-center">
              <PaginationAdvertiser
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

export default TbodyAdvertiserAucts;
