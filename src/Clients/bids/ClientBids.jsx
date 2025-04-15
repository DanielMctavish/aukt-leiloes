/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls";

// Componente de Paginação
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center items-center mt-8 gap-1">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                    currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Primeira página"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
            </button>

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                    currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Página anterior"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                        currentPage === page
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                    currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Próxima página"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>

            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                    currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Última página"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

// Componente para Avatar do Cliente
const ClientAvatar = ({ avatarNumber, nickname }) => {
    // Convertendo o objeto de URLs em um array
    const avatars = Object.values(avatarClientsUrls);

    // Garantir que o número do avatar está dentro do range válido
    const safeAvatarIndex = ((avatarNumber || 0)) % avatars.length;
    const avatarSrc = avatars[safeAvatarIndex];

    return (
        <div className="flex items-center gap-2">
            <img
                src={avatarSrc}
                alt={nickname}
                className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium">{nickname}</span>
        </div>
    );
};

// Componente de Skeleton Loading para os cards
const AuctionCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    </div>
);

function ClientBids() {
    const [currentClient, setCurrentClient] = useState({});
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedAuction, setExpandedAuction] = useState(null);
    const [expandedProduct, setExpandedProduct] = useState(null);
    const auctionsPerPage = 6;

    const navigate = useNavigate();

    useEffect(() => {
        const loadClientAuctions = async () => {
            try {
                const clientSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
                if (!clientSession) {
                    navigate('/client/login');
                    return;
                }

                // Buscar informações do cliente
                const clientResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${clientSession.email}`
                );
                setCurrentClient(clientResponse.data);

                // Buscar leilões do cliente
                const auctionsResponse = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?client_id=${clientResponse.data.id}`
                );

                // Filtra apenas leilões que contêm produtos com lances
                const filteredAuctions = auctionsResponse.data.filter(auction =>
                    auction.product_list.some(product => product.Bid?.length > 0)
                );

                // Ordena os leilões do mais recente para o mais antigo
                const sortedAuctions = filteredAuctions.sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                );

                setAuctions(sortedAuctions);
                setTotalPages(Math.ceil(sortedAuctions.length / auctionsPerPage));
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadClientAuctions();
    }, [navigate]);

    // Paginação simplificada (sem filtragem)
    const indexOfLastAuction = currentPage * auctionsPerPage;
    const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
    const currentAuctions = auctions.slice(indexOfFirstAuction, indexOfLastAuction);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAuctionClick = (auction) => {
        setExpandedAuction(expandedAuction === auction.id ? null : auction.id);
    };

    const handleProductClick = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    return (
        <div className="w-full flex justify-between items-start bg-gradient-to-br from-gray-50 to-gray-100">
            <AssideClient MenuSelected="menu-2" />

            <section className="w-full h-[100vh] flex flex-col items-center justify-start p-2 overflow-y-auto">
                <NavClient currentClient={currentClient} />

                <div className="w-full max-w-7xl h-[80vh] p-4 justify-start items-center flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Meus Leilões</h1>
                    </div>
                    
                    {/* Caixa Informacional */}
                    <div className="bg-gradient-to-r from-[#3777e03b] to-[#4299e148] p-4 rounded-xl 
                        shadow-sm mb-6 border border-[#94c8ff6a]">
                        <div className="flex items-start gap-3">
                            <div className="text-blue-600 mt-1 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-1">Navegue pelos seus leilões</h2>
                                <p className="text-gray-700">
                                    Aqui você encontra todos os leilões em que participou com lances. Clique em qualquer 
                                    leilão para ver detalhes dos lotes e seu histórico de lances. Para cada lote, você 
                                    pode verificar os valores ofertados e se foi o vencedor. Clique em um produto para 
                                    ver o histórico completo de lances.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grid de Leilões */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            [...Array(6)].map((_, index) => (
                                <AuctionCardSkeleton key={index} />
                            ))
                        ) : (
                            currentAuctions.map((auction) => (
                                <div
                                    key={auction.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer 
                                        hover:shadow-lg transition-all duration-300 group border border-gray-100"
                                    onClick={() => handleAuctionClick(auction)}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={auction.auct_cover_img}
                                            alt={auction.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                                            from-black/80 to-transparent p-4">
                                            <h2 className="text-white font-semibold text-lg">{auction.title}</h2>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {auction.descriptions_informations}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                                </svg>
                                                <span className="text-sm text-gray-500">
                                                    {auction.product_list?.length || 0} produtos
                                                </span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${auction.status === 'finished'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {auction.status === 'finished' ? 'Finalizado' : 'Em andamento'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Modal de Produtos */}
                    {expandedAuction && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
                            <div className="bg-white rounded-xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-fadeIn">
                                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {auctions.find(a => a.id === expandedAuction)?.title}
                                    </h2>
                                    <button
                                        onClick={() => setExpandedAuction(null)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 
                                        hover:bg-gray-200 hover:text-gray-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {auctions
                                            .find(a => a.id === expandedAuction)
                                            ?.product_list
                                            ?.filter(product => product.Bid?.length > 0)
                                            ?.map((product) => (
                                                <div key={product.id} className="relative">
                                                    <div
                                                        className={`bg-white rounded-xl shadow p-4 hover:shadow-md 
                                                            transition-all duration-300 ${expandedProduct === product.id
                                                                ? 'ring-2 ring-blue-500 transform scale-[1.02]'
                                                                : 'border border-gray-100'
                                                            }`}
                                                        onClick={() => handleProductClick(product.id)}
                                                    >
                                                        <div className="relative overflow-hidden rounded-lg mb-3">
                                                            <img
                                                                src={product.cover_img_url}
                                                                alt={product.title}
                                                                className="w-full h-40 object-cover transition-transform 
                                                                duration-500 hover:scale-105"
                                                            />
                                                            {product.Winner && product.Winner.id === currentClient.id && (
                                                                <div className="absolute top-2 right-2 bg-green-500 text-white 
                                                                rounded-full px-2 py-1 text-xs font-bold shadow-lg">
                                                                    Vencedor
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className="text-sm text-gray-600">Lote: {product.lote}</p>
                                                            <span className="text-sm text-blue-600 font-medium">
                                                                {product.Bid?.length || 0} lance{product.Bid?.length !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-green-600 font-medium">
                                                                {new Intl.NumberFormat('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                }).format(product.initial_value)}
                                                            </span>
                                                            {product.Winner && (
                                                                <span className="text-sm bg-blue-100 text-blue-800 px-2 
                                                                    py-1 rounded-full">
                                                                    {product.Winner.id === currentClient.id
                                                                        ? 'Você venceu!'
                                                                        : 'Finalizado'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Lista de lances do produto */}
                                                    <div className={`absolute left-0 right-0 bg-white rounded-xl shadow-xl 
                                                        mt-2 z-10 transition-all duration-300 ease-in-out ${expandedProduct === product.id
                                                            ? 'opacity-100 transform translate-y-0'
                                                            : 'opacity-0 transform -translate-y-4 pointer-events-none'
                                                        }`}
                                                    >
                                                        <div className="p-4 max-h-[300px] overflow-y-auto">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h4 className="font-semibold text-gray-800">Histórico de Lances</h4>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedProduct(null);
                                                                    }}
                                                                    className="w-6 h-6 flex items-center justify-center rounded-full 
                                                                    text-gray-400 hover:bg-gray-100"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                            {product.Bid?.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {product.Bid.sort((a, b) =>
                                                                        new Date(b.created_at) - new Date(a.created_at)
                                                                    ).map((bid) => (
                                                                        <div
                                                                            key={bid.id}
                                                                            className={`p-3 rounded-lg ${bid.client_id === currentClient.id
                                                                                    ? 'bg-blue-50 border border-blue-100'
                                                                                    : 'bg-gray-50 border border-gray-100'
                                                                                }`}
                                                                        >
                                                                            <div className="flex justify-between items-center mb-2">
                                                                                <ClientAvatar
                                                                                    avatarNumber={bid.Client.client_avatar || 1}
                                                                                    nickname={bid.Client.nickname || "Anônimo"}
                                                                                />
                                                                                <span className="font-medium text-green-600">
                                                                                    {new Intl.NumberFormat('pt-BR', {
                                                                                        style: 'currency',
                                                                                        currency: 'BRL'
                                                                                    }).format(bid.value)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex justify-between items-center text-xs">
                                                                                <span className="text-gray-500">
                                                                                    {new Date(bid.created_at)
                                                                                        .toLocaleString('pt-BR')}
                                                                                </span>
                                                                                {bid.cover_auto && (
                                                                                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                                                        Lance automático
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 text-center py-4">
                                                                    Nenhum lance registrado
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </section>
        </div>
    );
}


export default ClientBids;