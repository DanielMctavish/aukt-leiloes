import { Wallet, Construction, AccountBalance, SwapHoriz, Receipt } from "@mui/icons-material"
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import CardAdvertiserWallet from "./cards/CardAdvertiserWallet";
import { useState, useEffect } from 'react';
import axios from 'axios';

function AdvertiserWallet() {
  const [advertiserAmount, setAdvertiserAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertiserData = async () => {
      try {
        const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'));
        if (!currentLocalAdvertiser) return;

        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
          params: { email: currentLocalAdvertiser.email },
          headers: {
            'Authorization': `Bearer ${currentLocalAdvertiser.token}`
          }
        });

        setAdvertiserAmount(response.data.amount);
      } catch (error) {
        console.error('Erro ao buscar dados do anunciante:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertiserData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#D8DEE8] text-zinc-600 overflow-x-hidden">
      <div className="flex">
        <AssideAdvertiser MenuSelected="menu-7" />
        
        <main className="flex-1">
          <NavAdvertiser />

          {/* Banner de Desenvolvimento */}
          <div className="bg-blue-50 border-b border-blue-100 p-4">
            <div className="max-w-7xl mx-auto flex items-center gap-3 text-blue-700">
              <Construction className="text-blue-500" />
              <p className="text-sm">
                Esta área está em desenvolvimento. Em breve você terá acesso a recursos avançados 
                de gerenciamento financeiro.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Cards Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card de Saldo */}
              <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900">Saldo Disponível</span>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <AccountBalance className="text-blue-500" />
                  </div>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(advertiserAmount || 0)}
                    </span>
                    <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Saldo atualizado
                    </p>
                  </>
                )}
              </div>

              {/* Outros Cards Informativos */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900">Transações Pendentes</span>
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Receipt className="text-orange-500" />
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-900">0</span>
                <p className="text-gray-500 text-sm mt-1">Em desenvolvimento</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900">Transferências</span>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <SwapHoriz className="text-purple-500" />
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-900">0</span>
                <p className="text-gray-500 text-sm mt-1">Em desenvolvimento</p>
              </div>

              {/* Botão de Transferência */}
              <div className="bg-[#012038] text-white rounded-xl shadow-lg p-6 hover:bg-[#01325e] transition-all duration-300">
                <button className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <SwapHoriz className="text-3xl" />
                  <span className="font-medium">Nova Transferência</span>
                </button>
              </div>
            </div>

            {/* Seção Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cartões Bancários */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Cartões Bancários</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">3/3</span>
                  </div>
                  <CardAdvertiserWallet />
                </div>
              </div>

              {/* Histórico de Transações */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <Wallet className="text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">Histórico de Transações</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <Construction className="text-gray-300 text-4xl mb-4" />
                    <p className="text-lg font-medium">Histórico em Desenvolvimento</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Em breve você poderá visualizar todas as suas transações aqui.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdvertiserWallet;
