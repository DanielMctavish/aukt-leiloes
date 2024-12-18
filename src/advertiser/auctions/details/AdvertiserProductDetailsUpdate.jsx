/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { Modal } from "@mui/material";
import { Close, Save, AttachMoney, Category, Inventory, Title, Description } from "@mui/icons-material";

const AdvertiserProductDetailsUpdate = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        const localAdvertiser = JSON.parse(currentLocalAdvertiser)

        // Create an object with only the modified fields
        const updatedFields = {};
        for (const key in formData) {
            if (formData[key] !== product[key]) {
                updatedFields[key] = formData[key];
            }
        }

        if (product.advertiser_id) {
            updatedFields.advertiser_id = product.advertiser_id;
        }

        // Convert numeric fields
        if (updatedFields.initial_value) updatedFields.initial_value = parseFloat(updatedFields.initial_value);
        if (updatedFields.reserve_value) updatedFields.reserve_value = parseFloat(updatedFields.reserve_value);
        if (updatedFields.height) updatedFields.height = parseFloat(updatedFields.height);
        if (updatedFields.width) updatedFields.width = parseFloat(updatedFields.width);
        if (updatedFields.weight) updatedFields.weight = parseFloat(updatedFields.weight);

        try {
            await axios.patch(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/update-product`, 
                updatedFields, 
                {
                    headers: {
                        'Authorization': `Bearer ${localAdvertiser.token}`
                    },
                    params: {
                        product_id: product.id
                    }
                }
            );
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            open={true} 
            onClose={onClose}
            className="flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Header mais clean */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-medium text-gray-800">Editar Produto</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                {/* Form com inputs mais clean */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-8">
                        {/* Título */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Title className="text-gray-400" fontSize="small" />
                                Título
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-200 
                                    focus:border-blue-500 focus:ring-0 outline-none transition-colors text-gray-700"
                                placeholder="Digite o título do produto"
                            />
                        </div>

                        {/* Descrição */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Description className="text-gray-400" fontSize="small" />
                                Descrição
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg focus:ring-0 
                                    outline-none text-gray-700 resize-none"
                                placeholder="Digite a descrição do produto"
                            />
                        </div>

                        {/* Valores */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <AttachMoney className="text-gray-400" fontSize="small" />
                                    Valor Inicial
                                </label>
                                <input
                                    type="number"
                                    name="initial_value"
                                    value={formData.initial_value}
                                    onChange={handleChange}
                                    className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-200 
                                        focus:border-blue-500 focus:ring-0 outline-none transition-colors text-gray-700"
                                    placeholder="0,00"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <AttachMoney className="text-gray-400" fontSize="small" />
                                    Valor de Reserva
                                </label>
                                <input
                                    type="number"
                                    name="reserve_value"
                                    value={formData.reserve_value}
                                    onChange={handleChange}
                                    className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-200 
                                        focus:border-blue-500 focus:ring-0 outline-none transition-colors text-gray-700"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>

                        {/* Categoria e Grupo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Category className="text-gray-400" fontSize="small" />
                                    Categoria
                                </label>
                                <input
                                    type="text"
                                    name="categorie"
                                    value={formData.categorie}
                                    onChange={handleChange}
                                    className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-200 
                                        focus:border-blue-500 focus:ring-0 outline-none transition-colors text-gray-700"
                                    placeholder="Digite a categoria"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Inventory className="text-gray-400" fontSize="small" />
                                    Grupo
                                </label>
                                <input
                                    type="text"
                                    name="group"
                                    value={formData.group}
                                    onChange={handleChange}
                                    className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-200 
                                        focus:border-blue-500 focus:ring-0 outline-none transition-colors text-gray-700"
                                    placeholder="Digite o grupo"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer mais clean */}
                    <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-500 hover:text-gray-700 font-medium 
                                transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[#012038] hover:bg-[#012d52] text-white rounded-lg 
                                transition-colors flex items-center gap-2 disabled:opacity-50 
                                disabled:cursor-not-allowed font-medium"
                        >
                            <Save fontSize="small" />
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AdvertiserProductDetailsUpdate;