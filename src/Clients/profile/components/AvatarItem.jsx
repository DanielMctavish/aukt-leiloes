import { memo, useState } from 'react';
import PropTypes from 'prop-types';

// Componente de Avatar otimizado
const AvatarItem = ({ avatar, index, isSelected, onSelect }) => {
    const [isLoading, setIsLoading] = useState(true);
    
    return (
        <div
            onClick={onSelect}
            className={`
                relative cursor-pointer transition-all duration-200
                ${isSelected
                    ? 'ring-2 ring-green-500 scale-105 z-10'
                    : 'ring-1 ring-gray-200 hover:ring-green-400'
                }
                rounded-lg overflow-hidden
                hover:shadow-md hover:scale-105
                active:scale-95
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                bg-gray-100
            `}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                </div>
            )}
            
            <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
            />

            {isSelected && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

AvatarItem.propTypes = {
    avatar: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
};

// Aplicamos o memo para otimização
export default memo(AvatarItem); 