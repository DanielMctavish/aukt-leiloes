/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AssideAdvertiser from "../../_asside/AssideAdvertiser";
import NavAdvertiser from "../../_navigation/NavAdvertiser";
import { useSelector, useDispatch } from "react-redux";
import { NoPhotography, EditNote } from "@mui/icons-material"
import axios from "axios"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"; // Import the plugin
import "./StyleAuctDetails.css"
import { editAuct } from "../../../features/auct/AuctToEdit";
import { selectProduct } from "../../../features/product/ProductAddPhoto";
import AddProductMod from "../mod/AddProductMod";
import AuctionHeader from "./AuctionHeader"; // Import the new component

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

function AdvertiserAuctDetails() {
    const { auct_id } = useParams(); // Get parameters from URL
    const [currentAuct, setCurrentAuct] = useState({ product_list: [] })
    const [isDeleting, setIsDeleting] = useState(false)
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
    const localAdvertiser = JSON.parse(currentLocalAdvertiser)
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

    useEffect(() => {
        if (!currentLocalAdvertiser) {
            navigate('/advertiser/login')
        }

        getCurrentAuctById(auct_id)
    }, [auct_id, state.finishedUpload])

    useEffect(() => { }, [currentAuct.auct_dates])

    const getCurrentAuctById = async (auctId) => {
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auctId}`, {
            headers: {
                'Authorization': `Bearer ${localAdvertiser.token}`
            }
        }).then(async response => {
            setCurrentAuct(response.data)
        }).catch(err => {
            if (err.response.status === 404) {
                navigate('/advertiser/auctions')
            }
        })
    }

    async function editCurrentAuct() {
        dispatch(editAuct(currentAuct))
        navigate('/advertiser/edit-auct')
    }

    const redirectToProductDetails = (product_id) => {
        navigate(`/advertiser/product-details/${product_id}`)
    }


    const handleShowPhotoAdd = (product) => {
        setIsAddProductModalOpen(true);
        dispatch(selectProduct(product));
    }

    const handleClosePhotoAdd = () => {
        setIsAddProductModalOpen(false);
    }

    const handleDeleteAuction = async (auct_id) => {
        setIsDeleting(true)

        try {
            await axios.delete(`${import.meta.env.VITE_APP_BACKEND_API}/auct/delete-auct?auct_id=${auct_id}`, {
                headers: {
                    'Authorization': `Bearer ${localAdvertiser.token}`
                }
            }).then(() => {
                setIsDeleting(false)
            })
        } catch (error) {
            setIsDeleting(false)
        }
    }

    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="w-full h-[100vh] bg-gray-50 flex flex-col md:flex-row absolute">
            <AssideAdvertiser MenuSelected="menu-3" />

            {/* Modal de Adicionar Produto */}
            {isAddProductModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[999] 
                    backdrop-blur-lg bg-black/30">
                    <AddProductMod onClose={handleClosePhotoAdd} />
                </div>
            )}

            <section className="w-full flex-1 flex flex-col">
                <NavAdvertiser path={"anunciante > leilões > detalhes"} />

                <div className="flex-1 p-3 md:p-6 bg-gradient-to-b from-[#091925] to-[#0d2437]">
                    {/* Header do Leilão */}
                    <AuctionHeader
                        currentAuct={currentAuct}
                        editCurrentAuct={editCurrentAuct}
                        handleDeleteAuction={handleDeleteAuction}
                        isDeleting={isDeleting}
                    />

                    {/* Lista de Produtos */}
                    <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Cabeçalho da Lista */}
                        <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800">
                                Lista de Produtos
                                <span className="ml-2 text-sm text-gray-500 font-normal">
                                    ({currentAuct.product_list.length} itens)
                                </span>
                            </h2>
                        </div>

                        {/* Tabela de Produtos - Versão Desktop */}
                        <div className="hidden md:block">
                            <table className="w-full table-fixed">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-[10%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Lote
                                        </th>
                                        <th className="w-[30%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Produto
                                        </th>
                                        <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Valor Inicial
                                        </th>
                                        <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Valor Atual
                                        </th>
                                        <th className="w-[10%] px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Lances
                                        </th>
                                        <th className="w-[10%] px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Imagem
                                        </th>
                                        <th className="w-[10%] px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentAuct.product_list
                                        .sort((a, b) => a.lote - b.lote)
                                        .map((product, index) => (
                                            <tr key={index}
                                                className={`hover:bg-gray-50 transition-colors relative
                                                    ${product.winner_id ? 'bg-[#30de4d30]' : ''}`}
                                            >
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    #{index + 1}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-gray-700 truncate" title={product.title}>
                                                        {product.title}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    {formatCurrency(product.initial_value)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(product.real_value || product.initial_value)}
                                                        </span>
                                                        {product.real_value > product.initial_value && (
                                                            <span className="text-xs text-green-600">
                                                                +{formatCurrency(product.real_value - product.initial_value)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                                        ${product.winner_id
                                                            ? 'bg-green-100 text-green-800'
                                                            : product.Bid?.length > 0
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-800'}`}>
                                                        {product.Bid?.length || 0} lance{product.Bid?.length !== 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <button
                                                        onClick={() => handleShowPhotoAdd(product)}
                                                        className="inline-flex items-center justify-center w-10 h-10 
                                                        rounded-full hover:bg-gray-100 transition-colors mx-auto"
                                                    >
                                                        {product.cover_img_url === "string" ? (
                                                            <NoPhotography className="text-gray-400" />
                                                        ) : (
                                                            <img
                                                                src={product.cover_img_url}
                                                                alt=""
                                                                className={`w-10 h-10 rounded-full object-cover 
                                                                ${product.winner_id
                                                                        ? 'ring-2 ring-green-400'
                                                                        : 'ring-2 ring-gray-200'}`}
                                                            />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {/* Tarja de Vendido - Ajustada para não interferir no layout */}
                                                    {product.winner_id && (
                                                        <div className="absolute right-0 top-0 w-32 h-full overflow-hidden pointer-events-none">
                                                            <div className="absolute top-[20px] right-[-40px] w-[170px] text-center 
                                                            transform rotate-45 bg-green-600 text-white text-xs font-bold py-1 
                                                            shadow-md z-10">
                                                                VENDIDO
                                                            </div>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => redirectToProductDetails(product.id)}
                                                        className="inline-flex items-center justify-center p-2 
                                                        rounded-full hover:bg-gray-100 transition-colors mx-auto"
                                                    >
                                                        <EditNote className={`${product.winner_id
                                                            ? 'text-green-600 hover:text-green-800'
                                                            : 'text-gray-600 hover:text-[#012038]'}`}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Lista de Produtos - Versão Mobile */}
                        <div className="md:hidden">
                            {currentAuct.product_list
                                .sort((a, b) => a.lote - b.lote)
                                .map((product, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 border-b border-gray-100 relative
                                            ${product.winner_id ? 'bg-green-50' : ''}`}
                                    >
                                        {product.winner_id && (
                                            <div className="absolute top-0 right-0">
                                                <div className="bg-green-600 text-white text-xs font-bold 
                                                    px-2 py-1 rounded-bl-lg">
                                                    VENDIDO
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mb-3">
                                            <button
                                                onClick={() => handleShowPhotoAdd(product)}
                                                className="flex-shrink-0"
                                            >
                                                {product.cover_img_url === "string" ? (
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 
                                                        flex items-center justify-center">
                                                        <NoPhotography className="text-gray-400" />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={product.cover_img_url}
                                                        alt=""
                                                        className={`w-12 h-12 rounded-full object-cover 
                                                            ${product.winner_id
                                                                ? 'ring-2 ring-green-400'
                                                                : 'ring-2 ring-gray-200'}`}
                                                    />
                                                )}
                                            </button>

                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">
                                                    Lote #{index + 1} - {product.title}
                                                </h3>
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-gray-500">
                                                        Inicial: {formatCurrency(product.initial_value)}
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        Atual: {formatCurrency(product.real_value || product.initial_value)}
                                                    </span>
                                                    {product.real_value > product.initial_value && (
                                                        <span className="text-xs text-green-600">
                                                            Valorização: +{formatCurrency(product.real_value - product.initial_value)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center px-2.5 py-1 
                                                rounded-full text-xs font-medium
                                                ${product.winner_id
                                                    ? 'bg-green-100 text-green-800'
                                                    : product.Bid?.length > 0
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'}`}>
                                                {product.Bid?.length || 0} lance{product.Bid?.length !== 1 ? 's' : ''}
                                            </span>

                                            <button
                                                onClick={() => redirectToProductDetails(product.id)}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <EditNote className={`${product.winner_id
                                                    ? 'text-green-600'
                                                    : 'text-gray-600'}`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AdvertiserAuctDetails;