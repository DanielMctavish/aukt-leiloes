/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import { useSelector } from "react-redux";
import {Timelapse} from "@mui/icons-material"
import axios from "axios"
import dayjs from "dayjs"
import "./StyleAuctDetails.css"

function AdvertiserAuctDetails() {
    const [currentAuct, setCurrentAuct] = useState('01010101010101')
    const state = useSelector(state => state)

    useEffect(() => {
        getCurrentAuctById()
    }, [state.selectedAuct])

    const getCurrentAuctById = async () => {

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${state.selectedAuct}`)
            .then(response => {
                setCurrentAuct(response.data)
            }).catch(err => {
                console.log('err get auct >>', err.response)
            })

    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-3" />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
                <NavAdvertiser />

                <div className="w-full h-[100vh] relative
               flex flex-col justify-start items-center bg-[#091925]">
                    {/* CAPA DO LEILÃO */}
                    <div className="w-full h-[30vh] flex bg-white relative overflow-hidden justify-center items-center">
                        <img src={currentAuct.auct_cover_img} alt="auct-cover" className="object-cover cover-auct-image" />
                        <h1 style={{ textShadow: "2px 2px 12px black" }} className="absolute text-[30px] font-bold">{currentAuct.nano_id}</h1>
                    </div>
                    {/* TÍTULO DO LEILÃO */}
                    <div className="w-full h-[6vh] flex justify-start items-center p-6">
                        <h1 className="text-[30px] font-light" style={{ letterSpacing: "6px" }}>{currentAuct.title}</h1>
                    </div>
                    {/* SESSÕES */}
                    
                    <div className="w-[97%] h-[10vh] flex justify-center items-center gap-3 bg-white rounded-lg">
                        {currentAuct.auct_dates ?
                            currentAuct.auct_dates.map((date, index) => (
                                <div key={index} className="text-zinc-700 font-bold flex gap-3 bg-zinc-100 p-2 rounded-md shadow-md shadow-[#0e0e0e33]">
                                    <Timelapse/>
                                    {dayjs(date).format('DD/MM/YYYY - HH:mm')}
                                </div>
                            )) : ''
                        }
                    </div>

                </div>

            </section>


        </div>
    )
}

export default AdvertiserAuctDetails;