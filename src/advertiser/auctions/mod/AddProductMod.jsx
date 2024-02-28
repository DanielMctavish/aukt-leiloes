import { Close } from "@mui/icons-material"
import { useState } from "react";

function AddProductMod() {
    const [photos, setPhotos] = useState(["photo1", "photo2", "photo3"])


    const handleCloseThisWindow = () => {

    }

    const handleDeleteThisImage = () => {

        setPhotos(photos.filter(photo => photo !== "photo1"))

    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center w-[80%] h-[80vh] bg-white rounded-md shadow-lg shadow-[#0f0f0f50] relative">

            <span
                onClick={handleCloseThisWindow}
                className="absolute top-1 right-1 text-zinc-800 cursor-pointer">
                <Close />
            </span>

            {/* DRAG AND DROP AREA */}
            <div className="w-[80%] h-[50%]
            flex justify-center items-center 
            border-[3px] border-[#13384d]
            hover:bg-[#13384d16]
            text-zinc-400 
            cursor-grabbing
            rounded-2xl border-dashed">
                <h2>arraste e solte as fotos do produto aqui</h2>
            </div>
            {/* ALL PHOTOS ADDED DISPLAY */}
            <div className="w-[80%] flex justify-start items-center gap-2">
                {
                    photos.map((photo, index) => {
                        return (
                            <div key={index} className="w-[100px] h-[100px] flex justify-center items-center relative">
                                <span
                                    onClick={() => { handleDeleteThisImage() }}
                                    className="absolute top-1 right-1 text-white cursor-pointer">
                                    <Close />
                                </span>
                                <img src={photo} alt=""
                                    className="w-[100px] h-[100px] bg-[#2a87af53] object-cover rounded-md" />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default AddProductMod;