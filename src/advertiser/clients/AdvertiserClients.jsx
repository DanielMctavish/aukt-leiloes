import { useEffect, useState } from "react";
import axios from "axios";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import ClientCard from "./ClientCard";

function AdvertiserClients() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"));
            if (currentSession) {
                try {
                    const advertiserResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
                        headers: {
                            'Authorization': `Bearer ${currentSession.token}`
                        },
                        params: {
                            email: currentSession.email
                        }
                    });
                    const advertiser = advertiserResponse.data;
                    console.log("obs advertiser", advertiser)
                    if (advertiser && advertiser.Clients) {
                        setClients(advertiser.Clients); // Assumindo que o campo é "clients"
                    } else {
                        console.log("No clients found for this advertiser.");
                    }
                } catch (error) {
                    console.log("Error fetching clients:", error.message);
                }
            }
        };

        fetchClients();
    }, []);

    return (
        <div className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-x-hidden custom-scrollbar
        flex lg:flex-row flex-col justify-start items-start">

            <AssideAdvertiser MenuSelected="menu-6" />
            <section className="w-full h-[100vh] text-zinc-600 flex flex-col justify-start items-center">
                <NavAdvertiser />

                <section className="w-[80%] h-[90%] mt-[1vh] flex flex-col 
                justify-start items-center p-2 bg-white relative gap-4">

                    <span className="flex w-full h-[60px] text-[22px] font-bold
                    bg-[#012038] text-white justify-start items-center p-2 rounded-t-[4px]">
                        Clientes
                    </span>

                    <div className="w-full h-full overflow-y-auto p-4 flex flex-wrap gap-4">
                        {clients.length > 0 ? (
                            clients.map(client => (
                                <ClientCard key={client.id} client={client} />
                            ))
                        ) : (
                            <span className="text-center text-gray-500">Nenhum cliente encontrado.</span>
                        )}
                    </div>

                </section>

            </section>

        </div>
    );
}

export default AdvertiserClients;