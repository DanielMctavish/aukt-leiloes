/* eslint-disable react/prop-types */
import { Close, KeyboardArrowDown, KeyboardArrowUp, UnfoldLess, UnfoldMore, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBackground } from "../../../../../features/template/HeaderSlice";
import bg_car_01 from "../../../../../media/backgrounds/templates/BG_CAR_01.jpg"
import bg_car_02 from "../../../../../media/backgrounds/templates/BG_CAR_02.jpg"
import bg_car_03 from "../../../../../media/backgrounds/templates/BG_CAR_03.jpg"
import bg_car_04 from "../../../../../media/backgrounds/templates/BG_CAR_04.jpg"
import bg_car_05 from "../../../../../media/backgrounds/templates/BG_CAR_05.jpg"
import bg_car_06 from "../../../../../media/backgrounds/templates/BG_CAR_06.jpg"
import bg_cavalos_01 from "../../../../../media/backgrounds/templates/BG_CAVALOS_01.jpg"
import bg_cavalos_02 from "../../../../../media/backgrounds/templates/BG_CAVALOS_02.jpg"
import bg_cavalos_03 from "../../../../../media/backgrounds/templates/BG_CAVALOS_03.jpg"
import bg_cavalos_04 from "../../../../../media/backgrounds/templates/BG_CAVALOS_04.jpg"
import bg_cavalos_05 from "../../../../../media/backgrounds/templates/BG_CAVALOS_05.jpg"
import bg_cavalos_06 from "../../../../../media/backgrounds/templates/BG_CAVALOS_06.jpg"
import bg_film_01 from "../../../../../media/backgrounds/templates/BG_FILM_01.jpg"
import bg_film_02 from "../../../../../media/backgrounds/templates/BG_FILM_02.jpg"
import bg_film_03 from "../../../../../media/backgrounds/templates/BG_FILM_03.jpg"
import bg_film_04 from "../../../../../media/backgrounds/templates/BG_FILM_04.jpg"
import bg_film_05 from "../../../../../media/backgrounds/templates/BG_FILM_05.jpg"
import bg_film_06 from "../../../../../media/backgrounds/templates/BG_FILM_06.jpg"
import bg_hq_01 from "../../../../../media/backgrounds/templates/BG_HQ_01.jpg"
import bg_hq_02 from "../../../../../media/backgrounds/templates/BG_HQ_02.jpg"
import bg_hq_03 from "../../../../../media/backgrounds/templates/BG_HQ_03.jpg"
import bg_hq_04 from "../../../../../media/backgrounds/templates/BG_HQ_04.jpg"
import bg_hq_05 from "../../../../../media/backgrounds/templates/BG_HQ_05.jpg"
import bg_hq_06 from "../../../../../media/backgrounds/templates/BG_HQ_06.jpg"
import bg_joias_01 from "../../../../../media/backgrounds/templates/BG_JOIAS_01.jpg"
import bg_joias_02 from "../../../../../media/backgrounds/templates/BG_JOIAS_02.jpg"
import bg_joias_03 from "../../../../../media/backgrounds/templates/BG_JOIAS_03.jpg"
import bg_joias_04 from "../../../../../media/backgrounds/templates/BG_JOIAS_04.jpg"
import bg_joias_05 from "../../../../../media/backgrounds/templates/BG_JOIAS_05.jpg"
import bg_joias_06 from "../../../../../media/backgrounds/templates/BG_JOIAS_06.jpg"
import bg_mini_01 from "../../../../../media/backgrounds/templates/BG_MINI_01.jpg"
import bg_mini_02 from "../../../../../media/backgrounds/templates/BG_MINI_02.jpg"
import bg_mini_03 from "../../../../../media/backgrounds/templates/BG_MINI_03.jpg"
import bg_mini_04 from "../../../../../media/backgrounds/templates/BG_MINI_04.jpg"
import bg_mini_05 from "../../../../../media/backgrounds/templates/BG_MINI_05.jpg"
import bg_mini_06 from "../../../../../media/backgrounds/templates/BG_MINI_06.jpg"
import bg_music_01 from "../../../../../media/backgrounds/templates/BG_MUSIC_01.jpg"
import bg_music_02 from "../../../../../media/backgrounds/templates/BG_MUSIC_02.jpg"
import bg_music_03 from "../../../../../media/backgrounds/templates/BG_MUSIC_03.jpg"
import bg_music_04 from "../../../../../media/backgrounds/templates/BG_MUSIC_04.jpg"
import bg_music_05 from "../../../../../media/backgrounds/templates/BG_MUSIC_05.jpg"
import bg_music_06 from "../../../../../media/backgrounds/templates/BG_MUSIC_06.jpg"
import bg_numis_01 from "../../../../../media/backgrounds/templates/BG_NUMIS_01.jpg"
import bg_numis_02 from "../../../../../media/backgrounds/templates/BG_NUMIS_02.jpg"
import bg_numis_03 from "../../../../../media/backgrounds/templates/BG_NUMIS_03.jpg"
import bg_numis_04 from "../../../../../media/backgrounds/templates/BG_NUMIS_04.jpg"
import bg_numis_05 from "../../../../../media/backgrounds/templates/BG_NUMIS_05.jpg"
import bg_numis_06 from "../../../../../media/backgrounds/templates/BG_NUMIS_06.jpg"
import bg_quadros_01 from "../../../../../media/backgrounds/templates/BG_QUADROS_01.jpg"
import bg_quadros_02 from "../../../../../media/backgrounds/templates/BG_QUADROS_02.jpg"
import bg_quadros_03 from "../../../../../media/backgrounds/templates/BG_QUADROS_03.jpg"
import bg_quadros_04 from "../../../../../media/backgrounds/templates/BG_QUADROS_04.jpg"
import bg_quadros_05 from "../../../../../media/backgrounds/templates/BG_QUADROS_05.jpg"
import bg_quadros_06 from "../../../../../media/backgrounds/templates/BG_QUADROS_06.jpg"
import bg_relogio_01 from "../../../../../media/backgrounds/templates/BG_RELOGIO_01.jpg"
import bg_relogio_02 from "../../../../../media/backgrounds/templates/BG_RELOGIO_02.jpg"
import bg_relogio_03 from "../../../../../media/backgrounds/templates/BG_RELOGIO_03.jpg"
import bg_relogio_04 from "../../../../../media/backgrounds/templates/BG_RELOGIO_04.jpg"
import bg_relogio_05 from "../../../../../media/backgrounds/templates/BG_RELOGIO_05.jpg"
import bg_relogio_06 from "../../../../../media/backgrounds/templates/BG_RELOGIO_06.jpg"
import bg_revista_01 from "../../../../../media/backgrounds/templates/BG_REVISTA_01.jpg"
import bg_revista_02 from "../../../../../media/backgrounds/templates/BG_REVISTA_02.jpg"
import bg_revista_03 from "../../../../../media/backgrounds/templates/BG_REVISTA_03.jpg"
import bg_revista_04 from "../../../../../media/backgrounds/templates/BG_REVISTA_04.jpg"
import bg_revista_05 from "../../../../../media/backgrounds/templates/BG_REVISTA_05.jpg"
import bg_revista_06 from "../../../../../media/backgrounds/templates/BG_REVISTA_06.jpg"
import bg_roupa_01 from "../../../../../media/backgrounds/templates/BG_ROUPA_01.jpg"
import bg_roupa_02 from "../../../../../media/backgrounds/templates/BG_ROUPA_02.jpg"
import bg_roupa_03 from "../../../../../media/backgrounds/templates/BG_ROUPA_03.jpg"
import bg_roupa_04 from "../../../../../media/backgrounds/templates/BG_ROUPA_04.jpg"
import bg_roupa_05 from "../../../../../media/backgrounds/templates/BG_ROUPA_05.jpg"
import bg_roupa_06 from "../../../../../media/backgrounds/templates/BG_ROUPA_06.jpg"
import bg_tech_01 from "../../../../../media/backgrounds/templates/BG_TECH_01.jpg"
import bg_tech_02 from "../../../../../media/backgrounds/templates/BG_TECH_02.jpg"
import bg_tech_03 from "../../../../../media/backgrounds/templates/BG_TECH_03.jpg"
import bg_tech_04 from "../../../../../media/backgrounds/templates/BG_TECH_04.jpg"
import bg_tech_05 from "../../../../../media/backgrounds/templates/BG_TECH_05.jpg"
import bg_tech_06 from "../../../../../media/backgrounds/templates/BG_TECH_06.jpg"
import bg_videogame_01 from "../../../../../media/backgrounds/templates/BG_VIDEOGAME_01.jpg"
import bg_videogame_02 from "../../../../../media/backgrounds/templates/BG_VIDEOGAME_02.jpg"
import bg_videogame_03 from "../../../../../media/backgrounds/templates/BG_VIDEOGAME_03.jpg"
import bg_videogame_04 from "../../../../../media/backgrounds/templates/BG_VIDEOGAME_04.jpg"
import bg_videogame_05 from "../../../../../media/backgrounds/templates/BG_VIDEOGAME_05.jpg"
import bg_videogame_06 from "../../../../../media/backgrounds/templates/BG_VIDEOGAME_06.jpg"

