/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { useNavigate } from "react-router-dom";
import ReceiptModalCartela from "./ReceiptModalCartela";

function ClientCartelas() {
    const [currentClient, setCurrentClient] = useState({})
    const [cartelas, setCartelas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [expandedCartela, setExpandedCartela] = useState(null);
    const [auctionDetails, setAuctionDetails] = useState({});
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [selectedCartela, setSelectedCartela] = useState(null);

    useEffect(() => {
        const fetchClientCartelas = async () => {
            const clientSession = JSON.parse(localStorage.getItem('client-auk-session-login'));

            if (!clientSession || !clientSession.token) {
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
                await getList(result.data.id, clientSession.token);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate("/client/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientCartelas();
    }, [navigate]);

    const getList = async (clientId, token) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/list-cartelas-by-client`, {
                params: { client_id: clientId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const cartelas = response.data;
            setCartelas(cartelas);
            
            // Verificar se as cartelas já têm a propriedade Auct
            const cartelasWithAuction = cartelas.filter(cartela => cartela.Auct);
            
            if (cartelasWithAuction.length > 0) {
                // Se já tiver a propriedade Auct, usar diretamente
                const auctionDetailsMap = {};
                cartelasWithAuction.forEach(cartela => {
                    if (cartela.Auct && cartela.Auct.id) {
                        auctionDetailsMap[cartela.Auct.id] = cartela.Auct;
                    }
                });
                setAuctionDetails(prevDetails => ({...prevDetails, ...auctionDetailsMap}));
            }
            
            // Buscar detalhes dos leilões para cartelas que não têm a propriedade Auct
            const auctionIds = [...new Set(cartelas
                .filter(cartela => !cartela.Auct && cartela.auction_id)
                .map(cartela => cartela.auction_id)
            )];
            
            if (auctionIds.length > 0) {
                await fetchAuctionDetails(auctionIds, token);
            }
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/client/login");
            }
        }
    }
    
    const fetchAuctionDetails = async (auctionIds, token) => {
        const details = {};
        
        try {
            for (const auctionId of auctionIds) {
                if (auctionId) {
                    const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auction/get-auction-by-id`, {
                        params: { auction_id: auctionId },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    
                    if (response.data) {
                        details[auctionId] = response.data;
                    }
                }
            }
            
            setAuctionDetails(prevDetails => ({...prevDetails, ...details}));
        } catch (error) {
            console.error("Erro ao buscar detalhes dos leilões:", error);
        }
    };

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

    // Função auxiliar para traduzir o status do leilão
    const getAuctionStatusInfo = (status) => {
        const statusMap = {
            'cataloged': { text: 'Catalogado', color: 'text-blue-600' },
            'live': { text: 'Ao Vivo', color: 'text-green-600' },
            'canceled': { text: 'Cancelado', color: 'text-red-600' },
            'finished': { text: 'Finalizado', color: 'text-purple-600' },
            'paused': { text: 'Pausado', color: 'text-yellow-600' },
            'pending': { text: 'Pendente', color: 'text-gray-600' }
        };
        return statusMap[status] || { text: status, color: 'text-gray-600' };
    };

    const toggleExpand = (cartelaId) => {
        setExpandedCartela(expandedCartela === cartelaId ? null : cartelaId);
    };
    
    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return "Data não disponível";
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    // Formatar valor monetário
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(value);
    };

    const openReceiptModal = (cartela) => {
        setSelectedCartela(cartela);
        setReceiptModalOpen(true);
    };

    const closeReceiptModal = () => {
        setReceiptModalOpen(false);
        setSelectedCartela(null);
    };

    return (
        <div className="w-full h-screen flex bg-gradient-to-br from-[#f8f8f8] to-[#e8e8e8]">
            <AssideClient MenuSelected="menu-8" />
            
            <section className="flex-1 h-screen flex flex-col gap-5 p-5 overflow-y-auto">
                <div className="z-[10]">
                    <NavClient currentClient={currentClient} />
                </div>

                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Minhas Cartelas
                        </h1>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-5 border border-gray-100 animate-pulse">
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
                            {cartelas.map(cartela => {
                                return (
                                    <div key={cartela.id} 
                                        className="bg-white/90 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                                    >
                                        <div className="p-4 border-b relative">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-lg text-gray-800">
                                                    Cartela #{cartela.id.slice(-7)}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs text-white font-medium
                                                    ${getStatusInfo(cartela.status).color}`}
                                                >
                                                    {getStatusInfo(cartela.status).text}
                                                </span>
                                            </div>
                                            
                                            {/* Usar Auct da cartela se disponível, senão usar auctionDetails */}
                                            {(cartela.Auct || (cartela.auction_id && auctionDetails[cartela.auction_id])) && (
                                                <div className="mt-2 space-y-1">
                                                    {(() => {
                                                        const auction = cartela.Auct || auctionDetails[cartela.auction_id];
                                                        return (
                                                            <>
                                                                <div className="text-sm text-gray-700 font-medium flex items-center gap-1">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                                    </svg>
                                                                    {auction.title}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-500">
                                                                    <div className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        Criado em: {formatDate(auction.created_at)}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                        </svg>
                                                                        Status: <span className={`font-medium ${getAuctionStatusInfo(auction.status).color}`}>
                                                                            {getAuctionStatusInfo(auction.status).text}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                        </svg>
                                                                        Leiloeiro: <span className="font-medium">{auction.Advertiser?.name || "Não disponível"}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                                        </svg>
                                                                        Categoria: <span className="font-medium">{auction.categorie || "Não especificada"}</span>
                                                                    </div>
                                                                </div>
                                                                {auction.tags && auction.tags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {auction.tags.map((tag, index) => (
                                                                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Valor Total:</span>
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(cartela.amount)}
                                                </span>
                                            </div>
                                            
                                            {/* Usar Auct da cartela se disponível, senão usar auctionDetails */}
                                            {(cartela.Auct || (cartela.auction_id && auctionDetails[cartela.auction_id])) && (
                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                    {(() => {
                                                        const auction = cartela.Auct || auctionDetails[cartela.auction_id];
                                                        return (
                                                            <>
                                                                <h4 className="text-sm font-medium text-blue-700 mb-2">Detalhes do Leilão</h4>
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-500">Data do Leilão:</span>
                                                                        <span className="font-medium text-gray-700">{formatDate(auction.created_at)}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-500">Leiloeiro:</span>
                                                                        <span className="font-medium text-gray-700">{auction.Advertiser?.name || "Não disponível"}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-500">Valor Base:</span>
                                                                        <span className="font-medium text-gray-700">{formatCurrency(auction.value || 0)}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-500">Status:</span>
                                                                        <span className={`font-medium capitalize ${getAuctionStatusInfo(auction.status).color}`}>
                                                                            {getAuctionStatusInfo(auction.status).text}
                                                                        </span>
                                                                    </div>
                                                                    {auction.auct_dates && auction.auct_dates.length > 0 && (
                                                                        <div className="flex flex-col col-span-2">
                                                                            <span className="text-gray-500">Próxima data:</span>
                                                                            <span className="font-medium text-gray-700">
                                                                                {formatDate(auction.auct_dates[0]?.date_auct)} {auction.auct_dates[0]?.hour || ""}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {auction.Advertiser && (
                                                                    <div className="mt-3 pt-3 border-t border-blue-100">
                                                                        <h5 className="text-xs font-medium text-blue-700 mb-2">Informações do Leiloeiro</h5>
                                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-gray-500">Nome:</span>
                                                                                <span className="font-medium text-gray-700">{auction.Advertiser.name}</span>
                                                                            </div>
                                                                            {auction.Advertiser.company_name && (
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-gray-500">Empresa:</span>
                                                                                    <span className="font-medium text-gray-700">{auction.Advertiser.company_name}</span>
                                                                                </div>
                                                                            )}
                                                                            {auction.Advertiser.email && (
                                                                                <div className="flex flex-col col-span-2">
                                                                                    <span className="text-gray-500">Contato:</span>
                                                                                    <span className="font-medium text-gray-700">{auction.Advertiser.email}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {auction.auct_dates && auction.auct_dates.length > 0 && (
                                                                    <div className="mt-3 pt-3 border-t border-blue-100">
                                                                        <h5 className="text-xs font-medium text-blue-700 mb-2">Datas do Leilão</h5>
                                                                        <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                                                            {auction.auct_dates.map((dateGroup, index) => (
                                                                                <div key={index} className="flex justify-between items-center text-xs p-1 rounded bg-white">
                                                                                    <div className="flex items-center gap-1">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                        </svg>
                                                                                        {formatDate(dateGroup.date_auct)}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="text-gray-600">{dateGroup.hour || "Horário não definido"}</span>
                                                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${getAuctionStatusInfo(dateGroup.group_status).color.replace('text-', 'bg-').replace('600', '100')}`}>
                                                                                            {dateGroup.group || "Grupo " + (index + 1)}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600 text-sm">Código de Rastreio:</span>
                                                    {cartela.status === 'SENDED' && (
                                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                            Enviado
                                                        </span>
                                                    )}
                                                </div>
                                                {cartela.tracking_code ? (
                                                    <div className="p-2 bg-gray-50 rounded-md font-mono text-sm border border-gray-200">
                                                        {cartela.tracking_code}
                                                    </div>
                                                ) : (
                                                    <div className="p-2 text-sm text-gray-500 italic bg-gray-50 rounded-md border border-gray-200">
                                                        Ainda não disponível
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                    </svg>
                                                    {cartela.products.length} produto{cartela.products.length !== 1 ? 's' : ''}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openReceiptModal(cartela)}
                                                        className="flex items-center gap-1 text-green-600 hover:text-green-800 
                                                            transition-colors text-sm font-medium bg-green-50 px-3 py-1 rounded-full"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Ver Recibo
                                                    </button>
                                                    <button
                                                        onClick={() => toggleExpand(cartela.id)}
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 
                                                            transition-colors text-sm font-medium bg-blue-50 px-3 py-1 rounded-full"
                                                    >
                                                        {expandedCartela === cartela.id ? 'Ocultar' : 'Ver produtos'}
                                                        <span className={`transform transition-transform duration-200
                                                            ${expandedCartela === cartela.id ? 'rotate-180' : ''}`}>
                                                            ▼
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Lista de produtos expandida */}
                                            <div className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out
                                                ${expandedCartela === cartela.id 
                                                    ? 'max-h-[800px] opacity-100' 
                                                    : 'max-h-0 opacity-0'}`}
                                            >
                                                {cartela.products.map(product => (
                                                    <div key={product.id} 
                                                        className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                                                    >
                                                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                            <img 
                                                                src={product.cover_img_url} 
                                                                alt={product.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <p className="text-sm font-medium text-gray-800">{product.title}</p>
                                                                <span className="text-sm font-bold text-green-600">
                                                                    {formatCurrency(product.real_value)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 flex flex-wrap gap-2">
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                                    Lote: {product.lote || 'N/A'}
                                                                </span>
                                                                {product.category && (
                                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                                                        {product.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {product.description && (
                                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                    {product.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100">
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

            {/* Modal de Recibo */}
            {receiptModalOpen && selectedCartela && (
                <ReceiptModalCartela
                    selectedCartela={selectedCartela}
                    closeReceiptModal={closeReceiptModal}
                    currentClient={currentClient}
                    auctionDetails={auctionDetails}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                    getStatusInfo={getStatusInfo}
                    getAuctionStatusInfo={getAuctionStatusInfo}
                />
            )}
        </div>
    );
}

export default ClientCartelas;