/* eslint-disable react/prop-types */
import axios from "axios"
import { Close, Email, Lock } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function LoginClientModal({ setIsModalOn, modalOn }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [messageDisplay, setMessageDisplay] = useState("")
    const [messageType, setMessageType] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordAttempts, setPasswordAttempts] = useState(0)

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

        setIsLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email: email,
                password: password
            });

            setMessageDisplay("Login realizado com sucesso!")
            setMessageType("success")
            setPasswordAttempts(0)

            const userData = {
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            };

            localStorage.setItem("client-auk-session-login", JSON.stringify(userData));

            // Disparar um evento personalizado para notificar outros componentes
            const loginEvent = new CustomEvent('clientLoginSuccess', { 
                detail: userData 
            });
            window.dispatchEvent(loginEvent);

            setTimeout(() => {
                setIsModalOn(false)
            }, 800)
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
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

    useEffect(() => {
        if (!modalOn) {
            // Limpar mensagens quando o modal for fechado
            setMessageDisplay("")
            setMessageType("")
            setEmail("")
            setPassword("")
            setPasswordAttempts(0)
        }
    }, [modalOn])

    return (
        <AnimatePresence>
            {modalOn && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
                >
                    {/* Elemento de brilho decorativo */}
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-[#247557]/20 blur-[120px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="w-[90%] max-w-[1000px] bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 
                            rounded-2xl shadow-2xl relative overflow-hidden border border-white/10"
                    >
                        {/* Padrão visual de fundo */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://img.freepik.com/free-vector/abstract-geometric-pattern-background_1319-242.jpg')] bg-cover bg-center mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                        <AnimatePresence>
                            {messageDisplay && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`
                                        absolute top-4 left-1/2 transform -translate-x-1/2 z-50
                                        px-6 py-3 rounded-lg shadow-lg backdrop-blur-md
                                        ${messageType === 'error' 
                                            ? 'bg-red-500/90 border border-red-400/20' 
                                            : 'bg-green-500/90 border border-green-400/20'}
                                        flex items-center gap-2 min-w-[300px] justify-center
                                    `}
                                >
                                    <span className="text-white font-medium">{messageDisplay}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            className='absolute top-4 right-4 text-gray-400 hover:text-white transition-all hover:rotate-90 z-50'
                            onClick={() => setIsModalOn(false)}
                        >
                            <Close fontSize="large" />
                        </button>

                        <div className="flex flex-col md:flex-row w-full">
                            <div className="w-full md:w-1/2 p-8 space-y-6 relative z-10">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center mb-4"
                                >
                                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                                        Bem vindo de volta
                                    </h2>
                                    <p className="text-gray-400">Por favor insira os detalhes da sua conta</p>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Email />
                                            </div>
                                            <input 
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                type="email"
                                                className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 
                                                    rounded-lg text-white placeholder-gray-400
                                                    focus:outline-none focus:ring-2 focus:ring-green-500 
                                                    focus:border-transparent transition-all duration-300"
                                                placeholder="seu@email.com"
                                                onKeyDown={(e) => { e.key === 'Enter' && handleLoginClient() }}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Senha
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Lock />
                                            </div>
                                            <input 
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                type="password"
                                                className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 
                                                    rounded-lg text-white placeholder-gray-400
                                                    focus:outline-none focus:ring-2 focus:ring-green-500 
                                                    focus:border-transparent transition-all duration-300"
                                                placeholder="••••••••"
                                                onKeyDown={(e) => { e.key === 'Enter' && handleLoginClient() }}
                                            />
                                        </div>
                                    </div>

                                    {/* Indicador de tentativas */}
                                    {passwordAttempts > 0 && (
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-400">Tentativas restantes:</span>
                                            <div className="flex space-x-1">
                                                {Array.from({ length: 3 }).map((_, index) => (
                                                    <div 
                                                        key={index}
                                                        className={`w-6 h-1.5 rounded-sm ${
                                                            index < 3 - passwordAttempts 
                                                                ? 'bg-green-500' 
                                                                : 'bg-gray-500'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <motion.button 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        onClick={handleLoginClient}
                                        disabled={isLoading || passwordAttempts >= 3}
                                        className={`
                                            w-full h-12 rounded-lg font-medium text-white text-lg
                                            ${isLoading 
                                                ? 'bg-green-600/80 cursor-not-allowed' 
                                                : passwordAttempts >= 3
                                                    ? 'bg-gray-600 cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}
                                            transition-all duration-300
                                            flex items-center justify-center gap-2
                                            relative overflow-hidden group
                                            shadow-lg shadow-green-900/20
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
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/40 to-emerald-600/40 
                                            transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left">
                                        </div>
                                    </motion.button>

                                    {/* Botões de registro e recuperação de senha */}
                                    <div className="flex flex-col items-center gap-3 pt-4">
                                        <button 
                                            onClick={() => {
                                                setIsModalOn(false);
                                                window.location.href = "/client/register";
                                            }}
                                            className="text-gray-300 hover:text-white transition-colors
                                                text-sm md:text-base relative group"
                                        >
                                            Não tem uma conta? <span className="underline relative">
                                                Registre-se
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                                            </span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => {
                                                setIsModalOn(false);
                                                window.location.href = "/client/forgot-password";
                                            }}
                                            className="text-gray-400 hover:text-white text-xs md:text-sm 
                                                transition-colors"
                                        >
                                            Esqueceu sua senha?
                                        </button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Seção direita com imagem de fundo e mensagem */}
                            <div className="hidden md:flex w-1/2 h-[600px] justify-center items-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/auction-bg.jpg')] bg-cover bg-center opacity-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80"></div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center relative z-10 p-8"
                                >
                                    <h3 className="font-bold text-white text-3xl leading-tight mb-4">
                                        A experiência de leilão que você sempre quis.
                                    </h3>
                                    <p className="text-gray-300 text-lg max-w-[350px] mx-auto">
                                        Participe dos melhores leilões com total segurança e transparência.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default LoginClientModal