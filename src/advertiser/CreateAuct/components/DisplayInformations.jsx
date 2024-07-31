/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";

function DisplayInformations({ currentAuct }) {
    const stateTheme = useSelector(state => state.theme)
    const refInformations = useRef()
    const dispatch = useDispatch()

    const refMain = useRef()

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            console.log("ligado")
            refMain.current.style.background = "#2d2d2d"
            refInformations.current.style.background = "#404040"
            refInformations.current.style.color = "#dcdcdc"
            refMain.current.style.color = "#efefef"
        } else {
            console.log("desligado")
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
            refInformations.current.style.background = "#e1e1e1"
            refInformations.current.style.color = "#202020"
        }

    }, [stateTheme])

    useEffect(() => {

        if (currentAuct) {
            refInformations.current.value = currentAuct.descriptions_informations
            dispatch(addAuct({ descriptions_informations: currentAuct.descriptions_informations }))
        }

    }, [])

    const handleDispatchInformations = () => {
        dispatch(addAuct({ descriptions_informations: refInformations.current.value }))
    }

    return (
        <div ref={refMain} className="w-full h-[100%] bg-white rounded-md
        hover:z-[77] hover:scale-[1.02] transition-[1s] 
        shadow-2xl shadow-[#00000039] p-3">
            <h2 className="font-bold">descrições e informações</h2>
            <textarea onChange={handleDispatchInformations} ref={refInformations} 
            className="w-full h-[90%] rounded-md p-3 bg-[#e1e1e1] text-zinc-800"></textarea>
        </div>
    )
}

export default DisplayInformations;