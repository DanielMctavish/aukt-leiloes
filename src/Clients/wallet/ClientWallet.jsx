import { Wallet, Construction, AccountBalance, SwapHoriz, Receipt } from "@mui/icons-material";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { useState, useEffect } from 'react';
import axios from 'axios';

function ClientWallet() {
    const [currentClient, setCurrentClient] = useState({});
    const [clientAmount, setClientAmount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const clientSession = JSON.parse(localStorage.getItem('client-auk-session-login'));
                if (!clientSession) return;

                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email`, {
                        params: { email: clientSession.email },
                        headers: {
                            'Authorization': `Bearer ${clientSession.token}`
                        }
                    }
                );
                setCurrentClient(response.data);
                setClientAmount(response.data.amount || 0);
            } catch (error) {
                console.error('Erro ao buscar dados do cliente:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientData();
    }, []);

    return (
        <div className="w-full flex justify-between items-start bg-[#fff]">
            <AssideClient MenuSelected="menu-5" />
            
            <section className="w-full h-[100vh] flex flex-col items-start overflow-y-auto">
                <NavClient currentClient={currentClient} />

                {/* Banner de Desenvolvimento */}
                <div className="w-full bg-blue-50 border-b border-blue-100 p-4">
                    <div className="max-w-7xl mx-auto flex items-center gap-3">
                        <Construction className="text-[#127b5f]" />
                        <p className="text-sm text-[#127b5f]">
                            Esta área está em desenvolvimento. Em breve você terá acesso a recursos avançados 
                            de gerenciamento financeiro.
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto px-4 py-8">
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
                                        }).format(clientAmount)}
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

                        {/* Card de Lances */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-medium text-gray-900">Lances Ativos</span>
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <Receipt className="text-orange-500" />
                                </div>
                            </div>
                            <span className="text-3xl font-bold text-gray-900">0</span>
                            <p className="text-gray-500 text-sm mt-1">Em desenvolvimento</p>
                        </div>

                        {/* Card de Cartelas */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-medium text-gray-900">Cartelas</span>
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <SwapHoriz className="text-purple-500" />
                                </div>
                            </div>
                            <span className="text-3xl font-bold text-gray-900">0</span>
                            <p className="text-gray-500 text-sm mt-1">Em desenvolvimento</p>
                        </div>

                        {/* Botão de Transferência */}
                        <div className="bg-[#14b963] text-white rounded-xl shadow-lg p-6 hover:bg-[#0e4523] transition-all duration-300 cursor-pointer">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                <SwapHoriz className="text-3xl" />
                                <span className="font-medium">Nova Transferência</span>
                            </div>
                        </div>
                    </div>

                    {/* Seção Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cartões Bancários */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-medium text-gray-900">Métodos de Pagamento</h3>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Em breve</span>
                                </div>
                                <div className="text-center text-gray-500 py-8">
                                    <Construction className="text-gray-300 text-4xl mb-4" />
                                    <p>Funcionalidade em desenvolvimento</p>
                                </div>
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
            </section>
        </div>
    );
}

export default ClientWallet;