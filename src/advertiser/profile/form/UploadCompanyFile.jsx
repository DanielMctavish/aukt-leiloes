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
        <>
            {!profileCompany ?

                <div {...getRootProps({ className: "dropzone" })}
                    ref={refLabelZoneArea}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className="w-[220px] h-[220px] flex justify-center items-center border-[3px] border-[#13384d] 
                    hover:bg-[#13384d16] rounded-full border-dashed text-white text-[10px]">
                    {isDragActive ? (<h2>solte o arquivo</h2>) : (<h2 className="text-center">arraste e solte a foto da empresa</h2>)}
                </div> :
                <img src={URL.createObjectURL(profileCompany)} className="object-cover w-[220px] h-[220px] rounded-full" />

            }

            {
                currentAdvertiser.url_profile_company_logo_cover &&
                <img src={currentAdvertiser.url_profile_company_logo_cover} 
                className="object-cover w-[80px] h-[80px] rounded-full absolute top-1 left-2 bg-white border-[3px] border-zinc-600" />
            }

            <input onChange={() => { }} {...getInputProps()} type="file" className="hidden" />
        </>
    )
}

export default UploadCompanyFile;