const allBackgrounds = {
    CARS: [bg_car_01, bg_car_02, bg_car_03, bg_car_04, bg_car_05, bg_car_06],
    HORSES: [bg_cavalos_01, bg_cavalos_02, bg_cavalos_03, bg_cavalos_04, bg_cavalos_05, bg_cavalos_06],
    FILM: [bg_film_01, bg_film_02, bg_film_03, bg_film_04, bg_film_05, bg_film_06],
    COMICS: [bg_hq_01, bg_hq_02, bg_hq_03, bg_hq_04, bg_hq_05, bg_hq_06],
    JEWELS: [bg_joias_01, bg_joias_02, bg_joias_03, bg_joias_04, bg_joias_05, bg_joias_06],
    MINIATURES: [bg_mini_01, bg_mini_02, bg_mini_03, bg_mini_04, bg_mini_05, bg_mini_06],
    MUSIC: [bg_music_01, bg_music_02, bg_music_03, bg_music_04, bg_music_05, bg_music_06],
    COINS: [bg_numis_01, bg_numis_02, bg_numis_03, bg_numis_04, bg_numis_05, bg_numis_06],
    PICTURES: [bg_quadros_01, bg_quadros_02, bg_quadros_03, bg_quadros_04, bg_quadros_05, bg_quadros_06],
    WATCHES: [bg_relogio_01, bg_relogio_02, bg_relogio_03, bg_relogio_04, bg_relogio_05, bg_relogio_06],
    MAGAZINES: [bg_revista_01, bg_revista_02, bg_revista_03, bg_revista_04, bg_revista_05, bg_revista_06],
    CLOTHES: [bg_roupa_01, bg_roupa_02, bg_roupa_03, bg_roupa_04, bg_roupa_05, bg_roupa_06],
    TECH: [bg_tech_01, bg_tech_02, bg_tech_03, bg_tech_04, bg_tech_05, bg_tech_06],
    VIDEOGAMES: [bg_videogame_01, bg_videogame_02, bg_videogame_03, bg_videogame_04, bg_videogame_05, bg_videogame_06]
}

