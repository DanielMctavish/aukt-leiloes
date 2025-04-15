import { memo } from 'react';
import PropTypes from 'prop-types';

// Componente de Input otimizado
const InputField = ({ label, value, onChange, placeholder, type = "text", disabled = false, onKeyDown }) => (
    <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onKeyDown={onKeyDown}
            className={`w-full px-3 py-2 rounded-lg border 
                ${disabled 
                    ? 'bg-gray-100 border-gray-200 text-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                }
                transition-all duration-200`}
            placeholder={placeholder}
        />
    </div>
);

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    onKeyDown: PropTypes.func
};

InputField.defaultProps = {
    type: "text",
    placeholder: "",
    disabled: false,
    onKeyDown: () => {} // Função vazia como padrão
};

// Aplicamos o memo para otimização
export default memo(InputField); 