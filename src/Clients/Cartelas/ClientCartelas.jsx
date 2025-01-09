/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { useNavigate } from "react-router-dom";

function ClientCartelas() {
    const [currentClient, setCurrentClient] = useState({})
    const [cartelas, setCartelas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [expandedCartela, setExpandedCartela] = useState(null);

    useEffect(() => {
        const fetchClientCartelas = async () => {
            const clientSession = JSON.parse(localStorage.getItem('client-auk-session-login'));

            if (!clientSession || !clientSession.token) { // Verificação aprimorada
                navigate("/client/login");
                return;
            }

            setIsLoading(true);

            try {
                const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email`, {
                    params: { email: clientSession.email },
                    headers: {
                        Authorization: `Bearer ${clientSession.token}`
                    }
                });
                setCurrentClient(result.data);
                await getList(result.data.id, clientSession.token); // Passando ID e token
            } catch (error) {
                if (error.response && error.response.status === 401) { // Tratamento de erro 401
                    navigate("/client/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientCartelas();
    }, [navigate]);

    const getList = async (clientId, token) => { // Ajuste nos parâmetros

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/list-cartelas-by-client`, {
                params: { client_id: clientId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCartelas(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) { // Tratamento de erro 401
                navigate("/client/login");
            }
        }
    }

    useEffect(() => { }, [cartelas])

    // Função auxiliar para traduzir o status
    const getStatusInfo = (status) => {
        const statusMap = {
            'DENIED': { text: 'Negado', color: 'bg-red-500' },
            'PAYMENT_CONFIRMED': { text: 'Pagamento Confirmado', color: 'bg-blue-500' },
            'PROCESS': { text: 'Em Processamento', color: 'bg-yellow-500' },
            'SENDED': { text: 'Enviado', color: 'bg-green-500' },
            'DELIVERED': { text: 'Entregue', color: 'bg-purple-500' }
        };
        return statusMap[status] || { text: status, color: 'bg-gray-500' };
    };

    const toggleExpand = (cartelaId) => {
        setExpandedCartela(expandedCartela === cartelaId ? null : cartelaId);
    };

    return (
        <div className="w-full flex justify-between items-start bg-[#fff]">
            <AssideClient MenuSelected="menu-8" />
            
            <section className="w-full h-[100vh] flex flex-col items-center justify-start p-2 overflow-y-auto">
                <NavClient currentClient={currentClient} />

                <div className="w-full max-w-7xl p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Minhas Cartelas</h1>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : cartelas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cartelas.map(cartela => (
                                <div key={cartela.id} 
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="p-4 border-b">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-lg">
                                                Cartela #{cartela.id.slice(-7)}...
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs text-white font-medium
                                                ${getStatusInfo(cartela.status).color}`}
                                            >
                                                {getStatusInfo(cartela.status).text}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Valor Total:</span>
                                            <span className="font-medium text-green-600">
                                                {new Intl.NumberFormat('pt-BR', { 
                                                    style: 'currency', 
                                                    currency: 'BRL' 
                                                }).format(cartela.amount)}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-gray-600">Código de Rastreio:</span>
                                            {cartela.tracking_code ? (
                                                <div className="mt-1 p-2 bg-gray-50 rounded-md font-mono text-sm">
                                                    {cartela.tracking_code}
                                                </div>
                                            ) : (
                                                <div className="mt-1 text-sm text-gray-500 italic">
                                                    Ainda não disponível
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                {cartela.products.length} produto{cartela.products.length !== 1 ? 's' : ''}
                                            </span>
                                            <button
                                                onClick={() => toggleExpand(cartela.id)}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 
                                                    transition-colors text-sm font-medium"
                                            >
                                                {expandedCartela === cartela.id ? 'Ocultar produtos' : 'Ver produtos'}
                                                <span className={`transform transition-transform duration-200
                                                    ${expandedCartela === cartela.id ? 'rotate-180' : ''}`}>
                                                    ▼
                                                </span>
                                            </button>
                                        </div>

                                        {/* Lista de produtos expandida */}
                                        <div className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out
                                            ${expandedCartela === cartela.id 
                                                ? 'max-h-[500px] opacity-100' 
                                                : 'max-h-0 opacity-0'}`}
                                        >
                                            {cartela.products.map(product => (
                                                <div key={product.id} 
                                                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                                                >
                                                    <img 
                                                        src={product.cover_img_url} 
                                                        alt={product.title}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{product.title}</p>
                                                        <p className="text-xs text-gray-500">Lote: {product.lote}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                Nenhuma cartela encontrada
                            </h3>
                            <p className="text-gray-500">
                                Suas cartelas aparecerão aqui quando você ganhar leilões
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ClientCartelas;