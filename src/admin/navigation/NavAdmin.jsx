import { Menu, ArrowDropDown } from "@mui/icons-material";
import UserInfor from "../dados/userInfor.json";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";

function NavAdmin() {
  const [navigationMenu, setNavigationMenu] = useState(false);

  //const tailwindItems = "flex justify-center items-center p-2 gap-3"

  const hideNavigation = () => {
    const navigationAuk = document.querySelector(".nav-auk");

    if (!navigationMenu) {
      navigationAuk.style.marginLeft = "-40vh";
      navigationAuk.style.transition = ".6s";
      setNavigationMenu(!navigationMenu);
    } else {
      navigationAuk.style.marginLeft = "0vh";
      navigationAuk.style.transition = ".2s";
      setNavigationMenu(!navigationMenu);
    }
  };

  return (
    <nav
      className="
        ml-0
        nav-auk
        lg:left-auto
        left-[34%]
        lg:bottom-0
        bottom-[6%]
        relative
        lg:w-full
        lg:h-[72px]
        h-[2vh]
       lg:bg-[#FFFFFF]
        lg:shadow-lg
        lg:shadow-[#1b1b1b23] 
        flex-row
        flex
        lg:justify-center
        justify-start 
        items-center 
        gap-2 
        text-white 
        text-[12px]
        cursor-pointer"
    >
      {UserInfor.map((auction, index) => (
        <section
          className="
            lg:w-[97%] 
            w-full 
            lg:h-[72px]
            h-[100vh] 
            flex 
            flex-row 
            lg:justify-between
            justify-start 
            items-center
            lg:gap-0
            gap-3"
          key={index}
        >
          <span className="text-[22px] text-zinc-600 font-bold lg:flex hidden">
            Bem vindo, {auction.firtName}!
          </span>

          <section className="flex flex-row justify-center items-center gap-6 text-zinc-600">
            <span>
              <NotificationsIcon className="text-[#012038]" />
            </span>
            <img
              src={auction.imagem}
              alt="foto-perfil"
              className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden"
            />
            <span className="text-[#012038] font-semibold text-[18px] lg:flex hidden">
              {auction.firtName}
            </span>
            <span className="lg:flex hidden">
              <ArrowDropDown />
            </span>
          </section>
        </section>
      ))}
    </nav>
  );
}

export default NavAdmin;

// const hideNavigation = () => {
//   const navigationAuk = document.querySelector(".nav-auk");

//   if (!navigationMenu) {
//     navigationAuk.style.marginLeft = "-40vh";
//     navigationAuk.style.transition = ".6s";
//     setNavigationMenu(!navigationMenu);
//   } else {
//     navigationAuk.style.marginLeft = "0vh";
//     navigationAuk.style.transition = ".2s";
//     setNavigationMenu(!navigationMenu);
//   }
// };

// return (
//   <nav
//     className="
//       lg:ml-0
//       ml-[-40vh]
//       nav-auk
//       lg:left-auto
//       left-0
//       lg:relative
//       fixed
//       lg:w-full
//       w-[220px]
//       lg:h-[72px]
//       h-[100vh]
//       bg-[#FFFFFF]
//       shadow-lg
//       shadow-[#1b1b1b23]
//       lg:flex-col
//       flex-row
//       lg:flex
//       justify-center
//       lg:justify-start
//       items-center
//       gap-2
//       text-white
//       text-[12px]
//       cursor-pointer"
//   >
//     <span
//       style={{ fontSize: "26px" }}
//       className="flex
//           fixed
//           top-1
//           right-1
//           lg:hidden
//           text-[#012038]
//           bg-white
//           p-1
//           rounded-md
//           z-40
//           w-[44px]
//           h-[44px]
//           justify-center
//           items-center"
//       onClick={hideNavigation}
//     >
//       <Menu />
//     </span>
//     {UserInfor.map((auction, index) => (
//       <section
//         className="
//           lg:w-[97%]
//           w-full
//           lg:h-[72px]
//           h-[100vh]
//           flex
//           flex-col
//           lg:flex-row
//           lg:justify-between
//           justify-start
//           items-center
//           lg:gap-0
//           gap-3"
//           key={index}
//       >
//         <span className="text-[22px] text-zinc-600 font-bold lg:block hidden">
//           Bem vindo, {auction.firtName}!
//         </span>

//         <section className="flex lg:flex-row flex-col justify-center items-center gap-6 text-zinc-600">
//           <img
//             src={auction.imagem}
//             alt="foto-perfil"
//             className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden"
//           />
//           <span className="text-[#012038] font-semibold text-[18px]">{auction.firtName}</span>
//           <ArrowDropDown />
//         </section>
//       </section>
//     ))}
//   </nav>
// );
// }
