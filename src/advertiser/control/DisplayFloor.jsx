/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import io from "socket.io-client";
import { useEffect, useState } from "react";

function DisplayFloor({ currentProduct, auct_id }) {
    const [socketWinner, setSocketWinner] = useState(false);

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socket.on(`${auct_id}-winner`, (message) => {
            console.log("lote vencedor - - - > ", message.data.winner);
            setSocketWinner(message.data.winner);
        });

        // Limpar o WebSocket quando o componente for desmontado
        return () => {
            socket.disconnect();
        };
    }, [])

    useEffect(() => { setSocketWinner(false) }, [currentProduct])

    if (socketWinner) {
        console.log("vencedor - - > ", socketWinner)
        return (
            <div className="flex flex-col w-[60%] h-full justify-center items-center text-[#282828]">
                <span className="font-bold text-[#0fa548]">{socketWinner && socketWinner.name}</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-[60%] h-full justify-center items-center text-[#282828] bg-zinc-100 overflow-hidden">

            {currentProduct.id &&
                <div className="flex absolute top-1 gap-3 bg-[#ffffff91] p-3 rounded-md backdrop-blur-[6px] shadow-lg shadow-[#12121227]">
                    <span className="font-bold">{currentProduct && currentProduct.title}</span>
                    <span className="font-bold text-[#165e80]">#{currentProduct && currentProduct.lote}</span>
                </div>
            }

            <img src={currentProduct.cover_img_url} alt=""
                className="w-full object-cover rounded-md " />
        </div>
    )
}

export default DisplayFloor;