/* eslint-disable react/prop-types */
import { Close, DeleteForever, DragIndicator } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addHeaderText, updateHeaderText, removeHeaderText } from "../../../../../features/template/HeaderSlice";

function TextsHeaderControls({ setIsModalSelector }) {
    const dispatch = useDispatch();
    const { headerData } = useSelector(state => state.header);
    const selectedPalette = headerData.palettes[headerData.colorPalette];

    const [isAddingText, setIsAddingText] = useState(false)
    const [draggedItem, setDraggedItem] = useState(null)
    const [selectedColors, setSelectedColors] = useState({
        title: Object.values(selectedPalette)[0],
        content: Object.values(selectedPalette)[0]
    })
    const previewRef = useRef(null)

    // Refs para os campos do formulário
    const titleRef = useRef()
    const contentRef = useRef()
    const titleSizeRef = useRef()

    useEffect(() => {
        // Atualiza as cores selecionadas quando a paleta muda
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
    ]

    const handleAddText = () => {
        const newText = {
            id: Date.now(),
            title: titleRef.current.value,
            content: contentRef.current.value,
            style: {
                titleColor: selectedColors.title,
                contentColor: selectedColors.content,
                titleSize: titleSizeRef.current.value
            },
            position: {
                top: '50%',
                left: '50%'
            }
        }

        dispatch(addHeaderText(newText));
        setIsAddingText(false);

        // Limpar campos
        const refs = [titleRef, contentRef]
        refs.forEach(ref => ref.current.value = '')
        titleSizeRef.current.value = '16px'
        setSelectedColors({
            title: Object.values(selectedPalette)[0],
            content: Object.values(selectedPalette)[0]
        })
    }

    const deleteText = (id) => {
        dispatch(removeHeaderText(id));
    }

    useEffect(() => {
        if (!draggedItem) return;

        const handleMouseMove = (e) => {
            if (!previewRef.current) return;

            const previewRect = previewRef.current.getBoundingClientRect()
            const x = e.clientX - previewRect.left
            const y = e.clientY - previewRect.top

            // Limites da área de preview
            const maxX = previewRect.width - 100
            const maxY = previewRect.height - 50

            const boundedX = Math.max(0, Math.min(x, maxX))
            const boundedY = Math.max(0, Math.min(y, maxY))

            const percentX = (boundedX / previewRect.width) * 100
            const percentY = (boundedY / previewRect.height) * 100

            dispatch(updateHeaderText({
                id: draggedItem.id,
                updates: {
                    position: {
                        left: `${percentX}%`,
                        top: `${percentY}%`
                    }
                }
            }));
        }

        const handleMouseUp = () => {
            setDraggedItem(null)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [draggedItem, dispatch])

    const handleMouseDown = (e, text) => {
        e.preventDefault()
        setDraggedItem(text)
    }

    return (
        <div className="fixed inset-0 bg-[#0D2B44]/80 backdrop-blur-[4px] 
            flex items-center justify-center z-[999]">
            <div className="w-[85%] h-[85%] bg-white rounded-2xl shadow-xl 
                flex justify-between items-start relative p-8 overflow-hidden gap-6">
                {/* Botão de fechar */}
                <button
                    onClick={() => setIsModalSelector(false)}
                    className="fixed top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                        backdrop-blur-sm transition-all duration-200"
                >
                    <Close className="text-white" />
                </button>

                {/* Seção de Adição/Formulário */}
                <section className="w-[26%] h-full flex flex-col gap-4">
                    <h3 className="text-[#144366] font-semibold">Adicionar Texto</h3>

                    <button
                        onClick={() => setIsAddingText(true)}
                        className={`w-full p-3 rounded-xl text-white font-medium
                            transition-all duration-300 ${isAddingText
                                ? 'bg-[#5A7184]'
                                : 'bg-[#144366] hover:bg-[#0D2B44] active:scale-[0.98]'}`}
                        disabled={isAddingText}
                    >
                        Adicionar Texto
                    </button>

                    {isAddingText && (
                        <div className="w-full flex flex-col gap-4 bg-[#F5F8FA]/50 backdrop-blur-sm p-6 rounded-xl">
                            {/* Input de Título */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Título</label>
                                <input 
                                    ref={titleRef} 
                                    type="text" 
                                    placeholder="Digite o título..."
                                    className="p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-[#E8F1F8] 
                                        focus:border-[#144366] outline-none transition-all duration-200
                                        placeholder:text-[#5A7184]/50 text-[#144366]" 
                                />
                            </div>

                            {/* Input de Conteúdo */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Conteúdo</label>
                                <textarea 
                                    ref={contentRef} 
                                    placeholder="Digite o conteúdo..."
                                    className="p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-[#E8F1F8] 
                                        focus:border-[#144366] outline-none transition-all duration-200 min-h-[100px]
                                        placeholder:text-[#5A7184]/50 text-[#144366] resize-none" 
                                />
                            </div>

                            {/* Cores da Paleta */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Cores do Título</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(selectedPalette).map((color, index) => (
                                        <button
                                            key={index}
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
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Cores do Conteúdo</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(selectedPalette).map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColors(prev => ({ ...prev, content: color }))}
                                            className={`w-8 h-8 rounded-full transition-all duration-200 
                                                hover:scale-110 active:scale-95 border-2
                                                ${selectedColors.content === color ? 'border-[#144366]' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Tamanho da Fonte */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#5A7184] font-medium pl-1">Tamanho da Fonte</label>
                                <select
                                    ref={titleSizeRef}
                                    defaultValue="16px"
                                    className="p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-[#E8F1F8]
                                        focus:border-[#144366] outline-none transition-all duration-200
                                        text-[#144366] appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '20px'
                                    }}
                                >
                                    {fontSizes.map((size, index) => (
                                        <option key={index} value={size.value}>
                                            {size.label} ({size.value})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botão de Confirmar */}
                            <button
                                onClick={handleAddText}
                                className="w-full p-3 mt-2 bg-[#144366] text-white rounded-xl
                                    hover:bg-[#0D2B44] transition-all duration-300 font-medium
                                    active:scale-[0.98] shadow-sm hover:shadow-md"
                            >
                                Confirmar
                            </button>
                        </div>
                    )}
                </section>

                {/* Seção de Preview */}
                <section className="w-[74%] h-full flex flex-col gap-4">
                    <h3 className="text-[#144366] font-semibold">Preview</h3>

                    {/* Área de Preview */}
                    <div
                        ref={previewRef}
                        className="w-full h-full bg-[#F5F8FA] rounded-xl relative overflow-hidden"
                        style={{
                            backgroundImage: 'url("https://placehold.co/1920x1080")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {headerData.texts.map((text) => (
                            <div
                                key={text.id}
                                className={`absolute cursor-move group ${draggedItem?.id === text.id ? 'z-50' : 'z-0'}`}
                                style={{
                                    left: text.position?.left || '0px',
                                    top: text.position?.top || '0px',
                                    userSelect: 'none'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, text)}
                            >
                                {/* Indicador de arraste e tamanho */}
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                                        {text.style?.titleSize}
                                    </span>
                                    <DragIndicator className="text-white drop-shadow-lg" />
                                </div>

                                {/* Título */}
                                <h4
                                    className="font-medium p-2 mb-2"
                                    style={{
                                        color: text.style?.titleColor,
                                        fontSize: text.style?.titleSize,
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {text.title}
                                </h4>

                                {/* Conteúdo */}
                                <p
                                    className="p-2"
                                    style={{
                                        color: text.style?.contentColor,
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {text.content}
                                </p>

                                {/* Botão de deletar */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteText(text.id);
                                    }}
                                    className="absolute -right-2 top-0 p-1 rounded-full bg-white/90 hover:bg-white
                                        shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                                >
                                    <DeleteForever className="text-red-500 text-sm" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default TextsHeaderControls;