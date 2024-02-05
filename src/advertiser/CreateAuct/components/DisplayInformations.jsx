import { useRef } from "react";
import { useDispatch } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";

function DisplayInformations(){
    const refInformations = useRef()
    const dispatch = useDispatch()

    const handleDispatchInformations = ()=>{
        dispatch(addAuct({ descriptions_informations: refInformations.current.value }))
    }

    return(
        <div className="w-[33%] h-[100%] bg-white rounded-md
        hover:z-[77] hover:scale-[1.02] transition-[1s] 
        shadow-2xl shadow-[#00000039] p-3">
            <h2 className="font-bold">descrições e informações</h2>
            <textarea onChange={handleDispatchInformations} ref={refInformations} className="w-full h-[90%] rounded-md p-3 bg-[#e1e1e1] text-zinc-800"></textarea>
        </div>
    )
}

export default DisplayInformations;