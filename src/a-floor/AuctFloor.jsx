/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import io from "socket.io-client"
import { useSelector } from "react-redux";
import CenterFloor from "./components/CenterFloor"
import FloorBids from "./components/FloorBids"
import FloorLots from "./components/FloorLots"
import FloorNavigation from "./components/FloorNavigation"
import backgroundFloor from "../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg"
import { useEffect, useState } from "react"
import { getCurrentProduct } from "./functions/getCurrentProduct"
// import { getAuctionInformations } from "./functions/getAuctionInformations"
import { useParams } from "react-router-dom"
import WinnerScreen from "./winner/WinnerScreen"


function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(false)
    const [socketMessage, setSocketMessage] = useState()
    const [socketWinner, setSocketWinner] = useState(false)
    const { auct_id } = useParams()
    const state = useSelector(state => state.bidLive)

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        getCurrentAuction()

        //ouvindo mensagem de pregão ao vivo................................................................

        socket.on(auct_id.toString(), (message) => {

            if (message.data.body.auct_id === auct_id) {
                setSocketWinner(false)
                setSocketMessage(message)
                getCurrentProduct(message.data.body.current_product_id, setCurrentProduct)
            }

        })


        //ouvindo mensagem de leilão finalizado..............................................................

        socket.on(`${auct_id}-winner`, (message) => {
            console.log("lote vencedor - - - > ", message.data.body)
            setTimeout(() => {
                setSocketWinner(message)
            }, 1200);

            setTimeout(() => {
                setSocketWinner(false)
            }, 3100);

        })

    }, [state])

    useEffect(() => { }, [currentProduct, currentAuct, socketWinner, socketMessage])

    const getCurrentAuction = async () => {

        try {

            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auct_id}`)
                .then((response) => {
                    setCurrentAuct(response.data)
                })

        } catch (error) {
            console.log("error at try get auction: ", error.message)

        }

    }

    if (socketWinner) {
        return (
            <WinnerScreen currentProduct={currentProduct} currentAuct={currentAuct} />
        )
    }

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-hidden p-[2vh] gap-[2vh]">

            <img src={backgroundFloor} alt="" className="flex absolute top-0  h-full w-[100%]  object-cover z-[1]" />
            <FloorNavigation auction={currentAuct} group={currentProduct.group} />

            <div className="flex lg:flex-row flex-col w-full h-full justify-between items-center gap-[2vh] z-[2] overflow-y-auto">

                <section className="lg:w-[70%] w-[99%] lg:h-[80vh] flex flex-col justify-between items-center relative gap-[2vh]">

                    <CenterFloor title={currentProduct.title}
                        cover={currentProduct.cover_img_url}
                        description={currentProduct.description}
                        auction={currentAuct} />
                    <FloorLots products={currentAuct.product_list}
                        currentProduct={currentProduct} />

                </section>

                <FloorBids timer={socketMessage ? socketMessage.data.cronTimer : 0}
                    duration={currentAuct.product_timer_seconds}
                    auct_id={currentAuct.id}
                    initial_value={currentProduct.initial_value}
                    currentProduct={currentProduct}
                />
            </div>

        </div>
    )

}

export default AuctFloor