/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";
import { useEffect, useRef, useState } from "react";
import { CreditCard, PixOutlined, Article, Payments } from "@mui/icons-material";


function DisplayMethodsPayments() {
    const stateTheme = useSelector(state => state.theme)
    const [methodsPayments, setMethodsPayments] = useState([]);
    const dispatch = useDispatch();
    const refMain = useRef()

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            refMain.current.style.background = "#2d2d2d"
            refMain.current.style.color = "#efefef"
        } else {
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
        }
    }, [stateTheme])

 

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        let newMethods;
        if (methodsPayments.includes(value)) {
            newMethods = methodsPayments.filter((method) => method !== value);
        } else {
            newMethods = [...methodsPayments, value];
        }
        setMethodsPayments(newMethods);
        dispatch(addAuct({ methods_payments: newMethods }));
    };

    return (
        <div ref={refMain} className="w-full sm:w-1/3 h-full bg-white rounded-lg p-6
            hover:scale-[1.02] transition-all duration-300 ease-in-out overflow-y-auto
            shadow-xl shadow-[#00000020] flex flex-col justify-start gap-6">
            <h2 className="font-bold text-xl flex items-center gap-2">
                <Payments className="text-[#012038]" />
                Métodos de Pagamento
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <label className={`
                    flex items-center gap-3 p-4 rounded-lg cursor-pointer
                    border-2 transition-all duration-200 ease-in-out
                    ${methodsPayments.includes("Pix") 
                        ? 'border-[#012038] bg-[#012038] text-white' 
                        : 'border-gray-200 hover:border-[#012038] text-gray-700'}
                `}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Pix"
                        onChange={handleCheckboxChange}
                        className="hidden"
                    />
                    <PixOutlined className={methodsPayments.includes("Pix") ? 'text-white' : 'text-[#012038]'} />
                    <span className="font-medium">Pix</span>
                </label>

                <label className={`
                    flex items-center gap-3 p-4 rounded-lg cursor-pointer
                    border-2 transition-all duration-200 ease-in-out
                    ${methodsPayments.includes("Credit") 
                        ? 'border-[#012038] bg-[#012038] text-white' 
                        : 'border-gray-200 hover:border-[#012038] text-gray-700'}
                `}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Credit"
                        onChange={handleCheckboxChange}
                        className="hidden"
                    />
                    <CreditCard className={methodsPayments.includes("Credit") ? 'text-white' : 'text-[#012038]'} />
                    <span className="font-medium">Crédito</span>
                </label>

                <label className={`
                    flex items-center gap-3 p-4 rounded-lg cursor-pointer
                    border-2 transition-all duration-200 ease-in-out
                    ${methodsPayments.includes("Debit") 
                        ? 'border-[#012038] bg-[#012038] text-white' 
                        : 'border-gray-200 hover:border-[#012038] text-gray-700'}
                `}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Debit"
                        onChange={handleCheckboxChange}
                        className="hidden"
                    />
                    <CreditCard className={methodsPayments.includes("Debit") ? 'text-white' : 'text-[#012038]'} />
                    <span className="font-medium">Débito</span>
                </label>

                <label className={`
                    flex items-center gap-3 p-4 rounded-lg cursor-pointer
                    border-2 transition-all duration-200 ease-in-out
                    ${methodsPayments.includes("Ticket") 
                        ? 'border-[#012038] bg-[#012038] text-white' 
                        : 'border-gray-200 hover:border-[#012038] text-gray-700'}
                `}>
                    <input
                        type="checkbox"
                        name="method"
                        value="Ticket"
                        onChange={handleCheckboxChange}
                        className="hidden"
                    />
                    <Article className={methodsPayments.includes("Ticket") ? 'text-white' : 'text-[#012038]'} />
                    <span className="font-medium">Boleto</span>
                </label>
            </div>
        </div>
    );
}

export default DisplayMethodsPayments;
