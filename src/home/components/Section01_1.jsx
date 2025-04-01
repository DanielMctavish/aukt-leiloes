/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowForwardIos } from "@mui/icons-material";
import { motion } from "framer-motion";

function Section01_1() {
    const [sortedAuctions, setSortedAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        listAuctions();
    }, []);

    const listAuctions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                params: {
                    status: "cataloged",
                }
            });
            getSortedAuctions(response.data);
        } catch (error) {
            console.error("Erro ao buscar leilões:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSortedAuctions = (auctions) => {
        const shuffled = auctions.sort(() => 0.5 - Math.random());
        setSortedAuctions(shuffled.slice(0, 6));
    };

    const renderStars = (rating = 5) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xs`} 
                        fontSize="small"
                    />
                ))}
            </div>
        );
    };

    // Variants para animações com framer-motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1.0] // Curva de animação estilo Apple
            }
        }
    };

    return (
        <section className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#0D1733] to-[#ffffff] py-12 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1480px]">
                {/* Cabeçalho da Seção */}
                <motion.div 
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Leilões em Destaque
                    </h2>
                    
                    <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
                        Na AUK Leilões, você encontra uma ampla variedade de produtos em leilão. 
                        Nossa plataforma oferece uma experiência única de compra, onde você pode 
                        adquirir itens exclusivos a preços competitivos.
                    </p>
                </motion.div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {sortedAuctions.map(auction => (
                            auction && (
                                <motion.div 
                                    key={auction.id} 
                                    variants={itemVariants}
                                    className="bg-white/95 backdrop-blur-sm flex flex-col h-full overflow-hidden rounded-2xl 
                                        shadow-sm transition-all duration-300
                                        hover:shadow-xl hover:shadow-[#1c1c1c15]"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="p-5 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                                                {auction.Advertiser.name}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mt-1 tracking-tight">
                                            {auction.title}
                                        </h3>
                                    </div>

                                    <div className="flex-grow p-5 grid grid-cols-2 gap-4">
                                        {auction.product_list && auction.product_list.slice(0, 4).map(product => (
                                            <div
                                                key={product.id}
                                                className="flex flex-col bg-gray-50 rounded-xl 
                                                    overflow-hidden group"
                                            >
                                                <div className="w-full h-28 overflow-hidden">
                                                    <img
                                                        src={product.cover_img_url}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover 
                                                            transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                                                            group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="p-3 text-center">
                                                    <p className="text-xs font-medium text-gray-900 mb-1 line-clamp-1">
                                                        {product.title}
                                                    </p>
                                                    <div className="flex justify-center">
                                                        {renderStars()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-5 pt-2">
                                        <button 
                                            onClick={() => navigate(`/advertiser/home/shop/${auction.id}`)}
                                            className="w-full flex items-center justify-center gap-1 py-3 
                                                bg-[#0D1733] text-white font-medium rounded-xl
                                                transition-all duration-300 hover:bg-[#182552]
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D1733]"
                                        >
                                            <span>Ver mais</span>
                                            <ArrowForwardIos fontSize="small" className="text-xs" />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export default Section01_1;