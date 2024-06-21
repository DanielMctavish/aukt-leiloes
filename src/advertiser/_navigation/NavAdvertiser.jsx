/* eslint-disable react/prop-types */
import axios from "axios"
import { ArrowDropDown } from "@mui/icons-material";
//import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";

function NavAdvertiser({ path }) {
  const [AdvertiserInfor, setAdvertiserInfor] = useState({})

  useEffect(() => {
    getAdvertiserInformations()
  }, [])

  const getAdvertiserInformations = async () => {
    const currentAdvertiserSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))

    const configAuth = {
      headers: {
        "Authorization": `Bearer ${currentAdvertiserSession.token}`
      }
    }

    try {
      await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserSession.email}`, configAuth)
        .then(response => {
          setAdvertiserInfor(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }

  }

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

      <section
        className="
            w-[98%] 
            lg:h-[72px]
            h-[100vh] 
            flex 
            flex-row 
            lg:justify-between
            justify-start 
            items-center
            lg:gap-0
            gap-3"
      >
        <div className="flex justify-center items-center gap-3">
          <span className="text-[22px] text-zinc-600 font-bold lg:flex hidden">
            Bem vindo, {AdvertiserInfor.name}!
          </span>

          <span className="text-[22px] text-zinc-300 font-bold lg:flex hidden">
            {AdvertiserInfor.nano_id}
          </span>
        </div>

        <span className="flex text-zinc-600 text-[12px]">
          {path}
        </span>

        <section className="flex flex-row justify-center items-center gap-6 text-zinc-600">
          <span>
            <NotificationsIcon className="text-[#012038]" />
          </span>
          <img
            src={AdvertiserInfor.url_profile_cover}
            alt="foto-perfil"
            className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden object-cover"
          />
          <span className="text-[#012038] font-semibold text-[18px] lg:flex hidden">
            {AdvertiserInfor.name}
          </span>
          <span className="lg:flex hidden">
            <ArrowDropDown />
          </span>
        </section>
      </section>

    </nav>
  );
}

export default NavAdvertiser;

