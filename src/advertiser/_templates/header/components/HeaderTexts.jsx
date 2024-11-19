import React from 'react';

function HeaderTexts({ texts, getPositionStyle, renderText }) {
    if (!texts) return null;

    return (
        <section className='absolute inset-0 z-20'>
            {texts.map((text) => (
                text.visible !== false && (
                    <div
                        key={text.id}
                        className='text-white'
                        style={getPositionStyle(text.position)}
                    >
                        {renderText(text)}
                    </div>
                )
            ))}
        </section>
    );
}

export default HeaderTexts; 