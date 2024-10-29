/* eslint-disable react/prop-types */
import axios from "axios"
import { Close } from "@mui/icons-material"
import { useEffect, useState } from "react"

function LoginClientModal({ setIsModalOn, modalOn }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [messageDisplay, setMessageDisplay] = useState("")
    const [messageType, setMessageType] = useState("")

    const handleLoginClient = async () => {
        if (!email) {
            setMessageDisplay("Por favor, preencha o email")
            setMessageType("error")
            return
        }

        if (!password) {
            setMessageDisplay("Por favor, preencha a senha")
            setMessageType("error")
            return
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email: email,
                password: password
            });

            console.log("logado com sucesso --> ", response.data)
            setMessageDisplay("Login realizado com sucesso!")
            setMessageType("success")

            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))

            setTimeout(() => {
                setIsModalOn(false)
            }, 500)
        } catch (error) {
            console.log("Error ao logar cliente -> ", error.message)
            if (error.response?.status === 401 || error.response?.status === 403) {
                setMessageDisplay("Email ou senha incorretos. Por favor, verifique suas credenciais.")
                setMessageType("error")
            } else {
                setMessageDisplay("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.")
                setMessageType("error")
            }
        }
    }

    useEffect(() => {
        if (!modalOn) {
            // Limpar mensagens quando o modal for fechado
            setMessageDisplay("")
            setMessageType("")
            setEmail("")
            setPassword("")
        }
    }, [modalOn])

    return (
        <div className={`
            ${modalOn ? 'flex' : 'hidden'} 
            flex-col w-[90%] max-w-[1000px] h-[90vh] max-h-[600px] 
            bg-gradient-to-r from-[#92ffb8] to-[#003026] 
            shadow-xl shadow-[#0f0f0f39] rounded-lg fixed 
            justify-center items-center z-[9999] top-[5vh] p-8
        `}>
            {messageDisplay && (
                <div className={`
                    absolute top-4 left-1/2 transform -translate-x-1/2
                    px-6 py-3 rounded-lg shadow-lg
                    ${messageType === 'error' ? 'bg-red-500' : 'bg-green-500'}
                    transition-all duration-300 ease-in-out
                    flex items-center gap-2 z-50
                `}>
                    {messageType === 'error' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    <span className="text-white font-medium">{messageDisplay}</span>
                </div>
            )}

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
                        onKeyDown={(e) => { e.key === 'Enter' && handleLoginClient() }}
                    />

                    <input 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password" 
                        placeholder='Sua senha...'
                        className='bg-[#070707] w-full max-w-[350px] h-12 rounded-full px-4 text-lg'
                        onKeyDown={(e) => { e.key === 'Enter' && handleLoginClient() }}
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