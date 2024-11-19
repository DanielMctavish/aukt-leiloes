/* eslint-disable react/prop-types */
import { constructorModels } from '../../../advertiser/_templates/templateData/templateModels';

function HeaderModel2({ header }) {
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
      {model.elements.map((element) => (
        <div
          key={element.id}
          name={element.id}
          className={`
            ${element.id === "element_1" && "w-[260px] h-[260px] rounded-full absolute right-[20vh] bottom-[-4vh]"}
            ${element.id === "element_2" && "w-[300px] h-[300px] rounded-full absolute right-[-4vh] bottom-[-4vh]"}
            ${element.id === "element_3" && "w-[260px] h-[260px] rounded-full absolute left-[17vh] bottom-[-4vh]"}
            ${element.id === "element_4" && "w-[290px] h-[290px] rounded-full absolute left-[-4vh] bottom-[-4vh]"}
            ${element.id === "element_5" && "w-[300px] h-[300px] rounded-full absolute left-[-100px] top-[-100px]"}
            ${element.id === "element_6" && "w-[360px] h-[360px] rounded-full absolute right-[-7vh] top-[-10vh]"}
          `}
          style={getElementStyle(element.id)}
        />
      ))}
    </div>
  );
}

export default HeaderModel2; 