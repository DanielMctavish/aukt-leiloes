import { useSelector, useDispatch } from "react-redux";
import { selectLiveAuction, selectLiveGroup } from "../../../features/auct/LiveSelected";
import { setRunning, setPaused } from "../../../features/auct/controlButtonsSlice";
import { useState, useEffect } from "react";

function AuctionsSelectorController() {
    const dispatch = useDispatch();
    const auctions = useSelector(state => state.auctionList.auctions);
    const isRunning = useSelector(state => state.controlButtons.isRunning);
    const isPaused = useSelector(state => state.controlButtons.isPaused);
    const selectedAuction = useSelector(state => state.live.auction);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (selectedAuction) {
            const uniqueGroups = [...new Set(selectedAuction.auct_dates.map(date => date.group))];
            setGroups(uniqueGroups);
        }
    }, [selectedAuction]);

    useEffect(() => {
        if (selectedAuction) {
            dispatch(setRunning(selectedAuction.status === "live"));
            dispatch(setPaused(selectedAuction.status === "paused"));
        }
    }, [selectedAuction, dispatch]);

    const handleSelectAuction = (auction) => {
        dispatch(selectLiveAuction(auction));
        dispatch(setRunning(auction.status === "live"));
        dispatch(setPaused(auction.status === "paused"));
    };

    const handleSelectGroup = (group) => {
        dispatch(selectLiveGroup(group));
    };

    const getStatusClass = (status) => {
        if (isRunning) return 'bg-red-500 text-white';
        if (isPaused) return 'bg-yellow-500 text-white';
        if (status === 'finished') return 'bg-green-500 text-white';
        return 'bg-blue-900 text-white';
    };

    return (
        <div className="flex flex-col w-full h-[60%] justify-around items-center p-4 bg-white rounded-md shadow-lg shadow-[#12121244]">
            <div className="flex w-full justify-between mb-2 text-lg font-semibold text-gray-700">
                <span className="text-[26px]">Selecione um leilão</span>
                {selectedAuction && (
                    <span className={`px-2 py-1 rounded ${getStatusClass(selectedAuction.status)}`}>
                        {selectedAuction.status}
                    </span>
                )}
            </div>

            <section className={`flex w-full h-[80%] relative ${selectedAuction ? 'justify-around items-center' : "justify-center items-start"} p-2 bg-zinc-200 rounded-md`}>
                {selectedAuction && (
                    <img
                        src={selectedAuction?.auct_cover_img}
                        alt={selectedAuction?.title}
                        className="h-[98%] object-cover rounded-[12px]"
                    />
                )}
                <div className="flex flex-col items-center">
                    <select
                        id="auction-select"
                        className="w-[270px] h-[70px] p-2 mb-4 bg-[#012038] text-white rounded-[6px]"
                        onChange={(e) => handleSelectAuction(auctions.find(a => a.id === e.target.value))}
                    >
                        <option value="">Selecione um leilão</option>
                        {auctions.map(auction => (
                            <option key={auction.id} value={auction.id}>
                                {auction.title}
                            </option>
                        ))}
                    </select>

                    {selectedAuction && (
                        <>
                            <label htmlFor="group-select" className="mb-2 text-lg font-semibold text-gray-700">
                                Selecione um grupo
                            </label>
                            <select
                                id="group-select"
                                className="w-[270px] h-[70px] p-2 bg-[#012038] text-white rounded-[6px]"
                                onChange={(e) => handleSelectGroup(e.target.value)}
                            >
                                <option value="">Selecione um grupo</option>
                                {groups.map(group => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AuctionsSelectorController;
