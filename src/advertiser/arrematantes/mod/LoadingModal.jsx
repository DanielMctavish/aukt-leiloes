/* eslint-disable react/prop-types */


function LoadingModal({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
                <p className="text-lg font-bold">Cartela sendo criada...</p>
            </div>
        </div>
    );
}

export default LoadingModal;