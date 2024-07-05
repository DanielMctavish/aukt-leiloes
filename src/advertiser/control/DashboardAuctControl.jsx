/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";


function DashboardAuctControl() {
    const [, setAdvertiser] = useState({})
    const [auctions, setAuctions] = useState([])
    const [selectedAuction, setSelectedAuction] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const currentSession = localStorage.getItem("advertiser-session-aukt")

        getAdminInformations()

        if (!currentSession) {
            navigate("/")
            return
        }
    }, [selectedAuction])

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

                            <div>
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
                            </div>

                            <span className="font-bold text-[#CA1515]">
                                {selectedAuction && selectedAuction.status}
                            </span>
                        </div>

                        <div className="flex w-[80%] h-[60%] justify-between items-center mt-[2vh] relative">

                            {selectedAuction &&
                                <div className="flex w-[40%] h-full  border-r-[1px] border-zinc-300 text-zinc-600">

                                    <div className="flex flex-col w-[50%] h-full justify-around items-center">
                                        <button
                                            onClick={handleStartAuction}
                                            className="bg-[#36bd53] text-white rounded-md p-2 font-bold">iniciar leilão</button>
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

                            <div className="flex w-[60%] h-full ">

                            </div>

                        </div>

                        <div className="flex w-[80%] h-[12%] justify-between 
                        items-center mt-2 border-t-[1px] border-zinc-300 relative">
                            <span className="font-bold text-[22px] absolute right-1 text-[#213F7E]">00:00</span>
                        </div>

                    </div>

                </div>

            </section>


        </div>
    )
}

export default DashboardAuctControl;