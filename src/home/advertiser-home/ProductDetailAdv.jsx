/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoAuk from '../../media/logos/logos-auk/aukt_blue.png'
//avatares import
import avatar_01 from '../../media/avatar-floor/avatar_01.png'
import avatar_02 from '../../media/avatar-floor/avatar_02.png'
import avatar_03 from '../../media/avatar-floor/avatar_03.png'
import avatar_04 from '../../media/avatar-floor/avatar_04.png'
import avatar_05 from '../../media/avatar-floor/avatar_05.png'
import avatar_06 from '../../media/avatar-floor/avatar_06.png'
import avatar_07 from '../../media/avatar-floor/avatar_07.png'
import avatar_08 from '../../media/avatar-floor/avatar_08.png'

import { getProductInformations } from './functions/getProductInformation';
import { getClientSession } from './functions/getClientSession';
import { Menu, Gavel, PeopleAltOutlined, Visibility } from '@mui/icons-material'
import axios from 'axios';
import Recomendados from './components/Recomendados';
import ProductInformation from './components/ProductInformation';
import CarroselHomeAdvertiserDetails from './components/CarroselHomeAdvertiserDetails';
import LoginClientModal from './modal/LoginClientModal';
import BidsAdvertiserHome from './components/BidsAdvertiserHome';

function ProductDetailAdv() {
    const [modalOn, setIsModalOn] = useState(false)
    const [showBids, setShowBids] = useState(false)
    const [anotherProducts, setAnotherProducts] = useState([])
    const [currentClient, setCurrentClient] = useState([]);
    const [sessionClient, setSessionsClient] = useState();

    const [currentProduct, setCurrentProduct] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [currentAuct, setCurrentAuct] = useState({});
    const [currentAdvertiser, setCurrentAdvertiser] = useState([]);
    const [bidInformations, setBidInformations] = useState([]);
    const [isWinner, setIsWinner] = useState(false);

    const navigate = useNavigate();

    const avatares_pessoas = [
        avatar_01,
        avatar_02,
        avatar_03,
        avatar_04,
        avatar_05,
        avatar_06,
        avatar_07,
        avatar_08
    ];

    const { product_id } = useParams();

    useEffect(() => {
        getProductInformations(product_id, setBidInformations, setCurrentProduct, setCurrentAuct, setCurrentAdvertiser, setIsWinner);
        getClientSession(setSessionsClient, setCurrentClient);
    }, [modalOn, product_id]);

    useEffect(() => {
        if (currentAuct && currentAuct.id) {
            getAnotherProducts();
        }
    }, [currentAuct]);

    const getAnotherProducts = async () => {
        if (!currentAuct || !currentAuct.id) return;

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    auct_id: currentAuct.id,
                    take: 14,
                }
            });
            setAnotherProducts(response.data);
        } catch (error) {
            console.log("Error loading page:", error.message);
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
        <div className="flex flex-col justify-start items-center w-full h-[140vh] bg-[#0D1733] p-[2vh] relative overflow-hidden">

            <LoginClientModal setIsModalOn={setIsModalOn} modalOn={modalOn} />

            {/* MENU */}
            <div onClick={() => setShowMenu(!showMenu)} className="flex w-[40px] h-[40px] 
            rounded-[12px] bg-[#fff] 
            cursor-pointer justify-center items-center
            hover:bg-[#eeeeee] fixed z-[99] top-[3vh] left-[3vh] 
            shadow-lg shadow-[#1313131e]">
                <Menu sx={{ color: "#767676" }} />
            </div>

            <div className='flex flex-col w-[40px] h-[92px] fixed z-[99] 
            top-[9vh] left-[3vh] gap-1 overflow-hidden justify-start items-start'>

                <div
                    onClick={() => navigate(`/advertiser/home/${currentAdvertiser.id}`)}
                    className={`
                    flex w-[40px] h-[40px] rounded-[12px] bg-[#fff] cursor-pointer justify-center items-center
                    hover:bg-[#eeeeee] shadow-md shadow-[#1313131e] ${!showMenu ? 'mt-[-99px]' : 'mt-0'}
                    `}>
                    <img src={logoAuk} alt="" className={`w-[40px]`} />
                </div>

                <div className="flex w-[40px] h-[40px] rounded-[12px] bg-[#fff] cursor-pointer justify-center items-center
                hover:bg-[#eeeeee] shadow-md shadow-[#1313131e]">
                    <Gavel sx={{ color: "#767676" }} />
                </div>

            </div>

            {/* Login Client */}
            <div className='flex fixed z-[99] top-[3vh] right-[3vh] gap-3 bg-white p-2 rounded-md cursor-pointer hover:bg-[#ededed]'>
                {
                    currentClient.name ?
                        <div onClick={() => navigate("/client/dashboard")} className='flex gap-2 justify-start items-center'>
                            <img src={avatares_pessoas[currentClient.client_avatar]} alt="" className='w-[33px] h-[33px] rounded-full' />
                            <span className='font-bold'>{currentClient.name}</span>
                        </div>
                        :
                        <div onClick={() => setIsModalOn(true)} className='w-full h-full p-2'>
                            <PeopleAltOutlined />
                            <button>Entrar</button>
                        </div>
                }
            </div>


            {/*Main Body*/}
            <div className="flex flex-col justify-center items-center w-full h-full bg-gradient-to-r from-[#FEFEFE] to-[#b6c5c7] relative gap-3">

                {currentAuct && currentAdvertiser && (
                    <div className='flex w-[80%] justify-between items-center gap-3'>
                        <div className='flex justify-center items-center gap-3'>
                            <img src={currentAdvertiser.url_profile_cover} alt="" className='w-[60px] h-[60px] object-cover rounded-full' />
                            <div className='flex flex-col justify-start items-start'>
                                <span className='font-bold text-[16px]'>{currentAdvertiser.name}</span>
                                <span>{currentAuct.title}</span>
                            </div>
                        </div>
                        <span onClick={() => setShowBids(!showBids)} className='flex justify-center gap-3 cursor-pointer'>
                            <Visibility />
                            ver lances
                        </span>
                    </div>
                )}

                {/* Carrosel e descrições */}
                <section className='flex w-[80%] h-[700px] relative justify-start items-start'>
                    {/* CARROSEL */}
                    <CarroselHomeAdvertiserDetails currentProduct={currentProduct} />

                    {/* Produto Information */}
                    <ProductInformation
                        currentProduct={currentProduct}
                        currentClient={currentClient}
                        currentAuct={currentAuct}
                        setCurrentProduct={setCurrentProduct}
                        setBidInformations={setBidInformations}
                        setIsModalOn={setIsModalOn}
                    />

                    {/* Lances */}
                    <BidsAdvertiserHome
                        bidInformations={bidInformations}
                        showBids={showBids} />

                </section>


                {/* Recomendados */}
                <Recomendados anotherProducts={anotherProducts} />

            </div>
        </div>
    );
}

export default ProductDetailAdv;