/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
import axios from "axios"
import { useEffect, useState } from "react";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import getAuctionsList from "../functions/GetAuctionsList";
import avatar_01 from '../../media/avatar-floor/avatar_01.png'
import avatar_02 from '../../media/avatar-floor/avatar_02.png'
import avatar_03 from '../../media/avatar-floor/avatar_03.png'
import avatar_04 from '../../media/avatar-floor/avatar_04.png'
import avatar_05 from '../../media/avatar-floor/avatar_05.png'
import avatar_06 from '../../media/avatar-floor/avatar_06.png'
import avatar_07 from '../../media/avatar-floor/avatar_07.png'
import avatar_08 from '../../media/avatar-floor/avatar_08.png'
import avatar_09 from '../../media/avatar-floor/Avatar_09.png'
import avatar_10 from '../../media/avatar-floor/Avatar_10.png'
import avatar_11 from '../../media/avatar-floor/Avatar_11.png'
import avatar_12 from '../../media/avatar-floor/Avatar_12.png'
import avatar_13 from '../../media/avatar-floor/Avatar_13.png'
import avatar_14 from '../../media/avatar-floor/Avatar_14.png'
import avatar_15 from '../../media/avatar-floor/Avatar_15.png'
import avatar_16 from '../../media/avatar-floor/Avatar_16.png'
import avatar_17 from '../../media/avatar-floor/Avatar_17.png'
import avatar_18 from '../../media/avatar-floor/Avatar_18.png'
import avatar_19 from '../../media/avatar-floor/Avatar_19.png'
import avatar_20 from '../../media/avatar-floor/Avatar_20.png'
import avatar_21 from '../../media/avatar-floor/Avatar_21.png'
import avatar_22 from '../../media/avatar-floor/Avatar_22.png'
import avatar_23 from '../../media/avatar-floor/Avatar_23.png'
import avatar_24 from '../../media/avatar-floor/Avatar_24.png'
import avatar_25 from '../../media/avatar-floor/Avatar_25.png'
import avatar_26 from '../../media/avatar-floor/Avatar_26.png'
import avatar_27 from '../../media/avatar-floor/Avatar_27.png'
import avatar_28 from '../../media/avatar-floor/Avatar_28.png'
import avatar_29 from '../../media/avatar-floor/Avatar_29.png'
import avatar_30 from '../../media/avatar-floor/Avatar_30.png'
import avatar_31 from '../../media/avatar-floor/Avatar_31.png'
import avatar_32 from '../../media/avatar-floor/Avatar_32.png'
import avatar_33 from '../../media/avatar-floor/Avatar_33.png'
import avatar_34 from '../../media/avatar-floor/Avatar_34.png'
import avatar_35 from '../../media/avatar-floor/Avatar_35.png'
import avatar_36 from '../../media/avatar-floor/Avatar_36.png'
import avatar_37 from '../../media/avatar-floor/Avatar_37.png'
import avatar_38 from '../../media/avatar-floor/Avatar_38.png'
import avatar_39 from '../../media/avatar-floor/Avatar_39.png'
import avatar_40 from '../../media/avatar-floor/Avatar_40.png'
import avatar_41 from '../../media/avatar-floor/Avatar_41.png'
import avatar_42 from '../../media/avatar-floor/Avatar_42.png'
import avatar_43 from '../../media/avatar-floor/Avatar_43.png'
import avatar_44 from '../../media/avatar-floor/Avatar_44.png'
import avatar_45 from '../../media/avatar-floor/Avatar_45.png'
import avatar_46 from '../../media/avatar-floor/Avatar_46.png'
import avatar_47 from '../../media/avatar-floor/Avatar_47.png'
import avatar_48 from '../../media/avatar-floor/Avatar_48.png'
import avatar_49 from '../../media/avatar-floor/Avatar_49.png'
import avatar_50 from '../../media/avatar-floor/Avatar_50.png'  
import avatar_51 from '../../media/avatar-floor/Avatar_51.png'
import avatar_52 from '../../media/avatar-floor/Avatar_52.png'
import avatar_53 from '../../media/avatar-floor/Avatar_53.png'
import avatar_54 from '../../media/avatar-floor/Avatar_54.png'
import avatar_55 from '../../media/avatar-floor/Avatar_55.png'
import avatar_56 from '../../media/avatar-floor/Avatar_56.png'
import avatar_57 from '../../media/avatar-floor/Avatar_57.png'
import avatar_58 from '../../media/avatar-floor/Avatar_58.png'


import LoadingModal from "./mod/LoadingModal";
import { useNavigate } from "react-router-dom";
import CartelasToConfirm from './components/CartelasToConfirm';
import CartelasConfirmadas from './components/CartelasConfirmadas';

