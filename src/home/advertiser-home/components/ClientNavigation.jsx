import { useNavigate } from "react-router-dom";
import {
    Dashboard,
    LocalAtm,
    Logout,
    Gavel,
} from "@mui/icons-material";
import logo_aukt_green from "../../../media/logos/logos-auk/aukt_greengreen.png";


const ClientNavigation = () => {


    const navigate = useNavigate()

    function handleClick(route) {
        navigate(route);
    }

    const handleLogoutClient = () => {
        localStorage.removeItem('client-auk-session-login')
        navigate('/')
    }

    return (
        <>
            <div className="w-full p-2 flex justify-center items-center">
                <img
                    src={logo_aukt_green}
                    alt="Logo-auk"
                    onClick={() => navigate("/")}
                    className="w-[100px] object-cover cursor-pointer mt-[3vh]
                    hover:border-[1px] border-[#ffffff33] rounded-md hover:bg-[#ffffff0e]"
                />
            </div>

            <button
                id="menu-1"
                className="w-full flex justify-between items-center p-2 text-white mt-6
                hover:border-[1px] border-[#ffffff33] rounded-md hover:bg-[#ffffff0e]"
                onClick={() => handleClick("/client/dashboard")}
            >
                <Dashboard />
                <span>Dashboard</span>
            </button>

            <button
                id="menu-2"
                className="w-full flex justify-between items-center p-2 text-white
                hover:border-[1px] border-[#ffffff33] rounded-md hover:bg-[#ffffff0e]"
                onClick={() => handleClick("/client/auctioned")}
            >
                <LocalAtm />
                <span>Arremates</span>
            </button>

            <button
                id="menu-3"
                className="w-full flex justify-between items-center p-2 text-white
                hover:border-[1px] border-[#ffffff33] rounded-md hover:bg-[#ffffff0e]"
                onClick={() => handleClick("/client/bids")}
            >
                <Gavel />
                <span>Lances</span>
            </button>

            <button
                onClick={handleLogoutClient}
                id="menu-7"
                className="w-full flex justify-between items-center p-2 text-white 
                hover:border-[1px] border-[#ffffff33] rounded-md hover:bg-[#ffffff0e]"
            >
                <Logout />
                <span>Logout</span>
            </button>

        </>
    )

}

export default ClientNavigation;