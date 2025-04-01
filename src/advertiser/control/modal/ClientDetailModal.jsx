import { Close } from "@mui/icons-material"
import { useRef } from "react";

function ClientDetailModal() {

    const mainWindoRef = useRef()

    const handleCloseCurrentWindow = () => {
        mainWindoRef.current.style.display = 'none'
        mainWindoRef.current.style.opacity = 0
    }

    return (
        <div ref={mainWindoRef} className="hidden w-[80%] h-[80%] bg-white absolute
        shadow-lg shadow-[#11111142] rounded-md">
            <span onClick={handleCloseCurrentWindow} className="absolute text-[#2d2d2d] top-1 right-1 cursor-pointer">
                <Close />
            </span>

        </div>
    )
}

export default ClientDetailModal;