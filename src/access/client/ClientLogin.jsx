/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useNavigate } from "react-router-dom"
import background from "../../media/backgrounds/social_bg_wall.jpg"
import logoAuk from "../../media/logos/logos-auk/aukt_blue.png"
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

        await axios.post(`/api/client/login`, {
            email: email,
            password: password,
        }).then(response => {
            //console.log("login >> ", response.data)
            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))
            navigate("/client/dashboard")
        }).catch(err => {
            console.log("err login >> ", err.message)
        })

    }

    return (

        <div className="text-white w-full h-[100vh] bg-[#F4F4F4] flex flex-col justify-center items-center gap-3 overflow-hidden relative">
            <img src={background} className="object-cover w-full absolute opacity-60" />

            <section className="w-[80%] h-[90vh] flex bg-transparent rounded-[4px] relative overflow-hidden shadow-2xl z-10">
                <div className="w-[50%] h-[100%] bg-white/30 backdrop-blur-[12px] flex justify-center items-center">
                    <img src={logoAuk} className="w-[360px] object-cover" />
                </div>

                <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative bg-zinc-600">
                    <h1 className="text-left font-bold text-[33px] w-[300px]">BEM VINDO!</h1>

                    <div className="flex flex-col justify-start items-start">
                        <span>email</span>
                        <input type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>senha</span>
                        <input type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <button onClick={handleClientLogin} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#242424]">entrar</button>
                    <button onClick={() => navigate("/client/register")}>não tem uma conta? Registre-se</button>
                </div>

            </section>

        </div>
    )
}

export default ClientLogin