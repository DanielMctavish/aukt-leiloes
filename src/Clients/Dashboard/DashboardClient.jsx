/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import NavClient from "../navigation/NavClient";
import AssideClient from "../Asside/AssideClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardClient() {
    const [currentClient, setCurrentClient] = useState({});
    const [allBids, setAllBids] = useState([]);
    const [allAucts, setAllAucts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getClientInformations();
    }, []);

    useEffect(() => {
        getAuctsByBids();
    }, [allBids]);

    const getClientInformations = async () => {
        const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
        if (!currentSessionClient) {
            navigate("/client/login");
        }

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
            headers: {
                "Authorization": `Bearer ${currentSessionClient.token}`
            }
        }).then((response) => {
            //console.log("dashboard client found -> ", response.data)
            getBidsByClient(response.data.id);
            setCurrentClient(response.data);
        }).catch(() => {
            localStorage.removeItem("client-auk-session-login");
            navigate("/client/login");
        });
    };

    const getBidsByClient = async (client_id) => {
        const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));

        try {
            if (currentClient)
                await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/list-bid?client_id=${client_id}`, {
                    headers: {
                        "Authorization": `Bearer ${currentSessionClient.token}`
                    }
                }).then((response) => {
                    console.log("bids by client -> ", response.data);
                    setAllBids(response.data);
                });
        } catch (error) {
            console.log("error at get bids by client -> ", error.message);
        }
    };

    const getAuctsByBids = async () => {
        const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
        let aucts = [];
        let seenAuctIds = new Set();

        for (const bid of allBids) {
            if (!seenAuctIds.has(bid.auct_id)) {
                seenAuctIds.add(bid.auct_id);
                try {
                    const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${bid.auct_id}`, {
                        headers: {
                            "Authorization": `Bearer ${currentSessionClient.token}`
                        }
                    });
                    aucts.push(response.data);
                } catch (error) {
                    console.log(`Error fetching auction with ID ${bid.auct_id}: `, error.message);
                }
            }
        }

        setAllAucts(aucts);
    };

    const uniqueAucts = Array.from(new Set(allBids.map(bid => bid.auct_id))).map(id => {
        return allBids.find(bid => bid.auct_id === id);
    });

    const totalProdutosArrematados = allBids.filter(bid => bid.Product[0].winner_id === currentClient.id).length;
    const totalLeiloesParticipados = uniqueAucts.length;
    const totalGastos = allBids.reduce((total, bid) => total + parseFloat(bid.Product[0].initial_value), 0).toFixed(2);
    let count = 0
    let countAuct = 0

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <AssideClient />
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
                        <div className="bg-[#E9EFFA] w-[33%] h-[80%] p-2 rounded-md flex flex-col justify-center items-center shadow-md">
                            <span className="text-2xl font-bold">Total de produtos arrematados</span>
                            <span className="text-4xl font-extrabold text-green-600">{totalProdutosArrematados}</span>
                        </div>
                        <div className="bg-[#E9EFFA] w-[33%] h-[80%] p-2 rounded-md flex flex-col justify-center items-center shadow-md">
                            <span className="text-2xl font-bold">Total de leilões participados</span>
                            <span className="text-4xl font-extrabold text-blue-600">{totalLeiloesParticipados}</span>
                        </div>
                        <div className="bg-[#E9EFFA] w-[33%] h-[80%] p-2 rounded-md flex flex-col justify-center items-center shadow-md">
                            <span className="text-2xl font-bold">Total de Gastos com leilões</span>
                            <span className="text-4xl font-extrabold text-red-600">{`R$ ${totalGastos}`}</span>
                        </div>
                    </div>
                </section>
                <section className="flex flex-col w-[98%] h-[60%] bg-white rounded-md shadow-md shadow-[#17171734] p-2">
                    <div className="flex flex-col justify-around items-start w-full h-[50%]">
                        <span className="font-bold">Arremates Recentes</span>
                        <div className="flex w-full justify-around items-center">
                            {
                                allBids.map((bid, index) => {
                                    count++
                                    if (count > 6) return null
                                    return (
                                        bid.Product[0].winner_id &&
                                        <span className="flex w-[200px] h-[200px] bg-[#ccffe6] overflow-hidden rounded-md justify-center items-center relative shadow-lg shadow-[#17171762]" key={index}>
                                            <img src={bid.Product[0].cover_img_url} alt="" className="w-full object-cover h-full absolute justify-center items-center" />
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
