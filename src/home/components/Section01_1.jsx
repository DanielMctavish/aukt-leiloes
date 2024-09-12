/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "@mui/icons-material";

function Section01_1() {
    const [sortedAuctions, setSortedAuctions] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        listAuctions()
    }, [])

    const listAuctions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                params: {
                    status: "cataloged",
                }
            });
            getSortedAuctions(response.data)
        } catch (error) {
            console.log("Error loading auctions:", error.message);
        }
    }

    const getSortedAuctions = (auctions) => {
        const shuffled = auctions.sort(() => 0.5 - Math.random());
        setSortedAuctions(shuffled.slice(0, 6));
    };

    const renderStars = () => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 text-sm" />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#0D1733] to-[#d7d7d7] py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Leilões em Destaque</h2>
            
            <div className="text-white mb-8">
                <p className="text-center">
                    Na AUK Leilões, você encontra uma ampla variedade de produtos em leilão. 
                    Nossa plataforma oferece uma experiência única de compra, onde você pode 
                    adquirir itens exclusivos a preços competitivos. Participe agora e descubra 
                    oportunidades incríveis!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAuctions.map(auction => (
                    auction && (
                        <div key={auction.id} className="bg-white flex flex-col h-full overflow-hidden
                        rounded-lg shadow-lg shadow-[#1c1c1c37] transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105">
                            <div className="p-4">
                                <span className="text-sm text-gray-600">{auction.Advertiser.name}</span>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{auction.title}</h3>
                            </div>

                            <div className="flex-grow p-4 grid grid-cols-2 gap-2">
                                {
                                    auction.product_list && auction.product_list.slice(0, 4).map(product => (
                                        <div
                                            key={product.id}
                                            className="flex flex-col items-center bg-gray-100 rounded-md shadow p-2 relative overflow-hidden group"
                                        >
                                            <img
                                                src={product.cover_img_url}
                                                alt={product.title}
                                                className="w-full h-24 object-cover rounded-md transition-all duration-300 group-hover:scale-110"
                                            />
                                            <div className="mt-2 text-center">
                                                {renderStars()}
                                                <p className="text-xs font-semibold mt-1 truncate w-full">{product.title}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="p-4">
                                <button 
                                    onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)}
                                    className="w-full h-10 bg-[#0D1733] rounded-md text-white hover:bg-[#1A2547] transition-colors duration-300"
                                >
                                    Ver mais
                                </button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default Section01_1;