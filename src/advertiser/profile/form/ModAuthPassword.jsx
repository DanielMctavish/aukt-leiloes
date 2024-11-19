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

    if (!authorization) {
        return null;
    }

    return (
        <div ref={refMod} className="flex flex-col justify-center items-center w-[400px] h-[240px] bg-white shadow-lg shadow-[#0e0e0e64] absolute z-30 rounded-md gap-3">

            <span onClick={handleCloseModal} className="absolute top-1 right-1 cursor-pointer">
                <CloseRounded />
            </span>
            <div className="flex w-[80%] justify-between items-center">
                <Shield />
                <span>Verificação de segurança</span>
            </div>
            <input type="password" onChange={(e) => setCurrentPassword(e.target.value)} placeholder="digite sua senha" className=" w-[80%] p-2 text-white rounded-md" />
            <button onClick={handleSubmitLogin}>autorizar</button>

        </div>
    )
}

export default ModAuthPassword;