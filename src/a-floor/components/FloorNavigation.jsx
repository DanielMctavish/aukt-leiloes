/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom"
import { AccountCircle, Notifications, SpaceDashboard, Inventory, Close, Logout, Dashboard } from "@mui/icons-material";
import "./floorStyles.css";
import DisplayClock from "./DisplayClock";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReceiveWebsocketOnFloor from "../class/ReceiveWebsocketOnFloor";
import { getAuctionInformations } from "../functions/getAuctionInformations";

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

function FloorNavigation({ setShowLoginModal }) {
    const { auct_id } = useParams();
    const [currentClient, setCurrentClient] = useState({})
    const [modalAllProducts, setModalAllProducts] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [currentAuct, setCurrentAuct] = useState(null)
    const [currentProduct, setCurrentProduct] = useState(null)
    const userMenuRef = useRef(null)
    const websocketRef = useRef(null)
    const navigate = useNavigate()

    // Buscar informações iniciais do leilão
    useEffect(() => {
        getAuctionInformations(auct_id, setCurrentAuct);
    }, [auct_id]);
    
    // Inicializa o websocket
    useEffect(() => {
        websocketRef.current = new ReceiveWebsocketOnFloor(auct_id);

        // Configura os listeners
        websocketRef.current.receivePlayingAuction((message) => {
            const { body } = message.data;
            setCurrentAuct(body.auction);
            setCurrentProduct(body.product);
        });

        websocketRef.current.receiveBidMessage((message) => {
            const { body } = message.data;
            if (body.currentBid) {
                setCurrentProduct(prevProduct => ({
                    ...prevProduct,
                    real_value: body.currentBid.value,
                    Bid: [...(prevProduct?.Bid || []), body.currentBid]
                }));
            }
        });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.disconnect();
            }
        };
    }, [auct_id]);

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
            localStorage.removeItem("client-auk-session-login");
            setCurrentClient(null);
        }
    }

    // Ouvir evento de login bem-sucedido
    useEffect(() => {
        const handleLoginSuccess = (event) => {
            setCurrentClient(event.detail);
            setShowLoginModal(false);
        };

        window.addEventListener('clientLoginSuccess', handleLoginSuccess);

        return () => {
            window.removeEventListener('clientLoginSuccess', handleLoginSuccess);
        };
    }, []);

    // Fechar menu quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("client-auk-session-login");
        setCurrentClient(null);
        setShowUserMenu(false);
        
        // Disparar evento de logout
        const logoutEvent = new CustomEvent('clientLogout');
        window.dispatchEvent(logoutEvent);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-[60px] lg:min-h-[100px] rounded-none lg:rounded-[22px] 
                flex flex-col lg:flex-row justify-between p-2 lg:p-3 items-center 
                bg-[#012038]/90 lg:bg-[#d2d2d291] backdrop-blur-md shadow-sm lg:shadow-xl shadow-[#1414143a] 
                border-b border-white/10 lg:border-b-[2px] lg:border-[#e3e3e3] z-[2] relative gap-4 lg:gap-0
                fixed lg:relative top-0 left-0 right-0"
        >
            <AnimatePresence>
                {modalAllProducts && (
                    <ModalAllProducts
                        products={currentAuct?.product_list}
                        onClose={() => setModalAllProducts(false)}
                    />
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
                                color: "#fff",
                                '@media (min-width: 1024px)': {
                                    color: "#082841",
                                    fontSize: "36px",
                                }
                            }}
                        />
                    </motion.div>

                    {/* Etiqueta leilão - Versão Mobile */}
                    {currentAuct && (
                        <div className="flex lg:hidden items-center gap-2 bg-white/10 p-1.5 pr-3 rounded-lg">
                            <img
                                src={currentAuct.auct_cover_img}
                                alt=""
                                className="w-8 h-8 object-cover rounded-lg shadow-md"
                            />
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium truncate max-w-[150px]">
                                    {currentAuct.title}
                                </span>
                                {currentProduct?.group && (
                                    <span className="text-white/80 text-xs bg-white/20 px-1.5 rounded">
                                        Grupo {currentProduct.group}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Etiqueta leilão - Versão Desktop */}
                    {currentAuct && (
                        <div className="hidden lg:flex flex-row justify-center items-center gap-3 
                            w-[400px] relative left-[9vh] ml-[-83px]">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="overflow-hidden rounded-lg shadow-lg"
                            >
                                <img src={currentAuct.auct_cover_img} alt=""
                                    className="w-[90px] h-[90px] object-cover hover:scale-110 transition-transform duration-500" />
                            </motion.div>
                            <div className="flex flex-col justify-start items-start 
                                w-[300px] h-[90px] bg-gradient-to-br from-[#3c3c3c] to-[#2a2a2a]
                                rounded-lg p-2 text-white overflow-y-auto shadow-lg border border-gray-700/50">
                                <h1 className="font-bold text-left w-full">{currentAuct.title}</h1>
                                <p className="text-[12px] text-left text-gray-300">
                                    {currentAuct.descriptions_informations}
                                </p>
                            </div>
                            {currentProduct?.group && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="font-bold text-[33px] bg-[#012038] text-white px-4 py-2 rounded-lg shadow-lg"
                                >
                                    {currentProduct.group}
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4 lg:gap-8">
                    <div className="hidden lg:block">
                        <DisplayClock message={currentAuct?.display_message} />
                    </div>

                    <div className="flex gap-3 lg:gap-8 items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setModalAllProducts(!modalAllProducts)}
                            className="p-2 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-colors"
                        >
                            <Inventory sx={{
                                fontSize: "24px",
                                color: "#fff",
                                '@media (min-width: 1024px)': {
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
                                color: "#fff",
                                '@media (min-width: 1024px)': {
                                    color: "#012038",
                                    fontSize: "28px"
                                }
                            }} />
                        </motion.button>

                        <div className="flex items-center gap-2 relative" ref={userMenuRef}>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (currentClient && Object.keys(currentClient).length > 0) {
                                        setShowUserMenu(!showUserMenu);
                                    } else {
                                        setShowLoginModal(true);
                                    }
                                }}
                                className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <AccountCircle sx={{
                                    fontSize: "24px",
                                    color: "#fff",
                                    '@media (min-width: 1024px)': {
                                        color: "#012038",
                                        fontSize: "28px"
                                    }
                                }} />
                            </motion.button>
                            <span className="hidden lg:block text-[#012038] font-medium">
                                {currentClient && Object.keys(currentClient).length > 0 ? (
                                    <motion.span 
                                        whileHover={{ color: "#036982" }}
                                        className="cursor-pointer transition-colors"
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                    >
                                        {currentClient.name}
                                    </motion.span>
                                ) : (
                                    <motion.span 
                                        whileHover={{ color: "#036982" }}
                                        className="cursor-pointer transition-colors text-white lg:text-[#012038]"
                                        onClick={() => setShowLoginModal(true)}
                                    >
                                        Acessar
                                    </motion.span>
                                )}
                            </span>

                            {/* Menu de Contexto do Usuário */}
                            <AnimatePresence>
                                {showUserMenu && currentClient && Object.keys(currentClient).length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl 
                                            border border-gray-100 overflow-hidden z-50"
                                    >
                                        <div className="p-3 bg-gradient-to-r from-[#012038] to-[#023161] text-white">
                                            <p className="text-sm font-medium truncate">{currentClient.name}</p>
                                            <p className="text-xs text-white/70 truncate">{currentClient.email}</p>
                                        </div>
                                        
                                        <div className="p-1">
                                            <motion.button
                                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                                onClick={() => {
                                                    navigate("/client/dashboard");
                                                    setShowUserMenu(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg text-sm"
                                            >
                                                <Dashboard fontSize="small" />
                                                <span>Meu Pregão</span>
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ backgroundColor: "#fee2e2" }}
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 rounded-lg text-sm"
                                            >
                                                <Logout fontSize="small" />
                                                <span>Sair</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default FloorNavigation;
