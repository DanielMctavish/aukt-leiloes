import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, Error, Close } from '@mui/icons-material';

const SpanTemplateControl = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg 
            transition-all duration-300 transform translate-y-0 z-50
            ${type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {type === 'success' ? (
                <CheckCircle className="text-green-600" />
            ) : (
                <Error className="text-red-600" />
            )}
            <span className="font-medium">{message}</span>
            <button 
                onClick={onClose}
                className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
                <Close className="text-sm" />
            </button>
        </div>
    );
};

SpanTemplateControl.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error']).isRequired,
    onClose: PropTypes.func.isRequired
};

export default SpanTemplateControl;