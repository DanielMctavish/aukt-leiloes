/* eslint-disable react-hooks/exhaustive-deps */
import "./DashboardAuctControl.css"
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"
import { useNavigate } from "react-router-dom";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import AvailableAuctions from "./AvailableAuctions";
import ControllerHead from "./ControllerHead";
import ButtonsControl from "./ButtonsControl";
import DisplayFloor from "./DisplayFloor";
import BottomDisplayFloor from "./BottomDisplayFloor";
import ClientDetailModal from "./modal/ClientDetailModal";
import BidsDisplayControl from "./BidsDisplayControl";


function DashboardAuctControl() {
    const [isRunning, setIsRunning] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [timer, setTimer] = useState(0)
    const [, setAdvertiser] = useState({})
    const [auctions, setAuctions] = useState([])
    const [selectedAuction, setSelectedAuction] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(false)
    const [productsByGroup, setProductsByGroup] = useState(0)
    const [currentProduct, setCurrentProduct] = useState()
    const [isChanged, setIsChanged] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const currentSession = localStorage.getItem("advertiser-session-aukt")
        getAdminInformations()

        if (!currentSession) {
            navigate("/")
            return
        }
        if (selectedAuction.status === "paused") {
            // setIsRunning({
            //     status: true,
            //     id: selectedAuction.id
            // })
            setIsPaused(true)
        }

        const allProducts = selectedAuction.product_list
        let productCount = 0
        Array.isArray(allProducts) &&
            allProducts.forEach(product => {
                if (product.group === selectedGroup) {
                    productCount++
                    setProductsByGroup(productCount)
                }
            })

    }, [selectedAuction, isRunning, isPaused, selectedGroup, isChanged])

    const getAdminInformations = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(response => {
                //console.log("founded advertiser -> ", response.data)
                setAdvertiser(response.data)
                getAuctionsList(response.data.id)
            })
        } catch (error) {
            console.log("erro at try get admin: ", error.message)
        }

    }

    const getAuctionsList = async (creator_id) => {

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${creator_id}`)
                .then(response => {
                    //console.log("founded auctions -> ", response.data)
                    setAuctions(response.data)
                })
        } catch (error) {
            console.log("error at try get auctions list: ", error.message)
        }

    }


    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        //ouvindo mensagem de pregão ao vivo................................................................

        socket.on(`${selectedAuction.id}-playing-auction`, (message) => {
            setIsRunning(true)
            setTimer(message.data.cronTimer)
            setCurrentProduct(message.data.body.product)

        })


        return () => {
            socket.disconnect();
            setIsRunning(false)
        };

    }, [selectedAuction])



    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <ClientDetailModal />

            <AssideAdvertiser MenuSelected="menu-4" />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2">
                <NavAdvertiser />

                <div className="flex flex-col w-full h-[92%] justify-center items-center overflow-hidden gap-6">

                    <div className="flex w-[80%] h-[30%] justify-center items-center gap-3">
                        <AvailableAuctions
                            auctions={auctions}
                            setSelectedAuction={setSelectedAuction}
                            selectedAuction={selectedAuction}
                            setCurrentProduct={setCurrentProduct}
                            setTimer={setTimer} />

                        {/* Lances component....... */}
                        <BidsDisplayControl auct_id={selectedAuction.id} currentProduct={currentProduct} />

                    </div>


                    <div className="flex flex-col w-[80%] h-[47%] bg-[#E9E9E9] 
                    relative justify-start items-center rounded-md shadow-lg shadow-[#15151532]">

                        {/* controller head */}
                        <ControllerHead
                            selectedAuction={selectedAuction}
                            isRunning={isRunning}
                            isPaused={isPaused}
                            setSelectedGroup={setSelectedGroup}
                            productsByGroup={productsByGroup}
                            currentProduct={currentProduct}
                            setIsChanged={setIsChanged}
                            isChanged={isChanged}
                        />

                        <div className="flex w-[80%] h-[60%] justify-between items-center mt-[2vh] relative">

                            {selectedAuction &&
                                <ButtonsControl setIsPaused={setIsPaused}
                                    selectedAuction={selectedAuction}
                                    isRunning={isRunning}
                                    setIsRunning={setIsRunning}
                                    selectedGroup={selectedGroup}
                                    isPaused={isPaused}
                                    setIsChanged={setIsChanged}
                                    isChanged={isChanged}/>
                            }

                            {currentProduct &&
                                <DisplayFloor currentProduct={currentProduct} auct_id={selectedAuction.id} />
                            }

                        </div>

                        {selectedAuction &&
                            <BottomDisplayFloor selectedAuction={selectedAuction} timer={timer} />
                        }

                    </div>

                </div>

            </section>


        </div>
    )
}

export default DashboardAuctControl;