/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Star } from "@mui/icons-material";
import io from 'socket.io-client';
import dayjs from 'dayjs';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CenterFloor({ title, description, auction, currentProduct }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);
    const [sortedAuctions, setSortedAuctions] = useState([]);
    const navigate = useNavigate();

    const images = currentProduct ? [currentProduct.cover_img_url, ...(currentProduct.group_imgs_url || [])] : [];

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

        socket.on(`${auction.id}-auct-finished`, () => {
            setIsAuctionFinished(true);
        });

        if (isAuctionFinished) {
            listAuctions();
        }

        return () => {
            socket.disconnect();
        };
    }, [auction.id, isAuctionFinished]);

    const handleToggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    };

    const listAuctions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                params: {
                    status: "cataloged",
                }
            });
            getSortedAuctions(response.data);
        } catch (error) {
            return error
        }
    }

    const getSortedAuctions = (auctions) => {
        const shuffled = auctions.sort(() => 0.5 - Math.random());
        setSortedAuctions(shuffled.slice(0, 6));
    };

    const renderStars = () => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 text-sm" />
                ))}
            </div>
        );
    };

    return (
        <section className="w-full h-[60vh] flex lg:flex-row flex-col 
        lg:justify-center justify-start items-center rounded-[22px] bg-gradient-to-br from-gray-100 to-gray-300
        shadow-xl relative z-[2] p-6 gap-6 overflow-hidden">
            {isAuctionFinished && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#0D1733] to-[#d7d7d7] flex flex-col items-center justify-center z-30 p-8 overflow-y-auto">
                    <div className="max-w-6xl w-full">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Leilão Finalizado</h2>
                        <p className="text-xl text-white mb-6 text-center">Obrigado pela sua participação!</p>
                        <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">Próximos Leilões em Destaque</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                            {sortedAuctions.map(auction => (
                                auction && (
                                    <div key={auction.id} className="bg-white flex flex-col h-80 overflow-hidden
                                    rounded-lg shadow-lg shadow-[#1c1c1c37] transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105">
                                        <div className="p-4 flex-shrink-0">
                                            <span className="text-sm text-gray-600">{auction.Advertiser.name}</span>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{auction.title}</h3>
                                        </div>

                                        <div className="flex-grow p-4 grid grid-cols-2 gap-2 overflow-hidden">
                                            {
                                                auction.product_list && auction.product_list.slice(0, 4).map(product => (
                                                    <div
                                                        key={product.id}
                                                        className="flex flex-col items-center bg-gray-100 rounded-md shadow p-2 relative overflow-hidden group aspect-square"
                                                    >
                                                        <img
                                                            src={product.cover_img_url}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover rounded-md transition-all duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                                                            {renderStars()}
                                                            <p className="text-xs font-semibold text-white truncate w-full">{product.title}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <div className="p-4 flex-shrink-0">
                                            <button
                                                onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)}
                                                className="w-full h-10 bg-[#0D1733] rounded-md text-white hover:bg-[#1A2547] transition-colors duration-300"
                                            >
                                                Ver mais
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Verifica se o leilão está catalogado antes de renderizar a tela de descanso */}
            {auction.status === "cataloged" && !isAuctionFinished && !currentProduct && (
                <div className="w-full h-full flex lg:flex-row flex-col items-center justify-between">
                    <div className="lg:w-1/2 w-full h-full relative overflow-hidden rounded-lg shadow-lg">
                        <img src={auction.auct_cover_img} alt="capa do leilão" className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-50" />
                        <img src={auction.auct_cover_img} alt="capa do leilão" className="relative z-10 w-full h-full object-contain" />
                    </div>
                    <div className="lg:w-1/2 w-full h-full flex flex-col justify-center items-start p-8 bg-white bg-opacity-80 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{auction.title}</h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {auction.descriptions_informations}
                        </p>
                        <div className="w-full justify-center items-center flex gap-3">
                            {auction.auct_dates &&
                                auction.auct_dates.map((date, i) => (
                                    <div key={i} className="flex items-center mb-2 bg-zinc-200 p-2 rounded-lg font-bold">
                                        <CalendarTodayIcon className="mr-2" />
                                        <span className="text-gray-600 text-[12px]">
                                            {dayjs(date.date_auct).format('DD/MM/YYYY HH:mm')}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            {description && (
                <>
                    <div className="lg:w-[40%] w-full lg:h-[80%] flex flex-col relative justify-center items-center gap-2">
                        <div className="relative w-full h-full">
                            <img
                                src={images[currentImageIndex]}
                                alt={`Produto ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={handleToggleFullscreen}
                            />
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-black bg-opacity-50">
                                {images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 mx-1 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {!isFullscreen && (
                        <div className="lg:w-[50%] w-full lg:h-[80%] min-h-[40vh] flex flex-col justify-start items-center p-6 bg-white shadow-lg rounded-lg">
                            <h1 className="font-bold lg:text-[34px] text-[24px] text-gray-800 mb-4">{title}</h1>
                            <section className="w-full h-full overflow-y-auto">
                                <p className="text-gray-600 lg:text-[16px] text-[14px] leading-relaxed">
                                    {description}
                                </p>
                            </section>
                        </div>
                    )}
                </>
            )}

            {isFullscreen && (
                <div className="fixed inset-0 z-20 bg-black bg-opacity-90 flex items-center justify-center">
                    <button
                        onClick={handleToggleFullscreen}
                        className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                    <button
                        onClick={handlePrevImage}
                        className="absolute left-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                    >
                        <ArrowBackIosNewIcon />
                    </button>
                    <img
                        src={images[currentImageIndex]}
                        alt={`Produto ${currentImageIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                    />
                    <button
                        onClick={handleNextImage}
                        className="absolute right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                    >
                        <ArrowForwardIosIcon />
                    </button>
                </div>
            )}
        </section>
    );
}

export default CenterFloor;