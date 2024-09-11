/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeAdvSection01 from "./HomeAdvSection01";
import HomeAdvSection02 from "./HomeAdvSection02";
import HomeAdvSection03 from "./HomeAdvSection03";
import HomeAdvFooter from "./HomeAdvFooter";

function HomeAdvertiser() {
    const [currentAdvertiser, setAdvertiser] = useState({})
    const [displayAuct, setDisplayAuct] = useState({})
    const { advertiser_id } = useParams();

    const navigate = useNavigate()

    useEffect(() => { 
        getAdvertiserInformations();
        getClientInformations();
    }, [])

    const getAdvertiserInformations = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find?adv_id=${advertiser_id}`)
                .then(result => {
                    setAdvertiser(result.data)
                })

            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${advertiser_id}`)
                .then(result => {
                    result.data.forEach((auct) => {
                        if (auct.status === "cataloged") {
                            // console.log("AUK >> ", auct)
                            setDisplayAuct(auct)
                            return false
                        }
                    })
                })
        } catch (error) {
            navigate("/")
        }
    }

    const getClientInformations = async () => {
        const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
                headers: {
                    "Authorization": `Bearer ${currentSessionClient.token}`
                }
            });

            if (!response.data) {
                localStorage.removeItem("client-auk-session-login");
            }
        } catch (error) {
            console.log(error.message);
            localStorage.removeItem("client-auk-session-login");
        }
    }

    return (
        <div className="w-full h-auto flex flex-col justify-start items-center relative roboto-condensed-advertiser">

            {/* SECTION 01 ------------------------------------------------------------------------------------------------------------------------- */}
            <HomeAdvSection01 currentAdvertiser={currentAdvertiser} displayAuct={displayAuct} />

            {/* SECTION 02 ------------------------------------------------------------------------------------------------------------------------- */}

            <HomeAdvSection02 currentAdvertiser={currentAdvertiser} />

            {/* SECTION 03 */}

            <HomeAdvSection03 currentAdvertiser={currentAdvertiser} />

            {/* RODAPÉ ------------------------------------------------------------------------------------------------------------------------- */}
            <HomeAdvFooter currentAdvertiser={currentAdvertiser} />
        </div>
    )
}

export default HomeAdvertiser;
