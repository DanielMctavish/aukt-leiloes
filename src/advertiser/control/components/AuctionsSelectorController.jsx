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
        <div className="flex w-full h-[50%] rounded-xl shadow-lg p-4">
            <div className="flex flex-col w-full h-full bg-gray-50 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#012038] text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Inventory2 sx={{ fontSize: 20 }} />
                        </div>
                        <span className="font-medium">Seleção de Leilão</span>
                    </div>
                    {generalAUK.auct && (
                        <div className={`px-3 py-1 rounded-full text-sm ${getStatusClass(generalAUK.status)} 
                            bg-opacity-20 border border-current`}>
                            {generalAUK.status.toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Conteúdo */}
                <div className="flex flex-1 p-6 gap-6">
                    {/* Imagem do Leilão */}
                    {selectedAuction && (
                        <div className="w-1/3">
                            <img
                                src={selectedAuction?.auct_cover_img}
                                alt={selectedAuction?.title}
                                className="w-full h-full object-cover rounded-xl shadow-md"
                            />
                        </div>
                    )}

                    {/* Seletores */}
                    <div className="flex flex-col flex-1 gap-4">
                        {/* Select de Leilões */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">Leilão</label>
                            <select
                                className="w-full p-3 bg-[#012038] text-white rounded-xl 
                                    border border-[#012038] hover:bg-[#023161] transition-colors"
                                onChange={(e) => handleSelectAuction(auctions.find(a => a.id === e.target.value))}
                                value={selectedAuction?.id || ""}
                            >
                                <option value="">Selecione um leilão</option>
                                {auctions.map(auction => (
                                    <option key={auction.id} value={auction.id}>
                                        {auction.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {generalAUK.auct && (
                            <>
                                {/* Select de Grupos */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-600 font-medium">Grupo</label>
                                    <select
                                        className="w-full p-3 bg-[#012038] text-white rounded-xl 
                                            border border-[#012038] hover:bg-[#023161] transition-colors"
                                        onChange={(e) => {
                                            const group = e.target.value;
                                            handleSelectGroup(group);
                                            setSelectedGroup(group);
                                        }}
                                        value={generalAUK.group || ""}
                                    >
                                        <option value="">Selecione um grupo</option>
                                        {groups.map(group => {
                                            const groupStatus = selectedAuction?.auct_dates
                                                .find(date => date.group === group)?.group_status;
                                            return (
                                                <option key={group} value={group}>
                                                    {group} {groupStatus && `(${groupStatus})`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Botão de Catalogar */}
                                {selectedGroup && selectedAuction?.auct_dates
                                    .find(date => date.group === selectedGroup)?.group_status !== "cataloged" && (
                                    <button
                                        onClick={handleChangeGroupStatus}
                                        disabled={loading}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl 
                                            font-medium transition-all duration-200 ${
                                            loading 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#012038] text-white hover:bg-[#266da4] shadow-md'
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 border-2 border-white 
                                                    border-t-transparent rounded-full" />
                                                <span>Processando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Inventory2 sx={{ fontSize: 20 }} />
                                                <span>Catalogar Grupo &quot;{selectedGroup}&quot;</span>
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Contador de Lotes */}
                                {generalAUK.group && (
                                    <div className="flex items-center justify-center gap-3 p-4 
                                        bg-white rounded-xl shadow-md">
                                        <Inventory2 className="text-[#012038]" />
                                        <span className="text-lg font-medium text-[#012038]">
                                            {lotCount} {lotCount === 1 ? 'Lote' : 'Lotes'}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionsSelectorController;
