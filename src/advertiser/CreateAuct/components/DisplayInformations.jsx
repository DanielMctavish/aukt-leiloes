/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { Description } from "@mui/icons-material";

function DisplayInformations() {
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


    const handleDispatchInformations = (e) => {
        const newInfo = e.target.value;
        dispatch(addAuct({ descriptions_informations: newInfo }));
    }

    return (
        <div ref={refMain} className="w-full h-[100%] bg-white rounded-lg p-4
            hover:z-[77] hover:scale-[1.02] transition-all duration-300 ease-in-out
            shadow-xl shadow-[#00000020] overflow-hidden">
            <h2 className="font-bold text-xl flex items-center gap-2 mb-4">
                <Description className="text-blue-600" />
                Descrições e Informações
            </h2>
            <textarea 
                onChange={handleDispatchInformations} 
                ref={refInformations}
                placeholder="Digite aqui as informações detalhadas do leilão..."
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

export default DisplayInformations;