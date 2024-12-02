/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { setFiles } from "../functions/MiddlewareTransferFile"

function UploadCompanyFile({ currentAdvertiser }) {
    const [profileCompany, setProfileCompany] = useState()

    //UPLOAD FILES OPERATIONS................................................................
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        refLabelZoneArea.current.style.border = "2px dashed red";
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        refLabelZoneArea.current.style.border = "3px dashed #13384d";
    };

    const refLabelZoneArea = useRef()

    const onDrop = useCallback((acceptedFiles) => {
        setProfileCompany(acceptedFiles[0]);
        setFiles(false, acceptedFiles[0])
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

    useEffect(() => {}, [profileCompany])

    const { getRootProps, getInputProps, isDragActive } = dropzone;

    return (
        <div className="relative group">
            <div {...getRootProps()}
                ref={refLabelZoneArea}
                className={`
                    w-24 h-24 rounded-lg overflow-hidden
                    flex items-center justify-center bg-white/10 backdrop-blur-sm
                    ${!profileCompany ? 'border-2 border-dashed border-white' : ''}
                    transition-all duration-300
                    group-hover:ring-4 group-hover:ring-white/20
                `}
            >
                {profileCompany ? (
                    <img 
                        src={URL.createObjectURL(profileCompany)} 
                        className="w-full h-full object-cover"
                        alt="Company Logo"
                    />
                ) : currentAdvertiser?.url_profile_company_logo_cover ? (
                    <img 
                        src={currentAdvertiser.url_profile_company_logo_cover}
                        className="w-full h-full object-cover"
                        alt="Current Company Logo"
                    />
                ) : (
                    <div className="text-center p-2">
                        <div className="text-white text-xs font-medium">
                            {isDragActive ? 'Solte a logo' : 'Logo da Empresa'}
                        </div>
                    </div>
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center 
                    opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">
                        Alterar logo
                    </span>
                </div>
            </div>

            <input {...getInputProps()} className="hidden" />
        </div>
    );
}

export default UploadCompanyFile;