/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";


function UploadProfileFile() {
    const [profilePicture, setProfilePicture, setCurrentAdvertiserProfileFile] = useState()

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
        setProfilePicture(acceptedFiles[0]);
        setCurrentAdvertiserProfileFile(acceptedFiles[0])
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

    useEffect(() => {
        console.log("foto de perfil -> ", profilePicture)
    }, [profilePicture])

    const { getRootProps, getInputProps, isDragActive } = dropzone;

    return (
        <>
            {!profilePicture ?

                <div {...getRootProps({ className: "dropzone" })}
                    ref={refLabelZoneArea}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className="w-[140px] h-[140px] flex justify-center items-center border-[3px] border-[#13384d] 
                 hover:bg-[#13384d16] text-white text-[10px] rounded-full border-dashed text-center">
                    {isDragActive ? (<h2>solte o arquivo</h2>) : (<h2>arraste e solte a foto do perfil</h2>)}
                </div>
                : <img src={URL.createObjectURL(profilePicture)} className=" w-[140px] h-[140px] object-cover rounded-full border-[3px] border-white" />
            }

            <input {...getInputProps()} type="file" className="hidden" />

        </>
    )
}

export default UploadProfileFile;