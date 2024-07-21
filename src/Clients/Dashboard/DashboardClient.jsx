/* eslint-disable react/prop-types */
/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import NavClient from "../navigation/NavClient";
import AssideClient from "../Asside/AssideClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClientInformations } from "../functions/getClientInformations";
import { getBidsByClient } from "../functions/getBidsByClient";
import { getAuctsByBids } from "../functions/getAuctsByBids";
// import { useSpring, animated } from 'react-spring';

function DashboardClient() {
    const [currentClient, setCurrentClient] = useState({});
    const [allBids, setAllBids] = useState([]);
    const [allAucts, setAllAucts] = useState([]);
    const [bidsWinners, setBidsWinners] = useState([])
    const [budget, setBudget] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getClientInformations(navigate,
            getBidsByClient,
            setCurrentClient,
            setAllBids,
            setBidsWinners,
            setBudget,
            currentClient);

    }, []);

    useEffect(() => { getAuctsByBids(allBids, setAllAucts); }, [currentClient, allAucts])

    let countAuct = 0
    let countAuctined = 0

    // const AnimatedNumber = ({ number }) => {
    //     const { number: animatedNumber } = useSpring({
    //         from: { number: 0 },
    //         number: number,
    //         delay: 200,
    //         config: { mass: 1, tension: 180, friction: 12 }
    //     });

    //     return (
    //         <animated.span>
    //             {animatedNumber.to(n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
    //         </animated.span>
    //     );
    // };

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <AssideClient MenuSelected="menu-1" />
            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 text-zinc-600">
                <NavClient currentClient={currentClient} />
                <section className="flex flex-col justify-between w-[98%] h-[30%] bg-white rounded-md shadow-md shadow-[#17171734] p-2">
                    <div className="flex w-full justify-start items-center gap-6">
                        <img src="" alt="" className="object-cover w-[70px] h-[70px] bg-zinc-200 rounded-full" />
                        <div className="flex flex-col justify-start items-start gap-1">
                            <span className="text-[33px]">{currentClient.name}</span>
                            <span>{currentClient.email}</span>
                        </div>
                    </div>

                    <div className="flex w-full h-[60%] justify-between items-center">
                        <div className="bg-[#E9EFFA] w-[23%] h-[80%] p-2 rounded-md flex flex-col justify-center items-center shadow-md">
                            <span className="text-[18px] font-bold">Total de Lances</span>
                            <span className="text-4xl font-extrabold text-cyan-700">{allBids.length}</span>
                        </div>

                        <div className="bg-[#E9EFFA] w-[23%] h-[80%] p-2 rounded-md flex flex-col justify-center items-center shadow-md">
                            <span className="text-[18px] font-bold">Total de arremates</span>
                            <span className="text-4xl font-extrabold text-green-600">{bidsWinners.length}</span>
                        </div>

                        <div className="bg-[#E9EFFA] w-[23%] h-[80%] p-2 rounded-md flex flex-col justify-center items-center shadow-md">
                            <span className="text-[18px] font-bold">Total de leilões participados</span>
                            <span className="text-4xl font-extrabold text-blue-600">{allAucts.length}</span>
                        </div>

                        <div className="bg-[#E9EFFA] w-[23%] h-[80%] p-2 rounded-md flex flex-col justify-center items-center shadow-md">
                            <span className="text-[18px] font-bold">Total de Gastos com leilões</span>
                            <span className="text-4xl font-extrabold text-[#143d64]">
                                {` ${parseFloat(budget).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                            </span>
                        </div>

                    </div>
                </section>
                <section className="flex flex-col w-[98%] h-[60%] bg-white rounded-md shadow-md shadow-[#17171734] p-2">
                    <div className="flex flex-col justify-around items-start w-full h-[50%]">
                        <span className="font-bold">Arremates Recentes</span>
                        <div className="flex w-full justify-start items-center overflow-x-auto gap-3">
                            {
                                bidsWinners.map((bid, index) => {
                                    countAuctined++
                                    if (countAuctined > 6) return null
                                    return (
                                        <span className="flex lg:w-[140px] h-[140px] bg-[#ccffe6] overflow-hidden rounded-md justify-center items-center 
                                        relative shadow-lg shadow-[#17171762]" key={index}>
                                            <img src={bid.Product[0].cover_img_url} alt=""
                                                className="w-full object-cover h-full absolute justify-center items-center" />
                                            <span style={{ textShadow: "1px 1px 2px #1515157b" }} className="text-[#fff] z-[10]">
                                                {bid.Product[0].title}
                                            </span>
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="flex flex-col w-full h-[50%] relative">
                        <span className="font-bold">Ultimas Participações</span>
                        <div className="overflow-x-auto overflow-y-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Imagem</th>
                                        <th className="px-4 py-2">Criador</th>
                                        <th className="px-4 py-2">Título</th>
                                        <th className="px-4 py-2">Nano ID</th>
                                        <th className="px-4 py-2">Categoria</th>
                                        <th className="px-4 py-2">Criado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allAucts.map((auct, index) => {
                                        countAuct++
                                        if (countAuct > 6) return null
                                        return (
                                            <tr key={index}>
                                                <td className="border px-4 py-2">
                                                    <img src={auct.auct_cover_img} alt={auct.title} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="border px-4 py-2">{auct.Advertiser?.name}</td>
                                                <td className="border px-4 py-2">{auct.title}</td>
                                                <td className="border px-4 py-2">{auct.nano_id}</td>
                                                <td className="border px-4 py-2">{auct.categorie}</td>
                                                <td className="border px-4 py-2">{new Date(auct.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </section>
            </section>
        </div>
    );
}

export default DashboardClient;
