import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

function AddProductMod() {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
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

    const refLabelZoneArea = useRef();

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

    useEffect(() => {
        console.log('observando files -> ', files);
    }, [files]);

    const handleCloseCurrentWindow = () => {
        const currentProductWindow = document.querySelector(".section-add-product");
        currentProductWindow.style.display = "none";
    };

    const { getRootProps, getInputProps, isDragActive } = dropzone;

    return (
        <div className="flex flex-col gap-2 window-add-product border-[1px] border-[#d2d2d2] justify-center items-center w-[60%] h-[80vh] bg-white rounded-md shadow-lg shadow-[#0f0f0f50] relative z-[99]">
            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-800 cursor-pointer">
                <Close />
            </span>

            {/* DRAG AND DROP AREA */}
            <div {...getRootProps({ className: "dropzone" })}
                ref={refLabelZoneArea}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="w-[80%] h-[50%] flex justify-center items-center border-[3px] border-[#13384d] hover:bg-[#13384d16] text-zinc-400 rounded-2xl border-dashed">
                {isDragActive ? (<h2 className="text-[#29a8c4]">solte o arquivo</h2>) : (<h2>arraste e solte as fotos do produto aqui</h2>)}
            </div>

            <input {...getInputProps()} type="file" className="hidden" />

            {/* ALL PHOTOS ADDED DISPLAY */}
            <div className="w-[80%] flex justify-start items-center gap-2 z-[100]">
                {files.map((file, index) => (
                    <div key={index} className="w-[80px] h-[80px] bg-red-300 rounded-md overflow-hidden flex justify-center">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AddProductMod;
