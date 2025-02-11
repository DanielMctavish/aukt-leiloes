/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Close, Add, Delete, WhatsApp } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSectionsData } from "../../../../../features/template/SectionsSlice";

function FormSectionControls({ setIsModalForm }) {
    const dispatch = useDispatch();
    const { sectionsData } = useSelector(state => state.sections);
    const [config, setConfig] = useState({
        whatsappNumber: "",
        buttonText: "Enviar Mensagem",
        fields: [
            { type: "text", label: "Nome", required: true },
            { type: "email", label: "E-mail", required: true },
            { type: "text", label: "Telefone", required: false },
            { type: "textarea", label: "Mensagem", required: true }
        ]
    });

    const handleCloseModal = () => {
        setIsModalForm(false);
    };

    const handleWhatsAppChange = (e) => {
        setConfig(prev => ({
            ...prev,
            whatsappNumber: e.target.value
        }));

        // Verifica se já existe uma seção de formulário
        const existingFormIndex = sectionsData.sections.findIndex(section => section.type === "Form");
        const newSection = {
            type: "Form",
            config: {
                ...config,
                whatsappNumber: e.target.value
            },
            color: "#ffffff",
            sizeType: "contained"
        };

        if (existingFormIndex !== -1) {
            // Se já existe, atualiza
            const updatedSections = [...sectionsData.sections];
            updatedSections[existingFormIndex] = newSection;
            dispatch(updateSectionsData({
                sections: updatedSections
            }));
        } else {
            // Se não existe, cria novo
            dispatch(updateSectionsData({
                sections: [...sectionsData.sections, newSection]
            }));
        }
    };

    const handleButtonTextChange = (e) => {
        setConfig(prev => ({
            ...prev,
            buttonText: e.target.value
        }));

        updateFormSection({
            ...config,
            buttonText: e.target.value
        });
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = [...config.fields];
        newFields[index] = {
            ...newFields[index],
            [key]: value
        };

        const newConfig = {
            ...config,
            fields: newFields
        };

        setConfig(newConfig);
        updateFormSection(newConfig);
    };

    const addField = () => {
        const newFields = [...config.fields, { type: "text", label: "Novo Campo", required: false }];
        const newConfig = {
            ...config,
            fields: newFields
        };
        
        setConfig(newConfig);
        updateFormSection(newConfig);
    };

    const removeField = (index) => {
        const newFields = config.fields.filter((_, i) => i !== index);
        const newConfig = {
            ...config,
            fields: newFields
        };

        setConfig(newConfig);
        updateFormSection(newConfig);
    };

    const updateFormSection = (newConfig) => {
        const existingFormIndex = sectionsData.sections.findIndex(section => section.type === "Form");
        const newSection = {
            type: "Form",
            config: newConfig,
            color: "#ffffff",
            sizeType: "contained"
        };

        if (existingFormIndex !== -1) {
            const updatedSections = [...sectionsData.sections];
            updatedSections[existingFormIndex] = newSection;
            dispatch(updateSectionsData({
                sections: updatedSections
            }));
        } else {
            dispatch(updateSectionsData({
                sections: [...sectionsData.sections, newSection]
            }));
        }
    };

    return (
        <div className="w-full h-[100vh] fixed top-0 left-0 bg-black/90
        flex justify-center items-center z-[999] backdrop-blur-md overflow-y-auto">

            <div className="w-[90%] h-[90%] bg-white rounded-2xl shadow-2xl flex flex-col 
            gap-8 items-center relative p-8 overflow-y-auto">
                <button 
                    onClick={handleCloseModal} 
                    className="fixed top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                    <Close className="text-gray-500 hover:text-gray-700" />
                </button>

                <div className="text-center relative w-full pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-[#036982]">Formulário de Contato</h1>
                    <p className="text-gray-500 mt-2">Configure os campos e opções do seu formulário</p>
                </div>

                <div className="w-full max-w-4xl flex flex-col gap-8">
                    {/* Configuração do WhatsApp */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <WhatsApp className="text-[#036982]" />
                            <h2 className="text-lg font-semibold text-[#036982]">Configurações do WhatsApp</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número do WhatsApp <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={config.whatsappNumber}
                                    onChange={handleWhatsAppChange}
                                    placeholder="Ex: 5511999999999"
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white
                                    focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all
                                    placeholder:text-gray-400"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Digite o número com código do país (55) e DDD, sem espaços ou caracteres especiais
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto do Botão <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={config.buttonText}
                                    onChange={handleButtonTextChange}
                                    placeholder="Ex: Enviar Mensagem no WhatsApp"
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white
                                    focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all
                                    placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campos do Formulário */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[#036982]">Campos do Formulário</h2>
                            <button
                                onClick={addField}
                                className="flex items-center gap-2 px-4 py-2 bg-[#036982] text-white rounded-lg
                                hover:bg-[#036982]/90 transition-colors"
                            >
                                <Add />
                                Adicionar Campo
                            </button>
                        </div>

                        <div className="space-y-4">
                            {config.fields.map((field, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tipo do Campo <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={field.type}
                                                    onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                                                    className="w-full p-2.5 border-2 border-gray-200 rounded-lg bg-white
                                                    focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all"
                                                >
                                                    <option value="text">Texto</option>
                                                    <option value="email">E-mail</option>
                                                    <option value="tel">Telefone</option>
                                                    <option value="textarea">Área de Texto</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rótulo do Campo <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={field.label}
                                                    onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                                                    placeholder="Ex: Nome Completo"
                                                    className="w-full p-2.5 border-2 border-gray-200 rounded-lg bg-white
                                                    focus:border-[#036982] focus:ring-2 focus:ring-[#036982]/20 transition-all
                                                    placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
                                                        className="w-4 h-4 text-[#036982] rounded focus:ring-[#036982]"
                                                    />
                                                    <span className="text-sm text-gray-700">Campo Obrigatório</span>
                                                </label>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeField(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
                                            rounded-lg transition-all"
                                            disabled={config.fields.length <= 1}
                                            title={config.fields.length <= 1 ? "Não é possível remover o último campo" : "Remover campo"}
                                        >
                                            <Delete />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prévia */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-[#036982] mb-4">Prévia do Formulário</h3>
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                            <form className="space-y-4">
                                {config.fields.map((field, index) => (
                                    <div key={index}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none bg-gray-50"
                                                rows={4}
                                                placeholder={`Digite ${field.label.toLowerCase()} aqui...`}
                                                disabled
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                                                placeholder={`Digite ${field.label.toLowerCase()} aqui...`}
                                                disabled
                                            />
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 
                                    bg-[#036982] text-white rounded-lg hover:bg-[#036982]/90 transition-colors"
                                >
                                    <WhatsApp />
                                    {config.buttonText || "Enviar Mensagem"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormSectionControls;