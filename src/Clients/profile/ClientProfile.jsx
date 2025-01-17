/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { getClientInformations } from "../functions/getClientInformations";
import { useNavigate } from "react-router-dom";

//avatares import
import avatar_01 from "../../media/avatar-floor/avatar_01.png";
import avatar_02 from "../../media/avatar-floor/avatar_02.png";
import avatar_03 from "../../media/avatar-floor/avatar_03.png";
import avatar_04 from "../../media/avatar-floor/avatar_04.png";
import avatar_05 from "../../media/avatar-floor/avatar_05.png";
import avatar_06 from "../../media/avatar-floor/avatar_06.png";
import avatar_07 from "../../media/avatar-floor/avatar_07.png";
import avatar_08 from "../../media/avatar-floor/avatar_08.png";
import avatar_09 from "../../media/avatar-floor/Avatar_09.png";
import avatar_10 from "../../media/avatar-floor/Avatar_10.png";
import avatar_11 from "../../media/avatar-floor/Avatar_11.png";
import avatar_12 from "../../media/avatar-floor/Avatar_12.png";
import avatar_13 from "../../media/avatar-floor/Avatar_13.png";
import avatar_14 from "../../media/avatar-floor/Avatar_14.png";
import avatar_15 from "../../media/avatar-floor/Avatar_15.png";
import avatar_16 from "../../media/avatar-floor/Avatar_16.png";
import avatar_17 from "../../media/avatar-floor/Avatar_17.png";
import avatar_18 from "../../media/avatar-floor/Avatar_18.png";
import avatar_19 from "../../media/avatar-floor/Avatar_19.png";
import avatar_20 from "../../media/avatar-floor/Avatar_20.png";
import avatar_21 from "../../media/avatar-floor/Avatar_21.png";
import avatar_22 from "../../media/avatar-floor/Avatar_22.png";
import avatar_23 from "../../media/avatar-floor/Avatar_23.png";
import avatar_24 from "../../media/avatar-floor/Avatar_24.png";
import avatar_25 from "../../media/avatar-floor/Avatar_25.png";
import avatar_26 from "../../media/avatar-floor/Avatar_26.png";
import avatar_27 from "../../media/avatar-floor/Avatar_27.png";
import avatar_28 from "../../media/avatar-floor/Avatar_28.png";
import avatar_29 from "../../media/avatar-floor/Avatar_29.png";
import avatar_30 from "../../media/avatar-floor/Avatar_30.png";
import avatar_31 from "../../media/avatar-floor/Avatar_31.png";
import avatar_32 from "../../media/avatar-floor/Avatar_32.png";
import avatar_33 from "../../media/avatar-floor/Avatar_33.png";
import avatar_34 from "../../media/avatar-floor/Avatar_34.png";
import avatar_35 from "../../media/avatar-floor/Avatar_35.png";
import avatar_36 from "../../media/avatar-floor/Avatar_36.png";
import avatar_37 from "../../media/avatar-floor/Avatar_37.png";
import avatar_38 from "../../media/avatar-floor/Avatar_38.png";
import avatar_39 from "../../media/avatar-floor/Avatar_39.png";
import avatar_40 from "../../media/avatar-floor/Avatar_40.png";
import avatar_41 from "../../media/avatar-floor/Avatar_41.png";
import avatar_42 from "../../media/avatar-floor/Avatar_42.png";
import avatar_43 from "../../media/avatar-floor/Avatar_43.png";
import avatar_44 from "../../media/avatar-floor/Avatar_44.png";
import avatar_45 from "../../media/avatar-floor/Avatar_45.png";
import avatar_46 from "../../media/avatar-floor/Avatar_46.png";
import avatar_47 from "../../media/avatar-floor/Avatar_47.png";
import avatar_48 from "../../media/avatar-floor/Avatar_48.png";
import avatar_49 from "../../media/avatar-floor/Avatar_49.png";
import avatar_50 from "../../media/avatar-floor/Avatar_50.png";
import avatar_51 from "../../media/avatar-floor/Avatar_51.png";
import avatar_52 from "../../media/avatar-floor/Avatar_52.png";
import avatar_53 from "../../media/avatar-floor/Avatar_53.png";
import avatar_54 from "../../media/avatar-floor/Avatar_54.png";
import avatar_55 from "../../media/avatar-floor/Avatar_55.png";
import avatar_56 from "../../media/avatar-floor/Avatar_56.png";
import avatar_57 from "../../media/avatar-floor/Avatar_57.png";
import avatar_58 from "../../media/avatar-floor/Avatar_58.png";

