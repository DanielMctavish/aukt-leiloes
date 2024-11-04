/* eslint-disable react/prop-types */
import InitialConfigControls from './InitialConfigControls';
import HeaderControls from './HeaderControls';
import FooterControls from './FooterControls';
import { Add } from '@mui/icons-material';

function TemplateControls({ 
    template,
    updateHeader,
    updateFooter,
    addSection,
    updateInitialConfig,
    selectedHeaderModel,
    setSelectedHeaderModel,
    selectedPalette
}) {
    const isInitialConfigComplete = template.colorPalette && template.fontStyle;

    return (
        <aside className="w-1/5 h-screen bg-gray-100 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">AUK CONSTRUCTOR</h2>

            <InitialConfigControls 
                template={template}
                updateInitialConfig={updateInitialConfig}
            />

            {isInitialConfigComplete && (
                <>
                    <HeaderControls 
                        template={template}
                        updateHeader={updateHeader}
                        selectedHeaderModel={selectedHeaderModel}
                        setSelectedHeaderModel={setSelectedHeaderModel}
                        selectedPalette={selectedPalette}
                    />

                    {/* Seções */}
                    {template.sections.map((section, index) => (
                        <div key={index} className="bg-white shadow rounded-lg p-4 mb-4">
                            {/* ... (código das seções) */}
                        </div>
                    ))}

                    {/* Footer */}
                    <FooterControls 
                        template={template}
                        updateFooter={updateFooter}
                        selectedPalette={selectedPalette}
                    />

                    <button
                        onClick={() => addSection('section')}
                        disabled={template.sections.length >= 3}
                        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent 
                            text-sm font-medium rounded-md text-[#4d4d4d] bg-[#effdff] 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                            ${template.sections.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Add className="h-5 w-5 mr-2" />
                        Adicionar Seção
                    </button>
                </>
            )}
        </aside>
    );
}

export default TemplateControls;
