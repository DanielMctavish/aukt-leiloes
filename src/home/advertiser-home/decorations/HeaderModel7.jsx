/* eslint-disable react/prop-types */
import { constructorModels } from '../../../advertiser/_templates/templateData/templateModels';

function HeaderModel7({ header }) {
  const model = constructorModels.model_01;
  const colorScheme = header?.colorPalette?.toLowerCase() || 'clean';

  const getElementStyle = (elementId) => {
    const element = model.elements.find(el => el.id === elementId);
    if (!element || !element[colorScheme]) return {};

    const { saturation, lightness } = element[colorScheme];

    return {
      borderColor: header?.color || '#000000',
      opacity: header?.elementsOpacity ?? 1,
      filter: `saturate(${saturation}%) brightness(${lightness}%)`
    };
  };

  return (
    <div className="absolute inset-0 z-10">
      {/* Grade de tijolinhos */}
      <div className="w-full h-full grid grid-cols-8 gap-1 p-2">
        {[...Array(48)].map((_, index) => {
          // Usa os elementos em ciclo para variar os estilos
          const elementId = `element_${(index % 6) + 1}`;
          return (
            <div
              key={index}
              className="w-full h-full border-[2px]"
              style={getElementStyle(elementId)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HeaderModel7; 