/* eslint-disable react-hooks/exhaustive-deps */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
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

import { handleBidproduct } from './functions/handleBidproduct';
import { getProductInformations } from './functions/getProductInformation';
import { getClientSession } from './functions/getClientSession';
import { Menu, Gavel, PeopleAltOutlined, Close, ArrowLeft, ArrowRight, Visibility } from '@mui/icons-material'
import axios from 'axios';

function ProductDetailAdv() {
    const [anotherProducts, setAnotherProducts] = useState([])
    const [emptySlot, setEmptySlot] = useState([])
    const [currentClient, setCurrentClient] = useState([]);
    const [sessionClient, setSessionsClient] = useState();

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [currentAuct, setCurrentAuct] = useState({});
    const [currentAdvertiser, setCurrentAdvertiser] = useState([]);
    const [bidValue, setBidValue] = useState(0);
    const [successBid, setSuccessBid] = useState(false);
    const [bidInformations, setBidInformations] = useState([]);
    const [displayBidWall, setDisplayBidWall] = useState(true);
    const [isWinner, setIsWinner] = useState(false);

    const navigate = useNavigate();
    const messageRef = useRef();
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
        getAnotherProducts()
    }, [successBid]);

    useEffect(() => {
        const imgsGroup = currentProduct.group_imgs_url

        if (imgsGroup && imgsGroup.length < 3) {
            const emptySlots = Array(3 - imgsGroup.length).fill(null);
            setEmptySlot(emptySlots);
        }

    }, [bidInformations]);

    const refBidWall = useRef();

    const handleShowBids = () => {

        if (!displayBidWall) {
            refBidWall.current.style.opacity = "1";
            refBidWall.current.style.transition = ".3s";
            refBidWall.current.style.position = "relative";
            refBidWall.current.style.marginRight = "0vh";
            setDisplayBidWall(!displayBidWall);
        } else {
            refBidWall.current.style.transition = "1s";
            refBidWall.current.style.position = "relative";
            refBidWall.current.style.marginRight = "-160vh";
            refBidWall.current.style.opacity = "0";

            setTimeout(() => {
                refBidWall.current.style.position = "absolute";
            }, 1000);

            setDisplayBidWall(!displayBidWall);
        }
    };

    useEffect(() => {
        console.log("produto atual ", currentProduct.Bid)
    }, [currentClient, bidInformations])

    const refEmail = useRef()
    const refPassword = useRef()
    const refModalLogin = useRef()

    const handleLoginClient = async () => {
        const sessionClient = localStorage.setItem("client-auk-session-login")

        if (!sessionClient)
            try {
                await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/login`, {
                    email: refEmail.current.value,
                    password: refPassword.current.value
                }).then(response => {
                    localStorage.setItem("client-auk-session-login", JSON.stringify({
                        token: response.data.token,
                        email: response.data.user.email,
                        name: response.data.user.name,
                        id: response.data.user.id,
                    }))
                })

                handleCloseModal()
            } catch (error) {
                handleCloseModal()
                console.log("Error ao logar cliente -> ", error.message)
            }

    }

    const handleCloseModal = () => {
        refModalLogin.current.style.display = "none";
    }
    const handleShowModal = () => {
        refModalLogin.current.style.display = "flex";
    }

    const handleNextProduct = async () => {
        console.log("produto atual -> ", currentProduct.lote + 1)

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find`, {
                params: {
                    lote: currentProduct.lote + 1,
                    auct_id: currentAuct.id
                }
            }).then(response => {
                setCurrentProduct(response.data);
                setBidInformations(response.data.Bid)
                // console.log("produto encontrado -> ", response.data.id)
                navigate(`/advertiser/home/product/${response.data.id}`)
            })
        } catch (error) {
            console.log("Error ao encontrar próximo produto -> ", error.message)
        }

    }

    const handlePrevProduct = async () => {

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find`, {
                params: {
                    lote: currentProduct.lote - 1,
                    auct_id: currentAuct.id
                }
            }).then(response => {
                setCurrentProduct(response.data);
                setBidInformations(response.data.Bid)
                // console.log("produto encontrado -> ", response.data)
                navigate(`/advertiser/home/product/${response.data.id}`)
            })
        } catch (error) {
            console.log("Error ao encontrar próximo produto -> ", error.message)
        }

    }

    const getAnotherProducts = async () => {

        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    auct_id: currentAuct.id,
                    take: 6,
                }
            }).then(response => {
                setAnotherProducts(response.data)
            })
        } catch (error) {
            console.log("Error loading page:", error.message);
        }


    }

    return (
        <div className="flex flex-col justify-start items-center w-full h-[130vh] bg-[#0D1733] p-[2vh] relative">
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
            <div className='flex fixed z-[99] top-[3vh] right-[3vh] gap-3 bg-white p-2 rounded-md'>
                {
                    currentClient.name ?
                        <div className='flex gap-2 justify-start items-center'>
                            <img src={avatares_pessoas[currentClient.client_avatar]} alt="" className='w-[33px] h-[33px] rounded-full' />
                            <span className='font-bold'>{currentClient.name}</span>
                        </div>
                        :
                        <>
                            <PeopleAltOutlined />
                            <button onClick={handleShowModal}>Entrar</button>
                        </>
                }
            </div>

            {/* Modal Login */}
            <div ref={refModalLogin} className='flex-col w-[80%] h-[80vh] bg-white 
            rounded-md absolute justify-center items-center gap-3 hidden'>
                <span className='fixed top-1 right-1 cursor-pointer' onClick={handleCloseModal}>
                    <Close />
                </span>
                <input ref={refEmail} type="email" className='bg-[#1a1a1a]' placeholder='seu email' />
                <input ref={refPassword} onClick={handleLoginClient} type="password" name="" id="" placeholder='sua senha...' />
            </div>

            {/*Main Body*/}
            <div className="flex flex-col justify-center items-center w-full h-full bg-gradient-to-r from-[#FEFEFE] to-[#b6c5c7] relative gap-3">

                <div className='flex w-[80%] justify-start items-center gap-3'>
                    <img src={currentAdvertiser.url_profile_cover} alt="" className='w-[60px] h-[60px] object-cover rounded-full' />
                    <div className='flex flex-col justify-start items-start'>
                        <span className='font-bold text-[16px]'>{currentAdvertiser.name}</span>
                        <span>{currentAuct.title}</span>
                    </div>
                </div>

                {/* Carrosel e descrições */}
                <section className='flex w-[80%] h-[700px] relative justify-start items-start'>
                    {/* CARROSEL */}
                    <div className='flex flex-col w-[600px] overflow-hidden'>
                        <div className="flex w-[600px] h-[600px] justify-center items-center bg-transparent">
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                }}
                                spaceBetween={2}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2"
                            >
                                <SwiperSlide>
                                    <div className='flex w-auto h-[600px] object-cover justify-center'>
                                        <img src={currentProduct.cover_img_url} alt="foto-produto-leilão"
                                            className='w-auto h-[600px] object-cover rounded-md' />
                                    </div>
                                </SwiperSlide>
                                {currentProduct.group_imgs_url &&
                                    currentProduct.group_imgs_url.map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <div className='flex w-auto h-[600px] justify-center object-cover'>
                                                <img src={img} alt="foto-produto-leilão"
                                                    className='w-auto h-full object-cover rounded-md' />
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>

                        <div className="flex w-full mt-2">
                            <Swiper
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <img src={currentProduct.cover_img_url && currentProduct.cover_img_url} alt="thumb"
                                        className="min-w-[100px] h-[100px] object-cover rounded-md" />
                                </SwiperSlide>
                                {
                                    currentProduct.group_imgs_url &&
                                    currentProduct.group_imgs_url.map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <img src={img} alt="thumb" className="w-full h-[100px] object-cover rounded-md" />
                                        </SwiperSlide>
                                    ))
                                }
                                {
                                    emptySlot &&
                                    emptySlot.map((_, i) => (
                                        <SwiperSlide key={i}>
                                            <div className="w-full h-[100px] object-cover rounded-md bg-slate-300"></div>
                                        </SwiperSlide>
                                    ))
                                }

                            </Swiper>
                        </div>
                    </div>

                    {/* Produto Information */}
                    <div className='flex flex-col flex-1 max-w-[60%] h-full justify-start items-center p-[3vh]'>

                        <div className='flex flex-col w-full h-full justify-start gap-3'>

                            <div className='flex w-full justify-between items-center'>
                                <span className='font-semibold text-[22px]'>Lote: {currentProduct.lote}</span>
                                <div>
                                    <span onClick={handlePrevProduct} className='hover:text-[#9f9f9f]'>
                                        <ArrowLeft className='cursor-pointer' sx={{ fontSize: "33px" }} />
                                    </span>
                                    <span onClick={handleNextProduct} className='hover:text-[#9f9f9f]'>
                                        <ArrowRight className='cursor-pointer' sx={{ fontSize: "33px" }} />
                                    </span>
                                </div>
                            </div>

                            <span className='font-bold text-[36px]'>{currentProduct.title}</span>
                            <span className='font-bold text-[16px]'>{currentProduct.description}</span>
                            <span className='font-bold text-[16px]'>{currentProduct.Bid && currentProduct.Bid.length} lance(s)</span>
                            <span className='font-bold text-[16px]'>valor atual:
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentProduct.initial_value)}
                            </span>

                            <div className='flex gap-1 text-white font-bold'>
                                <button className='w-[150px] h-[40px] bg-[#141839] rounded-md'>Fazer Lance</button>
                                <div className='flex w-[210px] h-[40px] bg-[#1399CF] justify-center items-center gap-2 rounded-md'>
                                    <input type="checkbox" name="" id="" className='w-[20px] h-[20px]' />
                                    <span>Lances Automáticos</span>
                                </div>
                            </div>

                            <span onClick={handleShowBids} className='flex gap-1 text-[#0D1733] cursor-pointer'>
                                <Visibility /> ver histório de lances
                            </span>

                        </div>

                    </div>

                    {/* Lances */}
                    <div ref={refBidWall} className='mr-[-160vh] flex-col w-[340px] h-full justify-start items-center 
                    p-3 bg-[#D5DCDC] rounded-[12px] shadow-lg shadow-[#1616162f] overflow-y-auto opacity-0'>
                        {
                            bidInformations.map((bid) => (
                                <div className='w-full bg-[#233751] rounded-[12px] h-[40px] text-white font-bold 
                                flex justify-between items-center p-1 mt-[2px]'
                                    key={bid.id}>
                                    <img src={bid.Client && avatares_pessoas[bid.Client.client_avatar]} alt=""
                                        className='w-[33px] h-[33px] object-cover rounded-full' />
                                    <span>{bid.Client && bid.Client.nickname}</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                        .format(bid.value)}</span>
                                </div>
                            ))
                        }
                    </div>

                </section>


                {/* Recomendados */}
                <section className='flex flex-col w-[80%] h-[260px] bg-[#C4CDCE] rounded-[12px] mt-[3vh] justify-between items-center relative p-3'>
                    <span className=' text-[22px] font-bold'>Outros Produtos</span>
                    <div className='flex w-full justify-between items-center gap-2 overflow-x-auto overflow-y-hidden p-3'>
                        {
                            anotherProducts.map((product) => {

                                return (
                                    <img key={product.id} src={product.cover_img_url} alt="" className='flex-1 h-[200px] object-cover rounded-md' />
                                )
                            })
                        }
                    </div>
                </section>

            </div>
        </div>
    );
}

export default ProductDetailAdv;