const avatares_pessoas = [
    avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08,
    avatar_09, avatar_10, avatar_11, avatar_12, avatar_13, avatar_14, avatar_15, avatar_16,
    avatar_17, avatar_18, avatar_19, avatar_20, avatar_21, avatar_22, avatar_23, avatar_24,
    avatar_25, avatar_26, avatar_27, avatar_28, avatar_29, avatar_30, avatar_31, avatar_32,
    avatar_33, avatar_34, avatar_35, avatar_36, avatar_37, avatar_38, avatar_39, avatar_40,
    avatar_41, avatar_42, avatar_43, avatar_44, avatar_45, avatar_46, avatar_47, avatar_48,
    avatar_49, avatar_50, avatar_51, avatar_52, avatar_53, avatar_54, avatar_55, avatar_56,
    avatar_57, avatar_58
];

function ClientProfile() {
    const [isLoading, setIsloading] = useState(false)
    const [name, setName] = useState("")
    const [nickname, setNickname] = useState("")
    const [clientAvatar, setClientAvatar] = useState(0)
    const [currentClient, setCurrentClient] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        getClientInformations(navigate, null, setCurrentClient, null, null, null, null)
    }, [])

    useEffect(() => {
        if (currentClient) {
            setName(currentClient.name || "")
            setNickname(currentClient.nickname || "")
            setClientAvatar(currentClient.client_avatar || 0)
        }
    }, [currentClient])

    const handleEditAccount = async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        setIsloading(true)
        try {
            await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/client/update-client?client_id=${currentClient.id}`, {
                name: name ? name : undefined,
                nickname: nickname ? nickname : undefined,
                client_avatar: clientAvatar ? clientAvatar : undefined
            }, {
                headers: {
                    Authorization: `Bearer ${currentSession.token}`
                }
            }).then(() => {
                setIsloading(false)
                navigate("/client/dashboard")
            })
        } catch (error) {
            setIsloading(false)
        }

    }

    return (
        <div className="w-full h-screen bg-gradient-to-br from-[#f8f8f8] to-[#e8e8e8] flex">
            <AssideClient MenuSelected="menu-6" />
            
            <section className="flex-1 h-screen flex flex-col gap-4 p-4 overflow-y-auto">
                <div className="z-[10]">
                    <NavClient currentClient={currentClient} />
                </div>

                {!isLoading ? (
                    <>
                        {/* Cards de Edição */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Card de Informações Pessoais */}
                            <div className="bg-[#001324] rounded-2xl shadow-lg p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-bl-full" />
                                
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Informações Pessoais
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-1 block">
                                            Nome Completo
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-700 
                                                bg-[#001324] text-white
                                                focus:ring-2 focus:ring-green-500 focus:border-transparent
                                                transition-all duration-300"
                                            placeholder="Seu nome completo"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-1 block">
                                            Apelido no Pregão
                                        </label>
                                        <input
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-700 
                                                bg-[#001324] text-white
                                                focus:ring-2 focus:ring-green-500 focus:border-transparent
                                                transition-all duration-300"
                                            placeholder="Seu apelido"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card de Seleção de Avatar */}
                            <div className="bg-[#001324] rounded-2xl shadow-lg p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-bl-full" />
                                
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Seu Avatar
                                </h2>

                                <div className="flex flex-wrap gap-4 max-h-[400px] overflow-y-auto p-4
                                    scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                    {avatares_pessoas.map((avatar, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setClientAvatar(i)}
                                            className={`
                                                relative group cursor-pointer
                                                transition-all duration-500 ease-out
                                                ${clientAvatar === i 
                                                    ? 'ring-4 ring-green-500 scale-110 rotate-3 z-10' 
                                                    : 'ring-2 ring-gray-700 hover:ring-green-400'
                                                }
                                                rounded-xl overflow-hidden
                                                hover:shadow-xl hover:shadow-green-500/20
                                                hover:scale-110 hover:rotate-3
                                                active:scale-95 active:rotate-0
                                            `}
                                        >
                                            <img
                                                src={avatar}
                                                alt={`Avatar ${i + 1}`}
                                                className="w-16 h-16 object-cover"
                                            />
                                            
                                            <div className={`
                                                absolute inset-0 flex items-center justify-center
                                                transition-all duration-300
                                                ${clientAvatar === i 
                                                    ? 'bg-green-500/20' 
                                                    : 'bg-black/0 group-hover:bg-green-500/10'
                                                }
                                            `}>
                                                {clientAvatar === i && (
                                                    <div className="bg-green-500 text-white p-1.5 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Botão de Salvar */}
                        <button
                            onClick={handleEditAccount}
                            className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 
                                text-white rounded-xl shadow-lg shadow-green-500/20
                                hover:shadow-xl hover:shadow-green-500/30 hover:scale-105
                                active:scale-95 transition-all duration-300
                                disabled:opacity-50 disabled:cursor-not-allowed
                                w-full max-w-md mx-auto"
                            disabled={isLoading}
                        >
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
                    </div>
                )}
            </section>
        </div>
    );
}

export default ClientProfile;