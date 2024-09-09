/* eslint-disable react/prop-types */
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"
import { Email, Phone, LocationCity, ArrowForward } from "@mui/icons-material"

function HomeAdvFooter() {

    return (
        <footer className="w-full h-[60vh] flex justify-center items-center bg-[#fff] p-[1vh] relative">

            <div className="flex md:flex-row flex-col w-full h-full bg-[#0D1733] rounded-[20px] 
            relative md:justify-center justify-start items-center gap-2 overflow-hidden p-1 overflow-y-auto">

                <div className="flex justify-between items-start flex-col md:flex-1 w-full md:h-[90%] min-h-[40vh]  text-zinc-100 p-[6vh]">

                    <div className="flex gap-2 justify-start items-center">
                        <img src={aukLogo} alt="" className="w-[32px] h-[32px] object-cover" />
                        <h1 className="text-[16px] font-bold">
                            Auk leilões
                        </h1>
                    </div>

                    <p className=" w-full text-[12px] font-bold border-b-[1px] border-[#ffffff36] pb-[2vh]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </p>

                    <span className="flex w-full border-b-[1px] border-[#ffffff36] pb-[2vh] gap-2">
                        <Email sx={{ fontSize: "22px" }} />
                        aukleiloes@auk.com
                    </span>

                    <span className="flex w-full border-b-[1px] border-[#ffffff36] pb-[2vh] gap-2">
                        <Phone />
                        (11)12345-6789
                    </span>

                    <span className="flex w-full text-[12px] border-b-[1px] border-[#ffffff36] pb-[2vh] gap-2 justify-center items-center">
                        <LocationCity />
                        Av. Paulista, 1243 - Bela Vista, São Paulo - SP
                    </span>

                </div>

                <div className="flex justify-start items-start flex-col md:flex-1 w-full md:h-[90%] min-h-[30vh]  text-zinc-100 p-[6vh] gap-[4vh]">
                    <span className="font-bold">LINKS ÚTEIS</span>

                    <span className="flex gap-3"><ArrowForward /> Home</span>
                    <span className="flex gap-3"><ArrowForward /> Produtos</span>
                    <span className="flex gap-3"><ArrowForward /> Entre em contato conosco</span>

                </div>

                <div className="flex justify-start items-start flex-col md:flex-1 w-full md:h-[90%] min-h-[40vh]  text-zinc-100 p-[6vh] gap-[4vh]">
                    <span className="font-bold">Fale conosco</span>
                    <p className="text-[12px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    <div className="flex">
                        <input type="email" className="bg-transparent border-[1px] h-[43px]  w-[180px] p-2" placeholder="seu email aqui" />
                        <button className="bg-[#005699] h-[43px] w-[90px] font-bold border-[1px] rounded-r-md">enviar</button>
                    </div>

                    <span className=" w-full border-b-[1px] border-[#ffffff36] pb-[3vh]">Seu ID do email é confidencial.</span>
                </div>

                
            </div>

            {/* <img src={currentAdvertiser.url_profile_cover} className="w-[200px] h-[200px] border-[3px] 
                border-[#fff] object-cover rounded-full bg-[#9c9c9c]" /> */}
        </footer>
    )
}

export default HomeAdvFooter