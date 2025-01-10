/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectedAuct } from "../../features/auct/SelectedAuct";
import { addResume } from "../../features/auct/ResumeAuctBalance";
import dayjs from "dayjs";
import PaginationAdvertiser from "./Pagination";
import axios from "axios";
import { 
  CheckCircle, 
  LiveTv,
  Inventory2,
} from '@mui/icons-material';

function TableAdvertiserAucts({ onRowClick }) {
  const [auctList, setAucts] = useState([])
  const stateAucts = useSelector(state => state.auctList)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [productsValueList, setProductsValueList] = useState([])
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [publishFeedback, setPublishFeedback] = useState({ id: null, status: '', message: '' });

  useEffect(() => {
    const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
    if (!currentLocalAdvertiser) {
      navigate('/advertiser/login')
    }

    setAucts(stateAucts)
    getSumProducts()
  }, [stateAucts])

  // Novo useEffect para verificar status
  useEffect(() => {
    if (auctList && Array.isArray(auctList) && auctList.length > 0) {
      auctList.forEach(auction => {
        checkDatesStatus(auction);
      });
    }
  }, [auctList])

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
        return "bg-[#6400C836] text-[#530e98]";
      case "finished":
        return "bg-[#00C81436] text-[#257500]";
      case "live":
        return "bg-[#C8000036] text-[#DD1C1C]";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "cataloged":
        return <Inventory2 className="w-4 h-4 mr-1" />;
      case "finished":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "live":
        return <LiveTv className="w-4 h-4 mr-1" />;
      default:
        return null;
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


  const handlePublish = async (e, auctId) => {
    e.stopPropagation();
    setPublishFeedback({ id: auctId, status: 'loading', message: 'Publicando...' });

    try {
      const currentSession = JSON.parse(localStorage.getItem('advertiser-session-aukt'));
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_API}/auct/update-auct?auct_id=${auctId}`,
        { public: true },
        {
          headers: { 'Authorization': `Bearer ${currentSession.token}` }
        }
      );

      setAucts(prevAucts =>
        prevAucts.map(auct =>
          auct.id === auctId ? { ...auct, public: true } : auct
        )
      );

      setPublishFeedback({ id: auctId, status: 'success', message: 'Leilão publicado!' });

      // Limpa o feedback após 3 segundos
      setTimeout(() => {
        setPublishFeedback({ id: null, status: '', message: '' });
      }, 3000);

    } catch (error) {
      console.error('Erro ao publicar leilão:', error);
      setPublishFeedback({ id: auctId, status: 'error', message: 'Erro ao publicar' });

      setTimeout(() => {
        setPublishFeedback({ id: null, status: '', message: '' });
      }, 3000);
    }
  };

  const checkDatesStatus = async (auction) => {
    // Verifica se todas as datas estão finalizadas
    const allDatesFinished = auction.auct_dates.every(date => 
      date.group_status === "finished"
    );

    // Se todas as datas estiverem finalizadas e o status não for "finished"
    if (allDatesFinished && auction.status !== "finished") {
      try {
        const currentSession = JSON.parse(localStorage.getItem('advertiser-session-aukt'));
        
        await axios.patch(
          `${import.meta.env.VITE_APP_BACKEND_API}/auct/update-auct?auct_id=${auction.id}`,
          { status: "finished" },
          {
            headers: { 'Authorization': `Bearer ${currentSession.token}` }
          }
        );

        // Atualiza o estado local
        setAucts(prevAucts =>
          prevAucts.map(auct =>
            auct.id === auction.id ? { ...auct, status: "finished" } : auct
          )
        );

      } catch (error) {
        console.error('Erro ao atualizar status do leilão:', error);
      }
    }
  };

  return (
    <section className="w-full flex flex-col justify-start items-center absolute">
      {/* Cabeçalho da Tabela */}
      <div className="w-[98%] bg-white rounded-t-lg shadow-md">
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-gray-600 border-b">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Título</div>
          <div className="col-span-1">ID</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-1">Data</div>
          <div className="col-span-1">Produtos</div>
          <div className="col-span-2">Valor Real</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Ações</div>
        </div>

        {/* Linhas da Tabela */}
        <div className="divide-y">
          {currentAucts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum leilão criado</div>
          ) : (
            currentAucts.map((auction, index) => (
              <div
                key={auction.id}
                onClick={() => handleClick(auction.advertiser_id, auction.id, productsValueList[index], auction.value)}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-blue-50 cursor-pointer transition-colors items-center text-sm"
              >
                <div className="col-span-1 text-gray-600">{indexOfFirstItem + index + 1}</div>
                <div className="col-span-2 truncate font-medium">{auction.title}</div>
                <div className="col-span-1 font-mono text-gray-600">{auction.nano_id}</div>
                <div className="col-span-2 truncate">{auction.Advertiser.email}</div>
                <div className="col-span-1">{dayjs(auction.created_at).format("DD/MM HH:mm")}</div>
                <div className="col-span-1 text-center">{auction.product_list.length}</div>
                
                {/* Nova coluna de Valor Real */}
                <div className="col-span-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(auction.real_value || 0)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Inicial: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(auction.initial_value || 0)}
                    </span>
                  </div>
                </div>

                {/* Status com Ícones */}
                <div className="col-span-1">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                    ${getStatusColor(auction.status)}`}
                  >
                    {getStatusIcon(auction.status)}
                    <span className="mr-2">{auction.status}</span>
                    
                    {/* Indicadores de Data Compactos */}
                    <div className="flex -space-x-0.5">
                      {auction?.auct_dates.map((date, index) => (
                        <div key={index} 
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          title={`Grupo ${index + 1}: ${date.group_status === "finished" ? "Finalizado" : "Pendente"}`}
                        >
                          {date.group_status === "finished" ? (
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border-[1px] border-gray-100" />
                          )}
                        </div>
                      ))}
                    </div>
                  </span>
                </div>

                {/* Ações */}
                <div className="col-span-1">
                  {auction.public ? (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs 
                      font-medium flex items-center gap-1 whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      Online
                    </span>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={(e) => handlePublish(e, auction.id)}
                        disabled={publishFeedback.id === auction.id}
                        className="px-3 py-1.5 bg-[#012038] text-white rounded-md text-xs 
                          font-medium hover:bg-[#012038]/90 transition-colors flex items-center gap-1
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Publicar
                      </button>

                      {publishFeedback.id === auction.id && (
                        <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 
                          whitespace-nowrap px-2 py-1 rounded text-xs font-medium
                          ${publishFeedback.status === 'success' ? 'bg-green-100 text-green-700' :
                            publishFeedback.status === 'error' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'}`}
                        >
                          {publishFeedback.message}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Paginação */}
      <div className="w-full flex justify-center mt-4">
        <PaginationAdvertiser
          currentPage={currentPage}
          totalPages={Math.ceil(auctList.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}

export default TableAdvertiserAucts;
