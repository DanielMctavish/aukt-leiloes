import PropTypes from 'prop-types';
import AvatarItem from '../components/AvatarItem';

function AvatarTab({ avatares, clientAvatar, handleSelectAvatar, handleEditAccount, isLoading }) {
    return (
        <div>
            <p className="text-gray-600 mb-6">
                Escolha um avatar para representá-lo nos leilões e interações na plataforma.
            </p>
            
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 
                max-h-[400px] overflow-y-auto p-2 sm:p-4 bg-gray-50 rounded-lg
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {avatares.map((avatar, i) => (
                    <AvatarItem
                        key={i}
                        avatar={avatar}
                        index={i}
                        isSelected={clientAvatar === i}
                        onSelect={() => handleSelectAvatar(i)}
                    />
                ))}
            </div>
            
            <button
                onClick={handleEditAccount}
                className="mt-6 px-6 py-2.5 bg-green-500 
                    text-white rounded-lg shadow-sm
                    hover:bg-green-600 active:scale-[0.98] 
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    font-medium"
                disabled={isLoading}
            >
                {isLoading ? "Salvando..." : "Salvar Avatar"}
            </button>
        </div>
    );
}

AvatarTab.propTypes = {
    avatares: PropTypes.array.isRequired,
    clientAvatar: PropTypes.number.isRequired,
    handleSelectAvatar: PropTypes.func.isRequired,
    handleEditAccount: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
};

export default AvatarTab; 