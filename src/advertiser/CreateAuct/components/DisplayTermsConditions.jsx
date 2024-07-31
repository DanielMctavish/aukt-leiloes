/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { useEffect, useRef } from "react";

function DisplayTermsConditions({ currentAuct }) {
    const stateTheme = useSelector(state => state.theme)
    const refTermsConditions = useRef()
    const dispatch = useDispatch()

    const refMain = useRef()

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            console.log("ligado")
            refMain.current.style.background = "#2d2d2d"
            refMain.current.style.color = "#efefef"
            refTermsConditions.current.style.background = "#404040"
            refTermsConditions.current.style.color = "#dcdcdc"
        } else {
            console.log("desligado")
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
            refTermsConditions.current.style.background = "#e1e1e1"
            refTermsConditions.current.style.color = "#202020"
        }

    }, [stateTheme])

    useEffect(() => {

        if (currentAuct) {
            refTermsConditions.current.value = currentAuct.terms_conditions
            dispatch(addAuct({ terms_conditions: currentAuct.terms_conditions }))
        }

    }, [])


    const handleDispatchTermsConditions = () => {
        dispatch(addAuct({ terms_conditions: refTermsConditions.current.value }))
    }

    return (
        <div ref={refMain} className="w-full h-[100%] bg-white
        hover:z-[77] hover:scale-[1.02] transition-[1s] 
        rounded-md shadow-2xl shadow-[#00000039] p-3 relative">
            <h2 className="font-bold">termos e condições</h2>
            <textarea ref={refTermsConditions} onChange={handleDispatchTermsConditions}
                className="w-full h-[90%] rounded-md p-3 bg-[#e1e1e1] text-zinc-800"></textarea>
        </div>
    )

}

export default DisplayTermsConditions;



