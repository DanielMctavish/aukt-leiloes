/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

// Componente de Loading para a tabela
const TableRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="p-3"><div className="h-12 w-12 bg-gray-200 rounded"></div></td>
        <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
        <td className="p-3"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
        <td className="p-3"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
        <td className="p-3"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
        <td className="p-3"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
        <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
    </tr>
);

function ClientAucts() {
    const [currentClient, setCurrentClient] = useState({});
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadClientAuctions = async () => {
            try {
                const clientSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
                if (!clientSession) {
                    navigate('/client/login');
                    return;
                }

                const clientResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${clientSession.email}`
                );
                setCurrentClient(clientResponse.data);

                const auctionsResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?client_id=${clientResponse.data.id}`
                );
                setAuctions(auctionsResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadClientAuctions();
    }, []);

    // Função para calcular o total de lances de um leilão
    const getTotalBids = (auction) => {
        return auction.product_list.reduce((total, product) => 
            total + (product.Bid?.length || 0), 0
        );
    };

    // Função para calcular o número único de participantes
    const getUniqueParticipants = (auction) => {
        const uniqueParticipants = new Set();
        
        auction.product_list.forEach(product => {
            product.Bid?.forEach(bid => {
                uniqueParticipants.add(bid.client_id);
            });
        });

        return uniqueParticipants.size;
    };

    return (
        <div className="w-full flex justify-between items-start bg-[#fff]">
            <AssideClient MenuSelected="menu-4" />
            
            <section className="w-full h-[100vh] flex flex-col items-center justify-start p-2 overflow-y-auto">
                <NavClient currentClient={currentClient} />

                <div className="w-full max-w-7xl p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Histórico de Leilões</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Capa</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">ID</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Título</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Produtos</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Total Lances</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Participantes</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isLoading ? (
                                        [...Array(5)].map((_, index) => (
                                            <TableRowSkeleton key={index} />
                                        ))
                                    ) : (
                                        auctions.map((auction) => (
                                            <tr 
                                                key={auction.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="p-3">
                                                    <img 
                                                        src={auction.auct_cover_img} 
                                                        alt=""
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                </td>
                                                <td className="p-3 text-sm font-medium text-gray-700">
                                                    {auction.nano_id}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {auction.title}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                        ${auction.status === 'finished' 
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {auction.status === 'finished' ? 'Finalizado' : 'Em andamento'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {auction.product_list.length}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {getTotalBids(auction)}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {getUniqueParticipants(auction)}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {dayjs(auction.created_at).format('DD/MM/YYYY')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ClientAucts;
