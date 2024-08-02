/* eslint-disable react/prop-types */
import axios from "axios"
import { PauseCircleFilledOutlined, SkipNext, WatchLater } from "@mui/icons-material"

function ButtonsControl({ setIsPaused, selectedAuction, isRunning, setIsRunning, selectedGroup, isPaused, setIsChanged, isChanged}) {

    const handleStartAuction = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        setIsPaused(false)

        if (!selectedGroup) {
            alert("Selecione um grupo de data antes de iniciar o leilão!")
            return
        }

        setIsRunning({
            status: true,
            id: selectedAuction.id
        })

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/start-auct`, {
                params: {
                    auct_id: selectedAuction.id,
                    group: selectedGroup
                },
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(res => {
                console.log("Leilão iniciado com sucesso -> ", res.data)
                setIsChanged(!isChanged)
            })
        } catch (error) {
            console.log("error at try start auction: ", error.message)
        }

    }

    const handlePauseAuct = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        setIsPaused(true)
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/pause-product-time`, {
                params: {
                    auct_id: selectedAuction.id,
                },
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(res => {
                console.log("Leilão pausado com sucesso -> ", res.data)
            })
        } catch (error) {
            console.log("error at try pause auction: ", error.message)
        }
    }

    const handleResumeAuct = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        setIsPaused(false)
        setIsRunning({
            status: true,
            id: selectedAuction.id
        })
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/resume-floor`, {
                params: {
                    auct_id: selectedAuction.id,
                },
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(res => {
                console.log("continue... -> ", res.data)
            })
        } catch (error) {
            console.log("error at try continue auction: ", error.message)
        }
    }

    const handleNextProduct = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/next-product`, {
                params: {
                    auct_id: selectedAuction.id,
                },
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(res => {
                console.log("next... -> ", res.data)
                setIsPaused(false)
            })
        } catch (error) {
            console.log("error at try step product: ", error.message)
        }
    }

    const handleAddSeconds = async (add) => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/change-product-time`, {
                params: {
                    auct_id: selectedAuction.id,
                    time: add
                },
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(res => {
                console.log("continue... -> ", res.data)
            })
        } catch (error) {
            console.log("error at try continue auction: ", error.message)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-[40%] h-full  border-r-[1px] border-zinc-300 text-zinc-600">

            {selectedAuction.status === "cataloged" || selectedAuction.status === "live" ?
                <div className="flex  w-full h-full justify-around items-center bg-[#e2e2e2] gap-1 p-1">

                    {!isRunning ?
                        !isPaused &&
                        <button
                            onClick={handleStartAuction}
                            className="bg-[#36bd53] flex-1 h-full text-white rounded-md p-2 font-bold">iniciar leilão</button>
                        :
                        <button
                            className="bg-[#c0c0c0] flex-1 h-full text-white rounded-md p-2 font-bold cursor-progress">
                            live
                        </button>
                    }

                    {!isPaused ?
                        <button onClick={handlePauseAuct} className="bg-white rounded-md p-2 flex-1 h-full">
                            <PauseCircleFilledOutlined sx={{ fontSize: "60px" }} />
                        </button> :
                        <button onClick={handleResumeAuct}
                            className="bg-[#213F7E] w-[120px] text-white rounded-md p-2 font-bold flex-1 h-full">
                            continuar...
                        </button>
                    }

                    <button onClick={handleNextProduct} className="bg-white rounded-md p-2 flex-1 h-full">
                        <SkipNext sx={{ fontSize: "60px" }} />
                    </button>

                </div> : ""
            }

            {selectedAuction.status === "cataloged" || selectedAuction.status === "live" ?
                <div className="flex w-full h-full justify-around items-center gap-1 bg-[#d0d0d0]">

                    {!isPaused &&
                        <div className="flex flex-col w-full h-full p-1 gap-1">
                            <div className="flex w-full h-[50%] gap-1">
                                <button onClick={() => handleAddSeconds(5)} className="bg-white flex-1 rounded-md p-2 text-[12px] gap-2 hover:bg-[#ffffffa4]">
                                    +5 <WatchLater />
                                </button>
                                <button onClick={() => handleAddSeconds(15)} className="bg-white flex-1 rounded-md p-2 text-[12px] gap-2 hover:bg-[#ffffffa4]">
                                    +15 <WatchLater />
                                </button>
                                <button onClick={() => handleAddSeconds(30)} className="bg-white flex-1 rounded-md p-2 text-[12px] gap-2 hover:bg-[#ffffffa4]">
                                    +30 <WatchLater />
                                </button>
                            </div>
                            <div className="flex w-full h-[50%] gap-1">
                                <button onClick={() => handleAddSeconds(60)} className="bg-white flex-1 rounded-md p-2 text-[12px] gap-2 hover:bg-[#ffffffa4]">
                                    +60 <WatchLater />
                                </button>
                                <button onClick={() => handleAddSeconds(120)} className="bg-white flex-1 rounded-md p-2 text-[12px] gap-2 hover:bg-[#ffffffa4]">
                                    +120 <WatchLater />
                                </button>
                                <button onClick={() => handleAddSeconds(240)} className="bg-white flex-1 rounded-md p-2 text-[12px] gap-2 hover:bg-[#ffffffa4]">
                                    +240 <WatchLater />
                                </button>
                            </div>
                        </div>
                    }

                </div> : ""
            }

        </div>
    )
}

export default ButtonsControl;