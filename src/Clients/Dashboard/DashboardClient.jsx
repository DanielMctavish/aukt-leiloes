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
        <div className="w-full h-screen bg-gradient-to-br from-[#f8f8f8] to-[#e8e8e8] flex">
            <AssideClient MenuSelected="menu-1" />
            
            <section className="flex-1 h-screen flex flex-col gap-4 p-4 overflow-y-auto">
                <div className="z-[10]">
                    <NavClient currentClient={currentClient} />
                </div>
                
                {/* Perfil e Estatísticas */}
                <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-200 to-gray-300 
                                rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                                {currentClient.avatar_url ? (
                                    <img src={currentClient.avatar_url} alt="Profile" 
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-400">
                                        {currentClient.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                {currentClient.name}
                            </h1>
                            <p className="text-gray-600">{currentClient.email}</p>
                        </div>
                    </div>

                    {/* Cards de Estatísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-gray-500 font-medium mb-2">Total de Lances</h3>
                            <p className="text-3xl font-bold text-cyan-700">{allBids.length}</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-gray-500 font-medium mb-2">Total de Arremates</h3>
                            <p className="text-3xl font-bold text-green-600">{bidsWinners.length}</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-gray-500 font-medium mb-2">Leilões Participados</h3>
                            <p className="text-3xl font-bold text-blue-600">{allAucts.length}</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-gray-500 font-medium mb-2">Total Investido</h3>
                            <p className="text-3xl font-bold text-[#143d64]">
                                {parseFloat(budget).toLocaleString('pt-BR', { 
                                    style: 'currency', 
                                    currency: 'BRL' 
                                })}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Seção de Arremates e Participações */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Arremates Recentes */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Arremates Recentes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {bidsWinners.slice(0, 6).map((bid, index) => (
                                <div key={index} 
                                    className="aspect-square rounded-xl overflow-hidden shadow-md 
                                        hover:shadow-xl transition-all duration-300 relative group">
                                    <img 
                                        src={bid.Product[0].cover_img_url} 
                                        alt={bid.Product[0].title}
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-black/60 flex items-center 
                                        justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-center text-sm px-2">
                                            {bid.Product[0].title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Últimas Participações */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Últimas Participações</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Leilão</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Criador</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allAucts.slice(0, 6).map((auct, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={auct.auct_cover_img} 
                                                        alt={auct.title}
                                                        className="w-10 h-10 rounded-lg object-cover" 
                                                    />
                                                    <span className="text-sm text-gray-700">{auct.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {auct.Advertiser?.name}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(auct.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}

export default DashboardClient;
