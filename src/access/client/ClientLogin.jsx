/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useNavigate } from "react-router-dom"
import logoAuk from "../../media/logos/logos-auk/aukt_greengreen.png"
import logoAukBlue from "../../media/logos/logos-auk/aukt_blue.png"
import { useEffect, useState } from "react"

function ClientLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [messageDisplay, setMessageDisplay] = useState("")
    const [messageType, setMessageType] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const currentSessionClient = localStorage.getItem("client-auk-session-login");
        if (currentSessionClient) {
            navigate("/client/dashboard")
        }
    }, [])

    const handleClientLogin = async () => {
        if (!email || !password) {
            setMessageDisplay(!email ? "Por favor, preencha o email" : "Por favor, preencha a senha")
            setMessageType("error")
            return
        }

        setIsLoading(true)
        localStorage.removeItem("client-auk-session-login")

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email,
                password,
            });
            
            setMessageDisplay("Login realizado com sucesso!")
            setMessageType("success")
            
            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))
            
            setTimeout(() => navigate("/client/dashboard"), 500)
            
        } catch (err) {
            setMessageDisplay(
                err.response?.status === 401 || err.response?.status === 403
                    ? "Email ou senha incorretos. Por favor, verifique suas credenciais."
                    : "Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde."
            )
            setMessageType("error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full h-screen bg-gradient-to-br from-[#e7e7e7] to-[#474747] 
            flex flex-col justify-center items-center relative p-4">
            {/* Logo superior */}
            <img 
                src={logoAukBlue} 
                alt="logo-aukt" 
                onClick={() => navigate("/")} 
                className="w-16 h-16 object-cover absolute top-4 left-6 cursor-pointer 
                    hover:scale-105 transition-transform duration-300
                    md:block hidden" 
            />

            {/* Mensagem de feedback */}
            {messageDisplay && (
                <div className={`
                    fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                    px-6 py-3 rounded-lg shadow-lg backdrop-blur-md
                    ${messageType === 'error' 
                        ? 'bg-red-500/90 border border-red-400/20' 
                        : 'bg-green-500/90 border border-green-400/20'}
                    transition-all duration-300 ease-in-out
                    flex items-center gap-2
                    max-w-[90%] md:max-w-md
                `}>
                    <span className="text-white font-medium text-sm md:text-base">{messageDisplay}</span>
                </div>
            )}

            {/* Container principal */}
            <section className="w-full md:w-4/5 h-[85vh] flex flex-col md:flex-row 
                bg-transparent rounded-2xl relative overflow-hidden shadow-2xl">
                {/* Lado esquerdo - Logo */}
                <div className="w-full md:w-1/2 h-[30vh] md:h-full 
                    bg-[#247557]/60 backdrop-blur-md 
                    flex flex-col justify-center items-center p-8
                    border-b md:border-b-0 md:border-r border-white/10">
                    <img 
                        src={logoAuk} 
                        className="w-40 md:w-80 object-cover transition-transform 
                            hover:scale-105 duration-300" 
                        alt="Aukt logo" 
                    />
                    <div className="mt-4 md:mt-8 text-center text-white/90">
                        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                            Bem-vindo ao AUKT
                        </h2>
                        <p className="text-base md:text-lg hidden md:block">
                            Sua plataforma de leilões online
                        </p>
                    </div>
                </div>

                {/* Lado direito - Formulário */}
                <div className="w-full md:w-1/2 h-[55vh] md:h-full 
                    flex flex-col justify-center items-center gap-6 md:gap-8 
                    bg-zinc-900/95 backdrop-blur-md p-6 md:px-12">
                    <h1 className="text-left font-bold text-3xl md:text-4xl text-white">
                        BEM VINDO!
                    </h1>

                    <form className="w-full max-w-md space-y-4 md:space-y-6" 
                        onSubmit={(e) => { e.preventDefault(); handleClientLogin(); }}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input 
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 bg-white/10 border border-white/20 
                                    rounded-lg text-white placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-green-500 
                                    focus:border-transparent transition-all duration-300"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Senha
                            </label>
                            <input 
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 px-4 bg-white/10 border border-white/20 
                                    rounded-lg text-white placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-green-500 
                                    focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full h-12 rounded-lg font-medium text-white text-lg
                                ${isLoading 
                                    ? 'bg-green-600 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}
                                transition-all duration-300 transform hover:scale-[1.02]
                                flex items-center justify-center gap-2 shadow-lg
                                mt-4
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 
                                        border-t-white rounded-full animate-spin" />
                                    <span>Entrando...</span>
                                </>
                            ) : 'Entrar'}
                        </button>

                        <div className="flex flex-col items-center gap-3 md:gap-4 mt-4 md:mt-6">
                            <button 
                                onClick={() => navigate("/client/register")}
                                className="text-gray-300 hover:text-white transition-colors
                                    text-sm md:text-base"
                            >
                                Não tem uma conta? <span className="underline">Registre-se</span>
                            </button>
                            
                            <button 
                                onClick={() => navigate("/client/forgot-password")}
                                className="text-gray-400 hover:text-white text-xs md:text-sm 
                                    transition-colors"
                            >
                                Esqueceu sua senha?
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default ClientLogin