function Arrematantes() {
    const [isCreating, setIsCreating] = useState(false)
    const [selectedCartelaStatus, setCartelaStatus] = useState("PENDENT")
    const [selectedAuction, setSelectedAuction] = useState('')
    const [aucts, setAucts] = useState([]);
    const [clientsGrouped, setClientsGrouped] = useState([]);
    const [showMod, setShowMod] = useState({});
    const [cartelas, setCartelas] = useState();
    const [activeTab, setActiveTab] = useState('toConfirm');
    const [trackingCodes, setTrackingCodes] = useState({});
    const [updatingCartelas, setUpdatingCartelas] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedCartela, setSelectedCartela] = useState(null);
    const navigate = useNavigate()

    const avatares_pessoas = [
        avatar_01,avatar_02,avatar_03,avatar_04, avatar_05,avatar_06,avatar_07,avatar_08,avatar_09,
        avatar_10,avatar_11,avatar_12,avatar_13,avatar_14,avatar_15,avatar_16,avatar_17,avatar_18,avatar_19,
        avatar_20,avatar_21,avatar_22,avatar_23,avatar_24,avatar_25,avatar_26,avatar_27,avatar_28,avatar_29,
        avatar_30,avatar_31,avatar_32,avatar_33,avatar_34,avatar_35,avatar_36,avatar_37,avatar_38,avatar_39,
        avatar_40,avatar_41,avatar_42,avatar_43,avatar_44,avatar_45,avatar_46,avatar_47,avatar_48,avatar_49,
        avatar_50,avatar_51,avatar_52,avatar_53,avatar_54,avatar_55,avatar_56,avatar_57,avatar_58
    ];

    useEffect(() => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt');
        getAuctionsList(currentLocalAdvertiser, setAucts);
    }, []);

    useEffect(() => {
        const groupedClients = {};

        aucts.forEach(auction => {
            auction.product_list.forEach(product => {
                if (!product.Winner) return;

                const groupKey = `${auction.id}-${product.Winner.id}`;

                if (!groupedClients[groupKey]) {
                    groupedClients[groupKey] = {
                        id: auction.id,
                        auction: auction.title,
                        advertiser_id: auction.creator_id,
                        avatar: product.Winner.client_avatar,
                        winner_id: product.Winner.id,
                        name: product.Winner.name,
                        client_email: product.Winner.email,
                        nickname: product.Winner.nickname,
                        cover: product.Winner.client_avatar,
                        products: [],
                        status: "PENDENT"
                    };
                }

                groupedClients[groupKey].products.push(product);
            });
        });

        Object.values(groupedClients).forEach(group => {
            const groupTotal = group.products.reduce((sum, p) => sum + p.real_value, 0);

            const exists = cartelas?.some(cartela =>
                cartela.amount === groupTotal &&
                cartela.client_id === group.winner_id &&
                cartela.products.length === group.products.length
            );

            if (exists) {
                delete groupedClients[`${group.id}-${group.winner_id}`];
            }
        });

        setClientsGrouped(Object.values(groupedClients));
    }, [aucts, showMod, selectedAuction, cartelas]);

    const fetchCartelas = async (auction_id) => {
        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"));
        if (!cookieSession) return navigate("/");

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/list-cartelas`, {
                params: { auction_id },
                headers: {
                    Authorization: `Bearer ${cookieSession.token}`
                }
            });

            if (response.data) {
                setCartelas(response.data);
                
                // Atualiza também a lista de clientes agrupados para remover os que já têm cartelas
                const confirmedClientIds = response.data.map(cartela => cartela.client_id);
                
                setClientsGrouped(prev => 
                    prev.filter(group => 
                        group.id !== auction_id || !confirmedClientIds.includes(group.winner_id)
                    )
                );
            }
        } catch (error) {
            console.error("Erro ao buscar cartelas:", error);
        }
    };

    const handleAuctionSelect = async (auction_id) => {
        setSelectedAuction(auction_id);
        fetchCartelas(auction_id);
    }

    const handleConfirmCard = async (advertiser_id, products, client_id, client_email) => {
        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"));

        if (!cookieSession) return navigate("/");

        setIsCreating(true);

        try {
            const totalAmount = products.reduce((sum, product) => sum + product.real_value, 0);
            
            const payload = {
                advertiser_id,
                client_id,
                auction_id: selectedAuction,
                products,
                amount: totalAmount,
                status: selectedCartelaStatus
            };

            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/cartela/create-cartela`, 
                payload, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookieSession.token}`
                    }
                }
            );

            if (response.data) {
                const newCartela = response.data;
                
                // Enviar email após criar a cartela
                try {
                    await axios.post(
                        `${import.meta.env.VITE_APP_BACKEND_API}/cartela/send-email-cartela`,
                        {
                            cartelaId: newCartela.id,
                            emailTo: client_email
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${cookieSession.token}`
                            }
                        }
                    );
                } catch (emailError) {
                    console.error("Erro ao enviar email:", emailError);
                    // Não interrompe o fluxo se o email falhar
                }

                // Atualiza o estado local
                setCartelas(prev => prev ? [...prev, newCartela] : [newCartela]);
                
                setClientsGrouped(prev => 
                    prev.filter(group => 
                        !(group.id === selectedAuction && group.winner_id === client_id)
                    )
                );
                
                setActiveTab('confirmed');
            }

            fetchCartelas(selectedAuction);
        } catch (error) {
            console.error("Erro ao confirmar cartela:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdateCartela = async (cartela_id) => {
        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"));

        if (!cookieSession) return navigate("/");

        // Se o ID da cartela for fornecido, abra o modal para edição
        if (cartela_id) {
            const cartela = cartelas.find(c => c.id === cartela_id);
            setSelectedCartela(cartela_id);
            setCartelaStatus(cartela.status); // Define o status atual da cartela
            setShowModal(true);
            return;
        }

        // Validação do código de rastreio quando status é SENDED
        if (selectedCartelaStatus === "SENDED" && !trackingCodes[selectedCartela]) {
            alert("Por favor, insira o código de rastreio antes de atualizar para status 'Enviado'");
            return;
        }

        setUpdatingCartelas(prev => ({ ...prev, [selectedCartela]: true }));

        try {
            const payload = {
                status: selectedCartelaStatus,
                tracking_code: selectedCartelaStatus === "SENDED" ? trackingCodes[selectedCartela] : null
            };

            const response = await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/update-cartela`, payload, {
                params: { cartela_id: selectedCartela },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookieSession.token}`
                }
            });

            if (response.data) {
                // Atualiza a cartela localmente
                setCartelas(prev => prev.map(cartela => 
                    cartela.id === selectedCartela 
                        ? { 
                            ...cartela, 
                            status: selectedCartelaStatus, 
                            tracking_code: payload.tracking_code 
                          }
                        : cartela
                ));
                
                // Limpa o código de rastreio se o status não for mais SENDED
                if (selectedCartelaStatus !== "SENDED") {
                    setTrackingCodes(prev => {
                        const newCodes = { ...prev };
                        delete newCodes[selectedCartela];
                        return newCodes;
                    });
                }
                
                setShowModal(false);
                // Atualiza os dados do servidor
                await fetchCartelas(selectedAuction);
            }
        } catch (error) {
            console.error("Erro ao atualizar cartela:", error);
            alert("Erro ao atualizar a cartela. Por favor, tente novamente.");
        } finally {
            setUpdatingCartelas(prev => ({ ...prev, [selectedCartela]: false }));
        }
    };

    // Função para lidar com a atualização no modal
    const handleModalUpdate = () => {
        handleUpdateCartela(); // Chama sem parâmetros para executar a atualização
    };

    useEffect(() => {}, [cartelas])

    useEffect(() => {
        function handleClickOutside(event) {
            const isOutsideModal = !event.target.closest('.product-modal-container');
            const isOutsideTrigger = !event.target.closest('.product-count-trigger');
            
            if (isOutsideModal && isOutsideTrigger) {
                setShowMod({});
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

   

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="flex flex-col lg:flex-row min-h-screen">
                <AssideAdvertiser MenuSelected="menu-5" />
                <div className="flex-1 flex flex-col">
                    <NavAdvertiser path="Arrematantes" />
                    
                    <main className="flex-1 p-4">
                        <div className="container mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-[#012038] mb-1 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1dad24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Arrematantes
                                        </h1>
                                        <p className="text-gray-500 text-sm">Gerencie os arrematantes e confirme as cartelas</p>
                                    </div>
                                    
                                    <div className="w-full md:w-auto">
                                        <select
                                            value={selectedAuction}
                                            onChange={(e) => handleAuctionSelect(e.target.value)}
                                            className="w-full md:w-64 p-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 
                                                focus:border-[#1dad24] focus:ring-1 focus:ring-[#1dad24] outline-none shadow-sm
                                                text-sm font-medium"
                                        >
                                            <option value="">Selecione um leilão</option>
                                            {aucts.map(auction => (
                                                <option key={auction.id} value={auction.id}>
                                                    {auction.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {selectedAuction && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1dad24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h2 className="text-lg font-semibold text-[#012038]">Informações do Leilão</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Título</p>
                                                <p className="font-medium text-[#012038]">
                                                    {aucts.find(a => a.id === selectedAuction)?.title || "Leilão Selecionado"}
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Total de Produtos</p>
                                                <p className="font-medium text-[#012038]">
                                                    {aucts.find(a => a.id === selectedAuction)?.product_list?.length || 0} produtos
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Produtos Arrematados</p>
                                                <p className="font-medium text-[#012038]">
                                                    {aucts.find(a => a.id === selectedAuction)?.product_list?.filter(p => p.Winner)?.length || 0} produtos
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tabs */}
                                <div className="mb-4">
                                    <div className="border-b border-gray-200">
                                        <nav className="flex gap-4">
                                            <button
                                                onClick={() => setActiveTab('toConfirm')}
                                                className={`py-2 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm
                                                    ${activeTab === 'toConfirm'
                                                        ? 'border-[#012038] text-[#012038]'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1dad24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Cartelas a confirmar
                                                {clientsGrouped.filter(group => group.id === selectedAuction).length > 0 && (
                                                    <span className="bg-[#1dad24] text-white text-xs px-2 py-0.5 rounded-full">
                                                        {clientsGrouped.filter(group => group.id === selectedAuction).length}
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('confirmed')}
                                                className={`py-2 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm
                                                    ${activeTab === 'confirmed'
                                                        ? 'border-[#012038] text-[#012038]'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1dad24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                Cartelas confirmadas
                                                {cartelas?.length > 0 && (
                                                    <span className="bg-[#1dad24] text-white text-xs px-2 py-0.5 rounded-full">
                                                        {cartelas.length}
                                                    </span>
                                                )}
                                            </button>
                                        </nav>
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="mt-4">
                                    {selectedAuction && activeTab === 'toConfirm' && (
                                        <>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Confirme as cartelas dos arrematantes para prosseguir com o processo de entrega
                                            </p>
                                            
                                            <CartelasToConfirm
                                                ClientGroupData={clientsGrouped}
                                                selectedAuction={selectedAuction}
                                                avatares_pessoas={avatares_pessoas}
                                                handleConfirmCard={handleConfirmCard}
                                                setCartelaStatus={setCartelaStatus}
                                            />
                                        </>
                                    )}

                                    {selectedAuction && activeTab === 'confirmed' && (
                                        <>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Cartelas já confirmadas e em processamento
                                            </p>
                                            
                                            <CartelasConfirmadas 
                                                cartelas={cartelas}
                                                avatares_pessoas={avatares_pessoas}
                                                setCartelas={setCartelas}
                                                handleUpdateCartela={handleUpdateCartela}
                                                updatingCartelas={updatingCartelas}
                                                trackingCodes={trackingCodes}
                                                setTrackingCodes={setTrackingCodes}
                                            />
                                        </>
                                    )}

                                    {!selectedAuction && (
                                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-700">
                                                        Selecione um leilão para visualizar os arrematantes e cartelas.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[#012038]">Atualizar Status da Cartela</h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status da Cartela
                            </label>
                            <select 
                                value={selectedCartelaStatus}
                                onChange={(e) => setCartelaStatus(e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 
                                    focus:border-[#1dad24] focus:ring-1 focus:ring-[#1dad24] outline-none"
                            >
                                <option value="PENDENT">Pendente</option>
                                <option value="PAYMENT_CONFIRMED">Pagamento confirmado</option>
                                <option value="PROCESS">Processando</option>
                                <option value="SENDED">Enviado</option>
                                <option value="DELIVERED">Entregue</option>
                                <option value="DENIED">Recusado</option>
                            </select>
                        </div>
                        
                        {selectedCartelaStatus === "SENDED" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Código de Rastreio
                                </label>
                                <input
                                    type="text"
                                    value={trackingCodes[selectedCartela] || ""}
                                    onChange={(e) => setTrackingCodes(prev => ({
                                        ...prev,
                                        [selectedCartela]: e.target.value
                                    }))}
                                    placeholder="Digite o código de rastreio"
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 
                                        focus:border-[#1dad24] focus:ring-1 focus:ring-[#1dad24] outline-none"
                                    required
                                />
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleModalUpdate()}
                                className="px-4 py-2 bg-gradient-to-r from-[#012038] to-[#1a3c5a] text-white rounded-md hover:from-[#1a3c5a] hover:to-[#012038] transition-all duration-300"
                            >
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <LoadingModal isVisible={isCreating} />
        </div>
    );
}

export default Arrematantes;