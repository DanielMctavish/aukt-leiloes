/* eslint-disable react/prop-types */
/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import NavClient from "../navigation/NavClient";
import AssideClient from "../Asside/AssideClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClientInformations } from "../functions/getClientInformations";
import { getBidsByClient } from "../functions/getBidsByClient";
import { getAuctsByBids } from "../functions/getAuctsByBids";
// import { useSpring, animated } from 'react-spring';

function DashboardClient() {
    const [currentClient, setCurrentClient] = useState({});
    const [allBids, setAllBids] = useState([]);
    const [allAucts, setAllAucts] = useState([]);
    const [bidsWinners, setBidsWinners] = useState([])
    const [budget, setBudget] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getClientInformations(navigate,
            getBidsByClient,
            setCurrentClient,
            setAllBids,
            setBidsWinners,
            setBudget,
            currentClient);
    }, []);

    useEffect(() => { getAuctsByBids(allBids, setAllAucts); }, [currentClient, allBids])

    return (
        <div className="w-full h-screen bg-gradient-to-br from-[#f8f8f8] to-[#e8e8e8] flex flex-col md:flex-row">
            <AssideClient MenuSelected="menu-1" />
            
            <section className="flex-1 h-screen flex flex-col gap-4 p-3 sm:p-5 overflow-y-auto pb-16 md:pb-5">
                <div className="z-[10]">
                    <NavClient currentClient={currentClient} />
                </div>
                
                {/* Perfil e Estatísticas */}
                <section className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start mb-5">
                        <div className="relative">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-blue-100 
                                rounded-full flex items-center justify-center overflow-hidden shadow-md border-2 border-white">
                                {currentClient.avatar_url ? (
                                    <img src={currentClient.avatar_url} alt="Profile" 
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl text-blue-400 font-semibold">
                                        {currentClient.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        <div className="text-center md:text-left">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                                {currentClient.name}
                            </h1>
                            <p className="text-gray-500 text-xs sm:text-sm">{currentClient.email}</p>
                        </div>
                    </div>

                    {/* Cards de Estatísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 sm:p-4 shadow-sm border border-cyan-200">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                    </svg>
                                </div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-1">Total de Lances</h3>
                            </div>
                            <p className="text-lg sm:text-2xl font-bold text-cyan-700">{allBids.length}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 shadow-sm border border-green-200">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-1">Total de Arremates</h3>
                            </div>
                            <p className="text-lg sm:text-2xl font-bold text-green-700">{bidsWinners.length}</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 shadow-sm border border-blue-200">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-1">Leilões Participados</h3>
                            </div>
                            <p className="text-lg sm:text-2xl font-bold text-blue-700">{allAucts.length}</p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 sm:p-4 shadow-sm border border-indigo-200">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-1">Total Investido</h3>
                            </div>
                            <p className="text-lg sm:text-2xl font-bold text-indigo-700 truncate">
                                {parseFloat(budget).toLocaleString('pt-BR', { 
                                    style: 'currency', 
                                    currency: 'BRL' 
                                })}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Seção de Arremates e Participações */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                    {/* Arremates Recentes */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-4 sm:p-5 border border-gray-100">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Arremates Recentes
                        </h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                            {bidsWinners.length === 0 ? (
                                <div className="col-span-full py-4 text-center text-gray-500 text-sm">
                                    Você ainda não tem arremates.
                                </div>
                            ) : (
                                bidsWinners.slice(0, 8).map((bid, index) => (
                                    <div key={index} 
                                        className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200
                                            hover:shadow-md hover:border-green-300 transition-all duration-300 relative group">
                                        <img 
                                            src={bid.Product[0].cover_img_url} 
                                            alt={bid.Product[0].title}
                                            className="w-full h-full object-cover" 
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                            flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                            <p className="text-white text-center text-xs font-medium truncate w-full">
                                                {bid.Product[0].title}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Últimas Participações */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-4 sm:p-5 border border-gray-100">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Últimas Participações
                        </h2>
                        <div className="overflow-x-auto rounded-lg">
                            {allAucts.length === 0 ? (
                                <div className="py-4 text-center text-gray-500 text-sm">
                                    Você ainda não participou de leilões.
                                </div>
                            ) : (
                                <table className="w-full min-w-[400px]">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-2 px-2 sm:px-3 text-left text-xs font-medium text-gray-500">Leilão</th>
                                            <th className="py-2 px-2 sm:px-3 text-left text-xs font-medium text-gray-500">Criador</th>
                                            <th className="py-2 px-2 sm:px-3 text-left text-xs font-medium text-gray-500">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allAucts.slice(0, 6).map((auct, index) => (
                                            <tr key={index} className="hover:bg-blue-50 transition-colors">
                                                <td className="py-2 px-2 sm:px-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                                                            <img 
                                                                src={auct.auct_cover_img} 
                                                                alt={auct.title}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy" 
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-700 font-medium truncate max-w-[120px] sm:max-w-none">
                                                            {auct.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2 sm:px-3 text-xs text-gray-600 truncate max-w-[80px] sm:max-w-none">
                                                    {auct.Advertiser?.name}
                                                </td>
                                                <td className="py-2 px-2 sm:px-3 text-xs text-gray-600 whitespace-nowrap">
                                                    {new Date(auct.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}

export default DashboardClient;
