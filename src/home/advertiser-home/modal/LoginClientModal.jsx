/* eslint-disable react/prop-types */
import axios from "axios"
import { Close } from "@mui/icons-material"
import { useEffect, useState } from "react"

function LoginClientModal({ setIsModalOn, modalOn }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLoginClient = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email: email,
                password: password
            });

            console.log("logado com sucesso --> ", response.data)

            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))

            setIsModalOn(false)
        } catch (error) {
            setIsModalOn(false)
            console.log("Error ao logar cliente -> ", error.message)
        }
    }

    useEffect(() => {
        // Efeito para lidar com a abertura/fechamento do modal
    }, [modalOn])

    return (
        <div className={`
            ${modalOn ? 'flex' : 'hidden'} 
            flex-col w-[90%] max-w-[1000px] h-[90vh] max-h-[600px] 
            bg-gradient-to-r from-[#92ffb8] to-[#003026] 
            shadow-xl shadow-[#0f0f0f39] rounded-lg fixed 
            justify-center items-center z-[9999] top-[5vh] p-8
        `}>
            <button 
                className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors'
                onClick={() => setIsModalOn(false)}
            >
                <Close fontSize="large" />
            </button>

            <div className="flex w-full h-full bg-[#17171776] rounded-2xl overflow-hidden">
                <section className="flex flex-col justify-center items-center w-1/2 h-full text-white p-8 space-y-6">
                    <h2 className="text-4xl font-bold mb-2">Bem vindo de volta</h2>
                    <p className="text-lg mb-6">Por favor insira os detalhes da sua conta</p>

                    <input 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className='bg-[#070707] w-full max-w-[350px] h-12 rounded-full px-4 text-lg'
                        placeholder='Seu email'
                    />

                    <input 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password" 
                        placeholder='Sua senha...'
                        className='bg-[#070707] w-full max-w-[350px] h-12 rounded-full px-4 text-lg'
                    />

                    <button 
                        className='bg-[#308D83] w-full max-w-[350px] h-12 rounded-full font-bold text-lg
                        hover:bg-[#2a7d74] transition-colors'
                        onClick={handleLoginClient}
                    >
                        Entrar
                    </button>
                </section>

                <section className="flex w-1/2 h-full justify-center items-center bg-gradient-to-b from-[#000000] to-[#24625B] p-8">
                    <div className="text-center">
                        <h3 className="font-bold text-white text-3xl leading-tight">
                            A experiência de leilão que você sempre quis.
                        </h3>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default LoginClientModal