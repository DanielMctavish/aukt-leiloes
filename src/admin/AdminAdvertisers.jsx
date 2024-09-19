//import React, { useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";


function AdminAdvertisers() {
  return (
    <div
      className="w-full lg:h-[100vh] h-auto
        bg-[#D8DEE8] text-zinc-600 overflow-x-hidden
        flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-3" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center">
        <NavAdmin />
        <section className="w-[90%] pt-6 flex justify-center items-center gap-6">
          
        </section>
      </section>
    </div>
  );
}

export default AdminAdvertisers;
