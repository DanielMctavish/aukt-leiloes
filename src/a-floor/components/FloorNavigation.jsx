/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom"
import { AccountCircle, Notifications, SpaceDashboard, Inventory, Close } from "@mui/icons-material";
import "./floorStyles.css";
import DisplayClock from "./DisplayClock";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
        <div className="fixed top-[8vh] right-[22vh] w-[600px] max-h-[86vh] bg-white rounded-2xl shadow-2xl 
            overflow-hidden flex flex-col z-50">
            {/* Cabeçalho */}
            <div className="bg-[#012038] p-4 flex justify-between items-center sticky top-0 z-20">
                <h2 className="text-white text-xl font-bold">Catálogo de Produtos</h2>
                <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
                    <Close />
                </button>
            </div>

            {/* Lista de Produtos Agrupados */}
            <div className="flex-1 overflow-y-auto p-4">
                {sortedGroups?.map((group) => (
                    <div key={group} className="mb-6">
                        {/* Cabeçalho do Grupo */}
                        <div 
                            className="sticky top-0 z-10 mb-3 p-2 rounded-lg shadow-sm"
                            style={{ 
                                backgroundColor: generatePastelColor(group),
                                borderLeft: `6px solid ${generatePastelColor(group).replace('90%', '70%')}`
                            }}
                        >
                            <h3 className="text-lg font-bold text-gray-800 flex justify-between items-center">
                                <span>Grupo {group}</span>
                                <span className="text-sm font-normal text-gray-600">
                                    {groupedProducts[group].length} {groupedProducts[group].length === 1 ? 'item' : 'itens'}
                                </span>
                            </h3>
                        </div>

                        {/* Produtos do Grupo */}
                        <div className="space-y-4">
                            {groupedProducts[group]
                                .sort((a, b) => a.lote - b.lote)
                                .map((product) => (
                                <div key={product.id} 
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg 
                                        transition-all duration-300 border border-gray-100">
                                    <div className="flex">
                                        {/* Imagem do Produto */}
                                        <div className="w-[120px] h-[120px] flex-shrink-0">
                                            <img 
                                                src={product.cover_img_url} 
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Informações do Produto */}
                                        <div className="flex-1 p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {product.title}
                                                    </h3>
                                                    <span className="text-sm text-gray-500">
                                                        Lote: {product.lote}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm text-gray-500">Valor Inicial</span>
                                                    <span className="text-lg font-bold text-[#036982]">
                                                        {formatCurrency(product.initial_value)}
                                                    </span>
                                                    {product.real_value > 0 && (
                                                        <span className="text-sm font-medium text-green-600">
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
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function FloorNavigation({ auction, group }) {
    const [currentClient, setCurrentClient] = useState({})
    const [modalAllProducts, setModalAllProducts] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("client-auk-session-login"))
        setCurrentClient(currentSession)
    }, [])

    console.log("observando floor __>> ", auction.product_list)


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
            {modalAllProducts && (
                <ModalAllProducts 
                    products={auction?.product_list} 
                    onClose={() => setModalAllProducts(false)}
                />
            )}

            <div className="flex flex-row lg:flex-row justify-between items-center w-full">
                <div className="flex items-center gap-3">
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

                    {/* Etiqueta leilão - Versão Mobile */}
                    {auction && (
                        <div className="flex lg:hidden items-center gap-2">
                            <img 
                                src={auction.auct_cover_img} 
                                alt="" 
                                className="w-8 h-8 object-cover rounded-lg" 
                            />
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium truncate max-w-[150px]">
                                    {auction.title}
                                </span>
                                {group && (
                                    <span className="text-white/80 text-xs">
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
                            <img src={auction.auct_cover_img} alt="" 
                                className="w-[90px] h-[90px] object-cover rounded-lg" />
                            <div className="flex flex-col justify-start items-start 
                                w-[300px] h-[90px] bg-[#3c3c3c] 
                                rounded-lg p-2 text-white overflow-y-auto">
                                <h1 className="font-bold text-left w-full">{auction.title}</h1>
                                <p className="text-[12px] text-left">
                                    {auction.descriptions_informations}
                                </p>
                            </div>
                            <span className="font-bold text-[33px]">
                                {group && group}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-6 lg:gap-8">
                    <div className="hidden lg:block">
                        <DisplayClock />
                    </div>

                    <div className="flex gap-4 lg:gap-8 items-center">
                        <button 
                            onClick={() => setModalAllProducts(!modalAllProducts)}
                            className="p-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
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
                            <span className="hidden lg:inline text-[#012038]">catálogo</span>
                        </button>

                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
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
                        </button>

                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
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
                            </button>
                            <span className="hidden lg:block text-[#012038]">
                                {currentClient ?
                                    <span className="cursor-pointer" 
                                        onClick={() => navigate("/client/dashboard")}>
                                        {currentClient.name}
                                    </span> :
                                    <span className="cursor-pointer" 
                                        onClick={() => navigate("/client/login")}>
                                        acessar
                                    </span>
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default FloorNavigation;
