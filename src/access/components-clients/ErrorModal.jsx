import { motion } from "framer-motion";
import { Close, ErrorOutline } from "@mui/icons-material";

function ErrorModal({ missingFields, clearErrors }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-[999] p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && clearErrors()}
        >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            
            <motion.div 
                className="bg-white rounded-xl p-5 max-w-sm w-full mx-auto shadow-2xl relative z-10"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
            >
                <div className="flex items-start mb-4">
                    <div className="p-2 bg-red-100 rounded-full mr-3">
                        <ErrorOutline className="text-red-600" fontSize="medium" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">Campos obrigatórios</h2>
                        <p className="text-gray-600 text-sm mt-1">Por favor, preencha os seguintes campos:</p>
                    </div>
                    <button 
                        onClick={clearErrors} 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Fechar"
                    >
                        <Close className="text-gray-500" fontSize="small" />
                    </button>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 mb-5">
                    <ul className="space-y-2">
                        {missingFields.map((field, index) => (
                            <li key={index} className="text-red-700 flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                                {field}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <button
                    onClick={clearErrors}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors
                        font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] 
                        transition-all duration-200"
                >
                    Entendi
                </button>
            </motion.div>
        </motion.div>
    );
}

export default ErrorModal;