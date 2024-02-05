import { useDispatch } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { useRef } from "react";

function DisplayMethodsPayments() {
    const refMethodsPayments = useRef()
    const dispatch = useDispatch()
    const handleDispatchMethodsPayments = () => {
        dispatch(addAuct({ methods_payments: refMethodsPayments.current.value }))
    }

    return (
        <div className="w-[33%] h-[100%] bg-white 
        hover:z-[77] hover:scale-[1.02] transition-[1s]
        flex flex-col justify-around items-start
        rounded-md shadow-2xl shadow-[#00000039] p-3 relative">

            <h2 className="font-bold">Métodos de pagamento aceitos</h2>
            <span className="text-[14px]">forma de pagamento</span>

            <select ref={refMethodsPayments} onChange={handleDispatchMethodsPayments} className="bg-transparent p-3 border-[1px] border-zinc-400 w-[70%]">
                <option value="">selecione</option>
                <option value="all">todos</option>
                <option value="pix">pix</option>
                <option value="credit">crédito</option>
                <option value="debit">débito</option>
                <option value="ticket">boleto</option>
            </select>
        </div>
    )
}

export default DisplayMethodsPayments;