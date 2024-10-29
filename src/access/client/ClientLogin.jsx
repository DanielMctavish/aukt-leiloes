/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useNavigate } from "react-router-dom"
import background from "../../media/backgrounds/social_bg_wall.jpg"
import logoAuk from "../../media/logos/logos-auk/aukt_greengreen.png"
import logoAukBlue from "../../media/logos/logos-auk/aukt_blue.png"
import { useEffect, useState } from "react"

function ClientLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [messageDisplay, setMessageDisplay] = useState("")
    const [messageType, setMessageType] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const currentSessionClient = localStorage.getItem("client-auk-session-login");
        if (currentSessionClient) {
            navigate("/client/dashboard")
        }
    }, [])

    const handleClientLogin = async () => {
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

        localStorage.removeItem("client-auk-session-login")

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email: email,
                password: password,
            });
            
            setMessageDisplay("Login realizado com sucesso!")
            setMessageType("success")
            
            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))
            
            setTimeout(() => {
                navigate("/client/dashboard")
            }, 500)
            
        } catch (err) {
            console.log("err login >> ", err.message)
            if (err.response?.status === 401 || err.response?.status === 403) {
                setMessageDisplay("Email ou senha incorretos. Por favor, verifique suas credenciais.")
                setMessageType("error")
            } else {
                setMessageDisplay("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.")
                setMessageType("error")
            }
        }
    }

    return (
        <div className="text-white w-full h-screen bg-[#09360f] flex flex-col justify-center items-center gap-3 overflow-hidden relative">
            <img src={logoAukBlue} alt="logo-aukt" onClick={() => navigate("/")} 
                className="w-16 h-16 object-cover z-10 absolute top-4 left-6 cursor-pointer hover:opacity-80 transition-opacity" />
            <img src={background} className="object-cover w-full h-full absolute opacity-40 blur-[2px]" alt="background" />

            {messageDisplay && (
                <div className={`
                    fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                    px-6 py-3 rounded-lg shadow-lg
                    ${messageType === 'error' ? 'bg-red-500' : 'bg-green-500'}
                    transition-all duration-300 ease-in-out
                    flex items-center gap-2
                `}>
                    {messageType === 'error' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    <span className="text-white font-medium">{messageDisplay}</span>
                </div>
            )}

            <section className="w-4/5 h-[90vh] flex bg-transparent rounded-md relative overflow-hidden shadow-2xl z-10">
                <div className="w-1/2 h-full bg-[#24755799] backdrop-blur-md flex justify-center items-center">
                    <img src={logoAuk} className="w-80 object-cover transition-transform hover:scale-105" alt="Aukt logo" />
                </div>

                <div className="w-1/2 h-full flex flex-col justify-center items-center gap-6 relative bg-zinc-800 bg-opacity-90">
                    <h1 className="text-left font-bold text-4xl w-80">BEM VINDO!</h1>

                    <div className="flex flex-col justify-start items-start w-80">
                        <label htmlFor="email" className="mb-1">Email</label>
                        <input 
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => { e.key === 'Enter' && handleClientLogin() }}
                            className="w-full h-12 p-3 border border-white bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white transition-all"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start w-80">
                        <label htmlFor="password" className="mb-1">Senha</label>
                        <input 
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => { e.key === 'Enter' && handleClientLogin() }}
                            className="w-full h-12 p-3 border border-white bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white transition-all"
                        />
                    </div>

                    <button 
                        onClick={handleClientLogin} 
                        className="w-80 h-12 bg-white rounded-md text-zinc-800 font-bold text-lg hover:bg-opacity-90 transition-all"
                    >
                        Entrar
                    </button>
                    <button 
                        onClick={() => navigate("/client/register")} 
                        className="text-white hover:underline transition-all"
                    >
                        Não tem uma conta? Registre-se
                    </button>
                </div>
            </section>
        </div>
    )
}

export default ClientLogin