/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Person } from '@mui/icons-material';
import NotificationSystem from './components/ProductInformationAdvertiser/NotificationSystem';
import avatarClientsUrls from '../../media/avatar-floor/AvatarclientsUrls';

import { getProductInformations } from './functions/getProductInformation';
import { getClientSession } from './functions/getClientSession';
import axios from 'axios';
import Recomendados from './components/Recomendados';
import ProductInformation from './components/ProductInformation';
import CarroselHomeAdvertiserDetails from './components/CarroselHomeAdvertiserDetails';
import LoginClientModal from './modal/LoginClientModal';
import BidsAdvertiserHome from './components/BidsAdvertiserHome';
import SideMenu from './components/SideMenu';

function ProductDetailAdv() {
    const [modalOn, setIsModalOn] = useState(false);
    const [anotherProducts, setAnotherProducts] = useState([]);
    const [currentClient, setCurrentClient] = useState(null);
    const [, setSessionClient] = useState(null);
    const [showOutbidNotification, setShowOutbidNotification] = useState(true);

    const [currentProduct, setCurrentProduct] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [currentAuct, setCurrentAuct] = useState({});
    const [currentAdvertiser, setCurrentAdvertiser] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Convertendo o objeto de URLs em um array
    const avatares_pessoas = Object.values(avatarClientsUrls);

    const { product_id } = useParams();

    useEffect(() => {
        // Carregar as informações do novo produto
        getProductInformations(product_id, setCurrentProduct, setCurrentAuct, setCurrentAdvertiser);
        getClientSession(setSessionClient, setCurrentClient);
        checkClientSession();
    }, [product_id]); // Dependência apenas no product_id para garantir que seja executado quando o produto mudar

    // Verificar a sessão do cliente quando o modal de login é fechado
    useEffect(() => {
        if (!modalOn) {
            checkClientSession();
        }
    }, [modalOn]);

    const checkClientSession = async () => {
        const currentSessionClient = localStorage.getItem("client-auk-session-login");

        if (currentSessionClient) {
            try {
                const sessionData = JSON.parse(currentSessionClient);
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/verify-token`, {
                    headers: {
                        Authorization: `Bearer ${sessionData.token}`
                    }
                });

                if (!response.data) {
                    localStorage.removeItem("client-auk-session-login");
                    setCurrentClient(null);
                    setSessionClient(null);
                }
            } catch (error) {
                console.error("Erro ao verificar token:", error);
                localStorage.removeItem("client-auk-session-login");
                setCurrentClient(null);
                setSessionClient(null);
            }
        } else {
            setCurrentClient(null);
            setSessionClient(null);
        }
    };

    useEffect(() => {
        if (currentAuct && currentAuct.id) {
            getAnotherProducts();
        }
    }, [currentAuct]);

    const getAnotherProducts = async () => {
        if (!currentAuct || !currentAuct.id) return;

        setIsLoadingProducts(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    auct_id: currentAuct.id,
                    take: 14,
                    exclude_product: product_id // Excluir o produto atual
                }
            });

            // Verificar e tratar a resposta
            if (response.data?.products) {
                setAnotherProducts(response.data.products);
            } else if (Array.isArray(response.data)) {
                setAnotherProducts(response.data);
            } else {
                setAnotherProducts([]);
            }
        } catch (error) {
            console.error('Erro ao carregar produtos recomendados:', error);
            setAnotherProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    }

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setIsModalOn(false);
            }
        };
        
        document.addEventListener('keydown', handleEscKey);
        
        // Cleanup para remover o event listener
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    return (
        <div className="flex flex-col justify-start items-center w-full bg-[#0D1733] relative">
            <LoginClientModal setIsModalOn={setIsModalOn} modalOn={modalOn} />

            {/* Sistema de Notificações de vencedor */}
            <NotificationSystem
                showOutbidNotification={showOutbidNotification}
                setShowOutbidNotification={setShowOutbidNotification}
                currentProduct={currentProduct}
            />

            {/* Novo Menu Lateral */}
            <SideMenu
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                currentClient={currentClient}
                currentAdvertiser={currentAdvertiser}
                setIsModalOn={setIsModalOn}
                avatares_pessoas={avatares_pessoas}
            />

            {/* Main Body */}
            <div className="flex flex-col w-full bg-[#fff] p-3 sm:p-4 md:p-6">
                {/* Container com largura máxima */}
                <div className="w-full max-w-[1480px] mx-auto">
                    {/* Cabeçalho com informações do leiloeiro */}
                    {currentAuct && currentAdvertiser && (
                        <div className='flex w-full justify-end items-center gap-2 text-zinc-800 mb-3'>
                            {/* Informações do anunciante à direita */}
                            <div className='flex justify-end items-center gap-2'>
                                {currentAdvertiser.url_profile_cover ? (
                                    <img src={currentAdvertiser.url_profile_cover} alt="" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover rounded-full' />
                                ) : (
                                    <div className='flex justify-center items-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-gray-200 rounded-full'>
                                        <Person className='text-gray-600 w-6 h-6 md:w-7 md:h-7' />
                                    </div>
                                )}
                                <div className='flex flex-col justify-start items-start'>
                                    <span className='font-bold text-[12px] md:text-[14px]'>{currentAdvertiser.name}</span>
                                    <span className='text-xs md:text-sm'>{currentAuct.title}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Container principal - removida altura fixa para mobile */}
                    <div className='w-full flex flex-col lg:flex-row justify-between items-start gap-4 p-0 sm:p-2 rounded-md'>
                        {/* Carrossel */}
                        <div className='w-full lg:w-[40%] order-1'>
                            <CarroselHomeAdvertiserDetails currentProduct={currentProduct} />
                        </div>

                        {/* Informações do produto - removido max-height e overflow no mobile */}
                        <div className='w-full lg:w-[58%] lg:h-[calc(100vh-180px)] lg:overflow-auto order-2 mt-3 lg:mt-0 max-w-full overflow-hidden'>
                            <ProductInformation
                                currentProduct={currentProduct}
                                currentClient={currentClient}
                                currentAuct={currentAuct}
                                setCurrentProduct={setCurrentProduct}
                                setIsModalOn={setIsModalOn}
                            >
                                {/* Passando BidsAdvertiserHome como children */}
                                <BidsAdvertiserHome
                                    productId={currentProduct?.id}
                                    auctId={currentAuct?.id}
                                />
                            </ProductInformation>
                        </div>
                    </div>

                    {/* Recomendados */}
                    <div className='w-full mt-6 px-0 sm:px-2'>
                        {isLoadingProducts ? (
                            <div className="flex justify-center items-center w-full h-[120px] md:h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-[#012038]"></div>
                            </div>
                        ) : anotherProducts.length > 0 ? (
                            <Recomendados anotherProducts={anotherProducts} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailAdv;