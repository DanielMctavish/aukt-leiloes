/* eslint-disable react-hooks/exhaustive-deps */
import {  useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const importAllAvatars = () => {
    const avatares = [];
    for (let i = 1; i <= 58; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const avatar = new URL(`../../media/avatar-floor/avatar_${paddedNumber}.png`, import.meta.url).href;
        avatares.push(avatar);
    }
    return avatares;
};

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
    const [showBids, setShowBids] = useState(false);
    const [anotherProducts, setAnotherProducts] = useState([]);
    const [currentClient, setCurrentClient] = useState(null);
    const [, setSessionClient] = useState(null);

    const [currentProduct, setCurrentProduct] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [currentAuct, setCurrentAuct] = useState({});
    const [currentAdvertiser, setCurrentAdvertiser] = useState([]);
    const [bidInformations, setBidInformations] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const avatares_pessoas = importAllAvatars();

    const { product_id } = useParams();

    useEffect(() => {
        // Limpar os lances ao mudar de produto
        setBidInformations([]);

        // Carregar as informações do novo produto
        getProductInformations(product_id, setBidInformations, setCurrentProduct, setCurrentAuct, setCurrentAdvertiser);
        getClientSession(setSessionClient, setCurrentClient);
        checkClientSession();

        // Disparar um evento personalizado para notificar outros componentes
        const productChangedEvent = new CustomEvent('productChanged', {
            detail: {
                productId: product_id
            }
        });
        console.log('Disparando evento productChanged:', product_id);
        window.dispatchEvent(productChangedEvent);
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
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setIsModalOn(false)
                setShowBids(false)
            }
        })
    }, [])

    return (
        <div className="flex flex-col justify-start items-center w-full min-h-screen bg-[#0D1733] p-[1.5vh] relative overflow-x-hidden">
            <LoginClientModal setIsModalOn={setIsModalOn} modalOn={modalOn} />
            
            {/* Novo Menu Lateral */}
            <SideMenu 
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                currentClient={currentClient}
                currentAdvertiser={currentAdvertiser}
                setIsModalOn={setIsModalOn}
                avatares_pessoas={avatares_pessoas}
            />

            {/* Main Body - ajustado o padding para acomodar o menu */}
            <div className="flex flex-col justify-between 
                items-center w-full h-full bg-gradient-to-r 
                from-[#FEFEFE] to-[#b6c5c7] relative gap-2
                pl-[70px]"> {/* Adicionado padding à esquerda */}

                {/* Cabeçalho apenas com informações do leiloeiro */}
                {currentAuct && currentAdvertiser && (
                    <div className='flex w-full md:w-[90%] lg:w-[75%] justify-start items-center gap-2 px-4 md:px-0 py-4'>
                        <div className='flex justify-center items-center gap-2'>
                            <img src={currentAdvertiser.url_profile_cover} alt="" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover rounded-full' />
                            <div className='flex flex-col justify-start items-start'>
                                <span className='font-bold text-[12px] md:text-[14px]'>{currentAdvertiser.name}</span>
                                <span className='text-xs md:text-sm'>{currentAuct.title}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Container principal com altura fixa */}
                <div className='w-full md:w-[90%] lg:w-[80%] flex flex-col lg:flex-row justify-between items-start gap-6 px-4 md:px-0'>
                    {/* Carrossel */}
                    <div className='w-full lg:w-[40%] h-[calc(100vh-180px)] order-1'>
                        <CarroselHomeAdvertiserDetails currentProduct={currentProduct} />
                    </div>

                    {/* Informações do produto */}
                    <div className='w-full lg:w-[60%] h-[calc(100vh-180px)] order-2'>
                        <ProductInformation
                            currentProduct={currentProduct}
                            currentClient={currentClient}
                            currentAuct={currentAuct}
                            setCurrentProduct={setCurrentProduct}
                            setBidInformations={setBidInformations}
                            setIsModalOn={setIsModalOn}
                            showBids={showBids}
                            setShowBids={setShowBids}
                        >
                            {/* Passando BidsAdvertiserHome como children */}
                            <BidsAdvertiserHome
                                bidInformations={bidInformations}
                                showBids={showBids}
                                productId={currentProduct?.id}
                                auctId={currentAuct?.id}
                            />
                        </ProductInformation>
                    </div>
                </div>

                {/* Recomendados */}
                <div className='w-full md:w-[90%] lg:w-[80%] mt-8 px-4 md:px-0'>
                    {isLoadingProducts ? (
                        <div className="flex justify-center items-center w-full h-[200px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012038]"></div>
                        </div>
                    ) : anotherProducts.length > 0 ? (
                        <Recomendados anotherProducts={anotherProducts} />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailAdv;