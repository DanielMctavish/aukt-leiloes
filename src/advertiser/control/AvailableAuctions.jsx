/* eslint-disable react/prop-types */

import { handleSelectAuction } from "./functions/handleSelectAuction";

function AvailableAuctions({ auctions, setSelectedAuction, setCurrentProduct, setTimer }) {


    return (
        <div className="flex flex-col w-[50%] h-full justify-between items-center relative bg-red-300">

            <div className="flex w-full justify-between items-center">
                <h1 className="text-zinc-700 text-[22px] font-bold">Leilões disponíveis</h1>
                <input type="text" placeholder="pesquisar leilão por título"
                    className=" p-2 bg-transparent border-[1px] border-[#D3D3D3] rounded-md text-zinc-700" />
            </div>

            <div className="flex w-full h-[90%] justify-start items-center gap-6 p-2 overflow-x-auto">
                {
                    Array.isArray(auctions) &&
                    auctions.map((auct, i) => {

                        return (
                            <div key={i}
                                className={`flex w-[140px] h-[140px] justify-between items-center overflow-hidden shadow-lg shadow-[#15151589]
                                        gap-2 px-2 py-2 rounded-[12px] bg-gray-100 cursor-pointer hover:bg-gray-200 relative z-40 
                                        ${auct.status === 'finished' ? 'finished-border' : ''}
                                        ${auct.status === 'live' ? 'live-border' : ''} 
                                        ${auct.status === 'paused' ? 'paused-border' : ''}`}
                                onClick={() => handleSelectAuction(auct, setSelectedAuction, setCurrentProduct, setTimer) }
                            >
                                <img src={auct.auct_cover_img} alt=""
                                    className="object-cover w-[120px] h-[120px] opacity-90
                                                absolute rounded-md shadow-lg shadow-[#1a1a1a2b]" />
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default AvailableAuctions;