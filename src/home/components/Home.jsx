import Navigation from "../navigation/Navigation";
import tempLogo from "../medias/temp-logo.png"
import Section01 from "./Section01";
import Section02 from "./Section02";
import Section03 from "./Section03";
import Footer from "./Footer";
import './Home.css';
 
function Home() {


  const hiddenNav = () => {
    if (window.innerWidth < 1025) {
      const navigationAuk = document.querySelector(".nav-auk")
      navigationAuk.style.marginLeft = '-40vh'
      navigationAuk.style.transition = '.2s'
    }
  }


  return (
    <div
      className="App flex flex-col justify-start items-center w-full h-full bg-zinc-100 overflow-x-hidden">
      <Navigation />

      <Section01 />
      <Section02 />
      <Section03 />
      <Footer />

      {/* <section
        onClick={hiddenNav}
        className="w-full gap-3 flex flex-col justify-center items-center lg:h-[96vh] h-[100vh] bg-slate-100">
        <img src={tempLogo} alt="" className="w-[130px] h-[130px] object-cover shadow-md rounded-lg" />
        <span className="text-zinc-600">tudo começa por aqui</span>
        <button className="text-zinc-400">
          <a href="https://dmdesenvolvedor.com.br" target="_blank" rel="noreferrer">Arboris Codex_</a>
        </button>
      </section> */}

    </div>
  );
}

export default Home;
