/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHeaderText } from '../../../../features/template/HeaderSlice';

function HeaderTexts({ texts, handleMouseDown }) {
    const dispatch = useDispatch();
    const [editingText, setEditingText] = useState(null);
    const [tempText, setTempText] = useState({ title: '', content: '' });
    const { headerData } = useSelector(state => state.header);

    const handleTextDoubleClick = (text) => {
        setEditingText(text);
        setTempText({
            title: text.title,
            content: text.content
        });
    };

    const handleTextChange = (e, field) => {
        setTempText(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleConfirmEdit = () => {
        if (editingText) {
            dispatch(updateHeaderText({
                id: editingText.id,
                updates: {
                    title: tempText.title,
                    content: tempText.content
                }
            }));
            setEditingText(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleConfirmEdit();
        }
        if (e.key === 'Escape') {
            setEditingText(null);
        }
    };

    const handleDragEnd = (text, newPosition) => {
        dispatch(updateHeaderText({
            id: text.id,
            updates: {
                positionTop: newPosition.top,
                positionLeft: newPosition.left
            }
        }));
    };

    const getTextColors = (text) => {
        if (headerData.colorPalette?.toLowerCase() === 'dark') {
            return {
                title: '#ffffff',
                content: '#e2e8f0'
            };
        }
        return {
            title: text.titleColor || 'white',
            content: text.contentColor || 'white'
        };
    };

    const renderText = (text) => {
        const textColors = getTextColors(text);

        if (editingText?.id === text.id) {
            return (
                <div className="relative bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                    <input
                        type="text"
                        value={tempText.title}
                        onChange={(e) => handleTextChange(e, 'title')}
                        onKeyDown={handleKeyDown}
                        className="text-[60px] font-bold w-full bg-transparent border-b border-white/30 
                            focus:border-white outline-none px-2 text-white placeholder-white/50"
                        placeholder="Digite o título..."
                        autoFocus
                    />
                    <textarea
                        value={tempText.content}
                        onChange={(e) => handleTextChange(e, 'content')}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-b border-white/30 focus:border-white 
                            outline-none mt-4 px-2 text-white placeholder-white/50 min-h-[100px] resize-none"
                        placeholder="Digite o conteúdo..."
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            onClick={() => setEditingText(null)}
                            className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 
                                text-white rounded transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmEdit}
                            className="px-3 py-1 text-sm bg-[#036982] hover:bg-[#036982]/90 
                                text-white rounded transition-all duration-200"
                        >
                            Confirmar
                        </button>
                    </div>
                    <div className="mt-2 text-white/60 text-sm">
                        Pressione Ctrl + Enter para salvar ou Esc para cancelar
                    </div>
                </div>
            );
        }

        return (
            <div
                className="cursor-move relative group"
                onMouseDown={(e) => {
                    const onDragEnd = (newPosition) => handleDragEnd(text, newPosition);
                    handleMouseDown(e, text, onDragEnd);
                }}
                onDoubleClick={() => handleTextDoubleClick(text)}
            >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 
                    bg-black/60 text-white/80 text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-200">
                    Duplo clique para editar
                </div>
                <h1
                    className="font-bold select-none"
                    style={{
                        fontSize: text.titleSize || '60px',
                        color: textColors.title,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                >
                    {text.title}
                </h1>
                <p
                    className="select-none mt-2"
                    style={{ 
                        color: textColors.content,
                        fontSize: '16px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                >
                    {text.content}
                </p>
            </div>
        );
    }

    if (!texts) return null;

    return (
        <section className='absolute inset-0 z-20'>
            {texts.map((text) => {
                if (!text) return null;
                
                return (
                    <div
                        key={text.id}
                        className='text-white absolute'
                        style={{
                            top: text.positionTop || '50%',
                            left: text.positionLeft || '50%',
                            transform: 'translate(-50%, -50%)',
                            minWidth: '200px',
                            maxWidth: text.positionWidth || '80%'
                        }}
                    >
                        {renderText(text)}
                    </div>
                );
            })}
        </section>
    );
}

export default HeaderTexts; 