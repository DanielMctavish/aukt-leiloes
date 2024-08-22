/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { useEffect, useRef, useState } from "react";
import { CreditCard, PixOutlined, Article } from "@mui/icons-material";

function DisplayMethodsPayments({ currentAuct }) {
    const stateTheme = useSelector(state => state.theme)
    const [methodsPayments, setMethodsPayments] = useState([]);
    const dispatch = useDispatch();

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        if (methodsPayments.includes(value)) {
            setMethodsPayments(methodsPayments.filter((method) => method !== value));
        } else {
            setMethodsPayments([...methodsPayments, value]);
        }
    };

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

    useEffect(() => {
        if (currentAuct) {
            setMethodsPayments(currentAuct.methods_payments);
            dispatch(addAuct({ methods_payments: currentAuct.methods_payments }));
        }
    }, []);

    useEffect(() => {
        dispatch(addAuct({ methods_payments: methodsPayments }));
    }, [methodsPayments]);

    return (
        <div ref={refMain} className="w-full sm:w-1/3 h-full bg-white hover:z-50 hover:scale-105 transition-transform 
        duration-300 ease-in-out flex flex-col justify-around items-start overflow-y-auto rounded-lg shadow-2xl p-6 relative">
            <h2 className="font-bold text-xl mb-2 w-[300px]">Selecione os métodos de pagamento aceitos</h2>
            <div className="flex w-full flex-wrap justify-start items-center gap-4 text-white">
                <label className={`inline-flex items-center mr-4 gap-2 p-2 rounded-md cursor-pointer
                    ${methodsPayments.includes("Pix") ? 'bg-[#03243a]' : 'bg-[#232323]'} transition duration-150 ease-in-out`}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Pix"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 hidden"
                    />
                    <span className="ml-2">Pix</span>
                    <PixOutlined />
                </label>

                <label className={`inline-flex items-center mr-4 gap-2 p-2 rounded-md cursor-pointer 
                    ${methodsPayments.includes("Credit") ? 'bg-[#03243a]' : 'bg-[#232323]'} transition duration-150 ease-in-out`}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Credit"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 hidden"
                    />
                    <span className="ml-2">Crédito</span>
                    <CreditCard />
                </label>

                <label className={`inline-flex items-center mr-4 gap-2 p-2 rounded-md ${methodsPayments.includes("Debit") ?
                    'bg-[#03243a]' : 'bg-[#232323]'} transition duration-150 ease-in-out cursor-pointer`}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Debit"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 hidden"
                    />
                    <span className="ml-2">Débito</span>
                    <CreditCard />
                </label>

                <label className={`inline-flex cursor-pointer items-center mr-4 gap-2 p-2 rounded-md ${methodsPayments.includes("Ticket") ?
                    'bg-[#03243a]' : 'bg-[#232323]'} transition duration-150 ease-in-out`}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Ticket"
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 hidden"
                    />
                    <span className="ml-2">Boleto</span>
                    <Article />
                </label>
            </div>
        </div>
    );
}

export default DisplayMethodsPayments;
