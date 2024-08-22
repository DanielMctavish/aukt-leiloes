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

function Arrematantes() {
    const [selectedAuction, setSelectedAuction] = useState('')
    const [aucts, setAucts] = useState([]);
    const [ClientGroupData, setClientGroupData] = useState([]);
    const [showMod, setShowMod] = useState(false);

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
                        avatar: product.Winner.client_avatar,
                        winner_id: product.Winner.id,
                        name: product.Winner.name,
                        cover: product.Winner.client_avatar,
                        products: []
                    };
                }

                groupedClients[groupKey].products.push(product);
            });
        });

        setClientGroupData(Object.values(groupedClients));

        console.log("observando mudança -> ", selectedAuction)
    }, [aucts, showMod, selectedAuction]);

    const handleShowProductMod = (group_id) => {
        const currentWindow = document.getElementById(group_id)

        setShowMod(!showMod)

        if (currentWindow.style.display === "flex") {
            currentWindow.style.display = "none";
        } else {
            currentWindow.style.display = "flex";
        }
    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#efefef]">
            <AssideAdvertiser MenuSelected="menu-5" />
            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 p-1">
                <NavAdvertiser />
                <div className="flex flex-col w-[80%] h-full bg-white p-2 overflow-y-auto gap-2">

                    <select onChange={(e) => setSelectedAuction(e.target.value)} className="flex w-[200px] bg-white p-2">
                        <option value="selecione">selecione o leilão</option>
                        {
                            aucts.map(auct => (
                                <option key={auct.id} value={auct.id}>{auct.title}</option>
                            ))
                        }
                    </select>

                    {ClientGroupData.map(groupClient => {

                        if (groupClient.id !== selectedAuction) return null

                        let totalValue = 0
                        groupClient.products.forEach(product => {
                            totalValue += product.initial_value;
                        })

                        return (
                            <div key={groupClient.winner_id + groupClient.auction}
                                className="flex justify-between items-center w-full p-2 text-[#222] bg-[#D9D9D9] rounded-[12px]">

                                <div className="flex gap-2 justify-start items-center">
                                    <img src={avatares_pessoas[groupClient.avatar]} alt="" className="w-[63px] h-[63px] object-cover rounded-full" />
                                    <div className="flex flex-col">
                                        <span className="text-[18px] font-bold">{groupClient.name}</span>
                                        <span className="text-[14px]">{groupClient.auction}</span>
                                    </div>
                                </div>

                                <span onClick={() => handleShowProductMod(groupClient.winner_id + groupClient.auction)}
                                    className="relative bg-white font-bold cursor-pointer
                                rounded-full flex w-[30px] h-[30px] justify-center items-center">
                                    {groupClient.products.length}
                                    <div>
                                        <ProductsGroupArrematantes />
                                    </div>
                                </span>

                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                    .format(totalValue)}</span>
                                <div className="flex gap-2">
                                    <select name="" id="" className="p-1 rounded-md bg-[#1dad24] text-white">
                                        <option value="">pendente</option>
                                        <option value="">processando</option>
                                        <option value="">enviado</option>
                                        <option value="">entregue</option>
                                        <option value="">recusado</option>
                                    </select>
                                    <button className="">confirmar</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}

export default Arrematantes;
