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
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
            params: {
                status: "cataloged",
            }
        });
        getSortedAuctions(response.data)
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
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#0D1733] to-[#d7d7d7] py-8 sm:py-12">
            <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-[200px]">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-8 text-center">
                    Leilões em Destaque
                </h2>
                
                <div className="text-white mb-6 sm:mb-8 px-4 sm:px-0">
                    <p className="text-center text-sm sm:text-base">
                        Na AUK Leilões, você encontra uma ampla variedade de produtos em leilão. 
                        Nossa plataforma oferece uma experiência única de compra, onde você pode 
                        adquirir itens exclusivos a preços competitivos. Participe agora e descubra 
                        oportunidades incríveis!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {sortedAuctions.map(auction => (
                        auction && (
                            <div key={auction.id} 
                                className="bg-white flex flex-col h-full overflow-hidden rounded-lg shadow-lg 
                                    shadow-[#1c1c1c37] transition-all duration-300 hover:shadow-xl 
                                    hover:transform hover:scale-[1.02]"
                            >
                                <div className="p-3 sm:p-4">
                                    <span className="text-xs sm:text-sm text-gray-600">
                                        {auction.Advertiser.name}
                                    </span>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                                        {auction.title}
                                    </h3>
                                </div>

                                <div className="flex-grow p-2 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3">
                                    {auction.product_list && auction.product_list.slice(0, 4).map(product => (
                                        <div
                                            key={product.id}
                                            className="flex flex-col items-center bg-gray-100 rounded-md 
                                                shadow p-2 relative overflow-hidden group"
                                        >
                                            <img
                                                src={product.cover_img_url}
                                                alt={product.title}
                                                className="w-full h-16 sm:h-24 object-cover rounded-md 
                                                    transition-all duration-300 group-hover:scale-110"
                                            />
                                            <div className="mt-2 text-center">
                                                {renderStars()}
                                                <p className="text-[10px] sm:text-xs font-semibold mt-1 
                                                    truncate w-full">
                                                    {product.title}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 sm:p-4">
                                    <button 
                                        onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)}
                                        className="w-full h-8 sm:h-10 bg-[#0D1733] rounded-md text-white 
                                            text-sm sm:text-base hover:bg-[#1A2547] transition-colors duration-300"
                                    >
                                        Ver mais
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Section01_1;