import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function DisplayLimitations() {
    const stateTheme = useSelector(state => state.theme)

    const refMain = useRef()

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            console.log("ligado")
            refMain.current.style.background = "#2d2d2d"
            refMain.current.style.color = "#efefef"
        } else {
            console.log("desligado")
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
        }

    }, [stateTheme])

    return (
        <div ref={refMain} className="w-[33%] h-[100%] bg-white
        hover:z-[77] hover:scale-[1.02] transition-[1s] 
        rounded-md shadow-2xl shadow-[#00000039] 
        p-3 relative flex flex-col justify-around">
            <h2 className="font-bold">Limitações</h2>
            <span className="text-[14px]">limitar participantes</span>
            <input type="number" className="bg-transparent p-3 border-[1px] border-zinc-400 w-[70%]" />
        </div>
    )
}

export default DisplayLimitations;