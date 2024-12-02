/* eslint-disable react/prop-types */
import axios from "axios"
import { Shield, CloseRounded } from "@mui/icons-material"
import { useRef, useState } from "react";


function ModAuthPassword({ authorization, set, setPassword, setConfirmPassword, setChangeAuthorized }) {
    const [password, setCurrentPassword] = useState()
    const refMod = useRef()

    const handleCloseModal = () => {
        set(false)
    }

    const handleSubmitLogin = async () => {
        const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'));

        try {
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/login`, {
                email: currentLocalAdvertiser.email,
                password: password
            }).then(response => {
                setPassword(response.data.password)
                setConfirmPassword(response.data.password)
                setChangeAuthorized(true)
                set(false)
            })

        } catch (error) {
            return error
        }
    }

    if (!authorization) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[400px] p-6 transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className="text-[#012038] text-2xl" />
                        <h2 className="text-xl font-semibold text-[#012038]">
                            Verificação de Segurança
                        </h2>
                    </div>
                    <button 
                        onClick={() => set(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <CloseRounded />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Digite sua senha atual
                        </label>
                        <input 
                            type="password" 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                                focus:ring-[#012038] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={handleSubmitLogin}
                        className="w-full py-3 bg-[#012038] text-white rounded-lg hover:bg-[#012038]/90 
                            transition-colors flex items-center justify-center gap-2"
                    >
                        <Shield className="text-sm" />
                        Autorizar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModAuthPassword;