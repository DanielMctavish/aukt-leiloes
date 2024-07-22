/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"
import { useNavigate } from "react-router-dom";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import { getCurrentProduct } from "../../a-floor/functions/getCurrentProduct";


function DashboardAuctControl() {
    const [isRunning, setIsRunning] = useState(false)
    const [timer, setTimer] = useState(0)
    const [, setAdvertiser] = useState({})
    const [auctions, setAuctions] = useState([])
    const [selectedAuction, setSelectedAuction] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(false)
    const [currentProduct, setCurrentProduct] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        const currentSession = localStorage.getItem("advertiser-session-aukt")

        getAdminInformations()

        if (!currentSession) {
            navigate("/")
            return
        }
    }, [selectedAuction, isRunning])

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

    const handleSelectAuction = (auction) => {
        //console.log("Auction selected -> ", auction)
        setSelectedAuction(auction)
        setCurrentProduct({})
        setTimer(0)
    }

    const handleStartAuction = async () => {
        if (!selectedGroup) {
            alert("Selecione um grupo de data antes de iniciar o leilão!")
            return
        }

        try {
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/start-auct`, {}, {
                params: {
                    auct_id: selectedAuction.id,
                    group: selectedGroup
                }
            }).then(res => {
                console.log("Leilão iniciado com sucesso -> ", res.data)
            })
        } catch (error) {
            console.log("error at try start auction: ", error.message)
        }

    }

    const handleChangeTocataloged = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

        try {

            await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/auct/update-auct?auct_id=${selectedAuction.id}`, {
                status: "cataloged"
            }, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(() => {
                //console.log("Leilão alterado para cataloged com sucesso -> ", res.data)
                getAdminInformations()
                setSelectedAuction(false)
                setSelectedGroup(false)
            })

        } catch (error) {

            console.log("error at try change tocataloged: ", error.message)

        }

    }

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);

        //ouvindo mensagem de pregão ao vivo................................................................

        socket.on(selectedAuction.id, (message) => {
            setIsRunning(true)
            setTimer(message.data.cronTimer)
            // console.log("mensagem via controle: ", message.data)
            getCurrentProduct(message.data.body.current_product_id, setCurrentProduct)
            // if (message.data.body.auct_id === auct_id) {
            //     setSocketWinner(false)
            //     setSocketMessage(message)
            //     getCurrentProduct(message.data.body.current_product_id, setCurrentProduct)
            // }

        })


        //ouvindo mensagem de leilão finalizado..............................................................

        // socket.on(`${auct_id}-winner`, (message) => {
        //     console.log("lote vencedor - - - > ", message.data.body)
        //     setTimeout(() => {
        //         setSocketWinner(message)
        //     }, 1200);

        //     setTimeout(() => {
        //         setSocketWinner(false)
        //     }, 3100);

        // })

        // Limpar o WebSocket quando o componente for desmontado
        return () => {
            socket.disconnect();
            setIsRunning(false)
        };

    }, [selectedAuction])


    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-4" />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2">
                <NavAdvertiser />

                <div className="flex flex-col w-full h-[92%] justify-center items-center overflow-hidden gap-6">

                    <div className="flex flex-col w-[80%] h-[30%] justify-between items-center relative">

                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-zinc-700 text-[22px] font-bold">Leilões disponíveis</h1>
                            <input type="text" placeholder="pesquisar leilão por título"
                                className=" p-2 bg-transparent border-[1px] border-[#D3D3D3] rounded-md text-zinc-700" />
                        </div>

                        <div className="flex w-full h-[90%] justify-start items-center gap-6 p-2 overflow-x-auto">
                            {
                                Array.isArray(auctions) &&
                                auctions.map((auct, i) => {
                                    return (
                                        <div key={i}
                                            onClick={() => handleSelectAuction(auct)}
                                            className="flex w-[140px] h-[140px] justify-between items-center overflow-hidden shadow-lg shadow-[#15151589]
                                        gap-2 px-2 py-2 rounded-[12px] bg-gray-100 cursor-pointer hover:bg-gray-200 relative z-40">

                                            <img src={auct.auct_cover_img} alt="" className="object-cover w-[100%] h-[100%] absolute" />

                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>

                    <div className="flex flex-col w-[80%] h-[47%] bg-[#E9E9E9] relative justify-start items-center">

                        <div className="flex w-[80%] justify-between items-center mt-[2vh] border-b-[1px] border-zinc-300 p-2">
                            <span className="text-[#818181] text-[22px]">
                                {selectedAuction && selectedAuction.title}
                            </span>

                            {!isRunning && <div>
                                <select onChange={(e) => { setSelectedGroup(e.target.value) }} name="" id="" className="p-2 bg-white rounded-md text-zinc-600">
                                    <option value="">selecione o grupo</option>
                                    {
                                        selectedAuction &&
                                        selectedAuction.auct_dates.map((dates, i) => {
                                            return (
                                                <option key={i} value={dates.group}>{dates.group}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>}

                            <div className="flex justify-center gap-3">
                                <span className="font-bold text-[#CA1515]">
                                    {selectedAuction && selectedAuction.status}
                                </span>
                                {currentProduct && <span className="text-[#08435e] font-bold">
                                    {currentProduct.group}
                                </span>}
                            </div>

                            {
                                isRunning && selectedAuction &&
                                <button className="p-2 bg-[#213F7E] text-white rounded-md border-[1px] border-[#b8ccf7]"
                                    onClick={() => navigate(`/floor/${selectedAuction.id}`)}>
                                    pregão
                                </button>
                            }

                            {
                                !isRunning && selectedAuction.status !== "cataloged" &&
                                <button className="p-2 bg-[#213F7E] text-white rounded-md border-[1px] border-[#b8ccf7]"
                                    onClick={handleChangeTocataloged} >mandar para catálogo</button>
                            }

                        </div>

                        <div className="flex w-[80%] h-[60%] justify-between items-center mt-[2vh] relative">

                            {selectedAuction &&
                                <div className="flex w-[40%] h-full  border-r-[1px] border-zinc-300 text-zinc-600">

                                    <div className="flex flex-col w-[50%] h-full justify-around items-center">

                                        {!isRunning ?
                                            <button
                                                onClick={handleStartAuction}
                                                className="bg-[#36bd53] w-[120px] text-white rounded-md p-2 font-bold">iniciar leilão</button>
                                            :
                                            <button
                                                className="bg-[#c0c0c0] w-[120px] text-white rounded-md p-2 font-bold cursor-progress">
                                                live
                                            </button>
                                        }

                                        <button className="bg-white rounded-md p-2">pausar leilão</button>
                                        <button className="bg-white rounded-md p-2">próximo lote</button>

                                    </div>

                                    <div className="flex flex-col w-[50%] h-full justify-around items-center">

                                        <button className="bg-white rounded-md p-2">+5 segundos</button>
                                        <button className="bg-white rounded-md p-2">+15 segundos</button>
                                        <button className="bg-white rounded-md p-2">+30 segundos</button>

                                    </div>

                                </div>
                            }

                            {currentProduct && <div className="flex flex-col w-[60%] h-full justify-center items-center text-[#282828]">
                                <span>{currentProduct && currentProduct.title}</span>
                                <img src={currentProduct.cover_img_url} alt=""
                                    className="h-[80%] object-cover rounded-md" />
                            </div>}

                        </div>

                        {selectedAuction && <div className="flex w-[80%] h-[12%] justify-between 
                        items-center mt-2 border-t-[1px] border-zinc-300 relative">
                            <span className="font-bold text-[22px] absolute right-1 text-[#213F7E]">{selectedAuction.product_timer_seconds - timer}</span>
                        </div>}

                    </div>

                </div>

            </section>


        </div>
    )
}

export default DashboardAuctControl;