/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { GridView, ViewTimeline } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import { getAuctionInformations } from "../functions/getAuctionInformations";

function FloorLots({ currentProduct }) {
    const [productLots, setProductsLots] = useState([])
    const [selectedLot, setSelectedLot] = useState(null)
    const [visibleLots, setVisibleLots] = useState([])
    const [showAllLots, setShowAllLots] = useState(false)
    const [currentAuct, setCurrentAuct] = useState(null)
    const { auct_id } = useParams();

    // Buscar informações iniciais do leilão
    useEffect(() => {
        getAuctionInformations(auct_id, setCurrentAuct);
    }, [auct_id]);

    useEffect(() => {
        if (currentAuct?.product_list) {
            setProductsLots(currentAuct.product_list);
        }
    }, [currentAuct]);

    // Atualiza os lotes visíveis com base no lote atual
    useEffect(() => {
        if (Array.isArray(productLots) && currentProduct) {
            // Filtra apenas os lotes do mesmo grupo
            const sameGroupLots = productLots.filter(lot => lot.group === currentProduct.group);
            
            // Ordena os lotes por número
            const sortedLots = sameGroupLots.sort((a, b) => (a.lote || 0) - (b.lote || 0));
            
            if (showAllLots) {
                // Mostra todos os lotes do grupo
                setVisibleLots(sortedLots);
            } else {
                // Encontra o índice do lote atual
                const currentIndex = sortedLots.findIndex(lot => lot.id === currentProduct.id);
                
                if (currentIndex !== -1) {
                    // Pega os próximos lotes (incluindo o atual) até o limite de 12
                    const lotsToShow = sortedLots.slice(currentIndex, currentIndex + 12);
                    setVisibleLots(lotsToShow);
                }
            }
        }
    }, [productLots, currentProduct, showAllLots]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedLot && !event.target.closest('.lot-item')) {
                setSelectedLot(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedLot]);

    if (!Array.isArray(productLots)) {
        return null;
    }

    const toggleView = () => {
        setShowAllLots(!showAllLots);
    };

    const renderLotItem = (lot) => {
        const isCurrentLot = currentProduct && lot.id === currentProduct.id;

        return (
            <div
                className={`
                    lot-item flex-shrink-0
                    ${isCurrentLot 
                        ? 'lg:w-[85px] lg:h-[85px] w-[100px] h-full ring-2 ring-[#13326b] ring-offset-2 ring-offset-[#d2d2d2]' 
                        : 'lg:w-[70px] lg:h-[70px] w-[80px] opacity-75 hover:opacity-100'
                    }
                    relative rounded-lg overflow-hidden
                    transition-all duration-300 ease-in-out
                    transform hover:scale-105 cursor-pointer
                    bg-white shadow-md
                `}
            >
                <img
                    src={lot.cover_img_url}
                    alt={`Lote ${lot.lote}`}
                    className="w-full h-full object-cover"
                />
                
                {/* Número do Lote */}
                <div className={`
                    absolute inset-0 flex items-end justify-start p-1
                    bg-gradient-to-t from-[#13326b]/80 to-transparent
                    transition-opacity duration-300
                    ${isCurrentLot ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
                `}>
                    <span className="text-white text-sm font-bold px-2 py-1 rounded-md"
                        style={{ textShadow: "1px 2px 1px #60e0ee" }}>
                        #{lot.lote}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full  h-full bg-[#d2d2d2ad] backdrop-blur-lg rounded-2xl 
            shadow-xl shadow-[#1414143a] border-[1px] border-[#f9f9f9] overflow-hidden"
        >
            {/* Cabeçalho com Título e Botão Toggle */}
            <div className="lg:px-3 lg:py-1.5 px-2 py-1 bg-white/10 border-b border-white/20 flex justify-between items-center">
                <span className="text-gray-700 text-sm font-medium hidden lg:block">
                    {showAllLots ? 'Todos os Lotes' : 'Próximos Lotes'}
                </span>
                <button
                    onClick={toggleView}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 
                        transition-colors duration-200 text-gray-700 lg:w-auto w-full justify-center"
                    title={showAllLots ? "Mostrar próximos 12 lotes" : "Mostrar todos os lotes"}
                >
                    {showAllLots ? (
                        <ViewTimeline sx={{ fontSize: 16 }} />
                    ) : (
                        <GridView sx={{ fontSize: 16 }} />
                    )}
                </button>
            </div>

            {/* Container dos Lotes com Scroll Moderno */}
            <div className="h-[calc(100%-32px)] lg:px-3 lg:py-1.5 px-1 py-1">
                <div className={`
                    flex lg:flex-row flex-col lg:gap-2 gap-3 h-full lg:items-center items-start
                    overflow-y-auto lg:overflow-y-hidden lg:overflow-x-auto overflow-x-hidden
                    scroll-smooth
                    scrollbar-thin scrollbar-thumb-[#13326b] scrollbar-track-transparent
                    hover:scrollbar-thumb-[#13326b]/80
                    ${showAllLots ? 'mask-fade-edges' : ''}
                `}>
                    {visibleLots.map((lot, index) => (
                        <div key={index} className="first:mt-1 last:mb-1 lg:first:ml-0 lg:last:mr-0">
                            {renderLotItem(lot)}
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #13326b;
                    border-radius: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(19, 50, 107, 0.8);
                }
                .mask-fade-edges {
                    mask-image: linear-gradient(
                        to bottom,
                        transparent,
                        black 5%,
                        black 95%,
                        transparent
                    );
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        transparent,
                        black 5%,
                        black 95%,
                        transparent
                    );
                }
                @media (min-width: 1024px) {
                    .mask-fade-edges {
                        mask-image: linear-gradient(
                            to right,
                            transparent,
                            black 5%,
                            black 95%,
                            transparent
                        );
                        -webkit-mask-image: linear-gradient(
                            to right,
                            transparent,
                            black 5%,
                            black 95%,
                            transparent
                        );
                    }
                }
                `}
            </style>
        </div>
    )
}

export default FloorLots


