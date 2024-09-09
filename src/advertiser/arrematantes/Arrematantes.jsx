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
    const [selectedCartelaStatus, setCartelaStatus] = useState("PENDENT") // Default status
    const [selectedAuction, setSelectedAuction] = useState('')
    const [aucts, setAucts] = useState([]);
    const [ClientGroupData, setClientGroupData] = useState([]);
    const [showMod, setShowMod] = useState({}); // Change to an object to track visibility per group
    const [cartelas, setCartelas] = useState({ pending: [], confirmed: [] }); // State for cartelas
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
                        status: "PENDENT" // Default status for new cartelas
                    };
                }

                groupedClients[groupKey].products.push(product);
            });
        });

        setClientGroupData(Object.values(groupedClients));

        console.log("observando mudança -> ", selectedAuction)
    }, [aucts, showMod, selectedAuction]);

    const fetchCartelas = async (advertiser_id, auction_id) => {
        const cookieSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

        if (!cookieSession) return navigate("/")

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/list-cartelas`, {
                params: { advertiser_id, auction_id },
                headers: {
                    Authorization: `Bearer ${cookieSession.token}`
                }
            });

            console.log("listagem de cartelas -> ", response.data)

            setCartelas(response.data);

        } catch (error) {
            console.log("error listagem de cartelas-> ", error)
        }
    }

    const handleAuctionSelect = async (auction_id) => {
        setSelectedAuction(auction_id);
        const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'));
        let advertiser_id = currentLocalAdvertiser?.advertiser_id;

        fetchCartelas(advertiser_id, auction_id);
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
            console.log(error.response)
        }
    }

    const handleShowCurrentModal = (id, visibility) => {
        setShowMod(prevState => ({ ...prevState, [id]: visibility }));
    }

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
                        <h2 className="text-xl font-bold text-[#3f3f3f]">Cartelas Confirmadas</h2>
                        {cartelas.confirmed.map(cartela => (
                            <div key={cartela.id}
                                className="flex justify-between items-center w-full p-2 text-[#222] bg-[#eaeaea] 
                                rounded-[12px] shadow-lg shadow-[#09090927]">

                                <div className="flex gap-2 justify-start items-center">
                                    <img src={avatares_pessoas[cartela.Client.avatar]} alt="" className="w-[63px] h-[63px] object-cover rounded-full" />
                                    <div className="flex flex-col">
                                        <span className="text-[18px] font-bold">{cartela.Client.name}</span>
                                        <span className="text-[14px]">{cartela.auction.title}</span>
                                    </div>
                                </div>

                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                    .format(cartela.amount)}</span>

                                <div className="flex justify-center items-center gap-3">
                                    <span className="p-3 rounded-md bg-[#1dad24] text-white">{cartela.status}</span>
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
