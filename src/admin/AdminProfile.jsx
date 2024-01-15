import axios from "axios"
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const [currentAdm, setCurrentAdm] = useState({})
  const refName = useRef()
  const refEmail = useRef()
  const refPassword = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const currentAdminSession = JSON.parse(localStorage.getItem("auct-admin-session"))
    setCurrentAdm(currentAdminSession)

  }, [])

  const handleUpdateAdmin = async () => {

    try {

      const response = await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/admin/update?admin_id=${currentAdm.id}`, {
        name: !refName.current.value ? currentAdm.name : refName.current.value,
        email: !refEmail.current.value ? currentAdm.email : refEmail.current.value,
        password: refPassword.current.value
      })
      console.log('observando response update -> ', response.data);
      const JsonString = JSON.stringify({
        token: response.data.token,
        email: response.data.email,
        name: response.data.name,
        id: response.data.id
      })
      localStorage.setItem("auct-admin-session", JsonString)
      navigate("/admin/dashboard")

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-x-hidden custom-scrollbar
        flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-6" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center">
        <NavAdmin />

        <section className="w-[100%] h-full flex justify-center items-center gap-6 p-2">

          <div className="
            w-full h-[80%] lg:bg-white bg-[#D8DEE8] rounded-md 
            lg:shadow-lg lg:shadow-[#17171722] flex
            flex-col justify-start items-center relative"
          >
            {/* CABEÇALHO PROFILE */}
            <div className="w-full relative 
            flex-col justify-center items-center
            lg:flex hidden bg-gradient-to-r from-[#191F2F] via-[#2B344E] to-[#12141A] 
            p-4 rounded-t h-[40%] gap-6">
              <span className="text-white text-[16px] font-bold">
                Configuração da conta
              </span>
              <div className="relative flex flex-col items-center">
                <img
                  src=""
                  alt="foto-perfil"
                  className="w-[80px] h-[80px] bg-zinc-300 rounded-full overflow-hidden object-cover"
                />
                <span className="absolute top-12 left-12 pl-1 text-[white] bg-[#1E293B] border-4 w-10 h-10 border-white rounded-full cursor-pointer flex items-center">
                  <PhotoCameraIcon style={{ width: "24px" }} />
                </span>

                <span className="text-[#e4e4e4] font-bold text-[16px] mt-2">
                  {currentAdm.name}
                </span>
              </div>
            </div>

            <div className="w-full h-[60%] flex flex-col justify-center items-center gap-3">

              <div className="flex flex-col justify-start items-start">
                <span>nome</span>
                <input ref={refName} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-zinc-600 bg-transparent rounded-md" />
              </div>
              <div className="flex flex-col justify-start items-start">
                <span>email</span>
                <input ref={refEmail} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-zinc-600 bg-transparent rounded-md" />
              </div>
              <div className="flex flex-col justify-start items-start">
                <span>senha</span>
                <input ref={refPassword} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-zinc-600 bg-transparent rounded-md" />
              </div>

            </div>

            <button onClick={handleUpdateAdmin} className="font-bold">alterar informações</button>

          </div>
        </section>

      </section>
    </div>
  );
}

export default AdminProfile;
