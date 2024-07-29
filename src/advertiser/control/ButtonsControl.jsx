/* eslint-disable react/prop-types */
import axios from "axios"

function ButtonsControl({ setIsPaused, selectedAuction, isRunning, setIsRunning, selectedGroup, isPaused }) {

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

            <div className="flex  w-full h-full justify-around items-center bg-pink-400">

                {!isRunning ?
                    !isPaused &&
                    <button
                        onClick={handleStartAuction}
                        className="bg-[#36bd53] w-[120px] text-white rounded-md p-2 font-bold">iniciar leilão</button>
                    :
                    <button
                        className="bg-[#c0c0c0] w-[120px] text-white rounded-md p-2 font-bold cursor-progress">
                        live
                    </button>
                }

                {!isPaused ?
                    <button onClick={handlePauseAuct} className="bg-white rounded-md p-2">
                        pausar leilão
                    </button> :
                    <button onClick={handleResumeAuct}
                        className="bg-[#213F7E] w-[120px] text-white rounded-md p-2 font-bold">
                        continuar...
                    </button>
                }

                <button onClick={handleNextProduct} className="bg-white rounded-md p-2">
                    próximo lote
                </button>

            </div>

            <div className="flex w-full h-full justify-around items-center gap-1 bg-purple-300">

                {!isPaused &&
                    <>
                        <button onClick={() => handleAddSeconds(5)} className="bg-white flex-1 rounded-md p-2 text-[12px]">+5 </button>
                        <button onClick={() => handleAddSeconds(15)} className="bg-white flex-1 rounded-md p-2 text-[12px]">+15 </button>
                        <button onClick={() => handleAddSeconds(30)} className="bg-white flex-1 rounded-md p-2 text-[12px]">+30 </button>
                    </>
                }

            </div>

        </div>
    )
}

export default ButtonsControl;