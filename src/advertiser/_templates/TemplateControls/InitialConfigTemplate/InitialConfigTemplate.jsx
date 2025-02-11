/* eslint-disable no-unused-vars */
import { DragHandle, KeyboardArrowDown } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setColorPalette, setFontStyle, setHeaderColor, setHeaderSize } from "../../../../features/template/HeaderSlice";
import { updateSectionsData } from "../../../../features/template/SectionsSlice";
import { setFooterColor, setFooterSize } from "../../../../features/template/FooterSlice";

function InitialConfigTemplate() {
    const [isRetracted, setIsRetracted] = useState(true);
    const dispatch = useDispatch();
    const {
        headerData: {
            fontFamilies,
            colorPalette,
            fontStyle,
            color: headerColor,
            sizeType: headerSize,
            palettes: PALETTES
        }
    } = useSelector(state => state.header);

    const { sectionsData: { sections, selectedPalette } } = useSelector(state => state.sections);
    const { footerData: { color: footerColor, size: footerSize } } = useSelector(state => state.footer);

    useEffect(() => { }, [colorPalette])

    const handlePaletteChange = (palette) => {
        dispatch(setColorPalette(palette));
        dispatch(updateSectionsData({ selectedPalette: palette }));
    };

    const handleFontChange = (font) => {
        dispatch(setFontStyle(fontFamilies[font]));
    };

    const handleColorChange = (section, newColor) => {
        
        switch(section) {
            case 'header':
                dispatch(setHeaderColor(newColor));
                break;
            case 'footer':
                dispatch(setFooterColor(newColor));
                break;
        }
    };

    const handleSizeChange = (section, size) => {
        switch(section) {
            case 'header':
                dispatch(setHeaderSize(size === 'SMALL' ? 'SMALL' : size === 'MEDIUM' ? 'MEDIUM' : 'FULL'));
                break;
            case 'footer':
                dispatch(setFooterSize(size));
                break;
        }
    };

    return (
        <div className={`w-full flex flex-col bg-white/80 backdrop-blur-sm shadow-lg p-4 
            transition-all duration-300 relative rounded-lg ${isRetracted ? 'h-[6vh]' : 'h-full'}`}>

            <div className={`flex items-center ${isRetracted ? 'gap-12' : 'gap-2 w-full justify-between'}`}>
                <div className="flex items-center gap-2">
                    <DragHandle
                        className="text-gray-500"
                        sx={{ fontSize: '1.5rem' }}
                    />
                    <span className="font-medium text-gray-700 tracking-wide text-sm">INICIAL</span>
                </div>
            </div>

            <div
                className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 
                    transition-all duration-200 absolute right-3 top-2.5"
                onClick={() => setIsRetracted(!isRetracted)}>
                <KeyboardArrowDown
                    className={`cursor-pointer transition-transform duration-300 text-gray-600 hover:text-blue-600 ${isRetracted ? 'rotate-180' : ''}`}
                    sx={{ fontSize: '1.5rem' }}
                />
            </div>

            {!isRetracted && (
                <div className="mt-6 space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <select
                                value={Object.keys(fontFamilies).find(key => fontFamilies[key] === fontStyle) || ''}
                                onChange={(e) => handleFontChange(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 
                                    focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                            >
                                <option value="" disabled>Fonte dos textos</option>
                                {Object.entries(fontFamilies).map(([key, value]) => (
                                    <option key={key} value={key} style={{ fontFamily: value }}>
                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <KeyboardArrowDown className="text-gray-400" sx={{ fontSize: '1.2rem' }} />
                            </div>
                        </div>

                        <div className="relative">
                            <select 
                                value={colorPalette}
                                onChange={(e) => handlePaletteChange(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 
                                    focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                            >
                                <option value="" disabled>Paleta de cores</option>
                                <option value="clean">Clean</option>
                                <option value="candy">Candy</option>
                                <option value="dark">Dark</option>
                                <option value="monochromatic">Monochromatic</option>
                            </select>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <KeyboardArrowDown className="text-gray-400" sx={{ fontSize: '1.2rem' }} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-700 block">Cores das sessões</span>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Header Colors */}
                            <div className="space-y-2">
                                <span className="text-xs text-gray-600 block">Header</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {PALETTES[colorPalette] && (
                                        <>
                                            {Object.values(PALETTES[colorPalette]).map((paletteColor, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleColorChange('header', paletteColor)}
                                                    className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 
                                                        ${headerColor === paletteColor ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                                    style={{ backgroundColor: paletteColor }}
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>



                            {/* Footer Colors */}
                            <div className="space-y-2">
                                <span className="text-xs text-gray-600 block">Footer</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {PALETTES[colorPalette] && (
                                        <>
                                            {Object.values(PALETTES[colorPalette]).map((paletteColor, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleColorChange('footer', paletteColor)}
                                                    className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 
                                                        ${footerColor === paletteColor ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                                    style={{ backgroundColor: paletteColor }}
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-700 block">Tamanho das sessões</span>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-xs text-gray-600">Header</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleSizeChange('header', 'SMALL')}
                                        className={`px-2 py-1 text-xs rounded transition-colors
                                            ${headerSize === 'SMALL' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        P
                                    </button>
                                    <button 
                                        onClick={() => handleSizeChange('header', 'MEDIUM')}
                                        className={`px-2 py-1 text-xs rounded transition-colors
                                            ${headerSize === 'MEDIUM' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        M
                                    </button>
                                    <button 
                                        onClick={() => handleSizeChange('header', 'LARGE')}
                                        className={`px-2 py-1 text-xs rounded transition-colors
                                            ${headerSize === 'LARGE' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        G
                                    </button>
                                </div>
                            </div>


                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-xs text-gray-600">Footer</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleSizeChange('footer', 'SMALL')}
                                        className={`px-2 py-1 text-xs rounded transition-colors
                                            ${footerSize === 'SMALL' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        P
                                    </button>
                                    <button 
                                        onClick={() => handleSizeChange('footer', 'MEDIUM')}
                                        className={`px-2 py-1 text-xs rounded transition-colors
                                            ${footerSize === 'MEDIUM' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        M
                                    </button>
                                    <button 
                                        onClick={() => handleSizeChange('footer', 'LARGE')}
                                        className={`px-2 py-1 text-xs rounded transition-colors
                                            ${footerSize === 'LARGE' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        G
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InitialConfigTemplate;