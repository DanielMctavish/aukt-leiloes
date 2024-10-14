/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import { useNavigate } from "react-router-dom";
import { Money, People, MonetizationOn, Close, ExpandMore, ExpandLess } from "@mui/icons-material"; // Importando ícones do MUI
import axios from "axios";


function AdminDashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCounts, setTotalCounts] = useState({ advertisersCount: 0, clientsCount: 0 });
  const [totalSales, setTotalSales] = useState(0);
  const [advertisers, setAdvertisers] = useState([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState(null);
  const [expandedAucts, setExpandedAucts] = useState({});

  useEffect(() => {
    const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'));

    if (!adminLocal) {
      navigate("/admin/login");
    } else {
      fetchBalance(adminLocal.email, adminLocal.token);
      fetchTotalCounts(adminLocal.token);
      fetchTotalSales(adminLocal.token);
      fetchAdvertisers(adminLocal.token);
    }
  }, []);

  const fetchBalance = async (email, token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/admin/find-by-email`, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Erro ao buscar o saldo:", error.response);
      setError("Não foi possível carregar o saldo. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalCounts = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/admin/total-counts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTotalCounts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contagens totais:", error.response);
      setError("Não foi possível carregar as contagens totais. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalSales = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/general-amount-cartelas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTotalSales(response.data.totalAmount);
    } catch (error) {
      console.error("Erro ao buscar total de vendas:", error.response);
      setError("Não foi possível carregar o total de vendas. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdvertisers = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/admin/list-advertisers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdvertisers(response.data);
    } catch (error) {
      console.error("Erro ao buscar anunciantes:", error.response);
      setError("Não foi possível carregar a lista de anunciantes. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar valores em Real Brasileiro
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAdvertiserClick = (advertiser) => {
    setSelectedAdvertiser(advertiser);
  };

  const closeModal = () => {
    setSelectedAdvertiser(null);
  };

  const toggleAuctExpansion = (auctId) => {
    setExpandedAucts(prev => ({
      ...prev,
      [auctId]: !prev[auctId]
    }));
  };

  const calculateTotalCartelasValue = (cartelas) => {
    return cartelas.reduce((total, cartela) => total + cartela.amount, 0);
  };

  return (
    <div
      className="w-full lg:h-[100vh] h-auto
        bg-[#D8DEE8] text-zinc-600 lg:overflow-x-hidden custom-scrollbar overflow-x-auto
        flex justify-start items-start lg:flex-row flex-col"
    >
      <AssideAdmin MenuSelected="menu-1" />
      <section className="w-full h-full flex flex-col justify-start items-center overflow-y-auto p-4">
        <NavAdmin />

        {/* section body */}
        <section className="w-full h-full flex flex-wrap justify-around items-start bg-[#e8e8e8]">
          {/* Painel Saldo */}
          <div className="w-[80%] lg:w-[30%] h-[30%] bg-[#fff] 
            flex flex-col justify-center items-center
            p-3 rounded-md shadow-lg shadow-[#17171722] m-2">
            <h2 className="text-center font-bold text-[22px]">Carteira</h2>

            <div className="flex items-center justify-around mt-4 w-[80%]">
              <div className="flex flex-col items-center">
                <Money className="text-[#314B8E]" fontSize="large" />
                <span className="text-[16px]">Saldo Atual</span>
                {isLoading ? (
                  <span>Carregando...</span>
                ) : (
                  <span className="text-[22px]">{formatCurrency(balance)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Painel Anunciante */}
          <div className="w-[80%] lg:w-[30%] h-[30%] bg-[#fff] 
            flex flex-col justify-center items-center
            p-3 rounded-md shadow-lg shadow-[#17171722] m-2">
            <h2 className="text-center font-bold text-[22px]">Usuários</h2>

            <div className="flex items-center justify-around mt-4 w-[80%]">
              <div className="flex flex-col items-center">
                <People className="text-[#314B8E]" fontSize="large" />
                <span className="text-[16px]">Anunciantes</span>
                {isLoading ? (
                  <span>Carregando...</span>
                ) : (
                  <span className="text-[22px]">{totalCounts.advertisersCount}</span>
                )}
              </div>
              <div className="flex flex-col items-center">
                <People className="text-[#314B8E]" fontSize="large" />
                <span className="text-[16px]">Clientes</span>
                {isLoading ? (
                  <span>Carregando...</span>
                ) : (
                  <span className="text-[22px]">{totalCounts.clientsCount}</span>
                )}
              </div>
            </div>
          </div>

          {/* Nova Seção: Estatísticas */}
          <div className="w-[80%] lg:w-[30%] h-[30%] bg-[#fff] 
          flex flex-col justify-center items-center
          p-3 rounded-md shadow-lg shadow-[#17171722] m-2">
            <h2 className="text-center font-bold text-[22px]">Estatísticas</h2>

            <div className="flex items-center justify-around mt-4 w-[80%]">
              <div className="flex flex-col items-center">
                <MonetizationOn className="text-[#314B8E]" fontSize="large" />
                <span className="text-[16px]">Total Vendas</span>
                {isLoading ? (
                  <span>Carregando...</span>
                ) : (
                  <span className="text-[22px]">{formatCurrency(totalSales)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Anunciantes */}
          <div className="w-full bg-[#fff] p-3 rounded-md 
          flex justify-center items-center flex-col
          shadow-lg shadow-[#17171722] m-2">
            <h2 className="text-center font-bold">Todos Anunciantes - Lista</h2>
            {isLoading ? (
              <p>Carregando anunciantes...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <table className="min-w-full mt-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 text-left">Nome</th>
                      <th className="p-2 text-left">CPF</th>
                      <th className="p-2 text-left">Nome da Empresa</th>
                      <th className="p-2 text-left">Valor</th>
                      <th className="p-2 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advertisers.map(advertiser => (
                      <tr 
                        key={advertiser.id} 
                        className="border-b hover:bg-[#194b81] cursor-pointer hover:text-[#fff]"
                        onClick={() => handleAdvertiserClick(advertiser)}
                      >
                        <td className="p-2">{advertiser.name}</td>
                        <td className="p-2">{advertiser.CPF}</td>
                        <td className="p-2">{advertiser.company_name}</td>
                        <td className="p-2">{formatCurrency(advertiser.amount)}</td>
                        <td className="p-2">{advertiser.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="bg-[#e8e8e8] p-2 mt-[2vh] text-[#464646] rounded-md">ver mais</button>
              </>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="w-[80%] lg:w-[30%] flex justify-around items-center m-2">
            <button className="bg-[#032c3c] text-white p-2 rounded">Criar Novo Anunciante</button>
            <button className="bg-green-500 text-white p-2 rounded">Criar Novo Cliente</button>
          </div>

          {/* Modal do Anunciante */}
          {selectedAdvertiser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="w-[80%] h-[90vh] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-auto">
                <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Detalhes do Anunciante</h2>
                  <button onClick={closeModal} className="text-white hover:text-gray-300">
                    <Close fontSize="large" />
                  </button>
                </div>
                <div className="p-6 text-white">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-4 md:mb-0">
                      <img 
                        src={selectedAdvertiser.url_profile_cover || 'https://via.placeholder.com/150'} 
                        alt={selectedAdvertiser.name}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="md:w-2/3 md:pl-6">
                      <h3 className="text-xl font-semibold mb-2">{selectedAdvertiser.name}</h3>
                      <p><strong>CPF:</strong> {selectedAdvertiser.CPF}</p>
                      <p><strong>Empresa:</strong> {selectedAdvertiser.company_name}</p>
                      <p><strong>CNPJ:</strong> {selectedAdvertiser.CNPJ || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedAdvertiser.email}</p>
                      <p><strong>Endereço:</strong> {selectedAdvertiser.address}</p>
                      <p><strong>Saldo:</strong> {formatCurrency(selectedAdvertiser.amount)}</p>
                      <p><strong>Status:</strong> {selectedAdvertiser.police_status || 'REGULAR'}</p>
                      <p><strong>Data de Criação:</strong> {new Date(selectedAdvertiser.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Leilões e Cartelas</h3>
                    {selectedAdvertiser.Aucts && selectedAdvertiser.Aucts.length > 0 ? (
                      <div className="space-y-6">
                        {selectedAdvertiser.Aucts.map(auct => (
                          <div key={auct.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-lg">{auct.title}</h4>
                              <button onClick={() => toggleAuctExpansion(auct.id)} className="text-white">
                                {expandedAucts[auct.id] ? <ExpandLess /> : <ExpandMore />}
                              </button>
                            </div>
                            <p><strong>Status:</strong> {auct.status}</p>
                            <p><strong>Valor Total das Cartelas:</strong> {formatCurrency(calculateTotalCartelasValue(auct.Cartelas))}</p>
                            <p><strong>Data:</strong> {new Date(auct.created_at).toLocaleDateString()}</p>
                            
                            {expandedAucts[auct.id] && (
                              <>
                                <h5 className="font-semibold mt-4 mb-2">Cartelas</h5>
                                {auct.Cartelas && auct.Cartelas.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {auct.Cartelas.map(cartela => (
                                      <div key={cartela.id} className="bg-gray-600 p-3 rounded">
                                        <p><strong>ID:</strong> ...{cartela.id.slice(-6)}</p>
                                        <p><strong>Valor:</strong> {formatCurrency(cartela.amount)}</p>
                                        <p><strong>Status:</strong> {cartela.status}</p>
                                        <p><strong>Data:</strong> {new Date(cartela.created_at).toLocaleDateString()}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>Nenhuma cartela para este leilão.</p>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Este anunciante ainda não realizou nenhum leilão.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default AdminDashboard;