/* eslint-disable react/prop-types */
import { constructorModels } from '../../../advertiser/_templates/templateData/templateModels';

function HeaderModel3({ header }) {
  const model = constructorModels.model_01;
  const colorScheme = header?.colorPalette?.toLowerCase() || 'clean';

  const getElementStyle = (elementId) => {
    const element = model.elements.find(el => el.id === elementId);
    if (!element || !element[colorScheme]) return {};

    const { saturation, lightness } = element[colorScheme];

    return {
      backgroundColor: header?.color || '#000000',
      opacity: header?.elementsOpacity ?? 1,
      filter: `saturate(${saturation}%) brightness(${lightness}%)`
    };
  };

  return (
    <div className="absolute inset-0 z-10">
      <div className="flex flex-col justify-between h-full">
        <div className="flex w-full h-[5vh] mt-[2vh]">
          {model.elements.slice(0, 6).map((element) => (
            <div 
              key={element.id}
              className="flex-1 mx-[0.5vh]"
              style={getElementStyle(element.id)}
            />
          ))}
        </div>
        <div className="flex w-full h-[5vh] mb-[2vh]">
          {model.elements.slice(0, 6).map((element) => (
            <div 
              key={`bottom-${element.id}`}
              className="flex-1 mx-[0.5vh]"
              style={getElementStyle(element.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeaderModel3; 