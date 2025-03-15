/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

// Componente de Paginação
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center items-center mt-6 gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                Anterior
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded ${currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                Próximo
            </button>
        </div>
    );
};

// Componente para Avatar do Cliente
const ClientAvatar = ({ avatarNumber, nickname }) => {
    const avatars = importAllAvatars()

    // Garantir que o número do avatar está dentro do range válido (1-58)
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
        <div className="w-full flex justify-between items-start bg-[#fff]">
            <AssideClient MenuSelected="menu-2" />

            <section className="w-full h-[100vh] flex flex-col items-center justify-start p-2 overflow-y-auto">
                <NavClient currentClient={currentClient} />

                <div className="w-full max-w-7xl h-[80vh] p-4 justify-start items-center flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Meus Leilões</h1>
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
                                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer 
                                        hover:shadow-lg transition-all duration-300"
                                    onClick={() => handleAuctionClick(auction)}
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={auction.auct_cover_img}
                                            alt={auction.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                                            from-black/70 to-transparent p-4">
                                            <h2 className="text-white font-semibold text-lg">{auction.title}</h2>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {auction.descriptions_informations}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                {auction.product_list?.length || 0} produtos
                                            </span>
                                            <span className={`px-2 py-1 rounded text-sm ${auction.status === 'finished'
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
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg w-[90%] max-w-6xl max-h-[90vh] overflow-hidden">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">
                                        {auctions.find(a => a.id === expandedAuction)?.title}
                                    </h2>
                                    <button
                                        onClick={() => setExpandedAuction(null)}
                                        className="text-gray-400 hover:text-gray-600"
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
                                                        className={`bg-white rounded-lg shadow p-4 hover:shadow-md 
                                                            transition-all duration-300 ${expandedProduct === product.id
                                                                ? 'ring-2 ring-blue-500 transform scale-[1.02]'
                                                                : ''
                                                            }`}
                                                        onClick={() => handleProductClick(product.id)}
                                                    >
                                                        <img
                                                            src={product.cover_img_url}
                                                            alt={product.title}
                                                            className="w-full h-40 object-cover rounded mb-3"
                                                        />
                                                        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className="text-sm text-gray-600">Lote: {product.lote}</p>
                                                            <span className="text-sm text-blue-600">
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
                                                                    py-1 rounded">
                                                                    {product.Winner.id === currentClient.id
                                                                        ? 'Você venceu!'
                                                                        : 'Finalizado'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Lista de lances do produto */}
                                                    <div className={`absolute left-0 right-0 bg-white rounded-lg shadow-lg 
                                                        mt-2 z-10 transition-all duration-300 ease-in-out ${expandedProduct === product.id
                                                            ? 'opacity-100 transform translate-y-0'
                                                            : 'opacity-0 transform -translate-y-4 pointer-events-none'
                                                        }`}
                                                    >
                                                        <div className="p-4 max-h-[300px] overflow-y-auto">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h4 className="font-semibold">Histórico de Lances</h4>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedProduct(null);
                                                                    }}
                                                                    className="text-gray-400 hover:text-gray-600"
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
                                                                            className={`p-3 rounded ${bid.client_id === currentClient.id
                                                                                    ? 'bg-blue-50 border border-blue-100'
                                                                                    : 'bg-gray-50'
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
                                                                            <div className="flex justify-between items-center text-sm">
                                                                                <span className="text-gray-500">
                                                                                    {new Date(bid.created_at)
                                                                                        .toLocaleString('pt-BR')}
                                                                                </span>
                                                                                {bid.cover_auto && (
                                                                                    <span className="text-blue-600">
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

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}


export default ClientBids;