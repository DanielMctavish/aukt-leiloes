import NavigationBirthday from "../navigation/NavigationBirthday";
import Navigation from "../navigation/Navigation";
//import tempLogo from "../medias/temp-logo.png"
import Section01 from "./Section01";
import Section01_1 from "./Section01_1";
import Section02 from "./Section02";
import Section03 from "./Section03";
import Footer from "./Footer";
import './Home.css';
import { useMemo } from 'react';
//import Submenu from "../navigation/Submenu";

function Home() {
  // const hiddenNav = () => {
  //   if (window.innerWidth < 1025) {
  //     const navigationAuk = document.querySelector(".nav-auk")
  //     navigationAuk.style.marginLeft = '-40vh'
  //     navigationAuk.style.transition = '.2s'
  //   }
  // }

  // Determina qual navegação mostrar com base na data
  const NavigationComponent = useMemo(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // Janeiro é 0, Março é 2

    // Dias 25, 26, 27 e 28 de março mostram NavigationBirthday
    if (month === 2 && day >= 25 && day <= 28) {
      return NavigationBirthday;
    }

    // Nos outros dias, mostra Navigation padrão
    return Navigation;
  }, []);

  return (
    <div
      className="App flex flex-col justify-start p-0 items-center w-full h-full bg-[#FFFFFF] 
      overflow-x-hidden relative text-white">

      <NavigationComponent />

      <Section01 />
      <Section01_1 />
      <Section02 />
      <Section03 />
      <Footer />
    </div>
  );
}

export default Home;
