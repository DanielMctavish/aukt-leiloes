/* eslint-disable react/prop-types */
import { constructorModels } from '../../../advertiser/_templates/templateData/templateModels';

function HeaderModel6({ header }) {
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
      {/* Grade principal com elementos conectados */}
      <div className="absolute inset-0">
        {/* Primeira linha */}
        <div className="absolute top-0 left-0 right-0 flex gap-0 h-[33.33%]">
          <div 
            className="w-[40%] h-full border-[2px]" 
            style={getElementStyle("element_1")}
          />
          <div 
            className="w-[25%] h-full border-[2px] border-l-0" 
            style={getElementStyle("element_2")}
          />
          <div 
            className="w-[35%] h-full border-[2px] border-l-0" 
            style={getElementStyle("element_3")}
          />
        </div>

        {/* Segunda linha */}
        <div className="absolute top-[33.33%] left-0 right-0 flex gap-0 h-[33.33%]">
          <div 
            className="w-[30%] h-full border-[2px] border-t-0" 
            style={getElementStyle("element_4")}
          />
          <div 
            className="w-[45%] h-full border-[2px] border-l-0 border-t-0" 
            style={getElementStyle("element_5")}
          />
          <div 
            className="w-[25%] h-full border-[2px] border-l-0 border-t-0" 
            style={getElementStyle("element_6")}
          />
        </div>

        {/* Terceira linha */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-0 h-[33.33%]">
          <div 
            className="w-[50%] h-full border-[2px] border-t-0" 
            style={getElementStyle("element_1")}
          />
          <div 
            className="w-[20%] h-full border-[2px] border-l-0 border-t-0" 
            style={getElementStyle("element_2")}
          />
          <div 
            className="w-[30%] h-full border-[2px] border-l-0 border-t-0" 
            style={getElementStyle("element_3")}
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderModel6; 