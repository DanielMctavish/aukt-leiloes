/* eslint-disable react/prop-types */
import { constructorModels } from '../../../advertiser/_templates/templateData/templateModels';

function HeaderModel1({ header }) {
  const model = constructorModels.model_01;
  const colorScheme = header?.colorPalette || 'clean';

  const getElementStyle = (elementId) => {
    const element = model.elements.find(el => el.id === elementId);
    if (!element || !element[colorScheme]) return {};

    return {
      backgroundColor: header?.color || '#000000',
      opacity: header?.elementsOpacity ?? 1
    };
  };

  const getElementClasses = (elementId) => {
    const element = model.elements.find(el => el.id === elementId);
    if (!element || !element[colorScheme]) return '';

    const { saturation, lightness } = element[colorScheme];
    
    // Convertendo os valores para as classes mais próximas do Tailwind
    const satClass = `saturate-[${saturation}]`;
    const brightClass = `brightness-[${lightness / 100}]`;

    return `${satClass} ${brightClass}`;
  };

  return (
    <div className="absolute inset-0 z-10">
      {model.elements.map((element) => (
        <div
          key={element.id}
          name={element.id}
          className={`
            ${element.id === "element_3" && "w-[110px] h-full absolute right-[48%]"}
            ${element.id === "element_4" && "w-[110px] h-full absolute right-[40%]"}
            ${element.id === "element_2" && "w-[120px] h-[60vh] absolute left-[34vh] bottom-[-10vh] origin-bottom-left transform rotate-[-50deg]"}
            ${element.id === "element_1" && "w-[100px] h-[60vh] absolute left-[34vh] bottom-[-28vh] origin-bottom-left transform rotate-[-50deg]"}
            ${element.id === "element_5" && "w-[120px] h-[60vh] absolute right-[34vh] top-[-13vh] origin-top-right transform rotate-[-50deg]"}
            ${element.id === "element_6" && "w-[100px] h-[60vh] absolute right-[34vh] top-[-28vh] origin-top-right transform rotate-[-50deg]"}
            ${getElementClasses(element.id)}
          `}
          style={getElementStyle(element.id)}
        />
      ))}
    </div>
  );
}

export default HeaderModel1; 