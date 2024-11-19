/* eslint-disable react/prop-types */
import { constructorModels } from '../../../advertiser/_templates/templateData/templateModels';

function HeaderModel8({ header }) {
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
      {/* Elementos minimalistas */}
      <div className="absolute inset-0 flex justify-between items-center p-8">
        {/* Linha vertical esquerda */}
        <div 
          className="w-[2px] h-[60%]" 
          style={getElementStyle("element_1")}
        />

        {/* Elementos centrais */}
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-[100px] h-[2px]" 
            style={getElementStyle("element_2")}
          />
          <div 
            className="w-[2px] h-[100px]" 
            style={getElementStyle("element_3")}
          />
          <div 
            className="w-[100px] h-[2px]" 
            style={getElementStyle("element_4")}
          />
        </div>

        {/* Linha vertical direita */}
        <div 
          className="w-[2px] h-[60%]" 
          style={getElementStyle("element_5")}
        />
      </div>

      {/* Elementos de canto */}
      <div className="absolute top-4 left-4">
        <div 
          className="w-[40px] h-[2px]" 
          style={getElementStyle("element_6")}
        />
        <div 
          className="w-[2px] h-[40px]" 
          style={getElementStyle("element_1")}
        />
      </div>

      <div className="absolute top-4 right-4">
        <div 
          className="w-[40px] h-[2px]" 
          style={getElementStyle("element_2")}
        />
        <div 
          className="w-[2px] h-[40px] ml-[38px]" 
          style={getElementStyle("element_3")}
        />
      </div>

      <div className="absolute bottom-4 left-4">
        <div 
          className="w-[2px] h-[40px]" 
          style={getElementStyle("element_4")}
        />
        <div 
          className="w-[40px] h-[2px]" 
          style={getElementStyle("element_5")}
        />
      </div>

      <div className="absolute bottom-4 right-4">
        <div 
          className="w-[2px] h-[40px] ml-[38px]" 
          style={getElementStyle("element_6")}
        />
        <div 
          className="w-[40px] h-[2px]" 
          style={getElementStyle("element_1")}
        />
      </div>
    </div>
  );
}

export default HeaderModel8; 