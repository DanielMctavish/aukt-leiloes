import NavigationBirthday from "../navigation/NavigationBirthday";
//import tempLogo from "../medias/temp-logo.png"
import Section01 from "./Section01";
import Section01_1 from "./Section01_1";
import Section02 from "./Section02";
import Section03 from "./Section03";
import Footer from "./Footer";
import './Home.css';
//import Submenu from "../navigation/Submenu";
// import Navigation from "../navigation/Navigation"; // Comentado temporariamente para tema de aniversário

function Home() {
  // const hiddenNav = () => {
  //   if (window.innerWidth < 1025) {
  //     const navigationAuk = document.querySelector(".nav-auk")
  //     navigationAuk.style.marginLeft = '-40vh'
  //     navigationAuk.style.transition = '.2s'
  //   }
  // }

  return (
    <div
      className="App flex flex-col justify-start items-center w-full h-full bg-[#FFFFFF] overflow-x-hidden relative text-white">
      <NavigationBirthday />
      {/* <Submenu /> */}
      <Section01 />
      <Section01_1 />
      <Section02 />
      <Section03 />
      <Footer />
    </div>
  );
}

export default Home;
