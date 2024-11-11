/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { useEffect, useRef } from "react";
import { Gavel } from "@mui/icons-material";

function DisplayTermsConditions({ currentAuct }) {
    const stateTheme = useSelector(state => state.theme)
    const refTermsConditions = useRef()
    const dispatch = useDispatch()

    const refMain = useRef()

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            refMain.current.style.background = "#2d2d2d"
            refMain.current.style.color = "#efefef"
            refTermsConditions.current.style.background = "#404040"
            refTermsConditions.current.style.color = "#dcdcdc"
        } else {
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
            refTermsConditions.current.style.background = "#e1e1e1"
            refTermsConditions.current.style.color = "#202020"
        }
    }, [stateTheme])

    const handleDispatchTermsConditions = (e) => {
        const newTerms = e.target.value;
        dispatch(addAuct({ terms_conditions: newTerms }));
    }

    return (
        <div ref={refMain} className="w-full h-[100%] bg-white rounded-lg p-4
            hover:z-[77] hover:scale-[1.02] transition-all duration-300 ease-in-out
            shadow-xl shadow-[#00000020] overflow-hidden">
            <h2 className="font-bold text-xl flex items-center gap-2 mb-4">
                <Gavel className="text-blue-600" />
                Termos e Condições
            </h2>
            <textarea 
                ref={refTermsConditions} 
                onChange={handleDispatchTermsConditions}
                placeholder="Digite aqui os termos e condições do leilão..."
                className="w-full h-[calc(100%-3rem)] rounded-lg p-4 
                bg-gray-50 text-gray-800 resize-none
                border border-gray-200 focus:border-blue-500
                focus:ring-2 focus:ring-blue-500 outline-none
                transition-all duration-300 ease-in-out
                overflow-y-auto"
            />
        </div>
    )
}

export default DisplayTermsConditions;



