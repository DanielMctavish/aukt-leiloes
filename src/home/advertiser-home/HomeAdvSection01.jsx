/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { ArrowCircleRight, PeopleAltOutlined } from "@mui/icons-material"
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"
import avatar_01 from '../../media/avatar-floor/avatar_01.png'
import avatar_02 from '../../media/avatar-floor/avatar_02.png'
import avatar_03 from '../../media/avatar-floor/avatar_03.png'
import avatar_04 from '../../media/avatar-floor/avatar_04.png'
import avatar_05 from '../../media/avatar-floor/avatar_05.png'
import avatar_06 from '../../media/avatar-floor/avatar_06.png'
import avatar_07 from '../../media/avatar-floor/avatar_07.png'
import avatar_08 from '../../media/avatar-floor/avatar_08.png'
import { useEffect, useRef, useState } from "react";
import { getClientSession } from "./functions/getClientSession";

function HomeAdvSection01({ currentAdvertiser }) {
    const [currentClient, setCurrentClient] = useState([]);
    const [productsBackground, setProductsBackground] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState(""); // Novo estado para a imagem de fundo
    const [, setSessionsClient] = useState();
    const navigate = useNavigate();
    const bgRef = useRef();

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

    useEffect(() => {
        getClientSession(setSessionsClient, setCurrentClient);
    }, []);

    useEffect(() => {
        if (currentAdvertiser.id) {
            getProductListByAdvertiser(currentAdvertiser.id);
        }
    }, [currentAdvertiser]);

    const getProductListByAdvertiser = async (advertiser_id) => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
                params: {
                    creator_id: advertiser_id,
                    take: 12
                }
            }).then(result => {
                setProductsBackground(result.data);
            });

        } catch (error) {
            console.log("error: ", error.message);
        }
    }

    useEffect(() => {
        let intervalChange;
        if (productsBackground.length > 0) {
            // Define a imagem de fundo inicial aleatoriamente
            const randomIndex = Math.floor(Math.random() * productsBackground.length);
            setBackgroundImage(productsBackground[randomIndex]?.cover_img_url);

            intervalChange = setInterval(() => {
                if (bgRef.current) {
                    bgRef.current.style.transition = 'transform 6s ease-in-out'; 
                    bgRef.current.style.transform = 'scale(2.1)'; 
                }
                const newRandomIndex = Math.floor(Math.random() * productsBackground.length);
                setBackgroundImage(productsBackground[newRandomIndex]?.cover_img_url);

               
                setTimeout(() => {
                    if (bgRef.current) {
                        bgRef.current.style.transform = 'scale(1)';
                    }
                }, 3000); 
            }, 7000); 

        }
        return () => clearInterval(intervalChange);
    }, [productsBackground]);

    return (
        <section className="flex flex-col justify-center items-center w-full h-[100vh] bg-[#0D1733] relative p-[26px]">

            {/* Login Client */}
            <div className='flex fixed z-[99] top-[3vh] right-[3vh] gap-2 bg-white p-1.5 rounded-md cursor-pointer hover:bg-[#ededed]'>
                {
                    currentClient && currentClient.name ? // Verifique se currentClient não é null
                        <div onClick={() => navigate("/client/dashboard")} className='flex gap-2 justify-start items-center'>
                            <img src={avatares_pessoas[currentClient.client_avatar]} alt="" className='w-[30px] h-[30px] rounded-full' />
                            <span className='font-bold text-sm'>{currentClient.name}</span>
                        </div>
                        :
                        <div onClick={() => navigate("/client/login")} className='w-full h-full p-1.5'>
                            <PeopleAltOutlined sx={{ fontSize: "1.2rem" }} />
                            <button className="text-sm">Entrar</button>
                        </div>
                }
            </div>

            <div className="w-full h-full bg-white flex justify-center items-center 
                relative overflow-hidden shadow-lg shadow-[#13131361]">

                <img ref={bgRef} src={backgroundImage} className="object-cover w-full h-full absolute blur-[3px]" />
                <div className=" flex min-w-[100%] left-[0vh] h-full bg-gradient-to-r from-[#fff] via-[#b2caffb0] to-[#ffffff00] absolute"></div>

                <div className="flex flex-col md:h-auto h-full md:flex-row md:justify-between 
                justify-around items-center w-full md:w-[80%] z-[99]">

                    <div className="flex flex-col w-[90%] md:w-[60%] gap-3">

                        <span className="font-bol text-[22px] text-[#143A8D] font-bold">Grandes Oportunidades Esperam por Você</span>
                        <span className="font-bold md:text-[62px] text-[42px] anton-regular-advertiser-title">
                            Prepare-se para os leilões mais emocionantes
                            da nossa plataforma!
                        </span>

                        <div className="flex font-bold gap-6 justify-start items-center">
                            <img src={currentAdvertiser.url_profile_cover} alt="" className="w-[63px] h-[63px] object-cover rounded-full" />
                            <span className="text-[22px]">{currentAdvertiser.name}</span>
                        </div>

                    </div>

                    <img src={aukLogo}
                        onClick={() => navigate('/')}
                        className="md:w-[240px] w-[200px] cursor-pointer hover:brightness-125" />

                </div>

            </div>

            <span className="w-[100px] h-[100px] bg-[#0D1733] 
            justify-center items-center
            absolute flex bottom-0 right-0">
                <ArrowCircleRight sx={{ color: "white", fontSize: "60px", transform: "rotateZ(45deg)" }} />
            </span>

        </section>
    )
}

export default HomeAdvSection01;