const gradientColors = {
    blue_dark: "bg-gradient-to-r from-[#01245a] to-[#099bcc]",
    blue_light: "bg-gradient-to-r from-[#0d4e8e] to-[#00a8e8]",
    blue_light_2: "bg-gradient-to-r from-[#005fbe] to-[#2bc3ff]",
    blue_deep: "bg-gradient-to-r from-[#001327] to-[#141414]",
    blue_deep_2: "bg-gradient-to-r from-[#000628] to-[#141414]",
    ocean: "bg-gradient-to-r from-[#0d8e72] to-[#0075a4]",
    ocean_2: "bg-gradient-to-r from-[#0dc69e] to-[#22aae0]",
    // Gradientes quentes
    sunset: "bg-gradient-to-r from-[#ff7e5f] to-[#feb47b]",
    orange_glow: "bg-gradient-to-r from-[#ff6a00] to-[#ee0979]",
    red_fire: "bg-gradient-to-r from-[#d31027] to-[#ea384d]",
    peach: "bg-gradient-to-r from-[#ff9a9e] to-[#fecfef]",
    coral: "bg-gradient-to-r from-[#ff6f61] to-[#d6336c]",

    // Gradientes frios
    ice: "bg-gradient-to-r from-[#00c6fb] to-[#005bea]",
    teal: "bg-gradient-to-r from-[#1f4037] to-[#99f2c8]",
    mint: "bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]",
    emerald: "bg-gradient-to-r from-[#009485] to-[#004d73]",
    sky_dream: "bg-gradient-to-r from-[#6a11cb] to-[#2575fc]",

    // Gradientes neutros
    silver: "bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50]",
    metal: "bg-gradient-to-r from-[#3a3a3a] to-[#1f1f1f]",
    ash: "bg-gradient-to-r from-[#d5d4d0] to-[#4d4d4d]",
    smoke: "bg-gradient-to-r from-[#e0e0e0] to-[#a9a9a9]",
    carbon: "bg-gradient-to-r from-[#434343] to-[#000000]",
}


