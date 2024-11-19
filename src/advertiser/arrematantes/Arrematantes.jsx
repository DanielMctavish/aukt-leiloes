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
import ProductsGroupArrematantes from "./mod/ProductsGroupArrematantes";
import LoadingModal from "./mod/LoadingModal"; // Import the LoadingModal
import { useNavigate } from "react-router-dom";


function Arrematantes() {
    const [isCreating, setIsCreating] = useState(false)
    const [selectedCartelaStatus, setCartelaStatus] = useState("PENDENT")
    const [selectedAuction, setSelectedAuction] = useState('')
    const [aucts, setAucts] = useState([]);
    const [ClientGroupData, setClientGroupData] = useState([]);
    const [showMod, setShowMod] = useState({});
    const [cartelas, setCartelas] = useState();
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

    // Adicione o estado para armazenar os códigos de rastreamento
    const [trackingCodes, setTrackingCodes] = useState({});

    // Adicione o estado para gerenciar o carregamento de atualizações por cartela
    const [updatingCartelas, setUpdatingCartelas] = useState({});

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

        // Verifica se a cartela já existe em cartelas
        Object.values(groupedClients).forEach(group => {
            const exists = cartelas?.some(cartela =>
                cartela.amount === group.products.reduce((sum, p) => sum + p.initial_value, 0) &&
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
        fetchCartelas( auction_id);
    }

    const handleConfirmCard = async (advertiser_id, products, client_id, amount) => {

        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

        if (!cookieSession) return navigate("/")

        setIsCreating(true)

        try {

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/create-cartela`, {
                advertiser_id: advertiser_id,
                client_id: client_id,
                auction_id: selectedAuction, // Ensure auction_id is being sent
                products: products,
                amount: amount,
                status: selectedCartelaStatus, // Ensure status is being sent
            }, {
                headers: {
                    Authorization: `Bearer ${cookieSession.token}`
                }
            }).then(() => {
                setIsCreating(false)
                fetchCartelas(advertiser_id, selectedAuction); // Refresh cartelas after creation
            })

        } catch (error) {
            setIsCreating(false)
        }
    }

    const handleShowCurrentModal = (id, visibility) => {
        setShowMod(prevState => ({ ...prevState, [id]: visibility }));
    }

    // {{ edit_2 }} Atualiza a função handleUpdateCartela para gerenciar o estado de loading por cartela
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

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#efefef]">
            <AssideAdvertiser MenuSelected="menu-5" />
            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 p-1">
                <NavAdvertiser />
                <div className="flex flex-col w-[80%] h-full bg-white p-2 overflow-y-auto gap-2">

                    <select onChange={(e) => handleAuctionSelect(e.target.value)}
                        className="flex w-[300px] bg-white p-4 shadow-lg shadow-[#09090927] rounded-lg">
                        <option value="selecione">selecione o leilão</option>
                        {
                            aucts.map(auct => (
                                <option key={auct.id} value={auct.id}>{auct.title}</option>
                            ))
                        }
                    </select>


                    <div className="flex flex-col w-full gap-2 mt-4 bg-[#f2f2f2] p-3 rounded-lg">
                        <h2 className="text-xl font-bold text-[#3f3f3f]">Cartelas a confirmar</h2>
                        {ClientGroupData.map(groupClient => {

                            if (groupClient.id !== selectedAuction) return null

                            let totalValue = 0
                            groupClient.products.forEach(product => {
                                totalValue += product.initial_value;
                            })

                            return (
                                <div key={groupClient.winner_id + groupClient.auction}
                                    className="flex justify-between items-center w-full p-2 text-[#222] bg-[#eaeaea] 
                                rounded-[12px] shadow-lg shadow-[#09090927]">

                                    <div className="flex gap-2 justify-start items-center">
                                        <img src={avatares_pessoas[groupClient.avatar]} alt="" className="w-[63px] h-[63px] object-cover rounded-full" />
                                        <div className="flex flex-col">
                                            <span className="text-[18px] font-bold">{groupClient.name}</span>
                                            <span className="text-[14px]">{groupClient.auction}</span>
                                        </div>
                                    </div>

                                    <span onMouseEnter={() => handleShowCurrentModal(groupClient.winner_id, "flex")}
                                        onMouseLeave={() => handleShowCurrentModal(groupClient.winner_id, "none")}
                                        className="relative bg-white font-bold cursor-pointer
                                rounded-full flex w-[30px] h-[30px] justify-center items-center">
                                        {groupClient.products.length}
                                        <div id={groupClient.winner_id} style={{ display: showMod[groupClient.winner_id] || "none" }} className="absolute">
                                            <ProductsGroupArrematantes products={groupClient.products} />
                                        </div>
                                    </span>

                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                        .format(totalValue)}</span>

                                    <div className="flex justify-center items-center gap-3">

                                        <select onChange={(e) => setCartelaStatus(e.target.value)} className="p-3 rounded-md bg-[#1dad24] text-white">
                                            <option value="PENDENT">pendente</option>
                                            <option value="PAYMENT_CONFIRMED">pagamento confirmado</option>
                                            <option value="PROCESS">processando</option>
                                            <option value="SENDED">enviado</option>
                                            <option value="DELIVERED">entregue</option>
                                            <option value="DENIED">recusado</option>
                                        </select>

                                        <button onClick={() => handleConfirmCard(
                                            groupClient.advertiser_id,
                                            groupClient.products,
                                            groupClient.winner_id,
                                            totalValue)}
                                            className="bg-[#012038] text-white p-3 rounded-md">confirmar</button>
                                    </div>
                                </div>
                            )
                        })}

                    </div>


                    <div className="flex flex-col w-full gap-2 mt-4 bg-[#f2f2f2] p-3 rounded-lg">
                        <h2 className="text-xl font-bold text-[#3f3f3f] mb-4">Cartelas Confirmadas</h2>
                        {cartelas &&
                            cartelas.map(cartela => (
                                <div key={cartela.id}
                                    className="flex flex-row justify-between items-center w-full p-4 bg-white 
                                rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">

                                    <div className="flex items-center gap-4">
                                        <img src={avatares_pessoas[cartela.Client.client_avatar]} alt=""
                                            className="w-16 h-16 object-cover rounded-full border-2 border-[#1dad24]" />
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="text-lg font-semibold text-[#012038]">{cartela.Client.name}</span>
                                                <span className="block text-sm text-gray-500">{cartela.auction}</span>
                                            </div>

                                            {/* {{ edit_5 }} Move o campo de produtos para ao lado do nome do cliente */}
                                            <span onMouseEnter={() => handleShowCurrentModal(cartela.id, "flex")}
                                                onMouseLeave={() => handleShowCurrentModal(cartela.id, "none")}
                                                className="relative bg-white text-[#1dad24] font-bold cursor-pointer
                                                rounded-full flex items-center justify-center w-8 h-8 transition-transform transform hover:scale-110">
                                                {cartela.products.length}
                                                <div id={cartela.id} style={{ display: showMod[cartela.id] || "none" }}
                                                    className="absolute top-10 left-0 bg-white border rounded-md shadow-lg p-2 z-10 transition-opacity duration-300">
                                                    <ProductsGroupArrematantes products={cartela.products} />
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <span className="text-lg font-medium text-[#3f3f3f]">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                            .format(cartela.amount)}
                                    </span>

                                    <div className="flex items-center gap-4">
                                        {/* {{ edit_2 }} Substitui o status por um select com design aprimorado */}
                                        <select
                                            value={cartela.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setCartelas(prevCartelas => prevCartelas.map(c => c.id === cartela.id ? { ...c, status: newStatus } : c));
                                            }}
                                            className={`p-2 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${cartela.status === "DENIED" ? 'bg-red-500 text-red-100' :
                                                    cartela.status === "PAYMENT_CONFIRMED" ? 'bg-blue-500 text-white' :
                                                        cartela.status === "PROCESS" ? 'bg-yellow-500 text-white' :
                                                            cartela.status === "SENDED" ? 'bg-green-500 text-white' :
                                                                cartela.status === "DELIVERED" ? 'bg-purple-500 text-white' :
                                                                    'bg-[#1dad24] text-white'
                                                }`}
                                        >
                                            <option value="PENDENT">Pendente</option>
                                            <option value="PAYMENT_CONFIRMED">Pagamento Confirmado</option>
                                            <option value="PROCESS">Processando</option>
                                            <option value="SENDED">Enviado</option>
                                            <option value="DELIVERED">Entregue</option>
                                            <option value="DENIED">Recusado</option>
                                        </select>

                                        {/* {{ edit_3 }} Condicional para o campo de código de rastreio com animação */}
                                        {cartela.status === "SENDED" && (
                                            <input
                                                type="text"
                                                placeholder="Insira o código de rastreio"
                                                value={cartela.tracking_code || trackingCodes[cartela.id] || ""}
                                                onChange={(e) => setTrackingCodes(prev => ({ ...prev, [cartela.id]: e.target.value }))}
                                                className={`p-3 border border-[#1dad24] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1dad24] transition-all duration-300 ${cartela.tracking_code ? 'bg-gray-100' : 'bg-white'
                                                    }`}
                                            />
                                        )}

                                        {/* {{ edit_4 }} Adiciona o botão "Atualizar" com loading */}
                                        <button
                                            onClick={() => handleUpdateCartela(cartela.id)}
                                            className={`flex items-center justify-center px-4 py-2 bg-[#012038] text-white 
                                                rounded-md hover:bg-[#01477f] transition-colors duration-300 
                                                ${updatingCartelas[cartela.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={updatingCartelas[cartela.id]}
                                        >
                                            {updatingCartelas[cartela.id] ? (
                                                <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"
                                                    viewBox="0 0 24 24">
                                                </svg>
                                            ) : null}
                                            Atualizar
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                </div>
            </section>
            <LoadingModal isVisible={isCreating} />
        </div>
    );
}

export default Arrematantes;
