/* eslint-disable react/prop-types */
import axios from "axios"
import { Close } from "@mui/icons-material"
import { useEffect, useState } from "react"


function LoginClientModal({ setIsModalOn, modalOn }) {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleLoginClient = async () => {

        try {
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email: email,
                password: password
            }).then(response => {

                console.log("logado com sucesso --> ", response.data)

                localStorage.setItem("client-auk-session-login", JSON.stringify({
                    token: response.data.token,
                    email: response.data.user.email,
                    name: response.data.user.name,
                    id: response.data.user.id,
                }))
            })

            setIsModalOn(false)
        } catch (error) {
            setIsModalOn(false)
            console.log("Error ao logar cliente -> ", error.message)
        }

    }

    useEffect(() => {

    }, [modalOn])

    return (
        <div className={
            `${modalOn ? 'flex' : 'hidden'} flex-col w-[80%] h-[80vh] bg-gradient-to-r from-[#92ffb8] to-[#003026] 
            shadow-lg shadow-[#0f0f0f39] rounded-md fixed justify-center items-center gap-3 z-[9999] top-[7vh] p-[4vh]`
        }>

            <span className='absolute top-2 right-2 cursor-pointer text-[#e4e4e4]'
                onClick={() => setIsModalOn(false)}>
                <Close />
            </span>

            <div className="flex w-full h-full bg-[#17171776] rounded-[22px] justify-center items-center">

                <section className="flex flex-col justify-between items-center w-[50%] h-[40%] text-white">

                    <span className="text-[48px] font-bold">Bem vindo de volta</span>
                    <span className="text-[16px]">Por favor insira os detalhes da sua conta</span>

                    <input onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className='bg-[#070707] w-[300px] h-[44px] rounded-[22px] p-3'
                        placeholder='seu email' />

                    <input onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password" placeholder='sua senha...'
                        className='bg-[#070707] w-[300px] h-[44px] rounded-[22px] p-3' />

                    <button className='bg-[#308D83] w-[300px] h-[44px] rounded-[22px] font-bold text-[16px]'
                        onClick={handleLoginClient}>entrar</button>
                </section>

                <section className="flex w-[50%] h-full justify-center items-center">
                    <div className="flex w-[70%] h-[70%] rounded-[22px] justify-center items-center 
                    bg-gradient-to-b from-[#000000] to-[#24625B]">
                        <span className="font-bold text-white text-[27px]">A experiência de leilão que
                            você sempre quis.
                        </span>
                    </div>
                </section>

            </div>

        </div>
    )
}

export default LoginClientModal