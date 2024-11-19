/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setAuct, setGroup, setStatus } from "../../../features/auct/generalAUKSlice";
import { Inventory2 } from "@mui/icons-material"

function AuctionsSelectorController() {
    const generalAUK = useSelector(state => state.generalAUK);
    const dispatch = useDispatch();
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState()
    const [groups, setGroups] = useState([]);
    const [lotCount, setLotCount] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState(""); // Novo estado para o grupo selecionado
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAuctions();
    }, [generalAUK.auct]);


    useEffect(() => {
        if (generalAUK.auct) {
            const uniqueGroups = [...new Set(generalAUK.auct.auct_dates.map(date => date.group))];
            setGroups(uniqueGroups);

            // Se já temos um grupo no Redux, selecione-o
            if (generalAUK.group) {
                handleSelectGroup(generalAUK.group);
            }
        }
    }, [generalAUK.auct, generalAUK.group]);

    useEffect(() => { }, [groups])

    const getAuctions = async () => {
        try {
            const currentSession = localStorage.getItem("advertiser-session-aukt");
            if (!currentSession) {
                console.error("No session found");
                return;
            }
            const sessionData = JSON.parse(currentSession);

            const advertiserResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
                headers: { 'Authorization': `Bearer ${sessionData.token}` },
                params: { email: sessionData.email }
            });

            const advertiser = advertiserResponse.data;
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
                headers: { 'Authorization': `Bearer ${sessionData.token}` },
                params: { creator_id: advertiser.id }
            });

            setAuctions(response.data);
            const uniqueGroups = [...new Set(selectedAuction.auct_dates.map(date => date.group))];
            setGroups(uniqueGroups);

            // Se já temos um leilão no Redux, selecione-o na lista
            if (generalAUK.auct) {
                handleSelectAuction(generalAUK.auct);
            }
        } catch (error) {
            return error
        }
    };

    const handleSelectAuction = (auction) => {
        dispatch(setAuct(auction));
        dispatch(setStatus(auction.status));
        dispatch(setGroup(null));
        setLotCount(0);
        setSelectedAuction(auction)
    };

    const handleSelectGroup = (group) => {
        const amountToGroups = generalAUK.auct.product_list.filter(product => product.group === group);
        dispatch(setGroup(group));
        setLotCount(amountToGroups.length);
        setSelectedGroup(group); // Atualiza o grupo selecionado
    };

    const getStatusClass = (status) => {
        if (status === 'live') return 'bg-red-500 text-white';
        if (status === 'paused') return 'bg-yellow-500 text-white';
        if (status === 'finished') return 'bg-green-500 text-white';
        return 'bg-blue-900 text-white';
    };

    const handleChangeGroupStatus = async () => {
        const auctDateId = generalAUK.auct.auct_dates.find(date => date.group === selectedGroup)?.id; // Obtenha o ID do leilão
        if (auctDateId) {
            setLoading(true); // Inicia o carregamento
            const currentSession = localStorage.getItem("advertiser-session-aukt");
            const sessionData = JSON.parse(currentSession);

            try {
                // Mudança de status do grupo
                await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/auct-dates/change-group-dates-status?auct_date_id=${auctDateId}`, {
                    group_status: "cataloged"
                }, {
                    headers: { 'Authorization': `Bearer ${sessionData.token}` }
                });

                // Obtenha o leilão atualizado
                const result = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${selectedAuction.id}`);
                const currentAuct = result.data;

                // Atualiza o estado local
                setSelectedAuction(currentAuct);
                const uniqueGroups = [...new Set(currentAuct.auct_dates.map(date => date.group))];
                setGroups(uniqueGroups);
                dispatch(setGroup(null)); // Resetando o grupo no Redux
                dispatch(setAuct(currentAuct)); // Atualizando o leilão no Redux

            } catch (error) {
                console.error("Error changing group status:", error);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div className="flex flex-col w-full h-[60%] justify-around items-center p-4 bg-white rounded-md 
        shadow-lg shadow-[#12121244]">
            <div className="flex w-[90%] justify-between mb-2 text-lg font-semibold text-gray-700">
                <span className="text-[26px]">Selecione um leilão</span>
                {generalAUK.auct && (
                    <span className={`px-2 py-1 rounded ${getStatusClass(generalAUK.status)}`}>
                        {generalAUK.status}
                    </span>
                )}
            </div>

            <section className={`flex w-full h-[90%] relative ${generalAUK.auct ? 'justify-around items-center' : "justify-center items-start"} p-2 bg-zinc-200 rounded-md`}>
                {selectedAuction && (
                    <img
                        src={selectedAuction?.auct_cover_img}
                        alt={selectedAuction?.title}
                        className="h-[80%] object-cover rounded-[12px]"
                    />
                )}
                <div className="flex flex-col items-center w-full">
                    <select
                        id="auction-select"
                        className="w-[90%] h-[60px] p-2 mb-4 bg-[#012038] text-white rounded-[6px]"
                        onChange={(e) => handleSelectAuction(auctions.find(a => a.id === e.target.value))}
                        value={selectedAuction && selectedAuction?.id || ""}
                    >
                        <option value="">Selecione um leilão</option>
                        {auctions.map(auction => (
                            <option key={auction.id} value={auction.id}>
                                {auction.title}
                            </option>
                        ))}
                    </select>

                    {generalAUK.auct && (
                        <>
                            <select
                                id="group-select"
                                className="w-[90%] h-[60px] p-2 bg-[#012038] text-white rounded-[6px]"
                                onChange={(e) => {
                                    const group = e.target.value;
                                    handleSelectGroup(group);
                                    setSelectedGroup(group); // Atualiza o grupo selecionado
                                }}
                                value={generalAUK.group || ""}
                            >
                                <option value="">Selecione um grupo</option>
                                {groups.map(group => {
                                    // Encontrar o status do grupo correspondente
                                    const groupStatus = selectedAuction && selectedAuction.auct_dates.find(date => date.group === group)?.group_status;

                                    return (
                                        <option key={group} value={group} className="flex w-full justify-around items-center">
                                            {group} {groupStatus && `(${groupStatus})`} {/* Adiciona o status do grupo */}
                                        </option>
                                    );
                                })}
                            </select>

                            {selectedGroup && (
                                // Verifica se o grupo já está catalogado
                                selectedAuction && selectedAuction.auct_dates.find(date => date.group === selectedGroup)?.group_status !== "cataloged" && (
                                    <button
                                        onClick={handleChangeGroupStatus}
                                        disabled={loading} // Desabilita o botão enquanto carrega
                                        className={`w-[90%] h-[40px] mt-[2px] ${loading ? 'bg-gray-400' : 'bg-[#13466d]'} text-white 
                                        rounded-[6px] hover:bg-blue-600 transition duration-200`}
                                    >
                                        {loading ? "Carregando..." : `Mandar grupo "${selectedGroup}" para catálogo`}
                                    </button>
                                )
                            )}

                            {generalAUK.group && (
                                <div className="mt-2 text-lg font-semibold text-gray-700 flex gap-3 justify-center items-center">
                                    <Inventory2 />
                                    <span>
                                        {lotCount}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AuctionsSelectorController;
