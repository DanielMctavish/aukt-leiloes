/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import CompanyPhotoModal from "../components/CompanyPhotoModal";
import { PhotoLibrary } from "@mui/icons-material";

function UploadCompanyFile({ currentAdvertiser }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companyPhotoUrl, setCompanyPhotoUrl] = useState(currentAdvertiser?.url_profile_company_logo_cover);

    const handleSuccess = (newUrl) => {
        setCompanyPhotoUrl(newUrl);
        window.location.reload();
    };

    return (
        <>
            <div 
                className="relative group cursor-pointer"
                onClick={() => setIsModalOpen(true)}
                style={{
                    backgroundImage: companyPhotoUrl ? `url(${companyPhotoUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="w-[180px] h-[120px] rounded-lg overflow-hidden
                    flex items-center justify-center bg-[#ffffff8e] backdrop-blur-[2px]
                    shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                    group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
                    transition-all duration-300 ease-in-out
                    border-4 border-white"
                >
                    <div className="text-center p-4 transform group-hover:scale-105 transition-transform duration-300">
                        <div className="text-[#012038] text-sm font-semibold">
                            Foto da Empresa
                        </div>
                        <p className="text-xs text-gray-200 mt-1">
                            Clique para alterar
                        </p>
                    </div>

                    {/* Photo library icon overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                        <PhotoLibrary className="text-white mb-2" style={{ fontSize: '24px' }} />
                        <span className="text-white text-sm font-medium">
                            {companyPhotoUrl ? 'Alterar foto' : 'Adicionar foto'}
                        </span>
                    </div>
                </div>

                {/* Decorative ring */}
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#012038]/20 to-[#012038]/10 
                    opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 -z-10" />
            </div>

            <CompanyPhotoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentAdvertiser={currentAdvertiser}
                onSuccess={handleSuccess}
            />
        </>
    );
}

export default UploadCompanyFile;