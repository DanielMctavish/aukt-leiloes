/* eslint-disable react/prop-types */
import { CloseRounded, Shield } from "@mui/icons-material";
import { useState } from "react";

function ModChangePassword({ authorization, set, setPassword, setConfirmPassword, setPassReady }) {
    const [password, setCurrentPassword] = useState()
    const [confirmPassword, setConfirmCurrentPassword] = useState()

    const handleCloseModal = () => {
        set(false)
    }

    const handleChangePassword = async () => {
        if (password === confirmPassword) {

            setPassword(password)
            setConfirmPassword(confirmPassword)
            setPassReady(true)
            set(false)

        }

    }

    if (!authorization) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[400px] p-6 transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className="text-[#012038] text-2xl" />
                        <h2 className="text-xl font-semibold text-[#012038]">
                            Criar Nova Senha
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
                            Nova senha
                        </label>
                        <input 
                            type="password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                                focus:ring-[#012038] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirme a nova senha
                        </label>
                        <input 
                            type="password"
                            onChange={(e) => setConfirmCurrentPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                                focus:ring-[#012038] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={handleChangePassword}
                        className="w-full py-3 bg-[#012038] text-white rounded-lg hover:bg-[#012038]/90 
                            transition-colors flex items-center justify-center gap-2"
                    >
                        <Shield className="text-sm" />
                        Alterar Senha
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModChangePassword;