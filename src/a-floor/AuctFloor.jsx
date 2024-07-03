/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import CenterFloor from "./components/CenterFloor"
import FloorBids from "./components/FloorBids"
import FloorLots from "./components/FloorLots"
import FloorNavigation from "./components/FloorNavigation"
import backgroundFloor from "../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg"
import { useEffect, useState } from "react"
import io from "socket.io-client"


function AuctFloor() {
    const [currentAuct, setCurrentAuct] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(false)
    const [socketMessage, setSocketMessage] = useState()

    useEffect(() => {

        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socket.on('aukt-server-floor-live', (message) => {

            //console.log("conectado ao socket com sucesso -> ", message)
            setSocketMessage(message)

            if (!currentAuct) {
                getAuctionInformations(message.data.body.auct_id)
                getCurrentProduct(message.data.body.current_product_id)
            }

        })

        return () => {
            socket.off('aukt-server-floor-live')
        }

    }, [])

    //Get Auct.............................................................................................
    const getAuctionInformations = async (auct_id) => {

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auct_id}`)
            .then(async response => {

                setCurrentAuct(response.data)

            }).catch(err => {
                console.log('err get auct >>', err.message)
            })

    }

    //Get Product ...........................................................................................

    const getCurrentProduct = async (product_id) => {

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
            .then(async response => {
                setCurrentProduct(response.data)
            }).catch(err => {
                console.log('err get product >>', err.message)
            })

    }

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-hidden p-[2vh] gap-[2vh]">

            <img src={backgroundFloor} alt="" className="flex absolute top-0  h-full w-[100%]  object-cover z-[1]" />
            <FloorNavigation auction={currentAuct} group={currentProduct.group} />

            <div className="flex lg:flex-row flex-col w-full h-full justify-between items-center gap-[2vh] z-[2] overflow-y-auto">

                <section className="lg:w-[70%] w-[99%] lg:h-[80vh] flex flex-col justify-between items-center relative gap-[2vh]">

                    <CenterFloor title={currentProduct.title}
                        cover={currentProduct.cover_img_url}
                        description={currentProduct.description} />
                    <FloorLots products={currentAuct.product_list} currentProduct={currentProduct} />

                </section>

                <FloorBids timer={socketMessage ? socketMessage.data.cronTimer : 0}
                    duration={currentAuct.product_timer_seconds}
                    auct_id={currentAuct.id}
                    initial_value={currentProduct.initial_value} />
            </div>

        </div>
    )

}

export default AuctFloor