const solidColors = {
    blues: [
        "#00a8c6", "#40c0cb", "#0075b4", "#006587", "#0055be",
        "#03c6e9", "#68f2ff", "#00ffff", "#41ffff", "#64ffff"
    ],
    reds: [
        "#ff6b6b", "#ff3d3d", "#d32f2f", "#c62828", "#e53935",
        "#f44336", "#ff5252", "#ff1744", "#d50000", "#b71c1c"
    ],
    greens: [
        "#4caf50", "#388e3c", "#2e7d32", "#66bb6a", "#81c784",
        "#a5d6a7", "#00e676", "#00c853", "#4ae04a", "#2adb2a"
    ],
    yellows: [
        "#ffeb3b", "#fbc02d", "#f9a825", "#f57f17", "#ffc107",
        "#ffb300", "#ffa000", "#ffca28", "#ffe082", "#fff176"
    ],
    purples: [
        "#9c27b0", "#8e24aa", "#7b1fa2", "#6a1b9a", "#ab47bc",
        "#ba68c8", "#ce93d8", "#e1bee7", "#d500f9", "#aa00ff"
    ],
    oranges: [
        "#ff9800", "#fb8c00", "#f57c00", "#ef6c00", "#e65100",
        "#ffb74d", "#ffcc80", "#ffab40", "#ff9100", "#ff6d00"
    ],
    grays: [
        "#9e9e9e", "#757575", "#616161", "#424242", "#212121",
        "#bdbdbd", "#e0e0e0", "#f5f5f5", "#eeeeee", "#f7f7f7"
    ]
};



