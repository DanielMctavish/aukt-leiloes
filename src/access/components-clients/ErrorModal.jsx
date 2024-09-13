import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";

function ErrorModal({ missingFields, clearErrors }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-red-600">Campos Faltando</h2>
                    <button onClick={clearErrors} className="text-gray-500 hover:text-gray-700">
                        <Close />
                    </button>
                </div>
                <p className="text-gray-700 mb-4">Por favor, preencha os seguintes campos:</p>
                <ul className="list-disc pl-5 mb-4">
                    {missingFields.map((field, index) => (
                        <li key={index} className="text-gray-600">{field}</li>
                    ))}
                </ul>
                <button
                    onClick={clearErrors}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Entendi
                </button>
            </div>
        </motion.div>
    );
}

export default ErrorModal;