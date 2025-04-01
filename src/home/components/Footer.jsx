/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import aukLogo from "../../media/logos/logos-auk/aukt_blue.png"
import React, { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { ArrowForward, Email, LocationCity, Phone, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

// Importing images from footer-imgs
import img1 from "../../media/footer-imgs/car_insta_01.png";
import img2 from "../../media/footer-imgs/car_insta_02.png";
import img3 from "../../media/footer-imgs/car_insta_03.png";
import img4 from "../../media/footer-imgs/car_insta_04.png";
import img5 from "../../media/footer-imgs/car_insta_05.png";
import img6 from "../../media/footer-imgs/car_insta_06.png";

function Footer() {
  // Estado para controlar a abertura/fechamento das seções no mobile
  const [openSection, setOpenSection] = useState({
    about: true,
    links: false,
    newsletter: false,
    gallery: false
  });

  // Função para alternar a abertura/fechamento de uma seção
  const toggleSection = (section) => {
    setOpenSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Componente para o cabeçalho de cada seção mobile
  const MobileAccordionHeader = ({ title, section, icon }) => (
    <div 
      className="flex justify-between items-center w-full py-4 border-b border-white/10 md:hidden cursor-pointer"
      onClick={() => toggleSection(section)}
    >
      <h2 className="text-lg font-bold flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h2>
      {openSection[section] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
    </div>
  );

  return (
    <section className="w-full flex flex-col justify-center items-center border-t-[10px] border-[#1E1E1E] bg-[#012038] overflow-hidden relative p-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1480px]">
        <div className="bg-[#0D1733] rounded-[20px] shadow-2xl shadow-[#11111125] relative flex flex-col md:flex-row justify-start md:justify-center items-start gap-8 p-6 md:p-12 lg:p-16">
          {/* Coluna 1 - Sobre a AUK */}
          <div className="flex flex-col md:flex-1 w-full space-y-6 text-zinc-100">
            <div className="flex gap-3 items-center">
              <img src={aukLogo} alt="AUK Leilões" className="w-[40px] h-[40px] object-cover" />
              <h1 className="text-xl font-bold">
                AUK Leilões
              </h1>
            </div>

            <MobileAccordionHeader 
              title="Sobre Nós" 
              section="about" 
            />

            {openSection.about && (
              <>
                <p className="text-sm leading-relaxed text-gray-300 border-b border-white/10 pb-6">
                  A AUK Leilões é uma plataforma inovadora especializada em leilões online. 
                  Conectamos vendedores e compradores em um ambiente seguro e transparente, 
                  oferecendo oportunidades únicas em diversos segmentos.
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Email className="text-[#005699] flex-shrink-0" />
                    <span className="break-all">contato@aukleiloes.com.br</span>
                  </div>

                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Phone className="text-[#005699] flex-shrink-0" />
                    <span>+55 11 91554-4171</span>
                  </div>

                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <LocationCity className="text-[#005699] flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Rua Pereira Estefano, 114 - São Paulo - SP</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div className="flex flex-col md:flex-1 w-full space-y-6 text-zinc-100 mt-6 md:mt-0">
            <MobileAccordionHeader 
              title="Links Rápidos" 
              section="links" 
              icon={<ArrowForward className="text-[#005699] text-sm" />}
            />

            {/* Desktop Header */}
            <h2 className="text-lg font-bold hidden md:block">Links Rápidos</h2>

            {(openSection.links || window.innerWidth >= 768) && (
              <div className="space-y-4">
                <a href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <ArrowForward className="text-[#005699] text-sm flex-shrink-0" /> Página Inicial
                </a>
                <a href="/floor/hub" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <ArrowForward className="text-[#005699] text-sm flex-shrink-0" /> Leilões ao Vivo
                </a>
                <a href="/search" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <ArrowForward className="text-[#005699] text-sm flex-shrink-0" /> Catálogo de Produtos
                </a>
                <a href="/client/register" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <ArrowForward className="text-[#005699] text-sm flex-shrink-0" /> Cadastre-se
                </a>
              </div>
            )}
          </div>

          {/* Coluna 3 - Newsletter */}
          <div className="flex flex-col md:flex-1 w-full space-y-6 text-zinc-100 mt-6 md:mt-0">
            <MobileAccordionHeader 
              title="Fique por Dentro" 
              section="newsletter" 
              icon={<Email className="text-[#005699] text-sm" />}
            />
            
            {/* Desktop Header */}
            <h2 className="text-lg font-bold hidden md:block">Fique por Dentro</h2>
            
            {(openSection.newsletter || window.innerWidth >= 768) && (
              <>
                <p className="text-sm text-gray-300">
                  Receba em primeira mão informações sobre novos leilões, 
                  oportunidades exclusivas e dicas para aproveitar melhor 
                  nossa plataforma.
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <input 
                      type="email" 
                      className="bg-white/5 border border-white/10 h-12 px-4 rounded-md sm:rounded-r-none sm:rounded-l-md w-full
                        focus:outline-none focus:border-[#005699] transition-colors text-sm"
                      placeholder="Seu melhor e-mail" 
                    />
                    <button className="bg-[#005699] hover:bg-[#004477] transition-colors px-6 py-3 sm:py-0
                      rounded-md sm:rounded-l-none sm:rounded-r-md font-medium text-sm">
                      Assinar
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Seus dados estão seguros conosco. Não compartilhamos suas informações.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Coluna 4 - Instagram Feed */}
          <div className="flex flex-col md:flex-1 w-full space-y-6 text-zinc-100 mt-6 md:mt-0">
            <MobileAccordionHeader 
              title="Galeria" 
              section="gallery" 
              icon={<InstagramIcon className="text-[#005699] text-sm" />}
            />

            {/* Desktop Header */}
            <div className="items-center justify-between hidden md:flex">
              <h2 className="text-lg font-bold">Galeria</h2>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-[#005699] hover:text-[#004477] transition-colors">
                <InstagramIcon />
              </a>
            </div>

            {(openSection.gallery || window.innerWidth >= 768) && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {[img1, img2, img3, img4, img5, img6].map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md group">
                      <img 
                        src={img} 
                        alt={`Galeria ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-300 
                          group-hover:scale-110" 
                      />
                    </div>
                  ))}
                </div>

                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[#005699] hover:text-[#004477] transition-colors">
                  Ver mais no Instagram →
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs sm:text-sm text-gray-400 py-6 px-4">
        © {new Date().getFullYear()} AUK Leilões. Todos os direitos reservados.
      </div>
    </section>
  );
}

export default Footer;