const ModalSelectorTypes = ({ setisModalSelector, setTypeBackground, typeBackground }) => {
    const dispatch = useDispatch();
    const [expandedCategories, setExpandedCategories] = useState(Object.keys(allBackgrounds).reduce((acc, category) => {
        acc[category] = true;
        return acc;
    }, {}));

    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const handleImageSelect = (imageUrl) => {
        dispatch(updateBackground({
            url: imageUrl,
            opacity: 100,
            blur: 0,
            brightness: 100
        }));
        if (!isPreviewMode) {
            setisModalSelector(false);
        }
    };

    const handleGradientSelect = (gradient) => {
        const matches = gradient.match(/from-\[(.*?)\] to-\[(.*?)\]/);
        if (matches) {
            const [, fromColor, toColor] = matches;
            const linearGradient = `linear-gradient(to bottom right, ${fromColor}, ${toColor})`;
            
            dispatch(updateBackground({
                url: linearGradient,
                opacity: 100,
                blur: 0,
                brightness: 100
            }));
            if (!isPreviewMode) {
                setisModalSelector(false);
            }
        }
    };

    const handleColorSelect = (color) => {
        dispatch(updateBackground({
            url: color,
            opacity: 100,
            blur: 0,
            brightness: 100
        }));
        if (!isPreviewMode) {
            setisModalSelector(false);
        }
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <div className={`fixed inset-0 ${!isPreviewMode ? 'bg-black/90 backdrop-blur-md' : ''} 
            flex items-center ${isPreviewMode ? 'justify-start' : 'justify-center'} z-[999]
            transition-all duration-500`}>

            <div className={`${isPreviewMode ? 'w-[500px] h-full rounded-r-2xl' : 'w-[85%] h-[85%] rounded-2xl'} 
                bg-white shadow-xl flex flex-col justify-between items-center relative p-8 overflow-hidden
                transition-all duration-500`}>
                
                {/* Botões de controle */}
                <div className="fixed top-4 right-4 flex items-center gap-2">
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 
                            transition-all duration-200 group"
                        title={isPreviewMode ? "Modo Tela Cheia" : "Modo Preview"}
                    >
                        <Visibility className={`text-white transition-transform duration-300
                            ${isPreviewMode ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    <button
                        onClick={() => setIsMenuVisible(prev => !prev)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 
                            transition-all duration-200"
                    >
                        {isMenuVisible ? 
                            <UnfoldLess className="text-white" /> : 
                            <UnfoldMore className="text-white" />
                        }
                    </button>
                    <button 
                        onClick={() => setisModalSelector(false)} 
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 
                            transition-all duration-200"
                    >
                        <Close className="text-white" />
                    </button>
                </div>

                {/* Menu Superior */}
                <div className={`w-full transition-all duration-500 ease-in-out ${
                    isMenuVisible 
                        ? 'opacity-100 max-h-[500px] mb-6' 
                        : 'opacity-0 max-h-0 overflow-hidden mb-0'
                }`}>
                    <div className="w-full flex flex-col justify-center items-center rounded-lg text-[#144366]">
                        <span className="text-2xl font-medium">
                            Selecione o tipo de background
                        </span>
                    </div>

                    <div className={`w-full ${isPreviewMode ? 'h-[20vh]' : 'h-[30vh]'} flex justify-between gap-6 
                        items-center rounded-lg mt-6 transition-all duration-500`}>
                        <div onClick={() => setTypeBackground('image')} 
                            className="flex-1 h-full bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-xl 
                                flex justify-center items-center cursor-pointer overflow-hidden relative
                                group shadow-md hover:shadow-xl transition-all duration-300">
                            <img src={bg_car_01} alt="" 
                                className="w-full h-full object-cover transition-all duration-500
                                    group-hover:scale-110 group-hover:blur-[2px]" />
                            <div className="absolute inset-0 bg-[#144366]/20 group-hover:bg-[#144366]/40 
                                transition-all duration-300" />
                            <span className="absolute text-white text-xl font-medium tracking-wide
                                drop-shadow-lg">Imagem</span>
                        </div>

                        <div onClick={() => setTypeBackground('gradient')} 
                            className="flex-1 h-full rounded-xl flex justify-center items-center cursor-pointer
                                bg-gradient-to-r from-[#361b53] to-[#2fe6a9] relative group overflow-hidden
                                shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2fe6a9] to-[#361b53] 
                                opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            <span className="relative text-white text-xl font-medium tracking-wide
                                drop-shadow-lg">Gradiente</span>
                        </div>

                        <div onClick={() => setTypeBackground('solid')} 
                            className="flex-1 h-full bg-gradient-to-br from-[#144366] to-[#1a5c8f] rounded-xl 
                                flex justify-center items-center cursor-pointer relative group overflow-hidden
                                shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a5c8f] to-[#144366] 
                                opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            <span className="relative text-white text-xl font-medium tracking-wide
                                drop-shadow-lg">Cor Sólida</span>
                        </div>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className={`w-full flex-1 transition-all duration-500 overflow-y-auto ${
                    isMenuVisible ? 'mt-8' : 'mt-0'
                }`}>
                    {typeBackground === 'image' && (
                        <div className="w-full h-full bg-[#f8fafc] rounded-xl p-6 overflow-y-auto">
                            {Object.entries(allBackgrounds).map(([category, images]) => (
                                <div key={category} className="mb-8">
                                    <div 
                                        onClick={() => toggleCategory(category)}
                                        className="flex items-center justify-between bg-white p-4 rounded-lg 
                                            shadow-sm cursor-pointer group hover:bg-[#144366]/5 
                                            transition-all duration-300 mb-4"
                                    >
                                        <h3 className="text-[#144366] font-medium flex items-center gap-2">
                                            {expandedCategories[category] ? 
                                                <KeyboardArrowUp className="text-[#144366]/70" /> : 
                                                <KeyboardArrowDown className="text-[#144366]/70" />
                                            }
                                            <span>{category}</span>
                                            <span className="text-sm text-[#144366]/50 ml-2">
                                                ({images.length} imagens)
                                            </span>
                                        </h3>
                                    </div>
                                    
                                    <div className={`grid grid-cols-3 gap-4 transition-all duration-500 
                                        ${expandedCategories[category] ? 'opacity-100 max-h-[2000px]' : 
                                        'opacity-0 max-h-0 overflow-hidden'}`}>
                                        {images.map((bg, index) => (
                                            <div 
                                                key={index} 
                                                onClick={() => handleImageSelect(bg)}
                                                className="aspect-video bg-white rounded-lg overflow-hidden cursor-pointer
                                                    group shadow-md hover:shadow-xl transition-all duration-300"
                                            >
                                                <img 
                                                    src={bg} 
                                                    alt="" 
                                                    className="w-full h-full object-cover transition-all duration-500
                                                        group-hover:scale-110 group-hover:brightness-110" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {typeBackground === 'gradient' && (
                        <div className="w-full h-full bg-[#f8fafc] rounded-xl p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(gradientColors).map(([name, gradient]) => (
                                    <div 
                                        key={name} 
                                        onClick={() => handleGradientSelect(gradient)}
                                        className="h-[120px] rounded-lg overflow-hidden cursor-pointer
                                            group shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className={`w-full h-full ${gradient} group-hover:scale-105 
                                            transition-transform duration-300`} />
                                        <div className="mt-2 text-center">
                                            <span className="text-[#144366] font-medium">{name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {typeBackground === 'solid' && (
                        <div className="w-full h-full bg-[#f8fafc] rounded-xl p-6 overflow-y-auto">
                            {Object.entries(solidColors).map(([category, colors]) => (
                                <div key={category} className="mb-8">
                                    <h3 className="text-[#144366] font-medium mb-4 capitalize">{category}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((color, index) => (
                                            <button 
                                                key={index}
                                                onClick={() => handleColorSelect(color)}
                                                className="w-14 h-14 rounded-xl cursor-pointer shadow-md
                                                    hover:scale-110 hover:shadow-xl active:scale-95
                                                    transition-all duration-300"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default ModalSelectorTypes;