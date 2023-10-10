import React from "react";
import Navigation from "../navigation/Navigation";
import tempLogo from "../medias/temp-logo.png"

function App() {

  const hiddenNav = () => {
    const navigationAuk = document.querySelector(".nav-auk")
    navigationAuk.style.marginLeft = '-40vh'
    navigationAuk.style.transition = '.2s'
  }

  return (
    <div className="App flex flex-col justify-start items-center h-[100vh] bg-zinc-100">
      <Navigation />

      <section
        onClick={hiddenNav}
        className="w-full gap-3 flex flex-col justify-center items-center lg:h-[96vh] h-[100vh] bg-slate-100">
        <img src={tempLogo} alt="" className="w-[130px] h-[130px] object-cover shadow-md rounded-lg" />
        <span className="text-zinc-600">tudo começa por aqui</span>
        <button className="text-zinc-400">
          <a href="https://dmdesenvolvedor.com.br" target="_blank" rel="noreferrer">Arboris Codex_</a>
        </button>
      </section>

    </div>
  );
}

export default App;
