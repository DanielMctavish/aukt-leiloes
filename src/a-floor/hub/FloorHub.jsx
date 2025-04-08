/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import bg_hub from "../../media/backgrounds/background_hub.png"
import blueLogo from "../../media/logos/logos-auk/aukt_blue.png";
import { AccessTime, LocalOffer } from '@mui/icons-material';

// Mini visualizador para leilões ao vivo (versão somente para FloorHub)
const LiveAuctionMiniPlayer = ({ auction, liveAuctionsData }) => {
    const auctionData = liveAuctionsData[auction.id] || {};
    const { timer = 0, currentProduct = null, duration = 60 } = auctionData;
    
    // Calcular a contagem regressiva (agora usando a duração real do leilão)
    const countdown = Math.max(0, duration - timer);
    
    return (
        <div className="absolute top-2 left-2 right-2 flex flex-col gap-1 z-20">
            {/* Container do Mini Player */}
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-white/20 overflow-hidden">
                {/* Barra de progresso do temporizador - agora com base na contagem regressiva */}
                {countdown > 0 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-1000"
                        style={{ width: `${100 - ((countdown / duration) * 100)}%` }}>
                    </div>
                )}
                
                {/* Informação do Lote Atual */}
                {currentProduct ? (
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <LocalOffer sx={{ fontSize: 16 }} className="text-white/80" />
                                <span className="text-white font-medium text-sm">
                                    Lote {currentProduct.lote || "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 bg-red-600/80 px-2 py-0.5 rounded-full">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                <span className="text-white text-xs font-medium">LIVE</span>
                            </div>
                        </div>
                        
                        {/* Timer - agora com contagem regressiva */}
                        <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center gap-1">
                                <AccessTime sx={{ fontSize: 14 }} className="text-white/80" />
                                <span className={`text-white text-xs ${countdown <= 10 ? 'font-bold text-red-400' : ''}`}>
                                    {countdown > 0 ? `${countdown}s` : "Aguardando..."}
                                </span>
                            </div>
                            <span className="text-xs text-white/80 truncate max-w-[120px]">
                                {currentProduct.title}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-1">
                        <span className="text-white/80 text-xs">Aguardando início...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const FloorHub = () => {
    const [allAuctions, setAllAuctions] = useState({
        auctionLive: [],
        auctionCataloged: [],
        auctionPaused: [],
    });
    const [currentClient, setCurrentClient] = useState();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [liveAuctionsData, setLiveAuctionsData] = useState({});
    const socketRefs = useRef({});
    const navigate = useNavigate()

    useEffect(() => {
        getAllAuctions();
        getCurrentClientSession();
        
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            // Desconectar todos os sockets ao desmontar
            Object.values(socketRefs.current).forEach(socket => {
                if (socket && typeof socket.disconnect === 'function') {
                    socket.disconnect();
                }
            });
        };
    }, []);

    useEffect(() => {
        // Conectar WebSockets para leilões ativos
        if (allAuctions.auctionLive.length > 0) {
            allAuctions.auctionLive.forEach(auction => {
                connectToAuctionSocket(auction.id);
            });
        }

        return () => {
            // Desconectar sockets desnecessários
            Object.keys(socketRefs.current).forEach(auctId => {
                if (!allAuctions.auctionLive.some(auction => auction.id === auctId)) {
                    if (socketRefs.current[auctId]) {
                        socketRefs.current[auctId].disconnect();
                        delete socketRefs.current[auctId];
                    }
                }
            });
        };
    }, [allAuctions.auctionLive]);

    const connectToAuctionSocket = (auctId) => {
        // Evitar conexões duplicadas
        if (socketRefs.current[auctId]) return;

        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`, {
            transports: ['websocket'],
            upgrade: false,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            timeout: 10000,
            forceNew: true,
            query: {
                instance_id: `hub_viewer_${Math.random().toString(36).substring(2, 9)}`,
                client_type: "hub_viewer",
                auct_id: auctId
            }
        });

        socketRefs.current[auctId] = socket;

        socket.on('connect', () => {
            socket.emit('join-auction-room', {
                auct_id: auctId,
                instance_id: `hub_viewer_${Math.random().toString(36).substring(2, 9)}`,
                client_type: "hub_viewer"
            });
        });

        socket.on(`${auctId}-playing-auction`, (message) => {
            if (message.data && message.data.body) {
                const auction = allAuctions.auctionLive.find(a => a.id === auctId);
                const duration = auction?.product_timer_seconds || 60;
                
                setLiveAuctionsData(prev => ({
                    ...prev,
                    [auctId]: {
                        ...prev[auctId],
                        currentProduct: message.data.body.product,
                        timer: message.data.cronTimer || 0,
                        duration: duration
                    }
                }));
            }
        });

        socket.on(`${auctId}-bid`, (message) => {
            if (message.data && message.data.body) {
                // Atualizar informações de lance
                const newBid = message.data.body;
                setLiveAuctionsData(prev => ({
                    ...prev,
                    [auctId]: {
                        ...prev[auctId],
                        lastBid: newBid,
                        bidCount: (prev[auctId]?.bidCount || 0) + 1
                    }
                }));
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket desconectado para leilão ${auctId}`);
        });

        socket.on('connect_error', (error) => {
            console.error(`Erro na conexão WebSocket para leilão ${auctId}:`, error);
        });
    };

    const getAllAuctions = async () => {
        try {
            const catalogedResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus?status=cataloged`
            );
            const liveResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus?status=live`
            );
            const pausedResponse = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus?status=paused`
            );

            const getTotalBids = (auction) => {
                return auction.product_list?.reduce((total, product) => 
                    total + (product.Bid?.length || 0), 0) || 0;
            };

            const sortAuctions = (auctions) => {
                return [...auctions].sort((a, b) => {
                    const bidCountA = getTotalBids(a);
                    const bidCountB = getTotalBids(b);
                    return bidCountA - bidCountB;
                });
            };

            const filteredLiveAuctions = liveResponse.data.filter(auct => auct.public === true);
            const filteredPausedAuctions = pausedResponse.data.filter(auct => auct.public === true);
            const filteredCatalogedAuctions = catalogedResponse.data.filter(auct => auct.public === true);

            setAllAuctions({
                auctionCataloged: sortAuctions(filteredCatalogedAuctions),
                auctionLive: sortAuctions(filteredLiveAuctions),
                auctionPaused: sortAuctions(filteredPausedAuctions),
            });

            // Inicializar dados para leilões ativos
            const initialLiveData = {};
            filteredLiveAuctions.forEach(auction => {
                initialLiveData[auction.id] = {
                    timer: 0,
                    currentProduct: null,
                    bidCount: 0,
                    lastBid: null,
                    duration: auction.product_timer_seconds || 60
                };
            });
            setLiveAuctionsData(initialLiveData);

        } catch (error) {
            console.error("Error at getting auctions: ", error.message);
        }
    };

    const getCurrentClientSession = async () => {
        const clientSession = localStorage.getItem("client-auk-session-login");

        if (clientSession) {
            try {
                const parsedSession = JSON.parse(clientSession);
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${parsedSession.email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${parsedSession.token}`,
                        },
                    }
                );
                setCurrentClient(response.data);
            } catch (error) {
                console.error("Error at getting client: ", error.message);
            }
        }
    };

    useEffect(() => {
    }, [allAuctions, currentClient]);

    const getBorderStyle = (status) => {
        if (status === 'live') return 'border-[#6e1313] border-[4px]';
        if (status === 'paused') return 'border-orange-500 border-[4px]';
        return 'border-none';
    };

    const getLabelColor = (status) => {
        if (status === 'live') return 'bg-[#6e1313]';
        if (status === 'paused') return 'bg-orange-500';
        return 'bg-[#10335f]';
    };

    // Função para renderizar cards para versão mobile
    const renderMobileCard = (auction, status, i) => {
        const totalLotes = auction.product_list?.length || 0;
        const totalLances = auction.product_list?.reduce((total, product) => 
            total + (product.Bid?.length || 0), 0);

        return (
            <div
                key={i}
                onClick={() => navigate(`/floor/${auction.id}`)}
                className={`flex flex-col justify-center items-center relative bg-white 
                    rounded-[20px] overflow-hidden cursor-pointer hover:bg-blue-100 
                    shadow-lg min-h-[200px] ${getBorderStyle(status)}`}
            >
                {status === 'live' && <LiveAuctionMiniPlayer auction={auction} liveAuctionsData={liveAuctionsData} />}
                
                <span className={`absolute top-2 right-2 text-white px-2 py-1 rounded-[20px] text-sm
                    ${getLabelColor(status)} backdrop-blur-sm`}
                >
                    {status}
                </span>

                <img
                    src={auction.auct_cover_img}
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3">
                    <h3 className="text-[#012038] font-medium mb-2 text-sm line-clamp-2">
                        {auction.title}
                    </h3>
                    
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex gap-2 flex-wrap">
                            <span className="bg-[#012038]/10 px-2 py-1 rounded-full whitespace-nowrap">
                                {totalLotes} lotes
                            </span>
                            <span className="bg-[#012038]/10 px-2 py-1 rounded-full whitespace-nowrap">
                                {totalLances} lances
                            </span>
                        </div>
                        <span className="text-xs text-gray-600 truncate max-w-[100px]">
                            {auction.Advertiser?.name}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Função para renderizar cards no estilo mosaico (desktop)
    const renderAuctionCards = (auctions, status) => {
        return auctions.map((auction, i) => {
            
            const totalLotes = auction.product_list?.length || 0;
            const totalLances = auction.product_list?.reduce((total, product) => 
                total + (product.Bid?.length || 0), 0);

            return (
                <div
                    key={i}
                    onClick={() => navigate(`/floor/${auction.id}`)}
                    className={`flex flex-col justify-center items-center relative bg-white 
                        rounded-[20px] gap-3 overflow-hidden p-3 cursor-pointer hover:bg-blue-100 
                        shadow-lg ${i % 2 === 0 ? 'min-h-[400px]' : 'min-h-[300px]'}
                        ${getBorderStyle(status)}`}
                    style={{
                        gridColumn: i % 2 === 0 ? 'span 1' : 'span 2',
                        gridRow: i % 2 === 0 ? 'span 2' : 'span 1',
                    }}
                >
                    {status === 'live' && <LiveAuctionMiniPlayer auction={auction} liveAuctionsData={liveAuctionsData} />}
                    
                    <span className={`absolute top-2 right-2 text-white p-1 rounded-[20px] 
                        ${getLabelColor(status)}`}
                    >
                        {status}
                    </span>

                    <img
                        src={auction.auct_cover_img}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3">
                        <h3 className="text-[#012038] font-medium mb-2">{auction.title}</h3>
                        
                        {/* Estatísticas do Leilão */}
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex gap-3">
                                <span className="bg-[#012038]/10 px-2 py-1 rounded-full">
                                    {totalLotes} lotes
                                </span>
                                <span className="bg-[#012038]/10 px-2 py-1 rounded-full">
                                    {totalLances} lances
                                </span>
                            </div>
                            <span className="text-xs text-gray-600">
                                {auction.Advertiser?.name}
                            </span>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div
            className="flex flex-col justify-start items-center w-full relative 
            h-[100vh] overflow-hidden bg-[#D8DEE8] text-[#2d2d2d]"
        >
            <img src={bg_hub} alt="" className="object-cover w-full h-[100vh] absolute opacity-70" />

            {/* Navbar */}
            <nav
                className="flex justify-between items-center 
                border-[1px] border-[#e9e9e9] backdrop-blur-[4px]
                w-[96%] h-[60px] rounded-[12px] mt-[1vh] bg-[#e0e0e0a6] 
                lg:px-4 px-3 z-10"
            >
                <div className="flex items-center gap-4">
                    <img
                        src={blueLogo}
                        alt="logo-azul-aukt"
                        className="lg:w-[57px] w-[45px] object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => navigate("/")}
                    />
                </div>

                {currentClient && (
                    <div className="flex items-center gap-2 lg:gap-3 bg-white/50 lg:px-4 px-2 py-2 rounded-lg">
                        <div className="h-8 w-8 bg-[#012038] rounded-full flex items-center 
                            justify-center shadow-md">
                            <span className="text-white font-medium">
                                {currentClient.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs lg:text-sm text-gray-500">Logado como</span>
                            <span className="text-[#012038] font-medium -mt-1 text-sm lg:text-base truncate max-w-[120px] lg:max-w-none">
                                {currentClient.name}
                            </span>
                        </div>
                    </div>
                )}
            </nav>

            {/* Grid de Leilões */}
            {isMobile ? (
                // Versão Mobile - Cards em coluna única com seções
                <section className="grid grid-cols-1 gap-3 w-[92%] h-[80vh] 
                    justify-start bg-transparent overflow-y-auto p-1 
                    transition-all duration-[1s] mt-[2vh] pb-16">
                    
                    {allAuctions.auctionLive.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-[#012038] font-semibold mb-3 text-lg">Leilões Ao Vivo</h2>
                            <div className="space-y-3">
                                {allAuctions.auctionLive.map((auction, i) => renderMobileCard(auction, "live", i))}
                            </div>
                        </div>
                    )}
                    {allAuctions.auctionPaused.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-[#012038] font-semibold mb-3 text-lg">Leilões Pausados</h2>
                            <div className="space-y-3">
                                {allAuctions.auctionPaused.map((auction, i) => renderMobileCard(auction, "paused", i))}
                            </div>
                        </div>
                    )}
                    {allAuctions.auctionCataloged.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-[#012038] font-semibold mb-3 text-lg">Leilões Catalogados</h2>
                            <div className="space-y-3">
                                {allAuctions.auctionCataloged.map((auction, i) => renderMobileCard(auction, "cataloged", i))}
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                // Versão Desktop - Layout em mosaico original
                <section className="grid grid-cols-4 gap-1 w-[70%] h-[80vh] justify-start bg-transparent 
                    overflow-y-auto p-1 transition-all duration-[1s] mt-[6vh]">
                    {renderAuctionCards(allAuctions.auctionLive, "live")}
                    {renderAuctionCards(allAuctions.auctionPaused, "paused")}
                    {renderAuctionCards(allAuctions.auctionCataloged, "cataloged")}
                </section>
            )}

            <span className={`text-[#51759A] z-10 text-center px-4 py-2
                ${isMobile 
                    ? 'text-sm fixed bottom-0 bg-white/80 backdrop-blur-sm w-full' 
                    : ''}`}
            >
                leia nossos termos e condições, obrigado pela sua presença!
            </span>
        </div>
    );
};

export default FloorHub;
