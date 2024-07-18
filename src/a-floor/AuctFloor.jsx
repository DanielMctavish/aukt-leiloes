/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import io from "socket.io-client"
import CenterFloor from "./components/CenterFloor"
import FloorBids from "./components/FloorBids"
import FloorLots from "./components/FloorLots"
import FloorNavigation from "./components/FloorNavigation"
import backgroundFloor from "../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg"
import { useEffect, useState } from "react"
import { getCurrentProduct } from "./functions/getCurrentProduct"
// import { getAuctionInformations } from "./functions/getAuctionInformations"
import { useParams } from "react-router-dom"


function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(false)
    const [socketMessage, setSocketMessage] = useState()
    const [socketWinner, setSocketWinner] = useState(false)
    const { auct_id } = useParams()

    useEffect(() => {
        getCurrentAuction()

        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

        //ouvindo mensagem de pregão ao vivo................................................................

        socket.on('aukt-server-floor-live', (message) => {

            console.log("mensagem do pregão ao vivo1 - - - > ", message.data.body.auct_id)
            console.log("mensagem do pregão ao vivo2 - - - > ", auct_id)

            if (message.data.body.auct_id === auct_id) {
                setSocketMessage(message)
                setSocketWinner(false)
                getCurrentProduct(message.data.body.current_product_id, setCurrentProduct)
            }

        })


        //ouvindo mensagem de leilão finalizado..............................................................

        socket.on('aukt-server-floor-winner', (message) => {
            console.log("lolte vencedor - - - > ", message)
            setSocketWinner(message)

        })


    }, [])

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
            <div className="flex flex-col w-full h-[100vh] justify-center items-center bg-gradient-to-r from-[#6fe46d] to-[#00570d]">
                <span className="text-[23px]">vencedor do lote!</span>
                <h1 style={{ textShadow: "2px 2px 1px #19191969" }} className="text-[38px]">{currentProduct.title}</h1>
                <img src={currentProduct.cover_img_url} alt="" className="w-[300px] h-[300px] object-cover rounded-[22px]" />
            </div>
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
                    currentProduct={currentProduct} />
            </div>

        </div>
    )

}

export default AuctFloor