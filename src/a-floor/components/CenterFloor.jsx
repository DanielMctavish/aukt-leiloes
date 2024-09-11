/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import io from 'socket.io-client';
import dayjs from 'dayjs';

function CenterFloor({ title, description, auction, currentProduct }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAuctionFinished, setIsAuctionFinished] = useState(false);

    const images = currentProduct ? [currentProduct.cover_img_url, ...(currentProduct.group_imgs_url || [])] : [];

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

        socket.on(`${auction.id}-auct-finished`, () => {
            console.log("Auction finished websocket!");
            setIsAuctionFinished(true);
        });

        return () => {
            socket.disconnect();
        };
    }, [auction.id]);

    const handleToggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    };

    useEffect(() => { }, [isAuctionFinished])
    useEffect(() => { }, [currentProduct])

    return (
        <section className="w-full h-[60vh] flex lg:flex-row flex-col 
        lg:justify-center justify-start items-center rounded-[22px] bg-gradient-to-br from-gray-100 to-gray-300
        shadow-xl relative z-[2] p-6 gap-6 overflow-hidden">
            {isAuctionFinished && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
                    <h2 className="text-white text-4xl font-bold">Leilão Finalizado</h2>
                </div>
            )}

            {auction.status === "cataloged" && (
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