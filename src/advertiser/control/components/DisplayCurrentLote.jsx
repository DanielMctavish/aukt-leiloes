/* eslint-disable react-hooks/exhaustive-deps */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setCurrentWinner } from "../../../features/winner/WinnerLive";
import { setCurrentProduct } from "../../../features/auct/CurrentProductSlice";
import 'swiper/swiper-bundle.css'; // Importação correta do CSS do Swiper

function DisplayCurrentLote() {
    const [timer, setTimer] = useState(0);
    const [currentAuction, setCurrentAuction] = useState();
    const [emptySlot, setEmptySlot] = useState([]);
    const [winner, setWinner] = useState(null);
    const [initialProductSet, setInitialProductSet] = useState(false);

    const stateLive = useSelector(state => state.live);
    const currentProduct = useSelector(state => state.currentProduct.product);
    const isRunning = useSelector(state => state.controlButtons.isRunning);
    const isPaused = useSelector(state => state.controlButtons.isPaused);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentAuction(stateLive.auction);
        webSocketFlow();
    }, [stateLive]);

    const webSocketFlow = async () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

        socket.on(`${currentAuction.id}-playing-auction`, (message) => {
            if (message.data.body.auct_id === currentAuction.id) {
                const product = message.data.body.product;
                const remainingTime = currentAuction.product_timer_seconds - message.data.cronTimer;

                setTimer(remainingTime); // Inicializa o cronômetro com product_timer_seconds e subtrai cronTimer

                // Envia o produto atual para o Redux apenas uma vez por lote
                if (!initialProductSet && remainingTime === currentAuction.product_timer_seconds) {
                    dispatch(setCurrentProduct(product));
                    setInitialProductSet(true);
                }

                setWinner(null); // Reset winner when a new product is being played
            }
        });

        socket.on(`${currentAuction.id}-winner`, (message) => {
            setWinner(message.data.winner);
            dispatch(setCurrentWinner(message.data.winner));
        });

        return () => {
            socket.disconnect();
        };
    };

    useEffect(() => {
        if (currentProduct) {
            const imgsGroup = currentProduct.group_imgs_url;
            if (imgsGroup && imgsGroup.length < 3) {
                const emptySlots = Array(3 - imgsGroup.length).fill(null);
                setEmptySlot(emptySlots);
            }
        }
    }, [currentProduct]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="flex lg:w-[50%] justify-center items-center w-full h-full p-[1vh] relative">
            <div className="w-full h-full bg-white rounded-md shadow-lg shadow-[#1a1a1a24]
            flex flex-col justify-start items-center overflow-hidden">

                <div className="w-[90%] h-[60px] flex justify-between items-center text-[22px] text-[#838383] relative">
                    <span className="font-extrabold ">Lote Atual</span>
                    <span>{currentProduct && currentProduct.lote}</span>
                </div>

                <div className="flex justify-center items-center w-[90%] h-[40px] bg-[#e9e9e9] rounded-md relative">
                    <span>{currentProduct && currentProduct.title}</span>
                    <span className="font-bold absolute right-2">{formatTime(timer)}</span>
                </div>

                <div className="flex justify-center items-center w-[90%] h-[40px] bg-[#e9e9e9] rounded-md relative mt-2">
                    <span>Grupo: {currentProduct && currentProduct.group}</span>
                </div>

                <section className="flex w-[90%] h-[80%] justify-center items-center">
                    <Swiper
                        navigation={true}
                        pagination={{ clickable: true }}
                        modules={[Navigation, Pagination]}
                    >
                        <SwiperSlide>
                            <div className='min-w-[600px] h-[600px] object-cover justify-center'>

                                {currentProduct && currentProduct.cover_img_url &&
                                    <img src={currentProduct && currentProduct.cover_img_url} alt="foto-produto-leilão"
                                        className='flex-1 h-[600px] object-cover rounded-md bg-zinc-200' />}
                            </div>
                        </SwiperSlide>
                        {currentProduct && currentProduct.group_imgs_url && currentProduct.group_imgs_url.map((img, i) => (
                            <SwiperSlide key={i}>
                                <img src={img} alt="thumb" className="w-full h-[600px] object-cover rounded-md" />
                            </SwiperSlide>
                        ))}
                        {emptySlot && emptySlot.map((_, i) => (
                            <SwiperSlide key={i}>
                                <div className="w-full h-[600px] object-cover rounded-md bg-slate-300"></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                <div className="h-[60px] text-[16px] font-bold text-[#838383] absolute bottom-0 right-6">
                    {isPaused && (
                        <button className="bg-yellow-500 text-white px-4 py-1 rounded">
                            Pausado
                        </button>
                    )}
                    {isRunning && (
                        <button className="bg-red-500 text-white px-4 py-1 rounded">
                            Em Andamento
                        </button>
                    )}
                    {!isRunning && !isPaused && (
                        <button className="bg-[#064874] text-white px-4 py-1 rounded">
                            Finalizado
                        </button>
                    )}
                </div>

                <div className="w-[90%] h-[60px] flex justify-center items-center text-[22px] text-[#838383] relative mt-4">
                    {winner ? (
                        <span className="font-bold text-green-500">Vencedor: {winner.name}</span>
                    ) : (
                        <span className="font-bold text-red-500">Não Arrematado</span>
                    )}
                </div>

            </div>
        </div>
    );
}

export default DisplayCurrentLote;