//import React, { useState } from "react";
import NavAdvertiser from "../_navigation/NavAdvertiser";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import FormProfile from "./form/FormProfile";



function AdvertiserProfile() {


  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-x-hidden custom-scrollbar
        flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdvertiser MenuSelected="menu-9" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center">
        <NavAdvertiser />

        <section className="w-full h-full flex justify-center items-center gap-6">
          <FormProfile />
        </section>

      </section>
    </div>
  );
}

export default AdvertiserProfile;
