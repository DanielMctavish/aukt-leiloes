/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ButtonsDeploy from "./TemplateControls/ButtonsDeployTemplate/ButtonsDeploy";
import FooterControlsTemplate from "./TemplateControls/FooterControlsTemplate/FooterControlsTemplate";
import HeaderControlsTemplate from "./TemplateControls/HeaderControlsTemplate/HeaderControlsTemplate";
import InitialConfigTemplate from "./TemplateControls/InitialConfigTemplate/InitialConfigTemplate";
import SectionsControlsTemplate from "./TemplateControls/SectionsControlsTemplate/SectionsControlsTemplate";
import { useEffect, useState } from "react";



function AdvertiserTemplateControls() {
    const [advertiser, setAdvertiser] = useState(null);
    const navigate = useNavigate();
    const { advertiser_id } = useParams();

    useEffect(()=>{
        getCurrentAdvertiser();
    },[])

    const getCurrentAdvertiser = async () => {
        try {
            const advertiserSession = localStorage.getItem('advertiser-session-aukt');
            if (!advertiserSession) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }
    
            const { token, email } = JSON.parse(advertiserSession);
            if (!token) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }
    
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`,
                {
                    params: { email: email },
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
    
    
            if (response.data.id !== advertiser_id) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }
    
            if (!response.data) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }
    
            setAdvertiser(response.data);
    
        } catch (error) {
            localStorage.removeItem('advertiser-session-aukt');
            navigate("/");
        }
    };

    return (
        <div className='w-full h-full flex flex-col justify-start items-center p-2 gap-1'>
            {
                advertiser && (
                    <div className="w-full bg-gradient-to-br from-[#012038] to-[#01284a] text-white 
                    rounded-xl shadow-2xl shadow-black/20 p-6 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Avatar do anunciante */}
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center 
                                justify-center text-2xl font-bold uppercase backdrop-blur-sm border-2 border-white/20">
                                    {advertiser.name?.charAt(0)}
                                </div>
                                
                                {/* Informações principais */}
                                <div>
                                    <h1 className="text-2xl font-bold">{advertiser.name}</h1>
                                    <p className="text-white/70">{advertiser.email}</p>
                                </div>
                            </div>                          
                        </div>

                        {/* Barra de progresso do template */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-white/70">Progresso do Template</span>
                                <span className="text-sm font-medium">75%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[75%] bg-gradient-to-r from-blue-400 to-blue-600 
                                rounded-full transition-all duration-500" />
                            </div>
                        </div>
                    </div>
                )
            }


            <InitialConfigTemplate />
            <HeaderControlsTemplate />
            <SectionsControlsTemplate />
            <FooterControlsTemplate />
            <ButtonsDeploy />
        </div>
    );
}

export default AdvertiserTemplateControls;
