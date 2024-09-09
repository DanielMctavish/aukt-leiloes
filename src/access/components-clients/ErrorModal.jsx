/* eslint-disable react/prop-types */
import { useEffect } from "react";

function ErrorModal({ missingFields, clearErrors }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            clearErrors();
        }, 3000);

        return () => clearTimeout(timer);
    }, [missingFields, clearErrors]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-lg">
            <div className="bg-[#e3e3e3] p-4 rounded shadow-lg">
                <span className="text-[#105b34] font-bold">Campos obrigatórios:</span>
                <ul>
                    {missingFields.map((field, index) => (
                        <li key={index} className="text-red-500">{field}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ErrorModal;