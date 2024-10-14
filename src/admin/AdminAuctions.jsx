import { useEffect, useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import axios from "axios";

function AdminAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'));
    if (adminLocal) {
      fetchAuctions(adminLocal.token);
    }
  }, []);

  const fetchAuctions = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/admin/list-auctions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAuctions(response.data);
    } catch (error) {
      console.error("Erro ao buscar leilões:", error.response);
      setError("Não foi possível carregar a lista de leilões. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="w-full lg:h-[100vh] h-auto bg-[#D8DEE8] text-zinc-600 overflow-x-hidden flex lg:flex-row flex-col justify-start items-start">
      <AssideAdmin MenuSelected="menu-2" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
        <NavAdmin />
        <section className="w-[95%] pt-6">
          <h2 className="text-2xl font-bold mb-4">Lista de Leilões</h2>
          {isLoading ? (
            <p>Carregando leilões...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Título</th>
                  <th className="py-3 px-4 text-left">Categoria</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Valor</th>
                  <th className="py-3 px-4 text-left">Data de Criação</th>
                </tr>
              </thead>
              <tbody>
                {auctions.map(auction => (
                  <tr key={auction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{auction.title}</td>
                    <td className="py-3 px-4">{auction.categorie}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{auction.value}</td>
                    <td className="py-3 px-4">{formatDate(auction.created_at)}</td>
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

function getStatusColor(status) {
  switch (status) {
    case 'cataloged': return 'bg-blue-100 text-blue-800';
    case 'live': return 'bg-green-100 text-green-800';
    case 'canceled': return 'bg-red-100 text-red-800';
    case 'finished': return 'bg-gray-100 text-gray-800';
    case 'paused': return 'bg-yellow-100 text-yellow-800';
    case 'pending': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default AdminAuctions;
