import { WhatsApp, Edit, DeleteForever } from '@mui/icons-material';
import { useState } from 'react';

function FormSectionControls({ section, index, onUpdate }) {
    const [editingField, setEditingField] = useState(null);

    const handleConfigUpdate = (updates) => {
        onUpdate(index, {
            ...section.config,
            ...updates
        });
    };

    const handleAddField = () => {
        const newField = {
            type: 'text',
            label: 'Novo Campo',
            required: false
        };

        handleConfigUpdate({
            fields: [...(section.config.fields || []), newField]
        });
    };

    const handleUpdateField = (fieldIndex, updates) => {
        const updatedFields = [...section.config.fields];
        updatedFields[fieldIndex] = {
            ...updatedFields[fieldIndex],
            ...updates
        };

        handleConfigUpdate({ fields: updatedFields });
    };

    const handleRemoveField = (fieldIndex) => {
        const updatedFields = section.config.fields.filter((_, idx) => idx !== fieldIndex);
        handleConfigUpdate({ fields: updatedFields });
    };

    return (
        <div className="space-y-6">
            {/* WhatsApp */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <WhatsApp className="text-gray-400 text-sm" />
                    Número do WhatsApp
                </label>
                <input
                    type="text"
                    value={section.config.whatsappNumber || ''}
                    onChange={(e) => handleConfigUpdate({ whatsappNumber: e.target.value })}
                    placeholder="Ex: 5511999999999"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Digite o número com código do país e DDD, sem espaços ou caracteres especiais
                </p>
            </div>

            {/* Texto do Botão */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto do Botão
                </label>
                <input
                    type="text"
                    value={section.config.buttonText || ''}
                    onChange={(e) => handleConfigUpdate({ buttonText: e.target.value })}
                    placeholder="Ex: Enviar Mensagem"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Campos do Formulário */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Campos do Formulário
                    </label>
                    <button
                        onClick={handleAddField}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        Adicionar Campo
                    </button>
                </div>

                <div className="space-y-4">
                    {section.config.fields?.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">Campo {fieldIndex + 1}</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingField(fieldIndex)}
                                        className="p-1 hover:bg-blue-100 rounded-full text-blue-500"
                                        title="Editar campo"
                                    >
                                        <Edit />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveField(fieldIndex)}
                                        className="p-1 hover:bg-red-100 rounded-full text-red-500"
                                        title="Remover campo"
                                    >
                                        <DeleteForever />
                                    </button>
                                </div>
                            </div>

                            {editingField === fieldIndex ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Rótulo do Campo
                                        </label>
                                        <input
                                            type="text"
                                            value={field.label}
                                            onChange={(e) => handleUpdateField(fieldIndex, { label: e.target.value })}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Tipo do Campo
                                        </label>
                                        <select
                                            value={field.type}
                                            onChange={(e) => handleUpdateField(fieldIndex, { type: e.target.value })}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="text">Texto</option>
                                            <option value="email">E-mail</option>
                                            <option value="textarea">Área de Texto</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => handleUpdateField(fieldIndex, { required: e.target.checked })}
                                            className="rounded text-blue-500"
                                        />
                                        <label className="text-sm text-gray-600">
                                            Campo Obrigatório
                                        </label>
                                    </div>
                                    <button
                                        onClick={() => setEditingField(null)}
                                        className="w-full mt-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Rótulo:</span> {field.label}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Tipo:</span> {field.type}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Obrigatório:</span> {field.required ? 'Sim' : 'Não'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FormSectionControls; 