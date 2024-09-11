/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import CenterFloor from "./components/CenterFloor";
import FloorBids from "./components/FloorBids";
import FloorLots from "./components/FloorLots";
import FloorNavigation from "./components/FloorNavigation";
import backgroundFloor from "../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import WinnerScreen from "./winner/WinnerScreen";


function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(false);
    const [socketMessage, setSocketMessage] = useState();
    const [socketWinner, setSocketWinner] = useState(false);
    const [isWinnerMessage, setIsWinnerMessage] = useState(false)

    const { auct_id } = useParams();
    const stateBid = useSelector(state => state.bidLive);

    const socketRef = useRef(null);

    useEffect(() => {
        webSocketFlow()
    }, [auct_id]);

    useEffect(() => {
        const product_id = stateBid.bidLive.product_id
        getCurrentProduct(product_id)
    }, [stateBid, socketWinner])

    const webSocketFlow = async () => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socketRef.current = socket;
        getCurrentAuction();

        // ouvindo mensagem de pregão ao vivo
        socket.on(`${auct_id}-playing-auction`, (message) => {
            if (message.data.body.auct_id === auct_id) {
                setSocketMessage(message);

                if (!currentProduct) {
                    setCurrentProduct(message.data.body.product)
                }
            }
        });

        // ouvindo mensagem de leilão finalizado
        socket.on(`${auct_id}-winner`, (message) => {
            getCurrentClientWinner(message.data.winner)
        });

        // Limpar o WebSocket quando o componente for desmontado
        return () => {
            setIsWinnerMessage(true)
            socket.disconnect();
        };

    }

    const getCurrentAuction = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auct_id}`)
                .then((response) => {
                    setCurrentAuct(response.data);
                });
        } catch (error) {
            console.log("error at try get auction: ", error.message);
        }
    };

    const getCurrentProduct = async (product_id) => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
                .then(result => {
                    setCurrentProduct(result.data);
                })
        } catch (error) {
            console.log("error ao tentar encontrar produto ", error.message);
        }
    }

    const getCurrentClientWinner = async (client_id) => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-client?client_id=${client_id}`)
                .then(response => {
                    console.log("VENCEDORRR! ->", response.data)
                    setSocketWinner(response.data);
                    setTimeout(() => {
                        setSocketWinner(false)
                    }, 3000);
                })
        } catch (error) {
            console.log("error at try get client: ", error.message);
        }
    }

    if (isWinnerMessage || socketWinner) {
        return (
            <WinnerScreen
                currentProduct={currentProduct}
                winner={socketWinner}
                auct={currentAuct} />
        );
    }

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-hidden p-[2vh] gap-[2vh]">
            <img src={backgroundFloor} alt="" className="flex absolute top-0 h-full w-[100%] object-cover z-[1]" />
            <FloorNavigation auction={currentAuct} group={currentProduct.group} />
            <div className="flex lg:flex-row flex-col w-full h-full justify-between items-center gap-[2vh] z-[2] overflow-y-auto">
                <section className="lg:w-[70%] w-[99%] lg:h-[80vh] flex flex-col justify-between items-center relative gap-[2vh] z-[999]">
                    <CenterFloor
                        title={currentProduct.title}
                        cover={currentProduct.cover_img_url}
                        description={currentProduct.description}
                        auction={currentAuct}
                        currentProduct={currentProduct} // Passando o produto atual para o CenterFloor
                    />
                    <FloorLots
                        products={currentAuct.product_list}
                        currentProduct={currentProduct}
                    />
                </section>
                <FloorBids
                    timer={socketMessage ? socketMessage.data.cronTimer : 0}
                    duration={currentAuct.product_timer_seconds}
                    auct_id={currentAuct.id}
                    productId={currentProduct.id} />
            </div>
        </div>
    );
}

export default AuctFloor;
