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
import LoadingModal from "./mod/LoadingModal";
import { useNavigate } from "react-router-dom";
import CartelasToConfirm from './components/CartelasToConfirm';
import CartelasConfirmadas from './components/CartelasConfirmadas';

function Arrematantes() {
    const [isCreating, setIsCreating] = useState(false)
    const [selectedCartelaStatus, setCartelaStatus] = useState("PENDENT")
    const [selectedAuction, setSelectedAuction] = useState('')
    const [aucts, setAucts] = useState([]);
    const [ClientGroupData, setClientGroupData] = useState([]);
    const [showMod, setShowMod] = useState({});
    const [cartelas, setCartelas] = useState();
    const [activeTab, setActiveTab] = useState('toConfirm');
    const [trackingCodes, setTrackingCodes] = useState({});
    const [updatingCartelas, setUpdatingCartelas] = useState({});
    const navigate = useNavigate()

    const avatares_pessoas = [
        avatar_01,
        avatar_02,
        avatar_03,
        avatar_04,
        avatar_05,
        avatar_06,
        avatar_07,
        avatar_08
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

        setClientGroupData(Object.values(groupedClients));
    }, [aucts, showMod, selectedAuction, cartelas]);

    const fetchCartelas = async (auction_id) => {
        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

        if (!cookieSession) return navigate("/")

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/list-cartelas`, {
                params: {
                    auction_id:auction_id
                },
                    headers: {
                    Authorization: `Bearer ${cookieSession.token}`
                }
            });

            setCartelas(response.data);

        } catch (error) {
            setCartelas([]);
        }
    }

    const handleAuctionSelect = async (auction_id) => {
        setSelectedAuction(auction_id);
        fetchCartelas(auction_id);
    }

    const handleConfirmCard = async (advertiser_id, products, client_id) => {
        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        if (!cookieSession) return navigate("/")

        setIsCreating(true)

        try {
            const totalAmount = products.reduce((sum, product) => sum + product.real_value, 0);

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/create-cartela`, {
                advertiser_id: advertiser_id,
                client_id: client_id,
                auction_id: selectedAuction,
                products: products,
                amount: totalAmount,
                status: selectedCartelaStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${cookieSession.token}`
                }
            }).then(() => {
                setIsCreating(false)
                fetchCartelas(advertiser_id, selectedAuction);
            })

        } catch (error) {
            setIsCreating(false)
        }
    }



    const handleUpdateCartela = async (cartela_id) => {
        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"));

        if (!cookieSession) return navigate("/");

        setUpdatingCartelas(prev => ({ ...prev, [cartela_id]: true }));

        try {
            const cartela = cartelas.find(c => c.id === cartela_id);
            const payload = {
                status: cartela.status,
            };

            if (payload.status === "SENDED") {
                payload.tracking_code = trackingCodes[cartela_id];
            }

            await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/update-cartela`, payload, {
                params: { cartela_id },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookieSession.token}`
                }
            });

            // Atualiza a lista de cartelas após a atualização
            fetchCartelas(selectedAuction);
        } catch (error) {
            return error
        } finally {
            setUpdatingCartelas(prev => ({ ...prev, [cartela_id]: false }));
        }
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
        <div className="w-full min-h-screen bg-[#D8DEE8] text-zinc-600">
            <div className="flex flex-col lg:flex-row min-h-screen">
                <AssideAdvertiser MenuSelected="menu-5" />
                <div className="flex-1 flex flex-col">
                    <NavAdvertiser path="Arrematantes" />
                    
                    <main className="flex-1 p-4">
                        <div className="max-w-[1600px] mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-[#012038] mb-1">Arrematantes</h1>
                                <p className="text-sm text-gray-500">Gerencie os arrematantes e suas cartelas</p>
                            </div>

                            {/* Auction Selection */}
                            <div className="mb-6">
                                <label htmlFor="auction-select" className="block text-sm font-medium text-gray-700 mb-1">
                                    Selecione o Leilão
                                </label>
                                <select
                                    id="auction-select"
                                    onChange={(e) => handleAuctionSelect(e.target.value)}
                                    value={selectedAuction}
                                    className="w-full md:w-[300px] p-2 text-sm bg-white border border-gray-300 rounded-lg 
                                        shadow-sm focus:border-[#012038] focus:ring-1 focus:ring-[#012038] outline-none"
                                >
                                    <option value="selecione">Selecione um leilão</option>
                                    {aucts.map(auct => (
                                        <option key={auct.id} value={auct.id}>{auct.title}</option>
                                    ))}
                                </select>
                            </div>

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
                                            Cartelas a confirmar
                                            {ClientGroupData.filter(group => group.id === selectedAuction).length > 0 && (
                                                <span className="bg-[#1dad24] text-white text-xs px-2 py-0.5 rounded-full">
                                                    {ClientGroupData.filter(group => group.id === selectedAuction).length}
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
                                {activeTab === 'toConfirm' && (
                                    <CartelasToConfirm 
                                        ClientGroupData={ClientGroupData}
                                        selectedAuction={selectedAuction}
                                        avatares_pessoas={avatares_pessoas}
                                        handleConfirmCard={handleConfirmCard}
                                        selectedCartelaStatus={selectedCartelaStatus}
                                        setCartelaStatus={setCartelaStatus}
                                    />
                                )}

                                {activeTab === 'confirmed' && (
                                    <CartelasConfirmadas 
                                        cartelas={cartelas}
                                        avatares_pessoas={avatares_pessoas}
                                        setCartelas={setCartelas}
                                        handleUpdateCartela={handleUpdateCartela}
                                        updatingCartelas={updatingCartelas}
                                        trackingCodes={trackingCodes}
                                        setTrackingCodes={setTrackingCodes}
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <LoadingModal isVisible={isCreating} />
        </div>
    );
}

export default Arrematantes;