/* eslint-disable react/prop-types */
import { KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

function TextPositionControls({ text, onPositionChange, label }) {
    const step = 5; // Porcentagem de movimento por clique

    // Função para formatar os valores percentuais
    const formatPosition = (value) => {
        if (!value) return '0%';
        const numValue = parseFloat(value);
        return isNaN(numValue) ? '0%' : `${Math.round(numValue)}%`;
    };

    const handleMove = (direction) => {
        const newPosition = { ...text.position };
        const currentTop = parseInt(text.position.top) || 0;
        const currentLeft = parseInt(text.position.left) || 0;
        
        switch(direction) {
            case 'up':
                newPosition.top = `${Math.max(0, currentTop - step)}%`;
                break;
            case 'down':
                newPosition.top = `${Math.min(100, currentTop + step)}%`;
                break;
            case 'left':
                newPosition.left = `${Math.max(0, currentLeft - step)}%`;
                break;
            case 'right':
                newPosition.left = `${Math.min(100, currentLeft + step)}%`;
                break;
            default:
                break;
        }

        onPositionChange(text.id, newPosition);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label || 'Posição do Elemento'}
            </label>
            <div className="flex flex-col items-center gap-1">
                <button
                    onClick={() => handleMove('up')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Mover para cima"
                >
                    <KeyboardArrowUp />
                </button>
                <div className="flex gap-1">
                    <button
                        onClick={() => handleMove('left')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Mover para esquerda"
                    >
                        <KeyboardArrowLeft />
                    </button>
                    <div className="w-16 h-16 border border-gray-300 rounded flex items-center justify-center text-sm bg-white">
                        <span className="text-gray-500">Mover</span>
                    </div>
                    <button
                        onClick={() => handleMove('right')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Mover para direita"
                    >
                        <KeyboardArrowRight />
                    </button>
                </div>
                <button
                    onClick={() => handleMove('down')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Mover para baixo"
                >
                    <KeyboardArrowDown />
                </button>
            </div>

            {/* Valores atuais com formatação */}
            <div className="mt-2 text-xs text-gray-500 flex justify-between px-2">
                <span>X: {formatPosition(text.position.left)}</span>
                <span>Y: {formatPosition(text.position.top)}</span>
            </div>
        </div>
    );
}

export default TextPositionControls;
