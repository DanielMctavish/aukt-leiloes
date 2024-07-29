/* eslint-disable react/prop-types */
import axios from "axios"
import { Inventory2 } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

function ControllerHead({ selectedAuction, isRunning, isPaused, setSelectedGroup, productsByGroup, currentProduct, setSelectedAuction }) {

    const navigate = useNavigate()

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
                setSelectedAuction(false)
                setSelectedGroup(false)
            })

        } catch (error) {

            console.log("error at try change tocataloged: ", error.message)

        }

    }

    useEffect(() => { }, [isRunning, isPaused])

    return (
        <div className="flex w-[80%] justify-between items-center mt-[2vh] border-b-[1px] border-zinc-300 p-2">
            <span className="text-[#818181] text-[22px] flex gap-3">
                <span> {selectedAuction && selectedAuction.title}</span>
                <span className="font-bold text-[#b5b5b5]">{selectedAuction && selectedAuction.nano_id}</span>
            </span>

            {!isRunning && <div className="flex justify-center items-center gap-2">
                <select onChange={(e) => { setSelectedGroup(e.target.value) }} name="" id=""
                    className="p-2 bg-white rounded-md text-zinc-600">
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
                <div className="flex gap-2 text-[#1f1f1f]">
                    <Inventory2 />
                    {productsByGroup}
                </div>
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
    )
}

export default ControllerHead