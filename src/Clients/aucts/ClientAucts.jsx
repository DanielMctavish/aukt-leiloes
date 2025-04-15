/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';

// Inicializa plugins e localização do dayjs
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

// Componente de Loading para a tabela desktop
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

// Componente para separador de grupo na tabela
const TableGroupSeparator = ({ label, colSpan = 8 }) => (
    <tr className="bg-gray-50 group">
        <td 
            colSpan={colSpan} 
            className="p-2 text-left text-sm font-medium text-gray-600 border-y border-gray-200"
        >
            <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                {label}
            </div>
        </td>
    </tr>
);

// Componente de Loading para cards mobile
const CardSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-3 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
            <div className="h-16 w-16 bg-gray-200 rounded"></div>
            <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
        </div>
    </div>
);

// Componente de Timeline para visualização mobile
const TimelineAuctionCard = ({ auction, getTotalBids, getUniqueParticipants }) => {
    const isRecent = (date) => {
        const now = dayjs();
        const auctionDate = dayjs(date);
        return now.diff(auctionDate, 'day') <= 7;
    };

    return (
        <div className="relative mb-8 last:mb-0">
            {/* Linha de tempo */}
            <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-purple-500"></div>
            
            {/* Marcador de tempo */}
            <div className="absolute left-[7px] top-[26px] w-[16px] h-[16px] rounded-full border-2 border-white 
                shadow-sm z-10 bg-gradient-to-br from-green-400 to-blue-500"></div>
            
            {/* Card do leilão */}
            <div className="ml-8 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                    <img 
                        src={auction.auct_cover_img} 
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-gray-800 line-clamp-1">{auction.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full
                                ${auction.status === 'finished' 
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                            >
                                {auction.status === 'finished' ? 'Finalizado' : 'Em andamento'}
                            </span>
                            {isRecent(auction.created_at) && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    Recente
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="p-3">
                    <div className="text-xs text-gray-500 mb-2">
                        ID: <span className="font-medium text-gray-700">{auction.nano_id}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-gray-700">{auction.product_list.length} produtos</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="text-gray-700">{getTotalBids(auction)} lances</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-gray-700">{getUniqueParticipants(auction)} participantes</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700">{dayjs(auction.created_at).format('DD/MM/YYYY')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de separador de tempo para a timeline
const TimelineSeparator = ({ label }) => (
    <div className="relative mb-6 ml-8">
        <div className="absolute left-[-32px] top-1/2 w-[24px] h-[2px] bg-gray-300"></div>
        <div className="bg-gray-100 rounded-full px-4 py-1.5 inline-block text-sm font-medium text-gray-700">
            {label}
        </div>
    </div>
);

function ClientAucts() {
    const [currentClient, setCurrentClient] = useState({});
    const [auctions, setAuctions] = useState([]);
    const [groupedAuctions, setGroupedAuctions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Função para agrupar leilões por períodos de tempo relativo
    const groupAuctionsByTimeFrame = (auctionsList) => {
        const today = dayjs();
        const groups = {
            'Hoje': [],
            'Esta semana': [],
            'Este mês': [],
            'Nos últimos 3 meses': [],
            'Nos últimos 6 meses': [],
            'Este ano': [],
            'Há mais de um ano': []
        };

        auctionsList.forEach(auction => {
            const auctionDate = dayjs(auction.created_at);
            const diffDays = today.diff(auctionDate, 'day');
            const diffMonths = today.diff(auctionDate, 'month');
            const diffYears = today.diff(auctionDate, 'year');

            if (diffDays === 0) {
                groups['Hoje'].push(auction);
            } else if (diffDays < 7) {
                groups['Esta semana'].push(auction);
            } else if (diffDays < 30) {
                groups['Este mês'].push(auction);
            } else if (diffMonths < 3) {
                groups['Nos últimos 3 meses'].push(auction);
            } else if (diffMonths < 6) {
                groups['Nos últimos 6 meses'].push(auction);
            } else if (diffYears < 1) {
                groups['Este ano'].push(auction);
            } else {
                groups['Há mais de um ano'].push(auction);
            }
        });

        // Remover grupos vazios
        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0) {
                delete groups[key];
            }
        });

        return groups;
    };

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
                
                // Ordenando por data (mais recentes primeiro)
                const sortedAuctions = [...auctionsResponse.data].sort((a, b) => 
                    new Date(b.created_at) - new Date(a.created_at)
                );
                
                setAuctions(sortedAuctions);
                
                // Agrupar leilões por períodos de tempo
                setGroupedAuctions(groupAuctionsByTimeFrame(sortedAuctions));
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

    // Função para renderizar o conteúdo da tabela com grupos
    const renderTableContent = () => {
        if (isLoading) {
            return [...Array(5)].map((_, index) => (
                <TableRowSkeleton key={index} />
            ));
        }

        if (auctions.length === 0) {
            return (
                <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                        Você ainda não participou de nenhum leilão.
                    </td>
                </tr>
            );
        }

        const tableContent = [];
        
        // Renderizar grupos e leilões
        Object.entries(groupedAuctions).forEach(([timeFrame, groupAuctions]) => {
            // Adicionar o separador de grupo
            tableContent.push(
                <TableGroupSeparator key={`group-${timeFrame}`} label={timeFrame} />
            );
            
            // Adicionar os leilões do grupo
            groupAuctions.forEach(auction => {
                tableContent.push(
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
                );
            });
        });
        
        return tableContent;
    };

    return (
        <div className="w-full flex justify-between items-start bg-gradient-to-b from-gray-50 to-white">
            <AssideClient MenuSelected="menu-4" />
            
            <section className="w-full h-[100vh] flex flex-col items-center justify-start p-2 overflow-y-auto">
                <NavClient currentClient={currentClient} />

                <div className="w-full max-w-7xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Histórico de Leilões</h1>
                    </div>

                    <div className="bg-gradient-to-r from-[#37ba5e3b] to-[#2cffc048] p-4 
                    rounded-lg shadow-sm mb-6 border border-[#94ffb06a]">
                        <div className="flex items-start gap-3">
                            <div className="text-green-600 mt-1 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-1">Sua jornada de leilões</h2>
                                <p className="text-gray-600">
                                    Aqui você encontra todos os leilões que participou, organizados do mais recente para o mais antigo.
                                    Acompanhe sua evolução, avalie seu histórico e identifique oportunidades para novos leilões.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Visualização Desktop */}
                    <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
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
                                    {renderTableContent()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Visualização Mobile - Timeline com separadores de tempo */}
                    <div className="md:hidden">
                        <div className="mb-4 text-sm text-center text-gray-500 italic">
                            Deslize para ver sua jornada completa de leilões
                        </div>
                        
                        {isLoading ? (
                            [...Array(3)].map((_, index) => (
                                <CardSkeleton key={index} />
                            ))
                        ) : (
                            <div className="pt-2 pb-4 px-2">
                                {Object.keys(groupedAuctions).length > 0 ? (
                                    Object.entries(groupedAuctions).map(([timeFrame, auctions]) => (
                                        <div key={timeFrame}>
                                            <TimelineSeparator label={timeFrame} />
                                            {auctions.map(auction => (
                                                <TimelineAuctionCard 
                                                    key={auction.id} 
                                                    auction={auction}
                                                    getTotalBids={getTotalBids}
                                                    getUniqueParticipants={getUniqueParticipants}
                                                />
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p>Você ainda não participou de nenhum leilão.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ClientAucts;
