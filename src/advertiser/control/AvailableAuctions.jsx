/* eslint-disable react/prop-types */

import { handleSelectAuction } from "./functions/handleSelectAuction";

function AvailableAuctions({ auctions, setSelectedAuction, selectedAuction, setCurrentProduct, setTimer }) {


    return (
        <div className="flex flex-col w-[40%] h-full justify-between items-center relative bg-[#E9E9E9] rounded-md p-3">

            <div className="flex w-full justify-between items-center">
                <h1 className="text-zinc-700 text-[22px] font-bold">Leilões disponíveis</h1>
            </div>

            {selectedAuction.status !== 'live' ?
                <select onChange={(e) => {
                    const selectedAuction = auctions.find(auction => auction.id === e.target.value);
                    handleSelectAuction(selectedAuction, setSelectedAuction, setCurrentProduct, setTimer)
                }}
                    className="w-[80%] bg-white p-2 rounded-md text-[#a5a5a5]">
                    <option value="">selecione seu leilão</option>
                    {
                        Array.isArray(auctions) &&
                        auctions.map((auct) => {
                            return (
                                <option key={auct.id} value={auct.id} className="text-[12px]">{auct.title}</option>
                            )
                        })
                    }
                </select> : ""}

            <div className="flex w-full h-[90%] justify-center items-center gap-6 p-2 overflow-x-auto">
                <div className={`flex w-[80px] h-[80px] justify-center items-center overflow-hidden shadow-lg shadow-[#15151589]
                                        gap-2 px-2 py-2 rounded-[12px] bg-gray-100 cursor-pointer hover:bg-gray-200 relative z-40 
                                        ${selectedAuction.status === 'finished' ? 'finished-border' : ''}
                                        ${selectedAuction.status === 'live' ? 'live-border' : ''} 
                                        ${selectedAuction.status === 'paused' ? 'paused-border' : ''}`}
                    onClick={() => handleSelectAuction(selectedAuction, setSelectedAuction, setCurrentProduct, setTimer)}
                >
                    <img src={selectedAuction.auct_cover_img} alt=""
                        className="object-cover w-[70px] h-[70px] opacity-90
                                                absolute rounded-md shadow-lg shadow-[#1a1a1a2b]" />
                </div>
            </div>

        </div>
    )
}

export default AvailableAuctions;