/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Tune, Contrast, BlurOn, Opacity } from "@mui/icons-material";
import { updateBackground, setElementsOpacity } from "../../../../../features/template/HeaderSlice";

function SettingsFiltersHeaderControls() {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);

    const handleBackgroundChange = (key, value) => {
        const payload = {
            url: headerData.backgroundImage,
            opacity: key === "backgroundImageOpacity" ? value * 100 : headerData.backgroundImageOpacity * 100,
            blur: key === "backgroundImageBlur" ? value : headerData.backgroundImageBlur,
            brightness: key === "backgroundImageBrightness" ? value * 100 : headerData.backgroundImageBrightness * 100
        };

        dispatch(updateBackground(payload));
    };

    const handleElementsOpacityChange = (value) => {
        dispatch(setElementsOpacity(value));
    };

    // Verifica se o background é uma imagem ou gradiente
    const isImage = headerData.backgroundImage?.startsWith('http') || headerData.backgroundImage?.startsWith('/');
    const isGradient = headerData.backgroundImage?.startsWith('linear-gradient');
    const hasBackground = headerData.backgroundImage && (isImage || isGradient);

    return (
        <div className="w-full space-y-8 p-6">
            {hasBackground && (
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-[#036982]">Ajustes de {isImage ? 'Imagem' : 'Gradiente'}</h2>

                    {/* Opacidade do Background */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-[#036982]/10">
                                    <Opacity className="text-[#036982]" />
                                </div>
                                <label className="text-sm font-medium text-gray-700">
                                    Opacidade do Background
                                </label>
                            </div>
                            <span className="text-sm text-gray-500">
                                {Math.round(headerData.backgroundImageOpacity * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={headerData.backgroundImageOpacity}
                            onChange={(e) => handleBackgroundChange("backgroundImageOpacity", parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                                [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:bg-[#036982] hover:[&::-webkit-slider-thumb]:bg-[#036982]/90"
                        />
                    </div>

                    {/* Desfoque - Apenas para imagens */}
                    {isImage && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-[#036982]/10">
                                        <BlurOn className="text-[#036982]" />
                                    </div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Desfoque da Imagem
                                    </label>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {headerData.backgroundImageBlur}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="1"
                                value={headerData.backgroundImageBlur}
                                onChange={(e) => handleBackgroundChange("backgroundImageBlur", parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                                    [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:bg-[#036982] hover:[&::-webkit-slider-thumb]:bg-[#036982]/90"
                            />
                        </div>
                    )}

                    {/* Brilho do Background */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-[#036982]/10">
                                    <Contrast className="text-[#036982]" />
                                </div>
                                <label className="text-sm font-medium text-gray-700">
                                    Brilho do Background
                                </label>
                            </div>
                            <span className="text-sm text-gray-500">
                                {Math.round(headerData.backgroundImageBrightness * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={headerData.backgroundImageBrightness}
                            onChange={(e) => handleBackgroundChange("backgroundImageBrightness", parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                                [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:bg-[#036982] hover:[&::-webkit-slider-thumb]:bg-[#036982]/90"
                        />
                    </div>
                </div>
            )}

            {/* Opacidade dos Elementos */}
            <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#036982]">Ajustes dos Elementos</h2>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-[#036982]/10">
                                <Tune className="text-[#036982]" />
                            </div>
                            <label className="text-sm font-medium text-gray-700">
                                Opacidade dos Elementos
                            </label>
                        </div>
                        <span className="text-sm text-gray-500">
                            {Math.round(headerData.elementsOpacity * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={headerData.elementsOpacity}
                        onChange={(e) => handleElementsOpacityChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                            [&::-webkit-slider-thumb]:bg-[#036982] hover:[&::-webkit-slider-thumb]:bg-[#036982]/90"
                    />
                </div>
            </div>
        </div>
    );
}

export default SettingsFiltersHeaderControls;