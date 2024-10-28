import { Palette, FormatSize } from '@mui/icons-material';
import { fontStyles } from "../templateData/templateModels";

function InitialConfigControls({ template, updateInitialConfig }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4 gap-2 flex flex-col">
            <h3 className="font-semibold mb-2">Configurações iniciais</h3>

            <div className="relative">
                <select
                    value={template.colorPalette}
                    onChange={e => updateInitialConfig('colorPalette', e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                >
                    <option value="">Selecione a paleta de cores</option>
                    <option value="clean">Clean</option>
                    <option value="candy">Candy</option>
                    <option value="dark">Dark</option>
                    <option value="monochromatic">Monocromático</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="relative">
                <select
                    value={template.fontStyle}
                    onChange={e => updateInitialConfig('fontStyle', e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 text-base border-gray-100 bg-[#e8e8e8] rounded-md cursor-pointer"
                >
                    <option value="">Selecione o estilo de fonte</option>
                    {Object.entries(fontStyles).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FormatSize className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
    );
}

export default InitialConfigControls;
