import { useEffect, useState } from "react";
import axios from "axios";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import ClientCard from "./ClientCard";
import { Search } from "@mui/icons-material";

function AdvertiserClients() {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setIsLoading(true);
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"));
        if (currentSession) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    },
                    params: {
                        email: currentSession.email
                    }
                });
                const advertiser = response.data;
                if (advertiser && advertiser.Clients) {
                    setClients(advertiser.Clients);
                }
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen bg-gray-100 flex lg:flex-row flex-col">
            <AssideAdvertiser MenuSelected="menu-6" />
            
            <div className="flex-1">
                <NavAdvertiser />

                <main className="p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Clientes
                            </h1>
                            <p className="text-gray-600">
                                Gerencie e acompanhe seus clientes
                            </p>
                        </div>

                        {/* Search and Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Search */}
                                <div className="relative flex-1 max-w-lg">
                                    <input
                                        type="text"
                                        placeholder="Buscar clientes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-transparent border border-gray-200 
                                            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                            transition-all outline-none"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                {/* Stats */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Total de Clientes</p>
                                    <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Client Grid */}
                        {isLoading ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : filteredClients.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredClients.map(client => (
                                    <ClientCard key={client.id} client={client} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <div className="text-gray-500">
                                    {searchQuery ? (
                                        <>
                                            <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                                            <p className="text-sm">Tente buscar com outros termos</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg font-medium">Nenhum cliente cadastrado</p>
                                            <p className="text-sm">Os clientes aparecerão aqui quando fizerem seu primeiro lance</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdvertiserClients;