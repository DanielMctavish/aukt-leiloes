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
    const navigate = useNavigate()

    useEffect(() => {
        const currentSessionClient = localStorage.getItem("client-auk-session-login");
        if (currentSessionClient) {
            navigate("/client/dashboard")
        }
    }, [])

    const handleClientLogin = async () => {
        localStorage.removeItem("client-auk-session-login")

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email: email,
                password: password,
            });
            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))
            navigate("/client/dashboard")
        } catch (err) {
            console.log("err login >> ", err.message)
            // Adicione aqui uma lógica para mostrar uma mensagem de erro ao usuário
        }
    }

    return (
        <div className="text-white w-full h-screen bg-[#09360f] flex flex-col justify-center items-center gap-3 overflow-hidden relative">
            <img src={logoAukBlue} alt="logo-aukt" onClick={() => navigate("/")} 
                className="w-16 h-16 object-cover z-10 absolute top-4 left-6 cursor-pointer hover:opacity-80 transition-opacity" />
            <img src={background} className="object-cover w-full h-full absolute opacity-40 blur-[2px]" alt="background" />

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