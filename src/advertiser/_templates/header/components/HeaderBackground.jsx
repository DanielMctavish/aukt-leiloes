import { useSelector } from 'react-redux';

function HeaderBackground({ getBackgroundImageStyle }) {
    const { headerData } = useSelector(state => state.header);
    
    if (!headerData.background?.image) return null;
    
    return (
        <div
            key={headerData.background.image}
            className="absolute inset-0 z-0"
            style={getBackgroundImageStyle()}
        />
    );
}

export default HeaderBackground; 