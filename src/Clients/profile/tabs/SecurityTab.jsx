import PropTypes from 'prop-types';
import InputField from '../components/InputField';

function SecurityTab({ 
    passwordChangeStep, 
    currentPassword, 
    newPassword, 
    confirmPassword, 
    passwordError, 
    passwordAttempts,
    handleCurrentPasswordChange, 
    handleNewPasswordChange, 
    handleConfirmPasswordChange,
    verifyCurrentPassword, 
    handlePasswordSave, 
    resetPasswordFlow,
    isLoading,
    isAuthenticating
}) {
    return (
        <div className="max-w-md">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Alterar sua senha requer autenticação. Proteja suas informações utilizando uma senha forte.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Exibir mensagem de erro, se houver */}
            {passwordError && (
                <div className={`border-l-4 p-3 mb-4 rounded-r-lg ${
                    passwordError.includes('última tentativa') || passwordError.includes('Excedido') 
                        ? 'bg-red-100 border-red-600' 
                        : 'bg-red-50 border-red-400'
                }`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className={`h-5 w-5 ${
                                passwordError.includes('última tentativa') || passwordError.includes('Excedido')
                                    ? 'text-red-600'
                                    : 'text-red-400'
                            }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className={`text-sm ${
                                passwordError.includes('última tentativa') || passwordError.includes('Excedido')
                                    ? 'text-red-800 font-medium'
                                    : 'text-red-600'
                            }`}>{passwordError}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Etapa 1: Verificar senha atual */}
            {passwordChangeStep === 'current' && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Verificação de Segurança</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Por favor, digite sua senha atual para continuar com a alteração.
                    </p>
                    
                    {passwordAttempts > 0 && (
                        <div className="mb-4 flex items-center">
                            <p className="text-sm text-gray-600 mr-2">Tentativas restantes:</p>
                            <div className="flex space-x-1">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div 
                                        key={index}
                                        className={`w-2 h-6 rounded-sm ${
                                            index < 3 - passwordAttempts 
                                                ? 'bg-red-500'
                                                : 'bg-green-500'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <InputField
                        label="Senha Atual"
                        value={currentPassword}
                        onChange={handleCurrentPasswordChange}
                        type="password"
                        placeholder="Digite sua senha atual"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                verifyCurrentPassword();
                            }
                        }}
                    />
                    
                    <button
                        onClick={verifyCurrentPassword}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg
                            hover:bg-green-600 active:scale-[0.98] transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAuthenticating}
                    >
                        {isAuthenticating ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verificando...
                            </span>
                        ) : "Continuar"}
                    </button>
                </div>
            )}
            
            {/* Etapa 2: Digitar nova senha */}
            {passwordChangeStep === 'new' && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Criar Nova Senha</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Digite e confirme sua nova senha. Use pelo menos 6 caracteres e combine letras e números.
                    </p>
                    
                    <InputField
                        label="Nova Senha"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        type="password"
                        placeholder="Digite sua nova senha"
                    />
                    
                    <InputField
                        label="Confirmar Nova Senha"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        type="password"
                        placeholder="Confirme sua nova senha"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                                e.preventDefault();
                                handlePasswordSave();
                            }
                        }}
                    />
                    
                    <div className="flex gap-3">
                        <button
                            onClick={handlePasswordSave}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg
                                hover:bg-green-600 active:scale-[0.98] transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Salvando...
                                </span>
                            ) : "Salvar Nova Senha"}
                        </button>
                        
                        <button
                            onClick={resetPasswordFlow}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg
                                hover:bg-gray-300 active:scale-[0.98] transition-all duration-200"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            
            {/* Etapa 3: Sucesso */}
            {passwordChangeStep === 'success' && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg animate-fadeIn">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                                Senha alterada com sucesso!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

SecurityTab.propTypes = {
    passwordChangeStep: PropTypes.string.isRequired,
    currentPassword: PropTypes.string.isRequired,
    newPassword: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    passwordError: PropTypes.string.isRequired,
    passwordAttempts: PropTypes.number.isRequired,
    handleCurrentPasswordChange: PropTypes.func.isRequired,
    handleNewPasswordChange: PropTypes.func.isRequired,
    handleConfirmPasswordChange: PropTypes.func.isRequired,
    verifyCurrentPassword: PropTypes.func.isRequired,
    handlePasswordSave: PropTypes.func.isRequired,
    resetPasswordFlow: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isAuthenticating: PropTypes.bool.isRequired
};

export default SecurityTab; 