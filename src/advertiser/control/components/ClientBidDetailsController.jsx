/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Close, WhatsApp } from "@mui/icons-material";

function ClientBidDetailsController({ bid, onClose }) {
    const [address, setAddress] = useState({});

    useEffect(() => {
        if (bid.Client.address) {
            try {
                const parsedAddress = JSON.parse(bid.Client.address);
                setAddress(parsedAddress);
            } catch (error) {
                console.error("Error parsing address:", error);
            }
        } else {
            setAddress({});
        }
    }, [bid]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[99]">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#012038] text-white p-6 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Close />
                    </button>
                    <h2 className="text-2xl font-bold">Detalhes do Cliente</h2>
                    <p className="text-white/80 mt-1">Informações do arrematante</p>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Informações Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Nome</label>
                                <p className="text-lg font-medium">{bid.Client.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <p className="text-lg font-medium">{bid.Client.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Telefone</label>
                                <p className="text-lg font-medium">{address.phone || "Não informado"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Valor do Lance</label>
                                <p className="text-lg font-bold text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL' 
                                    }).format(bid.value)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">Rua</label>
                                <p className="font-medium">{address.street || "Não informado"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Número</label>
                                <p className="font-medium">{address.number || "Não informado"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Cidade</label>
                                <p className="font-medium">{address.city || "Não informado"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Estado</label>
                                <p className="font-medium">{address.state || "Não informado"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer com Ações */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                                transition-colors font-medium"
                        >
                            Fechar
                        </button>
                        {address.phone && (
                            <a
                                href={`https://wa.me/55${address.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                    transition-colors font-medium flex items-center gap-2"
                            >
                                <WhatsApp />
                                Contatar via WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientBidDetailsController;