/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

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

    return (
        <div className="w-[400px] h-[270px] p-4 bg-white rounded-[4px] shadow-lg flex flex-col justify-around gap-2">
            <div className="flex flex-col">
                <span className="font-bold">Nome:</span>
                <span>{client.name}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold">Email:</span>
                <span>{client.email}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold">Telefone:</span>
                <span>{address.phone}</span>
            </div>
            <button className="mt-2 p-2 bg-[#0D1733] text-white rounded-md ">
                Entrar em contato
            </button>
        </div>
    );
}

export default ClientCard;