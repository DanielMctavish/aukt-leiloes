/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import backgroundSocial from "../../media/backgrounds/social_bg_wall.jpg"
import auctLogo from "../../media/logos/logos-auk/aukt_blue.png"
import AdvertiserLoginFooterModal from "./AdvertiserLoginFooterModal"

function AdvertiserLogin() {
    const [messageDisplay, setMessageDisplay] = useState("")
    const [messageType, setMessageType] = useState("")
    const [showFooterModal, setShowFooterModal] = useState(true)
    const [accountStatus, setAccountStatus] = useState(null)
    const [showWarningModal, setShowWarningModal] = useState(false)
    const [warningCountdown, setWarningCountdown] = useState(20)
    const refEmail = useRef()
    const refPassword = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        if (currentLocalAdvertiser) {
            navigate('/advertiser/dashboard')
        }
    }, [navigate])

    useEffect(() => {
        let timer
        if (showWarningModal && warningCountdown > 0) {
            timer = setTimeout(() => setWarningCountdown(warningCountdown - 1), 1000)
        } else if (warningCountdown === 0) {
            setShowWarningModal(false)
            proceedWithLogin()
        }
        return () => clearTimeout(timer)
    }, [showWarningModal, warningCountdown])

    const proceedWithLogin = () => {
        const currentAdvertiser = JSON.parse(localStorage.getItem("temp-advertiser-session-aukt"))
        if (currentAdvertiser) {
            localStorage.setItem("advertiser-session-aukt", JSON.stringify(currentAdvertiser))
            localStorage.removeItem("temp-advertiser-session-aukt")
            navigate("/advertiser/dashboard")
        }
    }

    const handeAdvertiserLogin = async () => {
        const email = refEmail.current.value
        const password = refPassword.current.value

        if (!email) {
            setMessageDisplay("Por favor, preencha o email")
            setMessageType("error")
            return
        }

        localStorage.removeItem("advertiser-session-aukt")
        localStorage.removeItem("temp-advertiser-session-aukt")

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/login`, {
                email: email,
                password: password
            })

            console.log("resposta login advertiser --> ", res)

            if (res.data.user.police_status === 'BANNED' || res.data.user.police_status === 'SUSPENDED') {
                setAccountStatus(res.data.user.police_status)
                return
            }

            const currentAdvertiser = {
                name: res.data.user.name,
                CPF: res.data.user.CPF,
                nickname: res.data.user.nickname,
                email: res.data.user.email,
                url_profile_cover: res.data.user.url_profile_cover,
                token: res.data.token
            }

            if (res.data.user.police_status === 'WARNED') {
                localStorage.setItem("temp-advertiser-session-aukt", JSON.stringify(currentAdvertiser))
                setShowWarningModal(true)
                setWarningCountdown(20)
                return
            }

            setMessageDisplay("Logado com sucesso!")
            setMessageType("success")
            localStorage.setItem("advertiser-session-aukt", JSON.stringify(currentAdvertiser))
            navigate("/advertiser/dashboard")

        } catch (err) {
            console.log("erro login advertiser --> ", err.response?.status)
            if (err.response?.status === 401 || err.response?.status === 403) {
                setMessageDisplay("Email ou senha incorretos. Por favor, verifique suas credenciais.")
                setMessageType("error")
            } else {
                setMessageDisplay("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.")
                setMessageType("error")
            }
        }
    }

    const WarningModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Advertência</h2>
                <p className="text-lg mb-4 text-gray-800">
                    Você está sendo advertido por condutas que agridem nossas políticas de uso da plataforma.
                </p>
                <p className="text-lg mb-4 text-gray-800">
                    A plataforma reprova fortemente as seguintes condutas:
                </p>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                    <li>Racismo ou qualquer forma de discriminação</li>
                    <li>Desrespeito a outros usuários ou à equipe da plataforma</li>
                    <li>Criação de leilões com itens ilegais ou ofensivos (ex: itens nazistas)</li>
                    <li>Compartilhamento de conteúdo pornográfico</li>
                    <li>Fraude ou tentativa de enganar outros usuários</li>
                    <li>Violação de direitos autorais</li>
                    <li>Uso de linguagem abusiva ou ameaçadora</li>
                    <li>Criação de múltiplas contas para manipular leilões</li>
                    <li>Venda de produtos falsificados ou ilegais</li>
                    <li>Divulgação de informações pessoais de outros usuários</li>
                </ul>
                <p className="text-lg font-semibold text-gray-800">
                    Esta mensagem fechará em {warningCountdown} segundos.
                </p>
            </div>
        </div>
    )

    if (accountStatus === 'BANNED') {
        return (
            <div className="w-full h-screen bg-white flex justify-center items-center p-8">
                <div className="max-w-2xl text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-6">Conta Bloqueada</h1>
                    <p className="text-lg text-gray-700 mb-4">
                        Lamentamos informar que sua conta foi permanentemente bloqueada devido a violações repetidas das nossas políticas de uso.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Ao longo do tempo, enviamos diversos avisos e orientações sobre o uso adequado da nossa plataforma. Infelizmente, essas diretrizes não foram seguidas, resultando nesta ação irrevogável.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Nosso compromisso com a integridade e segurança da comunidade Aukt nos obriga a tomar medidas rigorosas contra comportamentos que violam nossas políticas. Esta decisão foi tomada após cuidadosa consideração e múltiplas tentativas de resolução.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Agradecemos sua compreensão e lamentamos que tenha chegado a este ponto. Para quaisquer dúvidas sobre esta decisão, por favor, entre em contato com nossa equipe de suporte.
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                        Desejamos-lhe o melhor em seus futuros empreendimentos.
                    </p>
                </div>
            </div>
        )
    }

    if (accountStatus === 'SUSPENDED') {
        return (
            <div className="w-full h-screen bg-white flex justify-center items-center p-8">
                <div className="max-w-2xl text-center">
                    <h1 className="text-3xl font-bold text-yellow-600 mb-6">Conta Temporariamente Suspensa</h1>
                    <p className="text-lg text-gray-700 mb-4">
                        Informamos que sua conta foi temporariamente suspensa devido a algumas atividades que não estão de acordo com nossas políticas de uso.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Esta suspensão é uma medida temporária e pode durar de 3 a 12 dias, dependendo da natureza e gravidade da infração.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Durante este período, nossa equipe estará revisando sua conta. Pedimos que você aproveite este tempo para revisar nossas diretrizes e políticas de uso.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Se você acredita que houve um erro ou gostaria de obter mais informações sobre a suspensão, entre em contato com nossa equipe de suporte.
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                        Agradecemos sua compreensão e esperamos vê-lo de volta em breve na plataforma Aukt.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="text-white w-full h-[100vh] bg-[#F4F4F4] flex flex-col justify-center items-center gap-3 relative">
            <img src={backgroundSocial} alt="" 
                className="absolute w-full h-full object-cover opacity-30 saturate-0" />

            {showWarningModal && <WarningModal />}

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

            <section className="w-[80%] h-[90vh] flex bg-[#012038cd] backdrop-blur-sm rounded-[4px] relative overflow-hidden shadow-2xl">

                <div className="flex flex-col w-[50%] h-[100%] bg-white text-zinc-600 justify-center items-center gap-4">
                    <span>Bem vindo! Que bom que deu tudo certo.</span>
                    <span className="text-[33px] font-bold">Prepare-se para criar seus leilões</span>
                    <img src={auctLogo} alt="" className="w-[300px] object-cover cursor-pointer hover:brightness-[1.1]" 
                    onClick={() => navigate("/")}/>
                </div>

                <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                    <h1 className="text-left font-bold text-[33px] w-[300px]">BEM VINDO!</h1>

                    <div className="flex flex-col justify-start items-start">
                        <span>email</span>
                        <input onKeyDown={(e) => { e.key === 'Enter' && handeAdvertiserLogin() }}
                            ref={refEmail}
                            type="email"
                            className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>senha</span>
                        <input onKeyDown={(e) => { e.key === 'Enter' && handeAdvertiserLogin() }}
                            ref={refPassword}
                            type="password"
                            className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <button onClick={handeAdvertiserLogin} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#012038]">entrar</button>
                    <button onClick={() => navigate("/advertiser/register/x1x2x3x4x5")} className="w-[300px] h-[41px] p-2 bg-[#012038] rounded-md text-[#e3eff7]">registrar</button>
                </div>
            </section>

            <AdvertiserLoginFooterModal 
                isVisible={showFooterModal} 
                onClose={() => setShowFooterModal(false)} 
            />
        </div>
    )
}

export default AdvertiserLogin
