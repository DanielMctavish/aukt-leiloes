/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import yellowCar from "../../media/backgrounds/carro_amarelo_bg.png"
import { ArrowCircleRight } from "@mui/icons-material"
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"


function HomeAdvSection01({ currentAdvertiser }) {
    const navigate = useNavigate()

    return (
        <section className="flex flex-col justify-center items-center w-full h-[100vh] bg-[#0D1733] relative p-[26px]">

            <div className="w-full h-full bg-white flex justify-center items-center 
                relative overflow-hidden shadow-lg shadow-[#13131361]">

                <img src={yellowCar} className="object-cover w-full h-full absolute blur-[3px]" />
                <div className=" flex min-w-[300%] left-[0vh] h-full bg-gradient-to-r from-white to-[#ffffff00] absolute"></div>

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