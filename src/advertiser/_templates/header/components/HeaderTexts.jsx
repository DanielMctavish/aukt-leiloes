/* eslint-disable react/prop-types */

function HeaderTexts({ 
    texts, 
    editingText, 
    handleTextDoubleClick, 
    handleTextChange, 
    setEditingText,
    handleMouseDown 
}) {
    const getTitleSize = (size) => {
        switch(size) {
            case '2x': return 'text-[80px]';
            case '3x': return 'text-[100px]';
            default: return 'text-[60px]';
        }
    };

    const renderText = (text) => {
        if (editingText?.id === text.id) {
            return (
                <div className="relative">
                    <input
                        type="text"
                        name="title"
                        defaultValue={text.title}
                        className="text-[60px] font-bold w-full bg-transparent border-b border-white"
                        onChange={(e) => handleTextChange(e, text)}
                        autoFocus
                    />
                    <textarea
                        name="content"
                        defaultValue={text.content}
                        className="w-full bg-transparent border-b border-white mt-2"
                        onChange={(e) => handleTextChange(e, text)}
                    />
                    <button
                        onClick={() => setEditingText(null)}
                        className="absolute top-0 right-0 text-white bg-[#131313] px-2 py-1 rounded text-sm"
                    >
                        confirmar
                    </button>
                </div>
            );
        }

        return (
            <div
                className="cursor-move"
                onMouseDown={(e) => handleMouseDown(e, text)}
            >
                <h1
                    className={`${getTitleSize(text.style?.titleSize)} font-bold select-none`}
                    style={{
                        backgroundColor: text.style?.titleBackground || 'transparent',
                        color: text.style?.titleColor || 'white',
                        padding: text.style?.titleBackground !== 'transparent' ? '0.5rem' : '0',
                        borderRadius: text.style?.titleBorderRadius || '0px'
                    }}
                    onDoubleClick={() => handleTextDoubleClick(text)}
                >
                    {text.title}
                </h1>
                <p
                    className="select-none"
                    style={{ color: text.style?.contentColor || 'white' }}
                    onDoubleClick={() => handleTextDoubleClick(text)}
                >
                    {text.content}
                </p>
            </div>
        );
    };

    if (!texts) return null;

    return (
        <section className='absolute inset-0 z-20'>
            {texts.map((text) => {
                if (!text || text.visible === false) return null;
                
                return (
                    <div
                        key={text.id}
                        className='text-white'
                        style={{
                            position: 'absolute',
                            top: text.position?.top || '50%',
                            left: text.position?.left || '50%',
                            width: text.position?.width || '30vw'
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