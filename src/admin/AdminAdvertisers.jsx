import { useEffect, useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import axios from "axios";

function AdminAdvertisers() {
  const [advertisers, setAdvertisers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'));
    if (adminLocal) {
      fetchAdvertisers(adminLocal.token);
    }
  }, []);

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

  const updateAdvertiserStatus = async (advertiserId, newStatus) => {
    const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'));
    if (!adminLocal) return;

    setUpdatingStatus(advertiserId);
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_API}/admin/update-advertiser-status?advertiserId=${advertiserId}&status=${newStatus}`,
        {}, // Corpo da requisição vazio, pois os parâmetros estão na URL
        {
          headers: {
            Authorization: `Bearer ${adminLocal.token}` // Cabeçalhos
          }
        }
      );

      // Atualiza a lista de anunciantes após a mudança de status
      fetchAdvertisers(adminLocal.token);
    } catch (error) {
      console.error("Erro ao atualizar status do anunciante:", error.response);
      alert("Não foi possível atualizar o status do anunciante. Tente novamente mais tarde.");
    } finally {
      setUpdatingStatus(null);
    }
  };


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REGULAR': return 'bg-green-100 text-green-800';
      case 'WARNED': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED': return 'bg-orange-100 text-orange-800';
      case 'BANNED': return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="w-full lg:h-[100vh] h-auto
        bg-[#D8DEE8] text-zinc-600 overflow-x-hidden
        flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-3" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
        <NavAdmin />
        <section className="w-[95%] pt-6">
          <h2 className="text-2xl font-bold mb-4">Lista de Anunciantes</h2>
          {isLoading ? (
            <p>Carregando anunciantes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Empresa</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Saldo</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {advertisers.map(advertiser => (
                  <tr key={advertiser.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{advertiser.name}</td>
                    <td className="py-3 px-4">{advertiser.company_name}</td>
                    <td className="py-3 px-4">{advertiser.email}</td>
                    <td className="py-3 px-4">{formatCurrency(advertiser.amount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(advertiser.police_status || 'REGULAR')}`}>
                        {advertiser.police_status || 'REGULAR'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {updatingStatus === advertiser.id ? (
                        <span className="text-blue-500">Atualizando...</span>
                      ) : (
                        <select
                          className="border rounded p-1 bg-white hover:bg-gray-100 transition-colors duration-200"
                          onChange={(e) => updateAdvertiserStatus(advertiser.id, e.target.value)}
                          value={advertiser.police_status || 'REGULAR'}
                        >
                          <option value="REGULAR" className="bg-green-100 text-green-800">REGULAR</option>
                          <option value="WARNED" className="bg-yellow-100 text-yellow-800">WARNED</option>
                          <option value="SUSPENDED" className="bg-orange-100 text-orange-800">SUSPENDED</option>
                          <option value="BANNED" className="bg-red-100 text-red-800">BANNED</option>
                          <option value="UNDER_REVIEW" className="bg-blue-100 text-blue-800">UNDER REVIEW</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </section>
    </div>
  );
}

export default AdminAdvertisers;
