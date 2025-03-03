/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import AssideAdvertiser from "../../_asside/AssideAdvertiser";
import NavAdvertiser from "../../_navigation/NavAdvertiser";
import { useEffect, useState } from "react";
import { DeleteForever, ImageNotSupported, Edit, Gavel, TrendingUp, AccessTime, Sell } from "@mui/icons-material"
import AdvertiserProductDetailsUpdate from "./AdvertiserProductDetailsUpdate"; // Import the update modal
import dayjs from "dayjs";

function AdvertiserProductDetails() {
    const [currentProduct, setCurrentProduct] = useState({})
    const [deleteIsLoading, setDeleteIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showSelectClientModal, setShowSelectClientModal] = useState(false)
    const [advertiserClients, setAdvertiserClients] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)
    const navigate = useNavigate()
    const { product_id } = useParams();

    useEffect(() => {
        getCurrentProduct()
    }, [deleteIsLoading])

    const getCurrentProduct = async () => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        const localAdvertiser = JSON.parse(currentLocalAdvertiser)

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`, {
            headers: {
                'Authorization': `Bearer ${localAdvertiser.token}`
            }
        }).then(async response => {
            setCurrentProduct(response.data)
        }).catch(err => {
            if (err.response.status === 404) {
                navigate('/advertiser/auctions')
            }
        })
    }

    const handleDeleteProductImage = async (url, product_id) => {
        setDeleteIsLoading(true)
        try {
            await axios.delete(`${import.meta.env.VITE_APP_BACKEND_API}/products/delete-product-img`, {
                params: {
                    url_product: url,
                    product_id: product_id
                }
            });
            setDeleteIsLoading(false)
        } catch (error) {
            setDeleteIsLoading(false)
        }
    }

    const handleCloseAuction = async () => { 
        try {
            const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt');
            const localAdvertiser = JSON.parse(currentLocalAdvertiser);

            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
                params: {
                    email: localAdvertiser.email
                },
                headers: {
                    'Authorization': `Bearer ${localAdvertiser.token}`
                }
            });
            setAdvertiserClients(response.data.Clients);
            setShowSelectClientModal(true);
        } catch (error) {
            console.error("Erro ao buscar dados do anunciante:", error);
        }
    }

    const handleSetWinner = async (clientId) => {
        try {
            const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt');
            const localAdvertiser = JSON.parse(currentLocalAdvertiser);

            await axios.patch(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/update-product`, 
                {
                    winner_id: clientId
                },
                {
                    params: {
                        product_id: product_id
                    },
                    headers: {
                        'Authorization': `Bearer ${localAdvertiser.token}`
                    }
                }
            );
            
            getCurrentProduct(); // Atualiza os dados do produto
            setShowSelectClientModal(false);
            setSelectedClient(null);
        } catch (error) {
            console.error("Erro ao definir vencedor:", error);
        }
    }

    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    // Função para formatar data
    const formatDate = (date) => {
        return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
    };

    // Função para ordenar lances por data (mais recente primeiro)
    const getSortedBids = () => {
        return currentProduct.Bid?.sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        ) || [];
    };

    const SelectClientModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header do Modal */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Selecionar Vencedor do Lote
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Selecione o cliente que será definido como vencedor deste lote
                    </p>
                </div>

                {/* Lista de Clientes */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid gap-4">
                        {advertiserClients.map((client) => {
                            const address = JSON.parse(client.address);
                            return (
                                <div
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                                        ${selectedClient?.id === client.id 
                                            ? 'border-[#012038] bg-[#012038]/5' 
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#012038] flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg font-semibold text-white">
                                                {client.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {client.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {client.email} • CPF: {client.cpf}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {address.city}, {address.state}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer do Modal */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setShowSelectClientModal(false);
                            setSelectedClient(null);
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (selectedClient) {
                                handleSetWinner(selectedClient.id);
                            }
                        }}
                        disabled={!selectedClient}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition-colors
                            ${selectedClient 
                                ? 'bg-[#012038] hover:bg-[#012038]/90' 
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Confirmar Vencedor
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-screen bg-[#f8fafc] flex flex-col md:flex-row">
            <AssideAdvertiser MenuSelected="menu-3" />

            <section className="flex-1 flex flex-col">
                <NavAdvertiser path='anunciante > leilões > detalhes > produtos' />

                {showSelectClientModal && <SelectClientModal />}

                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {/* Header do Produto */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {currentProduct.title}
                            </h1>
                            <p className="text-gray-500">ID: {currentProduct.id}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleCloseAuction()}
                                className="mt-4 md:mt-0 px-6 py-2.5 bg-[#012038] hover:bg-[#012d52] text-white 
                                rounded-lg transition-all duration-300 flex items-center gap-2 shadow-sm"
                            >
                                <Sell className="text-sm" />
                                Fechar Lote
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 md:mt-0 px-6 py-2.5 bg-[#012038] hover:bg-[#012d52] text-white 
                                rounded-lg transition-all duration-300 flex items-center gap-2 shadow-sm"
                            >
                                <Edit className="text-sm" />
                                Editar Produto
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Seção de Imagens */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col gap-6">
                                {/* Imagem Principal */}
                                <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-50">
                                    {!deleteIsLoading ? (
                                        currentProduct.cover_img_url ? (
                                            <>
                                                <button
                                                    onClick={() => handleDeleteProductImage(currentProduct.cover_img_url, currentProduct.id)}
                                                    className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-500 
                                                        text-white rounded-lg shadow-lg transition-all duration-300 z-10
                                                        hover:scale-105"
                                                >
                                                    <DeleteForever className="text-xl" />
                                                </button>
                                                <img
                                                    src={currentProduct.cover_img_url}
                                                    alt=""
                                                    className="w-full h-full object-contain"
                                                />
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageNotSupported className="text-gray-300" sx={{ fontSize: 80 }} />
                                            </div>
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                                                Excluindo imagem...
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Galeria */}
                                {Array.isArray(currentProduct.group_imgs_url) && currentProduct.group_imgs_url.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">Galeria de Imagens</h3>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {currentProduct.group_imgs_url.map((url, key) => (
                                                <div key={key} className="relative aspect-square rounded-lg overflow-hidden group">
                                                    <img
                                                        src={url}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => handleDeleteProductImage(url, currentProduct.id)}
                                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                                                            flex items-center justify-center transition-opacity duration-200"
                                                    >
                                                        <DeleteForever className="text-white/90 hover:text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seção de Informações */}
                        <div className="space-y-6">
                            {/* Cards de Valores */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <span className="text-sm font-medium text-gray-400">Valor Inicial</span>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {formatCurrency(currentProduct.initial_value)}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <span className="text-sm font-medium text-gray-400">Valor Reserva</span>
                                    <p className="text-2xl font-bold text-cyan-600 mt-1">
                                        {formatCurrency(currentProduct.reserve_value)}
                                    </p>
                                </div>
                            </div>

                            {/* Grupo */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <span className="text-sm font-medium text-gray-400">Grupo</span>
                                <p className="text-xl font-semibold text-gray-900 mt-1">
                                    {currentProduct.group}
                                </p>
                            </div>

                            {/* Descrição */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <span className="text-sm font-medium text-gray-400">Descrição</span>
                                <div className="mt-3 prose prose-sm max-w-none">
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {currentProduct.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nova seção de lances após as informações */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Gavel className="text-gray-400" />
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Histórico de Lances
                                            <span className="ml-2 text-sm font-normal text-gray-500">
                                                ({currentProduct.Bid?.length || 0} lances)
                                            </span>
                                        </h2>
                                    </div>

                                    {currentProduct.winner_id && (
                                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            Produto Vendido
                                        </div>
                                    )}
                                </div>

                                {getSortedBids().length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Cliente
                                                    </th>
                                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Valor do Lance
                                                    </th>
                                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Data/Hora
                                                    </th>
                                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {getSortedBids().map((bid, index) => (
                                                    <tr key={index} className={`${currentProduct.winner_id === bid.client_id
                                                        ? 'bg-green-50'
                                                        : 'hover:bg-gray-50'
                                                        }`}>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-600">
                                                                        {bid.Client?.name?.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {bid.Client?.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {bid.Client?.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <TrendingUp className={`text-sm ${index === 0 ? 'text-green-500' : 'text-gray-400'
                                                                    }`} />
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {formatCurrency(bid.value)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <AccessTime className="text-gray-400 text-sm" />
                                                                <span className="text-sm text-gray-600">
                                                                    {formatDate(bid.created_at)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {currentProduct.winner_id === bid.client_id ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Vencedor
                                                                </span>
                                                            ) : index === 0 ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Maior Lance
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                    Superado
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        Nenhum lance registrado para este produto ainda.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isEditing && (
                <AdvertiserProductDetailsUpdate
                    product={currentProduct}
                    onClose={() => setIsEditing(false)}
                    onUpdate={getCurrentProduct}
                />
            )}
        </div>
    )
}

export default AdvertiserProductDetails;