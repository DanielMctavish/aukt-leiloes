/* eslint-disable react/prop-types */
import axios from "axios"
import { Close } from "@mui/icons-material"
import { useEffect, useState } from "react"

function LoginClientModalAdv({ setIsModalOn, modalOn, header, fontStyle }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [messageDisplay, setMessageDisplay] = useState("")
    const [messageType, setMessageType] = useState("")

    // Função para determinar se deve usar sombra no texto
    const getTextShadowStyle = () => {
        if (header?.colorPalette === 'CLEAN') {
            return { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' };
        }
        return {};
    };

    const handleClose = () => {
        setIsModalOn(false);
        setEmail('');
        setPassword('');
        setMessageDisplay('');
        setMessageType('');
    };

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

            setMessageDisplay("Login realizado com sucesso!")
            setMessageType("success")

            localStorage.setItem("client-auk-session-login", JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id,
            }))

            setTimeout(() => {
                handleClose();
            }, 500)
        } catch (error) {
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
            handleClose();
        }
    }, [modalOn])

    return (
        <div 
            className={`
                ${modalOn ? 'flex' : 'hidden'} 
                fixed inset-0 z-[9999] items-center justify-center
                bg-black/50 backdrop-blur-sm
            `}
            onClick={handleClose} // Fecha o modal ao clicar no overlay
        >
            <div 
                className={`
                    w-[90%] max-w-[1000px] h-[90vh] max-h-[600px] 
                    bg-white rounded-2xl shadow-2xl
                    flex overflow-hidden
                    relative
                `}
                style={{ fontFamily: fontStyle }}
                onClick={e => e.stopPropagation()} // Impede que o clique no conteúdo feche o modal
            >
                {/* Mensagem de Feedback */}
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

                {/* Botão Fechar */}
                <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                        transition-colors z-50"
                    onClick={handleClose}
                >
                    <Close fontSize="large" />
                </button>

                {/* Área de Login */}
                <div className="w-1/2 p-8 flex flex-col justify-center">
                    <div className="max-w-[400px] mx-auto w-full space-y-6">
                        <div className="text-center mb-8">
                            <h2 
                                className="text-3xl font-bold mb-2" 
                                style={{ 
                                    color: header?.color,
                                    ...getTextShadowStyle()
                                }}
                            >
                                Bem vindo de volta
                            </h2>
                            <p 
                                className="text-gray-600"
                                style={getTextShadowStyle()}
                            >
                                Por favor insira os detalhes da sua conta
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                    focus:ring-2 focus:ring-opacity-50 transition-all"
                                style={{ 
                                    focusRing: header?.color,
                                    focusBorderColor: header?.color 
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleLoginClient()}
                            />

                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Sua senha"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                    focus:ring-2 focus:ring-opacity-50 transition-all"
                                style={{ 
                                    focusRing: header?.color,
                                    focusBorderColor: header?.color 
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleLoginClient()}
                            />
                        </div>

                        <button
                            onClick={handleLoginClient}
                            className="w-full py-3 rounded-lg text-white font-medium 
                                transition-all hover:opacity-90"
                            style={{ backgroundColor: header?.color }}
                        >
                            Entrar
                        </button>
                    </div>
                </div>

                {/* Área Decorativa */}
                <div className="w-1/2 relative overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                            backgroundColor: header?.color,
                            backgroundImage: header?.backgroundImage ? 
                                `url(${header.backgroundImage})` : undefined,
                            opacity: header?.backgroundImageOpacity || 1,
                            filter: `blur(${header?.backgroundImageBlur || 0}px) 
                                brightness(${(header?.backgroundImageBrightness || 1) * 100}%)`
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
                    
                    <div className="relative h-full flex items-center justify-center p-12 text-white">
                        <h3 
                            className="text-4xl font-bold text-center leading-tight"
                            style={getTextShadowStyle()}
                        >
                            A experiência de leilão que você sempre quis.
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginClientModalAdv; 