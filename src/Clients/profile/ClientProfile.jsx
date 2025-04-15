/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { getClientInformations } from "../functions/getClientInformations";
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls";

// Componentes
import TabNavigation from "./components/TabNavigation";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import AvatarTab from "./tabs/AvatarTab";
import SecurityTab from "./tabs/SecurityTab";
import EmailTab from "./tabs/EmailTab";

// Estilos
import "./styles.css";

// Convertendo o objeto de URLs em um array
const avatares_pessoas = Object.values(avatarClientsUrls);

function ClientProfile() {
    const [isLoading, setIsloading] = useState(false)
    const [name, setName] = useState("")
    const [nickname, setNickname] = useState("")
    const [clientAvatar, setClientAvatar] = useState(0)
    const [currentClient, setCurrentClient] = useState({})
    const [activeTab, setActiveTab] = useState('info')
    
    // Estado para gerenciar as etapas de mudança de senha
    const [passwordChangeStep, setPasswordChangeStep] = useState('current') // 'current', 'new', 'success'
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordAttempts, setPasswordAttempts] = useState(0) // Contador de tentativas de senha
    const [isAuthenticating, setIsAuthenticating] = useState(false) // Estado para controlar autenticação em andamento
    
    const navigate = useNavigate()

    useEffect(() => {
        getClientInformations(navigate, null, setCurrentClient, null, null, null, null)
    }, [])

    useEffect(() => {
        if (currentClient) {
            setName(currentClient.name || "")
            setNickname(currentClient.nickname || "")
            setClientAvatar(currentClient.client_avatar || 0)
        }
    }, [currentClient])

    const handleEditAccount = useCallback(async () => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        setIsloading(true)
        try {
            await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/client/update-client?client_id=${currentClient.id}`, {
                name: name ? name : undefined,
                nickname: nickname ? nickname : undefined,
                client_avatar: clientAvatar ? clientAvatar : undefined
            }, {
                headers: {
                    Authorization: `Bearer ${currentSession.token}`
                }
            })
            setIsloading(false)
            navigate("/client/dashboard")
        } catch (error) {
            setIsloading(false)
        }
    }, [currentClient, name, nickname, clientAvatar, navigate]);

    const handleSelectAvatar = useCallback((index) => setClientAvatar(index), []);
    
    // Manipuladores para mudança de senha
    const handleCurrentPasswordChange = useCallback((e) => setCurrentPassword(e.target.value), []);
    const handleNewPasswordChange = useCallback((e) => setNewPassword(e.target.value), []);
    const handleConfirmPasswordChange = useCallback((e) => setConfirmPassword(e.target.value), []);
    
    const verifyCurrentPassword = useCallback(async () => {
        setPasswordError('');
        setIsAuthenticating(true);
        
        if (!currentPassword) {
            setPasswordError('Por favor, digite sua senha atual');
            setIsAuthenticating(false);
            return;
        }
        
        try {
            // Usar a rota de login para verificar a senha
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                email: currentClient.email,
                password: currentPassword
            });
            
            // Se chegou aqui, a senha está correta
            setPasswordAttempts(0); // Reseta contador de tentativas
            setPasswordChangeStep('new');
            
        } catch (error) {
            // Incrementa o contador de tentativas
            const newAttempts = passwordAttempts + 1;
            setPasswordAttempts(newAttempts);
            
            // Se atingiu 3 tentativas, desloga o usuário
            if (newAttempts >= 3) {
                setPasswordError('Excedido o número máximo de tentativas. Por segurança, você será desconectado.');
                
                // Espera 1.5 segundos antes de deslogar para que o usuário possa ler a mensagem
                setTimeout(() => {
                    localStorage.removeItem("client-auk-session-login");
                    navigate("/");
                }, 1500);
            } else {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    if (newAttempts === 2) {
                        setPasswordError(`Cuidado! Esta é sua última tentativa antes de bloquearmos seu acesso.`);
                    } else {
                        setPasswordError(`Senha incorreta. Você tem mais ${3 - newAttempts} tentativa(s).`);
                    }
                } else {
                    setPasswordError('Erro ao verificar senha. Tente novamente mais tarde.');
                }
            }
        } finally {
            setIsAuthenticating(false);
        }
    }, [currentPassword, passwordAttempts, currentClient.email, navigate]);
    
    const handlePasswordSave = useCallback(async () => {
        setPasswordError('');
        
        // Validações
        if (newPassword.length < 6) {
            setPasswordError('Nova senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setPasswordError('As senhas não coincidem');
            return;
        }
        
        setIsloading(true);
        
        try {
            const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"));
            
            // Usar a mesma rota de atualização do cliente para alterar a senha
            await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/client/update-client?client_id=${currentClient.id}`, {
                password: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${currentSession.token}`
                }
            });
            
            // Sucesso na atualização
            setPasswordChangeStep('success');
            
            // Resetar os campos após 3 segundos e voltar para a primeira etapa
            setTimeout(() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordChangeStep('current');
            }, 3000);
            
        } catch (error) {
            if (error.response?.data?.message) {
                setPasswordError(error.response.data.message);
            } else {
                setPasswordError('Erro ao atualizar senha. Tente novamente mais tarde.');
            }
        } finally {
            setIsloading(false);
        }
    }, [newPassword, confirmPassword, currentClient.id]);
    
    const resetPasswordFlow = useCallback(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setPasswordAttempts(0); // Reseta contador de tentativas
        setPasswordChangeStep('current');
    }, []);
    
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        
        // Resetar o fluxo de senha ao mudar de aba
        if (tab !== 'password') {
            resetPasswordFlow();
        }
    }, [resetPasswordFlow]);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
            <AssideClient MenuSelected="menu-6" />

            <section className="flex-1 flex flex-col gap-3 p-3 sm:p-5 overflow-y-auto">
                <div className="z-[10]">
                    <NavClient currentClient={currentClient} />
                </div>

                {!isLoading ? (
                    <div className="max-w-6xl mx-auto w-full">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="p-4 sm:p-6 flex items-center gap-4 border-b border-gray-100">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-100 shadow-sm">
                                    <img 
                                        src={avatares_pessoas[clientAvatar] || avatares_pessoas[0]} 
                                        alt="Perfil" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                        {currentClient.name || "Perfil do Cliente"}
                                    </h1>
                                    <p className="text-gray-500">
                                        {currentClient.email || "carregando..."}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Navegação por abas */}
                            <TabNavigation 
                                activeTab={activeTab} 
                                handleTabChange={handleTabChange} 
                            />
                            
                            {/* Conteúdo das abas */}
                            <div className="p-4 sm:p-6">
                                {/* Aba de Informações Pessoais */}
                                {activeTab === 'info' && (
                                    <PersonalInfoTab 
                                        name={name}
                                        setName={setName}
                                        nickname={nickname}
                                        setNickname={setNickname}
                                        handleEditAccount={handleEditAccount}
                                        isLoading={isLoading}
                                    />
                                )}
                                
                                {/* Aba de Avatar */}
                                {activeTab === 'avatar' && (
                                    <AvatarTab 
                                        avatares={avatares_pessoas}
                                        clientAvatar={clientAvatar}
                                        handleSelectAvatar={handleSelectAvatar}
                                        handleEditAccount={handleEditAccount}
                                        isLoading={isLoading}
                                    />
                                )}
                                
                                {/* Aba de Segurança */}
                                {activeTab === 'password' && (
                                    <SecurityTab 
                                        passwordChangeStep={passwordChangeStep}
                                        currentPassword={currentPassword}
                                        newPassword={newPassword}
                                        confirmPassword={confirmPassword}
                                        passwordError={passwordError}
                                        passwordAttempts={passwordAttempts}
                                        handleCurrentPasswordChange={handleCurrentPasswordChange}
                                        handleNewPasswordChange={handleNewPasswordChange}
                                        handleConfirmPasswordChange={handleConfirmPasswordChange}
                                        verifyCurrentPassword={verifyCurrentPassword}
                                        handlePasswordSave={handlePasswordSave}
                                        resetPasswordFlow={resetPasswordFlow}
                                        isLoading={isLoading}
                                        isAuthenticating={isAuthenticating}
                                    />
                                )}
                                
                                {/* Aba de Email */}
                                {activeTab === 'email' && (
                                    <EmailTab currentEmail={currentClient.email || ''} />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-1">
                        <div className="animate-spin rounded-full h-10 w-10 border-3 border-green-500 border-t-transparent" />
                    </div>
                )}
            </section>
        </div>
    );
}

export default ClientProfile;