/* eslint-disable react/prop-types */

// Componente para mostrar a lista de lances
const BidsList = ({ showBids, children }) => {
    return (
        <div className={`
            fixed right-0 top-0 h-full
            w-[400px]
            transform transition-all duration-300 ease-in-out
            ${showBids ? 'translate-x-0' : 'translate-x-[100%]'}
            z-20 bg-white shadow-2xl
        `}>
            {children}
        </div>
    );
};

export default BidsList; 