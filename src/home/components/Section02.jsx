import axios from "axios"
import CardContrast from "../micro-components/CardContrast";
import backgroundFloor from "../../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Section02() {
  const [liveAuctions, setLiveAuctions] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getAllAuctions()
  }, [])

  const getAllAuctions = async () => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
      params: {
        status: 'live'
      }
    }).then(response => {
      setLiveAuctions(response.data)
    }).catch(error => {
      console.error(error.message)
    });

  }

  return (
    <section className="bg-[#D9D9D9] w-full h-[100vh] 
    flex flex-col justify-center items-center
    overflow-x-hidden overflow-y-hidden p-3 gap-2">

      <h2 className="bg-[#E2E2E2] lg:w-[70%] w-[98%] h-[48px] p-1
      flex justify-start items-center shadow-lg shadow-[#16161622] 
      text-[#153f5f] text-[22px] font-bold leading-[14px] rounded-md">
        NOSSOS DESTAQUES (ao vivo)
      </h2>

      <div className=" flex lg:flex-row flex-col lg:w-[70%] w-[98%] h-full justify-between items-center overflow-hidden gap-1">

        <div className="lg:w-[60%] w-full h-[90%] bg-[#031a30] flex flex-col 
        justify-center items-center relative rounded-md gap-6 overflow-hidden">

          <img src={backgroundFloor} alt="" className="w-full h-full object-cover absolute opacity-30" />

          <h1 className="text-left text-[#fff] text-[22px] font-bold leading-[2px] mt-6 w-[90%] z-20" >
            Anuncie Seus Produtos em Nossos Leilões!
          </h1>

          <h1 style={{
            textShadow: "2px 1px 3px #15151586"
          }} className="w-[90%] text-[36px] z-20">
            Seus produtos bem apresentados!
          </h1>

          <div className="w-[90%] text-[#D7D7D7] text-[16px] text-justify z-20">
            Tem produtos para leilão? Nossa plataforma moderna e inovadora é o lugar perfeito para você! Selecionamos cautelosamente nossos anunciantes para garantir
            a melhor experiência de compra e venda. <br />
            Aproveite a oportunidade de alcançar um público amplo e diversificado. Entre em contato conosco e descubra como podemos ajudar a
            destacar seus itens. Nosso time está pronto para fornecer todos os detalhes e orientá-lo no processo.
          </div>

          <button onClick={() => navigate("/advertiser/form/subscription")} className="bg-white flex w-[90%] p-2 text-[18px] rounded-md text-zinc-600 z-20">
            entrar em contato
          </button>

        </div>

        <div className="flex lg:w-[40%] w-full h-[90%] flex-col justify-start items-center 
        bg-zinc-100 overflow-y-auto p-3 gap-3 rounded-md">
          {liveAuctions.map((auction, index) => (
            <CardContrast key={index} auction={auction} />
          ))}
        </div>
      </div>

    </section>
  );
}

export default Section02;
