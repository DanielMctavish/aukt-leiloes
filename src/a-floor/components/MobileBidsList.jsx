/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { EmojiEvents } from '@mui/icons-material';
import avatarClientsUrls from '../../media/avatar-floor/AvatarclientsUrls';
import axios from 'axios';

// Convertendo o objeto de URLs em um array
const avatarIndex = Object.values(avatarClientsUrls);

function MobileBidsList({ currentProduct, clientSession, onClose, isAuctionFinished, winner }) {
    const [bids, setBids] = useState([]);

    const fetchProductData = async () => {
        if (!currentProduct?.id) return;
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${currentProduct.id}`);
            const product = response.data;
            
            if (product?.Bid) {
                const sortedBids = [...product.Bid].sort((a, b) => {
                    const valueComparison = b.value - a.value;
                    if (valueComparison !== 0) return valueComparison;
                    
                    const dateA = new Date(a.created_at || a.bidTime || Date.now());
                    const dateB = new Date(b.created_at || b.bidTime || Date.now());
                    return dateB - dateA;
                });
                
                setBids(sortedBids);
            }
        } catch (error) {
            console.error("Erro ao buscar dados do produto:", error);
        }
    };

    // Buscar dados iniciais
    useEffect(() => {
        fetchProductData();
    }, [currentProduct?.id]);

    // Atualizar quando houver novos lances
    useEffect(() => {
        if (currentProduct?.Bid) {
            fetchProductData();
        }
    }, [currentProduct?.Bid]);

    // Função para formatar o valor em reais
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Função para formatar a data
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="bg-[#012038] text-white py-4 px-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Histórico de Lances</h2>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    Fechar
                </button>
            </div>

            {/* Card do Vencedor */}
            <AnimatePresence>
                {isAuctionFinished && winner && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-500 text-white p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <EmojiEvents />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Lote Arrematado!</h3>
                                <p className="text-white/90">
                                    Vencedor: {winner.nickname}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lista de Lances */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                    {bids.length > 0 ? (
                        bids.map((bid, index) => (
                            <motion.div
                                key={bid.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-3 rounded-lg shadow-sm border ${
                                    bid.client_id === clientSession?.id ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                                } ${index === 0 ? 'border-2 border-green-500 bg-green-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={avatarIndex[bid.Client.client_avatar || 0]}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800">
                                                    {bid.Client.nickname}
                                                </span>
                                                {index === 0 && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        Maior Lance
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(bid.created_at)}
                                            </span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="text-lg font-semibold text-green-600">
                                                {formatCurrency(bid.value)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            Nenhum lance registrado ainda
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

MobileBidsList.propTypes = {
    currentProduct: PropTypes.shape({
        Bid: PropTypes.array,
        id: PropTypes.number
    }),
    clientSession: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    isAuctionFinished: PropTypes.bool,
    winner: PropTypes.object
};

export default MobileBidsList; 