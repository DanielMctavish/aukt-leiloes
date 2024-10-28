/* eslint-disable react/prop-types */
//background template imgs import
import bg_template_01 from "../../../media/backgrounds/templates/template_bg_01.jpg";
import bg_template_02 from "../../../media/backgrounds/templates/template_bg_02.jpg";
import bg_template_03 from "../../../media/backgrounds/templates/template_bg_03.jpg";
import bg_template_04 from "../../../media/backgrounds/templates/template_bg_04.jpg";
import bg_template_05 from "../../../media/backgrounds/templates/template_bg_05.jpg";
import bg_template_06 from "../../../media/backgrounds/templates/template_bg_06.jpg";
import bg_antiguidades from "../../../media/backgrounds/templates/BACKGROUND-ANTIGUIDADES.jpg";
import bg_cds from "../../../media/backgrounds/templates/BACKGROUND-CDS.jpg";
import bg_instrumentos from "../../../media/backgrounds/templates/BACKGROUND-INSTRUMENTOS.jpg";
import bg_livros from "../../../media/backgrounds/templates/BACKGROUND-LIVROS.jpg";
import bg_miniaturas from "../../../media/backgrounds/templates/BACKGROUND-MINIATURAS.jpg";
import bg_moveis from "../../../media/backgrounds/templates/BACKGROUND-MOVEIS.jpg";
import bg_relogios from "../../../media/backgrounds/templates/BACKGROUND-RELOGIOS.jpg";
import bg_videogames from "../../../media/backgrounds/templates/BACKGROUND-VIDEO-GAMES.jpg";

function BackgroundImageControls({ template, updateHeader }) {
    const backgroundImages = [
        { name: "Circulo", src: bg_template_01 },
        { name: "Retro", src: bg_template_02 },
        { name: "Carros", src: bg_template_03 },
        { name: "Perfumes", src: bg_template_04 },
        { name: "Revistas", src: bg_template_05 },
        { name: "Casamento", src: bg_template_06 },
        { name: "Antiguidades", src: bg_antiguidades },
        { name: "CDs", src: bg_cds },
        { name: "Instrumentos", src: bg_instrumentos },
        { name: "Livros", src: bg_livros },
        { name: "Miniaturas", src: bg_miniaturas },
        { name: "Móveis", src: bg_moveis },
        { name: "Relógios", src: bg_relogios },
        { name: "Video Games", src: bg_videogames },
    ];

    const handleImageEffectChange = (effect, value) => {
        updateHeader(`backgroundImage${effect.charAt(0).toUpperCase() + effect.slice(1)}`, value);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem de Fundo</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
                {backgroundImages.map((img, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer border-2 ${template.header.backgroundImage === img.src ? 'border-blue-500' : 'border-gray-300'}`}
                        onClick={() => updateHeader('backgroundImage', img.src)}
                    >
                        <img src={img.src} alt={img.name} className="w-full h-16 object-cover" />
                        <div className="text-xs p-1 text-center truncate">{img.name}</div>
                    </div>
                ))}
            </div>
            {template.header.backgroundImage && (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Opacidade</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={template.header.backgroundImageOpacity || 30}
                        onChange={(e) => handleImageEffectChange('opacity', e.target.value)}
                        className="w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700 mt-2">Desfoque</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={template.header.backgroundImageBlur || 2}
                        onChange={(e) => handleImageEffectChange('blur', e.target.value)}
                        className="w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700 mt-2">Brilho</label>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={template.header.backgroundImageBrightness || 100}
                        onChange={(e) => handleImageEffectChange('brightness', e.target.value)}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}

export default BackgroundImageControls;
