/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react"
import logo_aukt from "../../media/logo_aukt.png"
import { Dashboard, LocalAtm, Group, AccountBalanceWallet, Person, Logout } from "@mui/icons-material"

function AssideAdmin(props) {

    useEffect(() => {

        const menuBtn = document.querySelector(`#${props.MenuSelected}`)
        if (menuBtn) {
            menuBtn.style.background = "linear-gradient(90deg, #4D5BD4 0.03%, #FC9F9F 99.17%)"
            menuBtn.style.borderRadius = "4px"
        }

    }, [])

    //console.log('observando props... ->>', props.MenuSelected);

    return (
        <nav className="w-[253px] h-[100vh] bg-[#191F2F]
        flex flex-col justify-start items-center gap-3">

            <img src={logo_aukt} alt="Logo-auk" className="w-[120px] object-cover" />
            <button id="menu-1" className="w-full flex justify-between items-center p-2 text-white mt-6">
                <Dashboard />
                <span>Dashboard</span>
            </button>
            <button id="menu-2" className="w-full flex justify-between items-center p-2 text-white">
                <LocalAtm />
                <span>Leilões</span>
            </button>
            <button id="menu-3" className="w-full flex justify-between items-center p-2 text-white">
                <Group />
                <span>Anunciantes</span>
            </button>
            <button id="menu-4" className="w-full flex justify-between items-center p-2 text-white">
                <Group />
                <span>Clientes</span>
            </button>
            <button id="menu-5" className="w-full flex justify-between items-center p-2 text-white">
                <AccountBalanceWallet />
                <span>Carteira</span>
            </button>

            <div className="w-full flex justify-start items-center p-2 text-zinc-300 mt-7">
                <span>Configuração e suporte</span>
            </div>

            <button id="menu-6" className="w-full flex justify-between items-center p-2 text-white mt-6">
                <Person />
                <span>Perfil</span>
            </button>
            <button id="menu-7" className="w-full flex justify-between items-center p-2 text-white">
                <Logout />
                <span>Logout</span>
            </button>

        </nav>
    )
}

export default AssideAdmin