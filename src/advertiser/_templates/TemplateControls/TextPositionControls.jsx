import { KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

function TextPositionControls({ text, onPositionChange }) {
    const step = 5; // Porcentagem de movimento por clique

    const handleMove = (direction) => {
        const newPosition = { ...text.position };
        
        switch(direction) {
            case 'up':
                newPosition.top = `${parseInt(text.position.top) - step}%`;
                break;
            case 'down':
                newPosition.top = `${parseInt(text.position.top) + step}%`;
                break;
            case 'left':
                newPosition.left = `${parseInt(text.position.left) - step}%`;
                break;
            case 'right':
                newPosition.left = `${parseInt(text.position.left) + step}%`;
                break;
        }

        onPositionChange(text.id, newPosition);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Posição do Texto {text.id}
            </label>
            <div className="flex flex-col items-center gap-1">
                <button
                    onClick={() => handleMove('up')}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <KeyboardArrowUp />
                </button>
                <div className="flex gap-1">
                    <button
                        onClick={() => handleMove('left')}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        <KeyboardArrowLeft />
                    </button>
                    <div className="w-16 h-16 border border-gray-300 rounded flex items-center justify-center text-sm">
                        Área {text.id}
                    </div>
                    <button
                        onClick={() => handleMove('right')}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        <KeyboardArrowRight />
                    </button>
                </div>
                <button
                    onClick={() => handleMove('down')}
                    className="p-1 hover:bg-gray-200 rounded"
                >
                    <KeyboardArrowDown />
                </button>
            </div>
        </div>
    );
}

export default TextPositionControls;
