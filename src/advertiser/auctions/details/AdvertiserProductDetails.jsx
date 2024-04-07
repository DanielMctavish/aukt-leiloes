//import {useNavigate} from "react-router-dom"

import AssideAdvertiser from "../../_asside/AssideAdvertiser";
import NavAdvertiser from "../../_navigation/NavAdvertiser";

function AdvertiserProductDetails() {

    //const navigate = useNavigate()

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <AssideAdvertiser MenuSelected="menu-3" />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
                <NavAdvertiser />
            </section>
            
        </div>
    )
}

export default AdvertiserProductDetails;