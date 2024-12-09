/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import ProfilePhotoModal from "../components/ProfilePhotoModal";
import { CameraAlt } from "@mui/icons-material";

function UploadProfileFile({ currentAdvertiser }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileUrl, setProfileUrl] = useState(currentAdvertiser?.url_profile_cover);

    const handleSuccess = (newUrl) => {
        setProfileUrl(newUrl);
        window.location.reload();
    };

    return (
        <>
            <div 
                className="relative group cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="w-[120px] h-[120px] md:w-[110px] md:h-[110px] rounded-full overflow-hidden
                    flex items-center justify-center bg-white 
                    shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                    group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
                    transition-all duration-300 ease-in-out
                    border-4 border-white"
                >
                    {profileUrl ? (
                        <img 
                            src={profileUrl}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            alt="Profile"
                        />
                    ) : (
                        <div className="text-center p-4 transform group-hover:scale-105 transition-transform duration-300">
                            <div className="text-[#012038] text-sm font-semibold">
                                Foto do Perfil
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Clique para alterar
                            </p>
                        </div>
                    )}

                    {/* Camera icon overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                        <CameraAlt className="text-white mb-2" style={{ fontSize: '24px' }} />
                        <span className="text-white text-sm font-medium">
                            {profileUrl ? 'Alterar foto' : 'Adicionar foto'}
                        </span>
                    </div>
                </div>

                {/* Decorative ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#012038]/20 to-[#012038]/10 
                    opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 -z-10" />
            </div>

            <ProfilePhotoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentAdvertiser={currentAdvertiser}
                onSuccess={handleSuccess}
            />
        </>
    );
}

export default UploadProfileFile;