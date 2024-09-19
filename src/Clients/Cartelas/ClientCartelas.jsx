import { useEffect, useState } from "react";
import axios from "axios";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import LoadingModal from "../../advertiser/arrematantes/mod/LoadingModal"; // Ajuste o caminho conforme necessário
import { useNavigate } from "react-router-dom";

function ClientCartelas() {
    const [currentClient, setCurrentClient] = useState({})
    const [cartelas, setCartelas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientCartelas = async () => {
            const clientSession = JSON.parse(localStorage.getItem('client-auk-session-login'));
            console.log("sessão cliente -> ", clientSession)

            if (!clientSession) {
                navigate("/client/login");
                return;
            }

            setIsLoading(true);

            try {
                const currentCliente = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email`, {
                    params: { email: clientSession.email },
                    headers: {
                        Authorization: `Bearer ${clientSession.token}`
                    }
                }).then(result => {
                    setCurrentClient(result.data)
                })

                const clientID = currentCliente.data.id

                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/cartela/list-cartelas-by-client`, {
                    params: { client_id: clientID },
                    headers: {
                        Authorization: `Bearer ${clientSession.token}`
                    }
                });

                setCartelas(response.data);
            } catch (error) {
                console.log("Erro ao buscar cartelas do cliente:", error.response);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientCartelas();
    }, [navigate]);

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#efefef]">
            <AssideClient MenuSelected="menu-8" />
            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 p-1">
                <NavClient currentClient={currentClient} />
                <div className="flex flex-col w-[80%] h-full bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Minhas Cartelas</h2>

                    {isLoading ? (
                        <LoadingModal isVisible={isLoading} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cartelas.length > 0 ? (
                                cartelas.map(cartela => (
                                    <div key={cartela.id} className="border p-4 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">Status:</span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-white ${cartela.status === "DENIED" ? 'bg-red-500' :
                                                    cartela.status === "PAYMENT_CONFIRMED" ? 'bg-blue-500' :
                                                        cartela.status === "PROCESS" ? 'bg-yellow-500' :
                                                            cartela.status === "SENDED" ? 'bg-green-500' :
                                                                cartela.status === "DELIVERED" ? 'bg-purple-500' :
                                                                    'bg-gray-500'
                                                    }`}
                                            >
                                                {cartela.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Valor Total:</span>
                                            <span className="ml-2">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                                    .format(cartela.amount)}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Código de Rastreio:</span>
                                            <span className="ml-2">
                                                {cartela.tracking_code || "Não informado"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Produtos:</span>
                                            <ul className="list-disc list-inside">
                                                {cartela.products.map(product => (
                                                    <li key={product.id}>{product.title}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <span>Nenhuma cartela encontrada.</span>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <LoadingModal isVisible={isLoading} />
        </div>
    );
}

export default ClientCartelas;