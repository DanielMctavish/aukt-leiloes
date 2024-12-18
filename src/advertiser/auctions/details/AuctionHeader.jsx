/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Timelapse, Edit, Delete, CalendarMonth, Person, AttachMoney } from "@mui/icons-material";
import dayjs from "dayjs";

const AuctionHeader = ({ currentAuct, editCurrentAuct, handleDeleteAuction, isDeleting }) => {
    const getEstimatedValue = () => {
        return currentAuct.product_list?.reduce((total, product) => 
            total + (product.initial_value || 0), 0) || 0;
    };

    const getSoldValue = () => {
        return currentAuct.product_list?.reduce((total, product) => {
            if (product.winner_id && product.Bid?.length > 0) {
                const winningBid = product.Bid.find(bid => bid.client_id === product.winner_id);
                return total + (winningBid?.value || 0);
            }
            return total;
        }, 0) || 0;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(value);
    };

    return (
        <section className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Cabeçalho com Imagem de Fundo */}
            <div className="relative h-36 md:h-48">
                <img 
                    src={currentAuct.auct_cover_img} 
                    alt="auct-cover" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Ações do Leilão */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                        onClick={editCurrentAuct}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/90 hover:bg-white 
                            text-gray-700 rounded-lg backdrop-blur-sm transition-all duration-300
                            shadow-lg hover:shadow-xl"
                    >
                        <Edit className="text-sm" />
                        <span className="hidden md:inline text-sm font-medium">Editar</span>
                    </button>
                    
                    {!isDeleting ? (
                        <button 
                            onClick={() => handleDeleteAuction(currentAuct.id)}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-500/90 hover:bg-red-500 
                                text-white rounded-lg backdrop-blur-sm transition-all duration-300
                                shadow-lg hover:shadow-xl"
                        >
                            <Delete className="text-sm" />
                            <span className="hidden md:inline text-sm font-medium">Excluir</span>
                        </button>
                    ) : (
                        <span className="flex items-center gap-2 px-4 py-2 bg-gray-500/90 
                            text-white rounded-lg backdrop-blur-sm">
                            Deletando...
                        </span>
                    )}
                </div>

                {/* ID do Leilão */}
                <div className="absolute bottom-4 left-4">
                    <span className="text-white/80 text-xs md:text-sm">ID do Leilão:</span>
                    <h2 className="text-white text-base md:text-lg font-bold">{currentAuct.nano_id}</h2>
                </div>
            </div>

            {/* Informações do Leilão */}
            <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    {/* Avatar e Informações Básicas */}
                    <img 
                        src={currentAuct.Advertiser?.url_profile_cover} 
                        alt="" 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 object-cover 
                            ring-4 ring-white shadow-lg mx-auto md:mx-0" 
                    />
                    
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                            {currentAuct.title}
                        </h1>
                        
                        <div className="flex flex-col md:flex-row items-center gap-2 text-gray-600 mb-4">
                            <Person className="text-sm" />
                            <span className="text-sm">Promotor(a):</span>
                            <span className="text-sm font-medium text-[#315fa3]">
                                {currentAuct.Advertiser?.email}
                            </span>
                        </div>

                        {/* Datas do Leilão */}
                        {currentAuct?.auct_dates && (
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                                {currentAuct.auct_dates.map((date, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 
                                            rounded-lg border border-gray-100"
                                    >
                                        <CalendarMonth className="text-gray-400 text-sm" />
                                        <span className="text-xs md:text-sm text-gray-600">
                                            {dayjs(date.date_auct).format('DD/MM/YYYY - HH:mm')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 
                        border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Timelapse className="text-gray-400" />
                            <span className="text-sm text-gray-500">Status</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-700">
                            {currentAuct.status}
                        </span>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 
                        border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AttachMoney className="text-blue-400" />
                            <span className="text-sm text-blue-500">Valor Estimado</span>
                        </div>
                        <span className="text-lg font-semibold text-blue-700">
                            {formatCurrency(getEstimatedValue())}
                        </span>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 
                        border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AttachMoney className="text-green-400" />
                            <span className="text-sm text-green-500">Valor Vendido</span>
                        </div>
                        <span className="text-lg font-semibold text-green-700">
                            {formatCurrency(getSoldValue())}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuctionHeader;