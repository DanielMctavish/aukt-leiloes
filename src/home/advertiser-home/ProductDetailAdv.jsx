/* eslint-disable react-hooks/exhaustive-deps */
import {  useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

//avatares import
import avatar_01 from '../../media/avatar-floor/avatar_01.png'
import avatar_02 from '../../media/avatar-floor/avatar_02.png'
import avatar_03 from '../../media/avatar-floor/avatar_03.png'
import avatar_04 from '../../media/avatar-floor/avatar_04.png'
import avatar_05 from '../../media/avatar-floor/avatar_05.png'
import avatar_06 from '../../media/avatar-floor/avatar_06.png'
import avatar_07 from '../../media/avatar-floor/avatar_07.png'
import avatar_08 from '../../media/avatar-floor/avatar_08.png'
import avatar_09 from '../../media/avatar-floor/Avatar_09.png'
import avatar_10 from '../../media/avatar-floor/Avatar_10.png'
import avatar_11 from '../../media/avatar-floor/Avatar_11.png'
import avatar_12 from '../../media/avatar-floor/Avatar_12.png'
import avatar_13 from '../../media/avatar-floor/Avatar_13.png'
import avatar_14 from '../../media/avatar-floor/Avatar_14.png'
import avatar_15 from '../../media/avatar-floor/Avatar_15.png'
import avatar_16 from '../../media/avatar-floor/Avatar_16.png'
import avatar_17 from '../../media/avatar-floor/Avatar_17.png'
import avatar_18 from '../../media/avatar-floor/Avatar_18.png'
import avatar_19 from '../../media/avatar-floor/Avatar_19.png'
import avatar_20 from '../../media/avatar-floor/Avatar_20.png'
import avatar_21 from '../../media/avatar-floor/Avatar_21.png'
import avatar_22 from '../../media/avatar-floor/Avatar_22.png'
import avatar_23 from '../../media/avatar-floor/Avatar_23.png'
import avatar_24 from '../../media/avatar-floor/Avatar_24.png'
import avatar_25 from '../../media/avatar-floor/Avatar_25.png'
import avatar_26 from '../../media/avatar-floor/Avatar_26.png'
import avatar_27 from '../../media/avatar-floor/Avatar_27.png'
import avatar_28 from '../../media/avatar-floor/Avatar_28.png'
import avatar_29 from '../../media/avatar-floor/Avatar_29.png'
import avatar_30 from '../../media/avatar-floor/Avatar_30.png'
import avatar_31 from '../../media/avatar-floor/Avatar_31.png'
import avatar_32 from '../../media/avatar-floor/Avatar_32.png'
import avatar_33 from '../../media/avatar-floor/Avatar_33.png'
import avatar_34 from '../../media/avatar-floor/Avatar_34.png'
import avatar_35 from '../../media/avatar-floor/Avatar_35.png'
import avatar_36 from '../../media/avatar-floor/Avatar_36.png'
import avatar_37 from '../../media/avatar-floor/Avatar_37.png'
import avatar_38 from '../../media/avatar-floor/Avatar_38.png'
import avatar_39 from '../../media/avatar-floor/Avatar_39.png'
import avatar_40 from '../../media/avatar-floor/Avatar_40.png'
import avatar_41 from '../../media/avatar-floor/Avatar_41.png'
import avatar_42 from '../../media/avatar-floor/Avatar_42.png'
import avatar_43 from '../../media/avatar-floor/Avatar_43.png'
import avatar_44 from '../../media/avatar-floor/Avatar_44.png'
import avatar_45 from '../../media/avatar-floor/Avatar_45.png'
import avatar_46 from '../../media/avatar-floor/Avatar_46.png'
import avatar_47 from '../../media/avatar-floor/Avatar_47.png'
import avatar_48 from '../../media/avatar-floor/Avatar_48.png'
import avatar_49 from '../../media/avatar-floor/Avatar_49.png'
import avatar_50 from '../../media/avatar-floor/Avatar_50.png'
import avatar_51 from '../../media/avatar-floor/Avatar_51.png'
import avatar_52 from '../../media/avatar-floor/Avatar_52.png'
import avatar_53 from '../../media/avatar-floor/Avatar_53.png'
import avatar_54 from '../../media/avatar-floor/Avatar_54.png'
import avatar_55 from '../../media/avatar-floor/Avatar_55.png'
import avatar_56 from '../../media/avatar-floor/Avatar_56.png'
import avatar_57 from '../../media/avatar-floor/Avatar_57.png'
import avatar_58 from '../../media/avatar-floor/Avatar_58.png'

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


    const avatares_pessoas = [
        avatar_01,
        avatar_02,
        avatar_03,
        avatar_04,
        avatar_05,
        avatar_06,
        avatar_07,
        avatar_08,
        avatar_09,
        avatar_10,
        avatar_11,
        avatar_12,
        avatar_13,
        avatar_14,
        avatar_15,
        avatar_16,
        avatar_17,
        avatar_18,
        avatar_19,
        avatar_20,
        avatar_21,
        avatar_22,
        avatar_23,
        avatar_24,
        avatar_25,
        avatar_26,
        avatar_27,
        avatar_28,
        avatar_29,
        avatar_30,
        avatar_31,
        avatar_32,
        avatar_33,
        avatar_34,
        avatar_35,
        avatar_36,
        avatar_37,
        avatar_38,
        avatar_39,
        avatar_40,
        avatar_41,
        avatar_42,
        avatar_43,
        avatar_44,
        avatar_45,
        avatar_46,
        avatar_47,
        avatar_48,
        avatar_49,
        avatar_50,
        avatar_51,
        avatar_52,
        avatar_53,
        avatar_54,
        avatar_55,
        avatar_56,
        avatar_57,
        avatar_58
    ];

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