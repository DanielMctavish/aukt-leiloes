/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"

import backgroundSocial from "../../media/backgrounds/social_bg_wall.jpg"
import auctLogo from "../../media/logos/logos-auk/aukt_blue.png"

function AdvertiserLogin() {
    const [messageDisplay, setMessageDisplay] = useState("")
    const refEmail = useRef()
    const refPassword = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        if (currentLocalAdvertiser) {
            navigate('/advertiser/dashboard')
        }
    }, [])

    const handeAdvertiserLogin = async () => {
        const email = refEmail.current.value
        const password = refPassword.current.value

        if (!email) {
            setMessageDisplay("Preencha o email")
            return
        }

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/login`, {
            email: email,
            password: password
        }).then(res => {

            console.log("resposta login advertiser --> ", res)
            setMessageDisplay("logado com sucesso!")

            const currentAdvertiser = {
                name: res.data.user.name,
                CPF: res.data.user.CPF,
                nickname: res.data.user.nickname,
                email: res.data.user.email,
                url_profile_cover: res.data.user.url_profile_cover,
                token: res.data.token
            }

            localStorage.setItem("advertiser-session-aukt", JSON.stringify(currentAdvertiser))
            navigate("/advertiser/dashboard")

        }).catch(err => {
            console.log("erro login advertiser --> ", err.response.status)
            if (err.response.status === 401 || err.response.status === 404) {
                setMessageDisplay("Usuário ou senha inválidos")
            } else {
                setMessageDisplay("Erro ao conectar com o servidor")
            }
        })

    }

    return (

        <div className="text-white w-full h-[100vh] bg-[#F4F4F4] flex flex-col justify-center items-center gap-3 relative">
            <img src={backgroundSocial} alt="" className="absolute w-full h-full object-cover opacity-30 saturate-0" />

            <span className="text-zinc-600">{messageDisplay}</span>

            <section className="w-[80%] h-[90vh] flex bg-[#012038cd] backdrop-blur-sm rounded-[4px] relative overflow-hidden shadow-2xl">

                <div className="flex flex-col w-[50%] h-[100%] bg-white text-zinc-600 justify-center items-center gap-4">
                    <span>Bem vindo! Que bom que deu tudo certo.</span>
                    <span className="text-[33px] font-bold">Prepare-se para criar seus leilões</span>
                    <img src={auctLogo} alt="" className="w-[300px]" />
                </div>

                <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                    <h1 className="text-left font-bold text-[33px] w-[300px]">BEM VINDO!</h1>

                    <div className="flex flex-col justify-start items-start">
                        <span>email</span>
                        <input ref={refEmail} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>senha</span>
                        <input ref={refPassword} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <button onClick={handeAdvertiserLogin} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#012038]">entrar</button>
                    <button onClick={() => navigate("/advertiser/register")}>não tem uma conta? Registre-se</button>
                </div>
            </section>

        </div>
    )
}

export default AdvertiserLogin