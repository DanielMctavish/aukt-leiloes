/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Email, Phone, WhatsApp, LocationOn } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";

function ClientCard({ client }) {
    const [address, setAddress] = useState({});

    useEffect(() => {
        if (client.address) {
            try {
                const parsedAddress = JSON.parse(client.address);
                setAddress(parsedAddress);
            } catch (error) {
                console.error("Error parsing address:", error);
            }
        }
    }, [client]);

    const handleWhatsAppClick = () => {
        if (address.phone) {
            const phoneNumber = address.phone.replace(/\D/g, '');
            const message = encodeURIComponent(`Olá ${client.name}, tudo bem? Vi seu cadastro no Aukt Leilões e gostaria de conversar com você.`);
            window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {client.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Email className="text-base" />
                        {client.email}
                    </p>
                </div>

                {/* Contact Info */}
                {address && (
                    <div className="space-y-2">
                        {address.phone && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone className="text-gray-400 text-base" />
                                {address.phone}
                            </p>
                        )}
                        {address.street && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <LocationOn className="text-gray-400 text-base" />
                                {`${address.street}${address.number ? `, ${address.number}` : ''}`}
                                {address.city && ` - ${address.city}`}
                                {address.state && `, ${address.state}`}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50">
                <Tooltip 
                    title={!address.phone ? "Este cliente não possui telefone cadastrado" : ""}
                    placement="top"
                >
                    <div className="w-full"> {/* Wrapper div para o Tooltip funcionar com botão desabilitado */}
                        <button
                            onClick={handleWhatsAppClick}
                            disabled={!address.phone}
                            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium
                                ${address.phone 
                                    ? 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700' 
                                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                                } transition-all duration-200`}
                        >
                            <WhatsApp />
                            {address.phone ? 'Contatar via WhatsApp' : 'Telefone não disponível'}
                        </button>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}

export default ClientCard;