/* eslint-disable react/prop-types */
function HeaderTexts({ texts, colorPalette }) {
    const getTitleSize = (size) => {
        const cleanSize = size?.replace('px', '');
        
        switch(cleanSize) {
            case '2x': return 'text-[80px]';
            case '3x': return 'text-[100px]';
            case '1x': return 'text-[60px]';
            default: return 'text-[60px]';
        }
    };

    // Função para determinar se deve usar sombra no texto
    const getTextShadowStyle = () => {
        if (colorPalette === 'CLEAN') {
            return { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' };
        }
        return {};
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
                            width: text.positionWidth,
                            ...getTextShadowStyle() // Adiciona sombra se for CLEAN
                        }}
                    >
                        <div>
                            <h1
                                className={`${getTitleSize(text.titleSize)} font-bold select-none`}
                                style={{
                                    backgroundColor: text.titleBackground,
                                    color: text.titleColor,
                                    padding: text.titleBackground !== 'transparent' ? '0.5rem' : '0',
                                    borderRadius: text.titleBorderRadius,
                                    ...getTextShadowStyle() // Adiciona sombra se for CLEAN
                                }}
                            >
                                {text.title}
                            </h1>
                            <p
                                className="select-none"
                                style={{ 
                                    color: text.contentColor,
                                    ...getTextShadowStyle() // Adiciona sombra se for CLEAN
                                }}
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