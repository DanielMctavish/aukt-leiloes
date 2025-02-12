/* eslint-disable react/prop-types */
import { Close, DeleteForever, Edit, DragIndicator } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addHeaderText, updateHeaderText, removeHeaderText } from "../../../../../features/template/HeaderSlice";

function TextsHeaderControls({ setIsModalSelector }) {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);
    const selectedPalette = headerData.palettes[headerData.colorPalette];

    const [isAddingText, setIsAddingText] = useState(false);
    const [editingText, setEditingText] = useState(null);
    const [selectedColors, setSelectedColors] = useState({
        title: Object.values(selectedPalette)[0],
        content: Object.values(selectedPalette)[0]
    });

    useEffect(() => {
        setSelectedColors({
            title: Object.values(selectedPalette)[0],
            content: Object.values(selectedPalette)[0]
        });
    }, [headerData.colorPalette, selectedPalette]);

    const fontSizes = [
        { value: '12px', label: 'Muito Pequeno' },
        { value: '14px', label: 'Pequeno' },
        { value: '16px', label: 'Médio' },
        { value: '20px', label: 'Grande' },
        { value: '24px', label: 'Muito Grande' },
        { value: '32px', label: 'Extra Grande' },
        { value: '40px', label: 'Título Pequeno' },
        { value: '48px', label: 'Título Médio' },
        { value: '56px', label: 'Título Grande' },
        { value: '64px', label: 'Título Extra Grande' },
        { value: '72px', label: 'Destaque Pequeno' },
        { value: '80px', label: 'Destaque Médio' },
        { value: '96px', label: 'Destaque Grande' }
    ];

    const handleAddOrUpdateText = (formData) => {
        if (editingText) {
            dispatch(updateHeaderText({
                id: editingText.id,
                updates: {
                    title: formData.title,
                    content: formData.content,
                    titleColor: formData.titleColor,
                    contentColor: formData.contentColor,
                    titleSize: formData.titleSize,
                    positionTop: editingText.positionTop || '50%',
                    positionLeft: editingText.positionLeft || '50%'
                }
            }));
            setEditingText(null);
        } else {
            const newText = {
                id: Date.now(),
                title: formData.title,
                content: formData.content,
                titleColor: formData.titleColor,
                contentColor: formData.contentColor,
                titleSize: formData.titleSize,
                positionTop: '50%',
                positionLeft: '50%'
            };
            dispatch(addHeaderText(newText));
        }
        setIsAddingText(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            title: e.target.title.value,
            content: e.target.content.value,
            titleColor: selectedColors.title,
            contentColor: selectedColors.content,
            titleSize: e.target.titleSize.value
        };
        handleAddOrUpdateText(formData);
    };

    const handleEdit = (text) => {
        setEditingText(text);
        setIsAddingText(true);
        setSelectedColors({
            title: text.titleColor || selectedColors.title,
            content: text.contentColor || selectedColors.content
        });
    };

    const deleteText = (id) => {
        dispatch(removeHeaderText(id));
    };

    return (
        <div className="fixed inset-0 bg-[#0D2B44]/80 backdrop-blur-[4px] 
            flex items-center justify-center z-[999]">
            <div className="w-[85%] h-[85%] bg-white rounded-2xl shadow-xl 
                flex justify-between items-start relative p-8 overflow-hidden gap-6">
                
                <button
                    onClick={() => setIsModalSelector(false)}
                    className="fixed top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                        backdrop-blur-sm transition-all duration-200">
                    <Close className="text-white" />
                </button>

                {/* Formulário e Lista de Textos */}
                <section className="w-[45%] h-full flex flex-col gap-4 overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#144366] font-semibold">Adicionar Texto</h3>
                        <button
                            onClick={() => {
                                setIsAddingText(true);
                                setEditingText(null);
                                setSelectedColors({
                                    title: Object.values(selectedPalette)[0],
                                    content: Object.values(selectedPalette)[0]
                                });
                            }}
                            className="p-2 bg-[#144366] text-white rounded-lg hover:bg-[#0D2B44] 
                                transition-all duration-300 text-sm">
                            Novo Texto
                        </button>
                    </div>

                    {/* Formulário */}
                    {isAddingText && (
                        <form onSubmit={handleSubmit} className="bg-[#F5F8FA]/50 p-6 rounded-xl space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Título</label>
                                <input 
                                    name="title"
                                    defaultValue={editingText?.title || ''}
                                    type="text" 
                                    placeholder="Digite o título..."
                                    className="p-3 rounded-xl bg-white/50 border border-[#E8F1F8] 
                                        focus:border-[#144366] outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Conteúdo</label>
                                <textarea 
                                    name="content"
                                    defaultValue={editingText?.content || ''}
                                    placeholder="Digite o conteúdo..."
                                    className="p-3 rounded-xl bg-white/50 border border-[#E8F1F8] 
                                        focus:border-[#144366] outline-none transition-all min-h-[100px] resize-none"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Cor do Título</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(selectedPalette).map((color, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedColors(prev => ({ ...prev, title: color }))}
                                            className={`w-8 h-8 rounded-full transition-all duration-200 
                                                hover:scale-110 active:scale-95 border-2
                                                ${selectedColors.title === color ? 'border-[#144366]' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Cor do Conteúdo</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(selectedPalette).map((color, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedColors(prev => ({ ...prev, content: color }))}
                                            className={`w-8 h-8 rounded-full transition-all duration-200 
                                                hover:scale-110 active:scale-95 border-2
                                                ${selectedColors.content === color ? 'border-[#144366]' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Tamanho da Fonte</label>
                                <select
                                    name="titleSize"
                                    defaultValue={editingText?.style?.titleSize || "16px"}
                                    className="p-3 rounded-xl bg-white/50 border border-[#E8F1F8]
                                        focus:border-[#144366] outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {fontSizes.map((size, index) => (
                                        <option key={index} value={size.value}>
                                            {size.label} ({size.value})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 p-3 bg-[#144366] text-white rounded-xl
                                        hover:bg-[#0D2B44] transition-all duration-300 font-medium">
                                    {editingText ? 'Atualizar' : 'Adicionar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingText(false);
                                        setEditingText(null);
                                    }}
                                    className="flex-1 p-3 bg-gray-100 text-gray-700 rounded-xl
                                        hover:bg-gray-200 transition-all duration-300 font-medium">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                {/* Lista de Textos Adicionados */}
                <section className="w-[55%] h-full flex flex-col gap-4 overflow-y-auto">
                    <h3 className="text-[#144366] font-semibold">Textos Adicionados</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {headerData.texts.map((text) => (
                            <div
                                key={text.id}
                                className="bg-[#F5F8FA]/50 p-4 rounded-xl space-y-3 relative group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DragIndicator className="text-[#144366]/50" />
                                        <h4 className="font-medium text-[#144366]">Texto</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(text)}
                                            className="p-1.5 rounded-lg bg-[#144366]/10 hover:bg-[#144366]/20 
                                                transition-all duration-200"
                                        >
                                            <Edit className="text-[#144366] text-sm" />
                                        </button>
                                        <button
                                            onClick={() => deleteText(text.id)}
                                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 
                                                transition-all duration-200"
                                        >
                                            <DeleteForever className="text-red-500 text-sm" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <h5 
                                            className="font-medium"
                                            style={{ 
                                                color: text.titleColor,
                                                fontSize: text.titleSize
                                            }}
                                        >
                                            {text.title}
                                        </h5>
                                        <p 
                                            className="text-sm mt-1"
                                            style={{ color: text.contentColor }}
                                        >
                                            {text.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TextsHeaderControls;