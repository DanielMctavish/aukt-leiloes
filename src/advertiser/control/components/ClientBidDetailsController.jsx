/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

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
        }else{
            setAddress({})
        }
    }, [bid]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-[99]">

            <div className="bg-white p-4 rounded shadow-lg w-[80%] h-[80%]">
                <button onClick={onClose} className="absolute top-2 right-2 text-white">
                    <Close sx={{ fontSize: "30px" }} />
                </button>
                <h2 className="text-xl font-bold mb-4">Detalhes do Cliente</h2>
                <div className="flex flex-col gap-2">
                    <div>
                        <span className="font-bold">Nome: </span>
                        <span>{bid.Client.name}</span>
                    </div>
                    <div>
                        <span className="font-bold">Email: </span>
                        <span>{bid.Client.email}</span>
                    </div>
                    <div>
                        <span className="font-bold">Telefone: </span>
                        <span>{address.phone}</span>
                    </div>
                    <div>
                        <span className="font-bold">Endereço: </span>
                        <span>{address.street}, {address.number}, {address.city} - {address.state}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ClientBidDetailsController;