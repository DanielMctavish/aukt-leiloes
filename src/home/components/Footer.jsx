/* eslint-disable no-unused-vars */
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"
import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { ArrowForward, Email, LocationCity, Phone } from "@mui/icons-material";

// Importing images from footer-imgs
import img1 from "../../media/footer-imgs/car_insta_01.png";
import img2 from "../../media/footer-imgs/car_insta_02.png";
import img3 from "../../media/footer-imgs/car_insta_03.png";
import img4 from "../../media/footer-imgs/car_insta_04.png";
import img5 from "../../media/footer-imgs/car_insta_05.png";
import img6 from "../../media/footer-imgs/car_insta_06.png";

function Footer() {
  return (
    <section className="w-full h-[60vh] border-t-[10px] border-[#1E1E1E] bg-[#012038] overflow-hidden relative">

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

        <div className="flex flex-col md:flex-1 w-full md:h-[90%] min-h-[40vh] p-[6vh] gap-3">
          <span className="font-bold  text-white text-[16px]">Instagram</span>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <img src={img1} alt="Instagram 1" className="w-full h-[100px] object-cover rounded-md" />
            <img src={img2} alt="Instagram 2" className="w-full h-[100px] object-cover rounded-md" />
            <img src={img3} alt="Instagram 3" className="w-full h-[100px] object-cover rounded-md" />
            <img src={img4} alt="Instagram 4" className="w-full h-[100px] object-cover rounded-md" />
            <img src={img5} alt="Instagram 5" className="w-full h-[100px] object-cover rounded-md" />
            <img src={img6} alt="Instagram 6" className="w-full h-[100px] object-cover rounded-md" />
          </div>
          <span className="cursor-pointer">veja mais</span>
        </div>
      </div>

    </section>
  );
}

export default Footer;
