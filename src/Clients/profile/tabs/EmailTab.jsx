import PropTypes from 'prop-types';

function EmailTab({ currentEmail }) {
    return (
        <div className="max-w-md">
            <p className="text-gray-600 mb-6">
                O email é seu principal meio de acesso à plataforma. Certifique-se de manter um email válido e que você tenha acesso.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 text-sm">Email atual</p>
                        <p className="text-gray-800 font-medium">{currentEmail}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Em breve</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            A alteração de email será implementada em breve com verificação 
                            por código de segurança enviado por email. Contate o suporte 
                            se precisar alterar seu email.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

EmailTab.propTypes = {
    currentEmail: PropTypes.string.isRequired
};

export default EmailTab; 