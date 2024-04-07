/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDropDown } from "@mui/icons-material";
import { useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
//import { useNavigate } from "react-router-dom";

function NavClient() {
  //const [adminLocal, setAdminLocal] = useState(false);
  //const navigate = useNavigate()

  useEffect(() => {
    //get admin local
    // const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'))
    // setAdminLocal(adminLocal)

    // if (!adminLocal) {
    //   navigate("/admin/login")
    // }

  }, []);

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
       lg:bg-[#eefff4]
        lg:shadow-lg
        lg:shadow-[#1b1b1b23] 
        flex-row
        flex
        lg:justify-center
        justify-start 
        items-center 
        gap-2 
        text-zinc-800 
        text-[12px]
        cursor-pointer"
    >
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
      >
        <span className="text-[22px] font-bold lg:flex hidden">
          Bem vindo, {'USUÁRIO cliente!'}
        </span>

        <section className="flex flex-row justify-center items-center gap-6 ">
          <span>
            <NotificationsIcon />
          </span>
          <img
            src=""
            alt="foto-perfil"
            className="w-[50px] h-[50px] bg-zinc-300 rounded-full overflow-hidden object-cover"
          />
          <span className="font-semibold text-[18px] lg:flex hidden">
            {'usuário'}
          </span>
          <span className="lg:flex hidden">
            <ArrowDropDown />
          </span>
        </section>
      </section>
    </nav>
  );
}

export default NavClient;

