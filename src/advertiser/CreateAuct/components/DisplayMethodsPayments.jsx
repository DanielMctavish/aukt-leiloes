/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { useEffect, useState } from "react";

function DisplayMethodsPayments({ currentAuct }) {
    const [methodsPayments, setMethodsPayments] = useState([]);
    const dispatch = useDispatch()

    const handleCheckboxChange = (event) => {

        const { value } = event.target;
        if (methodsPayments.includes(value)) {
            setMethodsPayments(methodsPayments.filter(method => method !== value));
        } else {
            setMethodsPayments([...methodsPayments, value]);
        }

    }

    useEffect(()=>{
        if(currentAuct){
            setMethodsPayments(currentAuct.methods_payments)
            dispatch(addAuct({ methods_payments: currentAuct.methods_payments }))
        }
    },[])

    useEffect(() => {

        dispatch(addAuct({ methods_payments: methodsPayments }))

    }, [methodsPayments])

    return (
        <div className="w-[33%] h-[100%] bg-white 
        hover:z-[77] hover:scale-[1.02] transition-[1s]
        flex flex-col justify-around items-start overflow-y-auto
        rounded-md shadow-2xl shadow-[#00000039] p-3 relative">

            <h2 className="font-bold">Métodos de pagamento aceitos</h2>
            <span className="text-[14px]">forma de pagamento</span>

            <div className="flex w-full flex-wrap justify-between items-center gap-2">

                <label className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        name="method"
                        value="Pix"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-zinc-600"
                    />
                    <span className="ml-2 text-gray-700">Pix</span>
                </label>

                <label className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        name="method"
                        value="Credit"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-zinc-600"
                    />
                    <span className="ml-2 text-gray-700">Crédito</span>
                </label>

                <label className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        name="method"
                        value="Debit"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-zinc-600"
                    />
                    <span className="ml-2 text-gray-700">Débito</span>
                </label>

                <label className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        name="method"
                        value="Ticket"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-zinc-600"
                    />
                    <span className="ml-2 text-gray-700">Boleto</span>
                </label>

            </div>

        </div>
    )
}

export default DisplayMethodsPayments;