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
                setMessageDisplay("Email ou senha incorretos. Por favor, verifique suas credenciais.")
                setMessageType("error")
            } else {
                setMessageDisplay("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.")
                setMessageType("error")
            }
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
        }
    }, [modalOn])

    return (
        <AnimatePresence>
            {modalOn && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 rounded-lg overflow-hidden"
                >
                    {/* Elemento de brilho decorativo */}
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-[#92ffb8]/20 blur-[120px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className={`
                            w-[90%] max-w-[1000px] h-[90vh] max-h-[600px] 
                            bg-gradient-to-r from-[#92ffb8]/90 to-[#003026]/90 
                            shadow-xl shadow-[#0f0f0f39]
                            relative overflow-hidden
                            border border-white/20 backdrop-filter backdrop-blur-md
                            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent rounded-lg
                            after:content-[''] after:absolute after:w-[200%] after:h-[200%] after:top-[-50%] after:left-[-50%] after:bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_0%,_transparent_60%)] after:rotate-12 after:pointer-events-none
                        `}
                    >
                        <AnimatePresence>
                            {messageDisplay && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`
                                        absolute top-4 left-1/2 transform -translate-x-1/2
                                        px-6 py-3  shadow-lg
                                        ${messageType === 'error' ? 'bg-red-500' : 'bg-green-500'}
                                        flex items-center gap-2 z-50 min-w-[300px] justify-center
                                    `}
                                >
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
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            className='absolute top-4 right-4 text-white hover:text-gray-300 transition-all hover:rotate-90 z-50'
                            onClick={() => setIsModalOn(false)}
                        >
                            <Close fontSize="large" />
                        </button>

                        <div className="flex w-full h-full bg-[#17171776] backdrop-blur-sm  overflow-hidden">
                            <section className="flex flex-col justify-center items-center w-full md:w-1/2 h-full text-white p-8 space-y-6 bg-black/10 backdrop-filter backdrop-blur-sm border-r border-white/10">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center mb-4"
                                >
                                    <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-[#92ffb8] bg-clip-text text-transparent">Bem vindo de volta</h2>
                                    <p className="text-lg text-gray-200">Por favor insira os detalhes da sua conta</p>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative w-full max-w-[350px]"
                                >
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Email />
                                    </div>
                                    <input 
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        className='bg-[#070707]/80 w-full h-12 rounded-full pl-12 pr-4 text-lg border-2 border-transparent focus:border-[#92ffb8]/70 outline-none transition-all backdrop-filter backdrop-blur-sm shadow-inner'
                                        placeholder='Seu email'
                                        onKeyDown={(e) => { e.key === 'Enter' && handleLoginClient() }}
                                    />
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative w-full max-w-[350px]"
                                >
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Lock />
                                    </div>
                                    <input 
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password" 
                                        placeholder='Sua senha...'
                                        className='bg-[#070707]/80 w-full h-12 rounded-full pl-12 pr-4 text-lg border-2 border-transparent focus:border-[#92ffb8]/70 outline-none transition-all backdrop-filter backdrop-blur-sm shadow-inner'
                                        onKeyDown={(e) => { e.key === 'Enter' && handleLoginClient() }}
                                    />
                                </motion.div>

                                <motion.button 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className='relative bg-gradient-to-r from-[#308D83]/90 to-[#1a4d46]/90 w-full max-w-[350px] h-12 rounded-full font-bold text-lg
                                    shadow-lg shadow-[#00000040] overflow-hidden group border border-white/20 backdrop-filter backdrop-blur-sm'
                                    onClick={handleLoginClient}
                                    disabled={isLoading}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processando...
                                            </>
                                        ) : "Entrar"}
                                    </span>
                                    <div className="absolute inset-0 bg-[#92ffb8] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-20"></div>
                                </motion.button>
                            </section>

                            <section className="hidden md:flex w-1/2 h-full justify-center items-center bg-gradient-to-b from-[#000000]/80 to-[#24625B]/80 p-8 relative overflow-hidden backdrop-filter backdrop-blur-sm">
                                <div className="absolute inset-0 bg-[url('/auction-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center relative z-10"
                                >
                                    <h3 className="font-bold text-white text-3xl leading-tight mb-4">
                                        A experiência de leilão que você sempre quis.
                                    </h3>
                                    <p className="text-gray-200 text-lg max-w-[350px] mx-auto">
                                        Participe dos melhores leilões com total segurança e transparência.
                                    </p>
                                </motion.div>
                            </section>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default LoginClientModal