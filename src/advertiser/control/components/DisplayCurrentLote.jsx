/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReceiveWebsocketMessages from "../control-usecases/receiveWebsocketMessages";
import { Timer, Gavel, EmojiEvents, Category } from '@mui/icons-material';
import CarroselHomeAdvertiserDetails from "../../../home/advertiser-home/components/CarroselHomeAdvertiserDetails";
import { setCurrentProduct, setStatus, setCurrentTimer } from "../../../features/auct/generalAUKSlice";

function DisplayCurrentLote() {
    const [remainingTime, setRemainingTime] = useState(0);
    const [currentBidValue, setCurrentBidValue] = useState(null);
    const [winner, setWinner] = useState(null);
    const [winnerBidValue, setWinnerBidValue] = useState(null);
    const [instanceId] = useState(() => crypto.randomUUID()); // ID único para esta instância

    const generalAUK = useSelector(state => state.generalAUK);
    const dispatch = useDispatch();


    useEffect(() => {
        if (generalAUK.auct && generalAUK.status === 'live') {
            const receiveWebsocketMessages = new ReceiveWebsocketMessages(generalAUK);

            // Configurar handlers para cada tipo de mensagem
            receiveWebsocketMessages.receivePlayingAuction((playingMessage) => {
                if (playingMessage.data?.body?.auct_id === generalAUK.auct.id) {
                    if (playingMessage.data.body.product) {
                        dispatch(setCurrentProduct(playingMessage.data.body.product));
                    }

                    const remaining = playingMessage.data.cronTimer || 0;
                    setRemainingTime(remaining);
                    dispatch(setCurrentTimer(remaining));

                    if (remaining === 0) {
                        setCurrentBidValue(0);
                    }
                }
            });

            receiveWebsocketMessages.receiveBidMessage((bidMessage) => {
                if (bidMessage.data?.body) {
                    try {
                        if (bidMessage.data.body.Product) {
                            setCurrentBidValue(bidMessage.data.body.CurrentBid.value);
                        }
                    } catch (error) {
                        console.error("Erro ao atualizar lance:", error);
                    }
                }
            });

            receiveWebsocketMessages.receiveWinnerMessage((winnerMessage) => {
                if (winnerMessage.data?.body) {
                    if (winnerMessage.data.body.product?.Bid?.length > 0) {
                        const lastBid = winnerMessage.data.body.product.Bid[0];
                        setWinnerBidValue(lastBid.value);
                        setWinner(winnerMessage.data.body.winner);
                    }
                }
            });

            receiveWebsocketMessages.receiveAuctionFinishedMessage((finishedMessage) => {
                if (finishedMessage.data) {
                    dispatch(setStatus('finished'));
                }
            });

            // Cleanup function
            return () => {
                receiveWebsocketMessages.disconnect();
            };
        }
    }, [generalAUK.auct, generalAUK.status, dispatch, instanceId]);



    if (!generalAUK.auct || generalAUK.status !== 'live') {
        return (
            <div className="flex flex-col justify-center items-center lg:w-[50%] w-full h-full 
                bg-white p-8 rounded-xl shadow-lg gap-4">
                <Gavel sx={{ fontSize: 48 }} className="text-gray-400" />
                <p className="text-gray-500 text-lg font-medium">Nenhum leilão em andamento</p>
                <p className="text-gray-400 text-sm text-center">
                    Aguarde o início do próximo leilão para visualizar os produtos
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:w-[50%] w-full h-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#012038] text-white p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                        <h2 className="text-2xl font-bold mb-2">
                            {generalAUK.currentProduct?.title || "Carregando..."}
                        </h2>
                        <p className="text-white/70 mb-4">
                            {generalAUK.currentProduct?.description}
                        </p>

                        {/* Informações do Produto */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-sm text-white/70">Valor Inicial</p>
                                <p className="text-lg font-bold">
                                    {generalAUK.currentProduct?.initial_value ?
                                        new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(generalAUK.currentProduct.initial_value)
                                        : "N/A"
                                    }
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-sm text-white/70">Lance Atual</p>
                                <p className="text-lg font-bold text-green-400">
                                    {currentBidValue ?
                                        new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(currentBidValue)
                                        : generalAUK.currentProduct?.Bid?.length > 0 ?
                                            new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(generalAUK.currentProduct.Bid[0].value)
                                            : "Sem lances"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                            <Category sx={{ fontSize: 16 }} />
                            <span>Lote {generalAUK.currentProduct?.lote || "N/A"}</span>
                        </div>

                    </div>
                </div>

                {/* Timer */}
                <div className={`flex items-center gap-2 p-3 rounded-lg 
                    ${remainingTime < 10 ? 'bg-red-500/20' : 'bg-white/10'}`}>
                    <Timer sx={{ fontSize: 24 }} />
                    <div>
                        <p className="text-sm opacity-80">Tempo Restante</p>
                        <p className="text-2xl font-bold">
                            {remainingTime} segundos
                        </p>
                    </div>
                </div>
            </div>

            {/* Carrossel */}
            <div className="flex-1 p-6 overflow-hidden bg-gray-50">
                {generalAUK.currentProduct && (
                    <div className="h-full">
                        <CarroselHomeAdvertiserDetails currentProduct={generalAUK.currentProduct} />
                    </div>
                )}
            </div>

            {/* Winner Banner */}
            {winner && (
                <div className="animate-slide-up">
                    <div className="bg-green-500 text-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <EmojiEvents sx={{ fontSize: 32 }} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">
                                    Vencedor do Lote
                                </h3>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-white/70 text-sm">Nome</p>
                                        <p className="font-medium">{winner.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/70 text-sm">Lance Vencedor</p>
                                        <p className="font-medium">
                                            {winnerBidValue ?
                                                new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(winnerBidValue)
                                                : "Valor não disponível"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DisplayCurrentLote;