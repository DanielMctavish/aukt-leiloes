import React from 'react';

function HeaderTexts({ texts, fontStyle }) {
    const getTitleSize = (size) => {
        switch(size) {
            case '2x': return 'text-[80px]';
            case '3x': return 'text-[100px]';
            case '1xpx': return 'text-[60px]';
            default: return 'text-[60px]';
        }
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
                            top: text.positionTop || '0',
                            left: text.positionLeft || '0',
                            width: text.positionWidth || 'auto',
                            fontFamily: fontStyle
                        }}
                    >
                        <h1 
                            className={`${getTitleSize(text.titleSize)} font-bold select-none`}
                            style={{
                                color: text.titleColor || 'white'
                            }}
                        >
                            {text.title}
                        </h1>
                        <p 
                            className="select-none"
                            style={{ color: text.contentColor || 'white' }}
                        >
                            {text.content}
                        </p>
                    </div>
                );
            })}
        </section>
    );
}

export default HeaderTexts; 