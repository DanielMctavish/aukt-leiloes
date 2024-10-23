import { useState, useEffect } from 'react';
import axios from 'axios';
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";

function AdminTransactions() {
  const [advertisers, setAdvertisers] = useState([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  const fetchAdvertisers = async () => {
    const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'));
    if (!adminLocal) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/admin/list-advertisers`, {
        headers: {
          Authorization: `Bearer ${adminLocal.token}`
        }
      });
      setAdvertisers(response.data);
    } catch (error) {
      console.error("Erro ao buscar anunciantes:", error);
      setError("Não foi possível carregar a lista de anunciantes.");
    }
  };

  const fetchTransactions = async (advertiserId) => {
    setIsLoading(true);
    setError(null);
    const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'));
    if (!adminLocal) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/admin/list-transactions?advertiserId=${advertiserId}`, {
        headers: {
          Authorization: `Bearer ${adminLocal.token}`
        }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setError("Não foi possível carregar as transações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvertiserChange = (e) => {
    const advertiserId = e.target.value;
    setSelectedAdvertiser(advertiserId);
    if (advertiserId) {
      fetchTransactions(advertiserId);
    } else {
      setTransactions([]);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="w-full lg:h-[100vh] h-auto bg-[#D8DEE8] text-zinc-600 overflow-x-hidden flex lg:flex-row flex-col justify-start items-start">
      <AssideAdmin MenuSelected="menu-transactions" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
        <NavAdmin />
        <section className="w-[95%] pt-6">
          <h2 className="text-2xl font-bold mb-4">Transações dos Anunciantes</h2>
          
          <select
            value={selectedAdvertiser}
            onChange={handleAdvertiserChange}
            className="mb-4 p-2 border rounded bg-[#ffffffad]"
          >
            <option value="">Selecione um anunciante</option>
            {advertisers.map(advertiser => (
              <option key={advertiser.id} value={advertiser.id}>
                {advertiser.name}
              </option>
            ))}
          </select>

          {isLoading && <p>Carregando transações...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!isLoading && !error && transactions.length > 0 && (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">ID da Transação</th>
                  <th className="py-3 px-4 text-left">Valor</th>
                  <th className="py-3 px-4 text-left">Método de Pagamento</th>
                  <th className="py-3 px-4 text-left">ID da Cartela</th>
                  <th className="py-3 px-4 text-left">Data de Criação</th>
                  <th className="py-3 px-4 text-left">Última Atualização</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{transaction.id}</td>
                    <td className="py-3 px-4">{formatCurrency(transaction.amount)}</td>
                    <td className="py-3 px-4">{transaction.payment_method}</td>
                    <td className="py-3 px-4">{transaction.cartela_id || 'N/A'}</td>
                    <td className="py-3 px-4">{formatDate(transaction.created_at)}</td>
                    <td className="py-3 px-4">{formatDate(transaction.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && !error && transactions.length === 0 && selectedAdvertiser && (
            <p>Nenhuma transação encontrada para este anunciante.</p>
          )}
        </section>
      </section>
    </div>
  );
}

export default AdminTransactions;
