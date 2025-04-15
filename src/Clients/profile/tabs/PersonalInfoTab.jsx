import PropTypes from 'prop-types';
import InputField from '../components/InputField';

function PersonalInfoTab({ name, setName, nickname, setNickname, handleEditAccount, isLoading }) {
    return (
        <div className="max-w-md">
            <p className="text-gray-600 mb-6">
                Atualize suas informações pessoais para personalizar sua experiência na plataforma.
            </p>
            
            <InputField
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
            />

            <InputField
                label="Apelido no Pregão"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Seu apelido"
            />
            
            <button
                onClick={handleEditAccount}
                className="mt-3 px-6 py-2.5 bg-green-500 
                    text-white rounded-lg shadow-sm
                    hover:bg-green-600 active:scale-[0.98] 
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    font-medium"
                disabled={isLoading}
            >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
        </div>
    );
}

PersonalInfoTab.propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
    nickname: PropTypes.string.isRequired,
    setNickname: PropTypes.func.isRequired,
    handleEditAccount: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
};

export default PersonalInfoTab; 