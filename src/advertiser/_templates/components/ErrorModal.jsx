import { Error } from '@mui/icons-material';

function ErrorModal({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <Error className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="mt-3">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Erro!
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                {message}
                            </p>
                        </div>
                    </div>
                    <div className="mt-5">
                        <button
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorModal; 