/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from 'socket.io-client';
import axios from "axios";
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { Timer, Gavel, EmojiEvents } from '@mui/icons-material';
import CarroselHomeAdvertiserDetails from "../../../home/advertiser-home/components/CarroselHomeAdvertiserDetails";
import { setCurrentProduct, setStatus } from "../../../features/auct/generalAUKSlice";

function DisplayCurrentLote() {
    const [remainingTime, setRemainingTime] = useState(0);
    const [winner, setWinner] = useState(null);
    const generalAUK = useSelector(state => state.generalAUK);
    const dispatch = useDispatch();

    useEffect(() => {
        if (generalAUK.auct && generalAUK.status === 'live') {
            const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

            socket.on(`${generalAUK.auct.id}-playing-auction`, (message) => {
                if (message.data.body.auct_id === generalAUK.auct.id) {
                    dispatch(setCurrentProduct(message.data.body.product));
                    const totalTime = generalAUK.auct.product_timer_seconds;
                    const elapsedTime = message.data.cronTimer || 0;
                    const remaining = Math.max(0, totalTime - elapsedTime);
                    setRemainingTime(remaining);
                }
            });

            socket.on(`${generalAUK.auct.id}-winner`, (message) => {
                getCurrentClientWinner(message.data.winner);
            });

            socket.on(`${generalAUK.auct.id}-auct-finished`, () => {
                dispatch(setStatus('finished'));
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [generalAUK.auct, generalAUK.status, dispatch]);

    const getCurrentClientWinner = async (client_id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-client?client_id=${client_id}`);
            setWinner(response.data);
            setTimeout(() => {
                setWinner(null);
            }, 3000);
        } catch (error) {
            return error
        }
    };

    if (!generalAUK.auct || generalAUK.status !== 'live') {
        return (
            <div className="flex justify-center items-center w-[50%] h-full">
                <Typography variant="h5">Nenhum leilão em andamento</Typography>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:w-[50%] justify-center items-center
        w-full h-full bg-white rounded-md shadow-lg overflow-hidden p-4">
            <Typography variant="h4" gutterBottom>
                {generalAUK.currentProduct?.title || "Carregando..."}
            </Typography>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item>
                    <Chip 
                        icon={<Timer />} 
                        label={`${remainingTime} segundos restantes`} 
                        color={remainingTime < 10 ? "error" : "primary"} 
                    />
                </Grid>
                <Grid item>
                    <Chip icon={<Gavel />} label={`Lote ${generalAUK.currentProduct?.lote || "N/A"}`} color="secondary" />
                </Grid>
                <Grid item>
                    <Chip label={`Status: ${generalAUK.status}`} color="default" />
                </Grid>
            </Grid>

            <Box flexGrow={1} overflow="auto">
                {generalAUK.currentProduct && <CarroselHomeAdvertiserDetails currentProduct={generalAUK.currentProduct} />}
            </Box>

            {winner && (
                <Paper elevation={2} sx={{ mt: 2, p: 2, bgcolor: 'success.light' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmojiEvents sx={{ mr: 1 }} /> Vencedor do Lote
                    </Typography>
                    <Typography>Nome: {winner.name}</Typography>
                    <Typography>Lance: R$ {winner.bid_value?.toFixed(2)}</Typography>
                </Paper>
            )}
        </div>
    );
}

export default DisplayCurrentLote;