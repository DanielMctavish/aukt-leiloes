/* eslint-disable react/prop-types */
import { constructorModels } from '../../../advertiser/_templates/templateData/templateModels';

function HeaderModel4({ header }) {
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

  const getBorderStyle = (elementId) => {
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
      {/* Elementos diagonais principais */}
      <div 
        className="absolute top-0 left-0 w-full h-1/2 transform -skew-y-6" 
        style={getElementStyle("element_1")}
      />
      <div 
        className="absolute bottom-0 right-0 w-full h-1/2 transform skew-y-6" 
        style={getElementStyle("element_2")}
      />

      {/* Elementos decorativos superiores */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={getElementStyle("element_3")}
        />
        <div 
          className="w-3 h-3 rounded-full" 
          style={getElementStyle("element_4")}
        />
        <div 
          className="w-3 h-3 rounded-full" 
          style={getElementStyle("element_5")}
        />
      </div>

      {/* Círculo decorativo inferior */}
      <div 
        className="absolute bottom-4 right-4 w-16 h-16 border-4 rounded-full" 
        style={getBorderStyle("element_6")}
      />
    </div>
  );
}

export default HeaderModel4; 