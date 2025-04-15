/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useNavigate } from "react-router-dom"
import logoAuk from "../../media/logos/logos-auk/aukt_greengreen.png"
import logoAukBlue from "../../media/logos/logos-auk/aukt_blue.png"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function ClientLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [messageDisplay, setMessageDisplay] = useState("")
    const [messageType, setMessageType] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordAttempts, setPasswordAttempts] = useState(0)
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
            setPasswordAttempts(0)
            
            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))
            
            setTimeout(() => navigate("/client/dashboard"), 500)
            
        } catch (err) {
            // Incrementar tentativas de senha apenas para erros de autenticação
            if (err.response?.status === 401 || err.response?.status === 403) {
                const newAttempts = passwordAttempts + 1;
                setPasswordAttempts(newAttempts);
                
                if (newAttempts >= 3) {
                    setMessageDisplay("Muitas tentativas malsucedidas. Por favor, tente novamente mais tarde.")
                } else {
                    setMessageDisplay(`Email ou senha incorretos. Você tem mais ${3 - newAttempts} tentativa(s).`)
                }
            } else {
                setMessageDisplay("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.")
            }
            setMessageType("error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen flex flex-col justify-center items-center relative p-4"
        >
            {/* Camada de sobreposição para controlar a claridade */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none"></div>
            
            {/* Elemento de brilho decorativo para desktop */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-[#92ffb8]/10 blur-[80px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block"></div>
            
            {/* Botão de voltar para mobile */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 z-50 flex items-center gap-2 text-gray-700 hover:text-gray-900
                    bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md
                    transition-all duration-300 md:hidden"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Logo superior para desktop */}
            <img 
                src={logoAukBlue} 
                alt="logo-aukt" 
                onClick={() => navigate("/")} 
                className="w-16 h-16 object-cover absolute top-4 left-6 cursor-pointer 
                    hover:scale-105 transition-transform duration-300
                    md:block hidden" 
            />

            {/* Mensagem de feedback */}
            <AnimatePresence>
                {messageDisplay && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`
                            fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                            px-6 py-3 rounded-lg shadow-lg backdrop-blur-md
                            ${messageType === 'error' 
                                ? 'bg-red-500/90 border border-red-400/20' 
                                : 'bg-green-500/90 border border-green-400/20'}
                            transition-all duration-300 ease-in-out
                            flex items-center gap-2
                            max-w-[90%] md:max-w-md
                        `}
                    >
                        <span className="text-white font-medium text-sm md:text-base">{messageDisplay}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Container principal */}
            <section className="w-full md:w-4/5 h-auto md:h-[85vh] flex flex-col md:flex-row 
                bg-transparent rounded-2xl relative overflow-hidden shadow-2xl
                max-w-4xl z-10"
            >
                {/* Lado esquerdo - Logo */}
                <div className="w-full md:w-1/2 h-[25vh] md:h-full 
                    bg-gradient-to-br from-[#247557]/90 to-[#194037]/90 backdrop-blur-md 
                    flex flex-col justify-center items-center p-8
                    border-b md:border-b-0 md:border-r border-white/10
                    relative overflow-hidden
                    md:rounded-l-2xl rounded-t-2xl"
                >
                    {/* Padrão visual de fundo */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://img.freepik.com/free-vector/abstract-geometric-pattern-background_1319-242.jpg')] bg-cover bg-center mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    
                    <img 
                        src={logoAuk} 
                        className="w-32 sm:w-40 md:w-56 xl:w-64 object-cover transition-transform 
                            hover:scale-105 duration-300 relative z-10" 
                        alt="Aukt logo" 
                    />
                    <div className="mt-4 md:mt-8 text-center text-white/90 relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                            Bem-vindo ao AUKT
                        </h2>
                        <p className="text-base md:text-lg md:block hidden">
                            Sua plataforma de leilões online
                        </p>
                        <p className="text-sm md:hidden block">
                            Faça login para acessar
                        </p>
                    </div>
                </div>

                {/* Lado direito - Formulário */}
                <div className="w-full md:w-1/2 h-auto md:h-full 
                    flex flex-col justify-center items-center gap-4 md:gap-8 
                    bg-white/95 backdrop-blur-md md:bg-gradient-to-br md:from-zinc-900/95 md:to-zinc-800/90 
                    p-6 md:px-12 py-8 md:py-12 relative overflow-hidden
                    md:rounded-r-2xl rounded-b-2xl"
                >
                    {/* Efeito de iluminação para desktop */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full hidden md:block"></div>
                    
                    <h1 className="text-left font-bold text-2xl sm:text-3xl md:text-4xl 
                        bg-gradient-to-r from-green-800 to-green-600 md:from-white md:to-green-300 bg-clip-text text-transparent">
                        BEM VINDO!
                    </h1>

                    <form className="w-full max-w-md space-y-4 md:space-y-6"
                        onSubmit={(e) => { e.preventDefault(); handleClientLogin(); }}
                    >
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 md:text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input 
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 bg-gray-100 md:bg-white/10 border border-gray-300 md:border-white/20 
                                        rounded-lg text-gray-800 md:text-white placeholder-gray-500 md:placeholder-gray-400
                                        focus:outline-none focus:ring-2 focus:ring-green-500 
                                        focus:border-transparent transition-all duration-300"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 md:text-gray-300 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input 
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 bg-gray-100 md:bg-white/10 border border-gray-300 md:border-white/20 
                                        rounded-lg text-gray-800 md:text-white placeholder-gray-500 md:placeholder-gray-400
                                        focus:outline-none focus:ring-2 focus:ring-green-500 
                                        focus:border-transparent transition-all duration-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Indicador de tentativas - visível apenas quando há tentativas */}
                        {passwordAttempts > 0 && (
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-600 md:text-gray-400">Tentativas restantes:</span>
                                <div className="flex space-x-1">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div 
                                            key={index}
                                            className={`w-6 h-1.5 rounded-sm ${
                                                index < 3 - passwordAttempts 
                                                    ? 'bg-green-500' 
                                                    : 'bg-gray-300 md:bg-gray-500'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading || passwordAttempts >= 3}
                            className={`
                                w-full h-12 rounded-lg font-medium text-white text-lg
                                ${isLoading 
                                    ? 'bg-green-600/80 cursor-not-allowed' 
                                    : passwordAttempts >= 3
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}
                                transition-all duration-300
                                flex items-center justify-center gap-2 shadow-lg
                                mt-4 relative overflow-hidden group
                            `}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 
                                            border-t-white rounded-full animate-spin" />
                                        <span>Entrando...</span>
                                    </>
                                ) : passwordAttempts >= 3 ? (
                                    'Tente mais tarde'
                                ) : (
                                    'Entrar'
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/40 to-emerald-600/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </button>

                        <div className="flex flex-col items-center gap-3 md:gap-4 mt-4 md:mt-6">
                            <button 
                                onClick={() => navigate("/client/register")}
                                className="text-gray-700 md:text-gray-300 hover:text-gray-900 md:hover:text-white transition-colors
                                    text-sm md:text-base relative group"
                            >
                                Não tem uma conta? <span className="underline relative">
                                    Registre-se
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </button>
                            
                            <button 
                                onClick={() => navigate("/client/forgot-password")}
                                className="text-gray-600 md:text-gray-400 hover:text-gray-900 md:hover:text-white text-xs md:text-sm 
                                    transition-colors"
                            >
                                Esqueceu sua senha?
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </motion.div>
    )
}

export default ClientLogin