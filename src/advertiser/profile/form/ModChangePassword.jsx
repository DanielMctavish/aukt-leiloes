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
        <div className="flex flex-col justify-center items-center w-[400px] h-[240px] bg-white shadow-lg shadow-[#0e0e0e64] absolute z-30 rounded-md gap-3">

            <span onClick={handleCloseModal} className="absolute top-1 right-1 cursor-pointer">
                <CloseRounded />
            </span>
            <div className="flex w-[80%] justify-between items-center">
                <Shield />
                <span>Criar Nova Senha</span>
            </div>

            <input type="password" onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="crie sua senha" className=" w-[80%] p-2 text-white rounded-md" />
            <input type="password" onChange={(e) => setConfirmCurrentPassword(e.target.value)}
                placeholder="confirme sua senha" className=" w-[80%] p-2 text-white rounded-md" />

            <button onClick={handleChangePassword}>mudar senha</button>

        </div>
    )
}

export default ModChangePassword;