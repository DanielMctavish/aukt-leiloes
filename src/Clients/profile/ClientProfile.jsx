/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { getClientInformations } from "../functions/getClientInformations";
import { useNavigate } from "react-router-dom";

//avatares import
const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

const avatares_pessoas = importAllAvatars()

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