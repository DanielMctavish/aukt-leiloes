import React, { useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import Form from "./statics-elements/Form";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserInfor from "./dados/userInfor.json";
function AdminProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
  };
  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-hidden
        flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-6" />
      <section className="w-full h-auto flex flex-col justify-start items-center ">
        <NavAdmin />
        <section className="w-[90%] h-full pt-6 flex justify-center items-center gap-6">
          <div
            className="w-full lg:bg-white bg-[#D8DEE8]  rounded-md 
                    lg:shadow-lg lg:shadow-[#17171722] flex
                    flex-col "
          >
            <div className="relative lg:flex hidden bg-gradient-to-r from-[#191F2F] via-[#2B344E] to-[#12141A] p-4 rounded-t h-[30vh]">
              <span className="text-white text-[16px] font-bold">
                Configuração da conta
              </span>
            </div>
            {UserInfor.map((auction) => (
              <section className="absolute lg:bottom-0 lg:ml-[78px] ml-[36%] lg:top-[280px] flex flex-col items-center ">
                <img
                  src={auction.imagem}
                  alt="foto-perfil"
                  className="w-[80px] h-[80px] bg-zinc-300 rounded-full overflow-hidden"
                />
                <span className="absolute top-12 left-12 pl-1 text-[white] bg-[#1E293B] border-4 w-10 h-10 border-white rounded-full cursor-pointer flex items-center">
                  <PhotoCameraIcon style={{ width: "24px" }} />
                </span>

                <span className="text-[#000000] font-bold text-[16px] mt-2">
                  {auction.firtName} {auction.lastName}
                </span>
              </section>
            ))}

            <div className="flex justify-start lg:mt-14 mt-24">
              <Form
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </div>
            <div className="col-span-2 flex flex-col lg:flex-row justify-between lg:mt-10  mb-2 pl-14 lg:pl-10 pr-16 lg:pr-10">
              <button className="text-[#C43030] text-[14px] font-semibold lg:mb-0 m-4">
                Altera senha
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-[#191F2F] text-white text-[12px] py-2 px-7 rounded-[4px] hover:bg-[#191F6F]"
              >
                Atualizar
              </button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminProfile;
