/* eslint-disable react/prop-types */
import { Palette, FormatSize } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setColorPalette, setFontStyle } from '../../../features/template/HeaderSlice';

function InitialConfigControls() {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);

    const handlePaletteChange = (palette) => {
        dispatch(setColorPalette(palette));
    };

    const handleFontChange = (font) => {
        dispatch(setFontStyle(font));
    };

    // Definindo as fontes disponíveis conforme o index.html
    const FONT_STYLES = {
        allura: { name: 'Allura', family: "'Allura', cursive" },
        amaticSC: { name: 'Amatic SC', family: "'Amatic SC', cursive" },
        anton: { name: 'Anton', family: "'Anton', sans-serif" },
        audiowide: { name: 'Audiowide', family: "'Audiowide', cursive" },
        bebasNeue: { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif" },
        bokor: { name: 'Bokor', family: "'Bokor', system-ui" },
        dancingScript: { name: 'Dancing Script', family: "'Dancing Script', cursive" },
        eduArrows: { name: 'Edu AU VIC WA NT Arrows', family: "'Edu AU VIC WA NT Arrows', cursive" },
        eduDots: { name: 'Edu AU VIC WA NT Dots', family: "'Edu AU VIC WA NT Dots', cursive" },
        fasterOne: { name: 'Faster One', family: "'Faster One', system-ui" },
        firaSansCondensed: { name: 'Fira Sans Condensed', family: "'Fira Sans Condensed', sans-serif" },
        greatVibes: { name: 'Great Vibes', family: "'Great Vibes', cursive" },
        gruppo: { name: 'Gruppo', family: "'Gruppo', sans-serif" },
        holtwoodOneSC: { name: 'Holtwood One SC', family: "'Holtwood One SC', serif" },
        jaro: { name: 'Jaro', family: "'Jaro', sans-serif" },
        monoton: { name: 'Monoton', family: "'Monoton', cursive" },
        permanentMarker: { name: 'Permanent Marker', family: "'Permanent Marker', cursive" },
        pirataOne: { name: 'Pirata One', family: "'Pirata One', system-ui" },
        playwriteHR: { name: 'Playwrite HR Lijeva', family: "'Playwrite HR Lijeva', cursive" },
        poiretOne: { name: 'Poiret One', family: "'Poiret One', system-ui" },
        sevillana: { name: 'Sevillana', family: "'Sevillana', cursive" },
        shadowsIntoLight: { name: 'Shadows Into Light', family: "'Shadows Into Light', cursive" },
        sixCaps: { name: 'Six Caps', family: "'Six Caps', sans-serif" },
        syncopate: { name: 'Syncopate', family: "'Syncopate', sans-serif" },
        tillana: { name: 'Tillana', family: "'Tillana', cursive" },
        unna: { name: 'Unna', family: "'Unna', serif" }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4 gap-2 flex flex-col">
            <h3 className="font-semibold mb-2">Configurações iniciais</h3>

            <div className="relative">
                <select
                    value={headerData.colorPalette}
                    onChange={e => handlePaletteChange(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                >
                    <option value="">Selecione a paleta de cores</option>
                    <option value="clean">Clean</option>
                    <option value="candy">Candy</option>
                    <option value="dark">Dark</option>
                    <option value="monochromatic">Monocromático</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="relative">
                <select
                    value={headerData.fontStyle}
                    onChange={e => handleFontChange(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                >
                    <option value="">Selecione o estilo de fonte</option>
                    {Object.entries(FONT_STYLES).map(([key, { name, family }]) => (
                        <option 
                            key={key} 
                            value={family}
                            style={{ fontFamily: family }}
                        >
                            {name}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FormatSize className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
    );
}

export default InitialConfigControls;
