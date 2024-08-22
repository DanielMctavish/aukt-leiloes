/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Section01_1() {
    const [sortedAuctions, setSortedAuctions] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        listAuctions()
    }, [])

    const listAuctions = async () => {

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                params: {
                    status: "cataloged",
                }
            }).then(response => {
                getSortedAuctions(response.data)
                // console.log("leilões -> ", response.data)
            })
        } catch (error) {
            console.log("Error loading page:", error.message);
        }

    }

    const getSortedAuctions = async (auctions) => {

        const updateAuctions = () => {
            setSortedAuctions([])

            let card01 = auctions[0] && auctions[Math.floor(Math.random() * 12)];
            let card02 = auctions[0] && auctions[Math.floor(Math.random() * 12)];
            let card03 = auctions[0] && auctions[Math.floor(Math.random() * 12)];
            let card04 = auctions[0] && auctions[Math.floor(Math.random() * 12)];

            // Atualiza o estado com os novos valores
            setSortedAuctions([card01, card02, card03, card04]);
        };

        updateAuctions();
    };

    return (
        <div className="flex w-full h-[100vh] bg-white">
            <div className="flex w-full h-[60vh] justify-between items-center p-3 gap-3 text-[#191919]">

                {
                    sortedAuctions.slice(0, 4).map(auction => (
                        <div key={auction.id} className=" bg-white flex flex-col flex-1 h-[90%] overflow-hidden
                        rounded-md shadow-lg shadow-[#1c1c1c37] p-2 relative">
                            <div className="flex w-full h-[10%]">
                                <div className="flex flex-col">
                                    <span className="text-[14px]">{auction.Advertiser.name}</span>
                                    <span className="text-[22px] font-bold">{auction.title}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 flex-1 h-[80%] justify-around items-center">
                                {
                                    auction.product_list.slice(0, 4).map(product => (
                                        <div
                                            key={product.id}
                                            className="flex justify-center items-center bg-white rounded-md shadow p-2 h-[40%] w-[40%] relative overflow-hidden"
                                        >
                                            <img
                                                src={product.cover_img_url}
                                                alt={product.title}
                                                className="h-[80%] w-[80%] object-cover rounded-md"
                                            />
                                        </div>
                                    ))
                                }
                            </div>

                            <div onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)} className="flex w-full h-[10%] justify-end p-1">
                                <button className="h-[40px] p-2 bg-[#0D1733] rounded-md text-white">veja mais</button>
                            </div>

                        </div>
                    ))
                }

            </div>
        </div>
    )
}


export default Section01_1;