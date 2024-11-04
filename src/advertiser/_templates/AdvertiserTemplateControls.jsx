/* eslint-disable react/prop-types */
import TemplateControls from './TemplateControls';
import { cleanColors, candyColors, darkColors, monochromaticColors } from "./templateData/templateModels";

function AdvertiserTemplateControls({ template,
    updateHeader, updateFooter, updateSection, addSection,
    removeSection, updateInitialConfig, selectedHeaderModel, setSelectedHeaderModel }) {

    const colorPalettes = {
        clean: cleanColors,
        candy: candyColors,
        dark: darkColors,
        monochromatic: monochromaticColors
    };

    // Usar a paleta de cores selecionada
    const selectedPalette = colorPalettes[template.colorPalette] || cleanColors;

    return (
        <div className='w-full'>
            <TemplateControls
                template={template}
                updateHeader={updateHeader}
                updateFooter={updateFooter}
                updateSection={updateSection}
                addSection={addSection}
                removeSection={removeSection}
                updateInitialConfig={updateInitialConfig}
                selectedHeaderModel={selectedHeaderModel}
                setSelectedHeaderModel={setSelectedHeaderModel}
                selectedPalette={selectedPalette}
            />
        </div>
    );
}

export default AdvertiserTemplateControls;
