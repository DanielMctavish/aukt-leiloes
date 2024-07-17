/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { getClientInformations } from "../functions/getClientInformations";
import { useNavigate } from "react-router-dom";

//avatares import
import avatar_01 from "../../media/avatar-floor/avatar_01.png"
import avatar_02 from "../../media/avatar-floor/avatar_02.png"
import avatar_03 from "../../media/avatar-floor/avatar_03.png"
import avatar_04 from "../../media/avatar-floor/avatar_04.png"
import avatar_05 from "../../media/avatar-floor/avatar_05.png"
import avatar_06 from "../../media/avatar-floor/avatar_06.png"
import avatar_07 from "../../media/avatar-floor/avatar_07.png"
import avatar_08 from "../../media/avatar-floor/avatar_08.png"

const avatares_pessoas = [avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08]

function ClientProfile() {
    const [clientAvatar, setClientAvatar] = useState(0)
    const [currentClient, setCurrentClient] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        getClientInformations(navigate, null, setCurrentClient, null, null, null, null)
    }, [])

    useEffect(() => { console.log("observando cliente: ", currentClient) }, [currentClient])

    const handleSelectedAvatar = (i) => {
        setClientAvatar(i)
    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

                <AssideClient MenuSelected="menu-6" />

                <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 text-zinc-600">

                    <NavClient currentClient={currentClient} />

                    <section className="flex lg:flex-row flex-col justify-center items-center w-full h-[70vh] p-3 gap-3">

                        <div className="flex lg:w-[50%] w-full h-[100%] flex-col justify-center relative
                        items-center bg-white p-3 rounded-md shadow-lg shadow-[#0505052d]">
                            <span className="absolute top-1 text-[33px] font-bold">1º</span>
                            <h1 className="text-left font-bold text-[23px] absolute top-[6vh]">mudar nome e apelido</h1>

                            <div className="flex flex-col">
                                <span>nome</span>
                                <input type="text" className="flex w-[300px] h-[40px] border-[1px] bg-transparent border-[#d4d4d4] rounded-md p-2" />
                            </div>

                            <div className="flex flex-col">
                                <span>nickname</span>
                                <input type="text" className="flex w-[300px] h-[40px] border-[1px] bg-transparent border-[#d4d4d4] rounded-md p-2" />
                            </div>

                        </div>

                        <div className="flex lg:w-[50%] w-full h-[100%] flex-col justify-center  relative
                        items-center bg-white p-3 rounded-md shadow-lg shadow-[#0505052d]">
                            <span className="absolute top-1 text-[33px] font-bold">2º</span>
                            <h1 className="text-left font-bold text-[23px] absolute top-[6vh]">mudar avatar de pregão</h1>
                            <div className="flex flex-wrap  w-[70%] max-h-[60vh] justify-center items-center gap-2 p-2 overflow-x-auto">
                                {
                                    avatares_pessoas.map(
                                        (avatar, i) => {
                                            if (i === clientAvatar) {
                                                return (
                                                    <img src={avatar} alt=""
                                                        key={i}
                                                        onClick={() => handleSelectedAvatar(i)}
                                                        className="w-[100px] h-[100px] object-cover rounded-full transition-all duration-[1s]
                                                        cursor-pointer border-[3px] border-zinc-600" />
                                                )
                                            } else {
                                                return (
                                                    <img src={avatar} alt=""
                                                        key={i}
                                                        onClick={() => handleSelectedAvatar(i)}
                                                        className="w-[70px] h-[70px] object-cover brightness-90
                                                        rounded-full cursor-pointer transition-all duration-[.3s]" />
                                                )
                                            }

                                        }
                                    )
                                }
                            </div>
                        </div>

                    </section>
                    <button className="bg-white w-[300px] h-[40px] 
                    hover:w-[98%] hover:h-[60px] transition-all duration-[1s]
                    hover:bg-gradient-to-r from-[#136f49] to-[#5ee8af]
                    hover:text-white hover:font-bold
                    rounded-md shadow-lg shadow-[#0505052d]">Mudar minhas informações</button>

                </section>

            </div>

        </div>
    )
}

export default ClientProfile;