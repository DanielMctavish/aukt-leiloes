import { useDispatch } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { useRef } from "react";

function DisplayTermsConditions() {
    const refTermsConditions = useRef()
    const dispatch = useDispatch()
    const handleDispatchTermsConditions = () => {
        dispatch(addAuct({ terms_conditions: refTermsConditions.current.value }))
    }

    return (
        <div className="w-full h-[100%] bg-white
        hover:z-[77] hover:scale-[1.02] transition-[1s] 
        rounded-md shadow-2xl shadow-[#00000039] p-3 relative">
            <h2 className="font-bold">termos e condições</h2>
            <textarea ref={refTermsConditions} onChange={handleDispatchTermsConditions} className="w-full h-[90%] rounded-md p-3 bg-[#e1e1e1] text-zinc-800"></textarea>
        </div>
    )

}

export default DisplayTermsConditions;



