/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { setFiles } from "../functions/MiddlewareTransferFile"

function UploadProfileFile({ currentAdvertiser }) {
    const [profilePicture, setProfilePicture] = useState()
    const refLabelZoneArea = useRef()

    const onDrop = useCallback((acceptedFiles) => {
        setProfilePicture(acceptedFiles[0]);
        setFiles(acceptedFiles[0])
    }, []);

    const dropzone = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg'],
            'image/jpg': ['.jpg'],
            'image/gif': ['.gif'],
        }
    });

    const { getRootProps, getInputProps, isDragActive } = dropzone;

    return (
        <div className="relative group">
            <div {...getRootProps()}
                ref={refLabelZoneArea}
                className={`
                    w-[100px] h-[100px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden
                    flex items-center justify-center
                    ${!profilePicture && !currentAdvertiser?.url_profile_cover ? 'border-3 border-dashed border-[#012038]' : ''}
                    transition-all duration-300
                    group-hover:ring-4 group-hover:ring-[#012038]/20
                    bg-white shadow-xl
                `}
            >
                {profilePicture ? (
                    <img 
                        src={URL.createObjectURL(profilePicture)} 
                        className="w-full h-full object-cover"
                        alt="New Profile"
                    />
                ) : currentAdvertiser?.url_profile_cover ? (
                    <img 
                        src={currentAdvertiser.url_profile_cover}
                        className="w-full h-full object-cover"
                        alt="Current Profile"
                    />
                ) : (
                    <div className="text-center p-4">
                        <div className="text-[#012038] text-sm font-medium">
                            {isDragActive ? 'Solte a imagem' : 'Foto do Perfil'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Arraste ou clique
                        </p>
                    </div>
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center 
                    opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-sm">
                        {currentAdvertiser?.url_profile_cover ? 'Alterar foto' : 'Adicionar foto'}
                    </span>
                </div>
            </div>

            <input {...getInputProps()} className="hidden" />
        </div>
    )
}

export default UploadProfileFile;