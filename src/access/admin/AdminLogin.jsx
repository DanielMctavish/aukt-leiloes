/* eslint-disable react-hooks/exhaustive-deps */
import { Lock } from "@mui/icons-material"
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundSocial from "../../media/backgrounds/social_bg_wall.jpg"
import auctLogo from "../../media/logos/logos-auk/logo_admin.png"

function AdminLogin() {
    const [messageDisplay, setMessageDisplay] = useState("")
    const refEmail = useRef()
    const refPassword = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const currentAdminSession = localStorage.getItem("auct-admin-session")
        if (currentAdminSession) {
            navigate("/admin")
        }
    }, [])

    const loginUser = async () => {
        if (!refEmail.current.value || !refPassword.current.value) {
            setMessageDisplay("Preencha todos os campos")
            return
        }

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/admin/login`, {
            email: refEmail.current.value,
            password: refPassword.current.value
        }).then(response => {
            const JsonString = JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id
            })

            localStorage.setItem('auct-admin-session', JsonString)
           
            setMessageDisplay("logado com sucesso! Bem vindo")
            navigate("/admin")

        }).catch(err => {
            if (err.response.status === 404) {
                setMessageDisplay("usuário não encontrado")
            } else if (err.response.status === 500) {
                setMessageDisplay("Internal server error")
            } else if (err.response.status === 401) {
                setMessageDisplay("email ou senha inválido")
            }   
            
        })
    }

    return (
        <div className="text-white w-full min-h-screen bg-[#F4F4F4] flex flex-col justify-center items-center gap-3 relative p-4 lg:p-0">
            <img src={backgroundSocial} alt=""
                className="absolute w-full h-full object-cover opacity-30 saturate-0" />

            <span className="text-zinc-600 absolute top-2 text-center">{messageDisplay}</span>

            <section className="w-full lg:w-[80%] h-auto lg:h-[90vh] flex flex-col lg:flex-row bg-[#000000cd] backdrop-blur-sm rounded-[4px] relative overflow-hidden shadow-2xl">
                <div className="flex flex-col w-full lg:w-[50%] h-auto lg:h-[100%] bg-white text-zinc-600 justify-center items-center gap-4 py-8 lg:py-0">
                    <span className="text-center px-4">Bem-vindo ao painel de administração</span>
                    <span className="text-[24px] lg:text-[33px] font-bold text-center px-4">Acesse o sistema administrativo</span>
                    <img src={auctLogo} alt="" className="w-[200px] lg:w-[300px] object-cover cursor-pointer hover:brightness-[1.1]"
                        onClick={() => navigate("/")} />
                </div>

                <div className="w-full lg:w-[50%] h-auto lg:h-[100%] flex flex-col justify-center items-center gap-6 relative py-8 lg:py-0">
                    <h1 className="text-left font-bold text-[24px] lg:text-[33px] w-[300px] flex items-center gap-2">
                        <Lock /> LOGIN ADM
                    </h1>

                    <div className="flex flex-col justify-start items-start w-[300px]">
                        <span>Email</span>
                        <input ref={refEmail} type="email" placeholder="seu email"
                            className="w-full h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start w-[300px]">
                        <span>Senha</span>
                        <input ref={refPassword} type="password"
                            className="w-full h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <button onClick={loginUser} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-black">Entrar</button>
                </div>
            </section>
        </div>
    )
}

export default AdminLogin;