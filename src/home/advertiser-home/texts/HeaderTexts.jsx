/* eslint-disable react/prop-types */
function HeaderTexts({ texts }) {
    const getTitleSize = (size) => {
        const cleanSize = size?.replace('px', '');
        
        switch(cleanSize) {
            case '2x': return 'text-[80px]';
            case '3x': return 'text-[100px]';
            case '1x': return 'text-[60px]';
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
                            top: text.positionTop,
                            left: text.positionLeft,
                            width: text.positionWidth
                        }}
                    >
                        <div>
                            <h1
                                className={`${getTitleSize(text.titleSize)} font-bold select-none`}
                                style={{
                                    backgroundColor: text.titleBackground,
                                    color: text.titleColor,
                                    padding: text.titleBackground !== 'transparent' ? '0.5rem' : '0',
                                    borderRadius: text.titleBorderRadius
                                }}
                            >
                                {text.title}
                            </h1>
                            <p
                                className="select-none"
                                style={{ color: text.contentColor }}
                            >
                                {text.content}
                            </p>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

export default HeaderTexts; 