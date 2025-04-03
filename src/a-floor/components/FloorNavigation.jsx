/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom"
import { AccountCircle, Notifications, SpaceDashboard, Inventory, Close } from "@mui/icons-material";
import "./floorStyles.css";
import DisplayClock from "./DisplayClock";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ModalAllProducts = ({ products, onClose }) => {

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Função para gerar cor aleatória em tons pastéis
    const generatePastelColor = (seed) => {
        const hue = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 360;
        return `hsl(${hue}, 70%, 90%)`;
    };

    // Agrupar produtos por grupo
    const groupedProducts = products?.reduce((acc, product) => {
        const group = product.group || 'Sem Grupo';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(product);
        return acc;
    }, {});

    // Ordenar grupos
    const sortedGroups = Object.keys(groupedProducts || {}).sort();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[8vh] right-[22vh] w-[600px] max-h-[86vh] bg-white rounded-2xl shadow-2xl 
                overflow-hidden flex flex-col z-50 border border-gray-200"
        >
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-[#012038] to-[#023161] p-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <Inventory className="text-white/80" />
                    <h2 className="text-white text-xl font-bold">Catálogo de Produtos</h2>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-white bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-all duration-200"
                >
                    <Close />
                </button>
            </div>

            {/* Lista de Produtos Agrupados */}
            <div className="flex-1 overflow-y-auto p-4">
                {sortedGroups?.length > 0 ? (
                    sortedGroups.map((group) => (
                        <div key={group} className="mb-6">
                            {/* Cabeçalho do Grupo */}
                            <div
                                className="sticky top-0 z-10 mb-3 p-3 rounded-lg shadow-sm"
                                style={{
                                    backgroundColor: generatePastelColor(group),
                                    borderLeft: `6px solid ${generatePastelColor(group).replace('90%', '70%')}`
                                }}
                            >
                                <h3 className="text-lg font-bold text-gray-800 flex justify-between items-center">
                                    <span>Grupo {group}</span>
                                    <span className="text-sm font-normal bg-white/50 px-3 py-1 rounded-full text-gray-600">
                                        {groupedProducts[group].length} {groupedProducts[group].length === 1 ? 'item' : 'itens'}
                                    </span>
                                </h3>
                            </div>

                            {/* Produtos do Grupo */}
                            <div className="space-y-4">
                                {groupedProducts[group]
                                    .sort((a, b) => a.lote - b.lote)
                                    .map((product) => (
                                        <motion.div 
                                            key={product.id}
                                            whileHover={{ y: -3 }}
                                            className="bg-white rounded-xl shadow-md overflow-hidden 
                                            transition-all duration-300 border border-gray-100 hover:shadow-lg 
                                            hover:border-blue-100"
                                        >
                                            <div className="flex">
                                                {/* Imagem do Produto */}
                                                <div className="w-[120px] h-[120px] flex-shrink-0 relative overflow-hidden">
                                                    <img
                                                        src={product.cover_img_url}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-gray-900/70 text-white px-2 py-0.5 text-xs rounded-full">
                                                        Lote {product.lote}
                                                    </div>
                                                </div>

                                                {/* Informações do Produto */}
                                                <div className="flex-1 p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-800 hover:text-[#036982] transition-colors">
                                                                {product.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm text-gray-500">Valor Inicial</span>
                                                            <span className="text-lg font-bold text-[#036982]">
                                                                {formatCurrency(product.initial_value)}
                                                            </span>
                                                            {product.real_value > 0 && (
                                                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                                    Atual: {formatCurrency(product.real_value)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2 hover:line-clamp-none transition-all">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Inventory sx={{ fontSize: 48, opacity: 0.3 }} />
                        <p className="mt-4">Nenhum produto disponível no catálogo</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

function FloorNavigation({ auction, group }) {
    const [currentClient, setCurrentClient] = useState({})
    const [modalAllProducts, setModalAllProducts] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginError, setLoginError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const currentSession = localStorage.getItem("client-auk-session-login")
        
        if (currentSession) {
            // Verificar se a sessão ainda é válida
            verifyClientSession(JSON.parse(currentSession));
        }
    }, [])

    // Função para verificar a validade da sessão do cliente
    const verifyClientSession = async (session) => {
        try {
            // Verificando se o token ainda é válido fazendo uma requisição ao servidor
            const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_API}/client/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${session.token}`
                }
            });

            if (response.ok) {
                // Sessão válida, atualizar o estado
                setCurrentClient(session);
            } else {
                // Sessão inválida, limpar o localStorage
                console.log("Sessão expirada ou inválida, removendo dados...");
                localStorage.removeItem("client-auk-session-login");
                setCurrentClient(null);
            }
        } catch (error) {
            console.error("Erro ao verificar sessão:", error);

            // Se houver erro na verificação, é mais seguro remover a sessão
            localStorage.removeItem("client-auk-session-login");
            setCurrentClient(null);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setLoginError('')

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, loginData)
            
            if (response.data.token) {
                const sessionData = {
                    token: response.data.token,
                    name: response.data.name,
                    email: response.data.email
                }
                localStorage.setItem("client-auk-session-login", JSON.stringify(sessionData))
                setCurrentClient(sessionData)
                setShowLoginModal(false)
                setLoginData({ email: '', password: '' })
            }
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    


    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-[60px] lg:min-h-[100px] rounded-none lg:rounded-[22px] 
                flex flex-col lg:flex-row justify-between p-2 lg:p-3 items-center 
                bg-white/10 lg:bg-[#d2d2d291] backdrop-blur-md shadow-sm lg:shadow-xl shadow-[#1414143a] 
                border-b border-white/10 lg:border-b-[2px] lg:border-[#e3e3e3] z-[2] relative gap-4 lg:gap-0"
        >
            <AnimatePresence>
                {modalAllProducts && (
                    <ModalAllProducts
                        products={auction?.product_list}
                        onClose={() => setModalAllProducts(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowLoginModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#012038]">Login</h2>
                                <button 
                                    onClick={() => setShowLoginModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Close />
                                </button>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 
                                            focus:ring-[#012038] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 
                                            focus:ring-[#012038] focus:border-transparent"
                                        required
                                    />
                                </div>

                                {loginError && (
                                    <div className="text-red-500 text-sm">
                                        {loginError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-2 px-4 rounded-lg text-white font-medium
                                        transition-all duration-200 ${
                                            isLoading 
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-[#012038] hover:bg-[#023161]'
                                        }`}
                                >
                                    {isLoading ? 'Entrando...' : 'Entrar'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-row lg:flex-row justify-between items-center w-full">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <SpaceDashboard
                            onClick={() => { navigate("/floor/hub") }}
                            sx={{
                                fontSize: "24px",
                                cursor: "pointer",
                                background: 'linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                '@media (min-width: 1024px)': {
                                    background: 'none',
                                    WebkitBackgroundClip: 'unset',
                                    WebkitTextFillColor: 'unset',
                                    color: "#082841",
                                    fontSize: "36px",
                                }
                            }}
                        />
                    </motion.div>

                    {/* Etiqueta leilão - Versão Mobile */}
                    {auction && (
                        <div className="flex lg:hidden items-center gap-2 bg-black/40 p-1.5 pr-3 rounded-lg">
                            <img
                                src={auction.auct_cover_img}
                                alt=""
                                className="w-8 h-8 object-cover rounded-lg shadow-md"
                            />
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium truncate max-w-[150px]">
                                    {auction.title}
                                </span>
                                {group && (
                                    <span className="text-white/80 text-xs bg-white/10 px-1.5 rounded">
                                        Grupo {group}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Etiqueta leilão - Versão Desktop */}
                    {auction && (
                        <div className="hidden lg:flex flex-row justify-center items-center gap-3 
                            w-[400px] relative left-[9vh] ml-[-83px]">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="overflow-hidden rounded-lg shadow-lg"
                            >
                                <img src={auction.auct_cover_img} alt=""
                                    className="w-[90px] h-[90px] object-cover hover:scale-110 transition-transform duration-500" />
                            </motion.div>
                            <div className="flex flex-col justify-start items-start 
                                w-[300px] h-[90px] bg-gradient-to-br from-[#3c3c3c] to-[#2a2a2a]
                                rounded-lg p-2 text-white overflow-y-auto shadow-lg border border-gray-700/50">
                                <h1 className="font-bold text-left w-full">{auction.title}</h1>
                                <p className="text-[12px] text-left text-gray-300">
                                    {auction.descriptions_informations}
                                </p>
                            </div>
                            {group && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="font-bold text-[33px] bg-[#012038] text-white px-4 py-2 rounded-lg shadow-lg"
                                >
                                    {group}
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-6 lg:gap-8">
                    <div className="hidden lg:block">
                        <DisplayClock message={auction.display_message} />
                    </div>

                    <div className="flex gap-4 lg:gap-8 items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setModalAllProducts(!modalAllProducts)}
                            className="p-2 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-colors"
                        >
                            <Inventory sx={{
                                fontSize: "24px",
                                background: 'linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                '@media (min-width: 1024px)': {
                                    background: 'none',
                                    WebkitBackgroundClip: 'unset',
                                    WebkitTextFillColor: 'unset',
                                    color: "#012038",
                                    fontSize: "28px"
                                }
                            }} />
                            <span className="hidden lg:inline text-[#012038] font-medium">Catálogo</span>
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <Notifications sx={{
                                fontSize: "24px",
                                background: 'linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                '@media (min-width: 1024px)': {
                                    background: 'none',
                                    WebkitBackgroundClip: 'unset',
                                    WebkitTextFillColor: 'unset',
                                    color: "#012038",
                                    fontSize: "28px"
                                }
                            }} />
                        </motion.button>

                        <div className="flex items-center gap-2">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => currentClient ? navigate("/client/dashboard") : setShowLoginModal(true)}
                                className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <AccountCircle sx={{
                                    fontSize: "24px",
                                    background: 'linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    '@media (min-width: 1024px)': {
                                        background: 'none',
                                        WebkitBackgroundClip: 'unset',
                                        WebkitTextFillColor: 'unset',
                                        color: "#012038",
                                        fontSize: "28px"
                                    }
                                }} />
                            </motion.button>
                            <span className="hidden lg:block text-[#012038] font-medium">
                                {currentClient ? (
                                    <motion.span 
                                        whileHover={{ color: "#036982" }}
                                        className="cursor-pointer transition-colors"
                                        onClick={() => navigate("/client/dashboard")}
                                    >
                                        {currentClient.name}
                                    </motion.span>
                                ) : (
                                    <motion.span 
                                        whileHover={{ color: "#036982" }}
                                        className="cursor-pointer transition-colors"
                                        onClick={() => setShowLoginModal(true)}
                                    >
                                        Acessar
                                    </motion.span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default FloorNavigation;
