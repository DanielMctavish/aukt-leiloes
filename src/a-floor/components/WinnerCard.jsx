/* eslint-disable react/prop-types */
import { EmojiEvents } from "@mui/icons-material";
import avatarClientsUrls from "../../media/avatar-floor/AvatarclientsUrls"

// Convertendo o objeto de URLs em um array
const avatarIndex = Object.values(avatarClientsUrls)

function WinnerCard({ winner, product }) {
    return (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden animate-scale-in">
            {/* Header com troféu e parabéns */}
            <div className="bg-green-600 text-white p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute -left-4 -top-4 w-20 h-20 bg-green-500 rounded-full opacity-20" />
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500 rounded-full opacity-20" />
                </div>
                <div className="relative z-10">
                    <EmojiEvents sx={{ fontSize: 48 }} className="mb-2" />
                    <h2 className="text-2xl font-bold mb-1">Parabéns pelo Arremate!</h2>
                    <p className="opacity-90">Lote {product.lote} foi vendido com sucesso</p>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-6">
                {/* Produto */}
                <div className="flex gap-6 items-center mb-8">
                    <div className="w-40 h-40 flex-shrink-0">
                        <img 
                            src={product.cover_img_url} 
                            alt={product.title}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                        <div className="text-2xl font-bold text-green-600">
                            R$ {product.real_value?.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Vencedor */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-4">
                        <img 
                            src={avatarIndex[winner.client_avatar]} 
                            alt="Avatar" 
                            className="w-16 h-16 rounded-full border-4 border-green-100"
                        />
                        <div>
                            <h4 className="text-lg font-bold text-gray-800">{winner.nickname}</h4>
                            <p className="text-green-600 font-medium">Vencedor do Lote</p>
                        </div>
                    </div>
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-medium">
                        Arrematado!
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WinnerCard; 