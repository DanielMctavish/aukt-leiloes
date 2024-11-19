import React from 'react';

function HeaderBackground({ backgroundImage, getBackgroundImageStyle }) {
    if (!backgroundImage) return null;
    
    return (
        <div
            key={backgroundImage}
            className="absolute inset-0 z-0"
            style={getBackgroundImageStyle()}
        />
    );
}

export default HeaderBackground; 