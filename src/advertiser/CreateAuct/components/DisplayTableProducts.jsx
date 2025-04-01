/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import "./styles/StylesTables.css"
import { ArrowDropDown } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeMax } from "@mui/icons-material"
import { getAllModelsCategories } from "../../../home/components/functions/getAllModelsCategories";
import { reportError } from "../../../features/errors/ReportErrorAtCreateAuct";
import { updateProducts } from "../../../features/product/Products";

function DisplayTableProducts() {
    const stateTheme = useSelector(state => state.theme)
    const state = useSelector(state => state.products.products)
    const dispatch = useDispatch()

    const [products, setProducts] = useState({ columns: [], values: [] })
    const [maximized, setMaximized] = useState(false)
    const [errors, setErros] = useState([])
    const [allcategories, setCurrentCategories] = useState({});
    const refMessage = useRef()
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState("");

    // Iniciar edição de uma célula
    const startEditing = (rowIndex, colIndex, value) => {
        setEditingCell({ row: rowIndex, col: colIndex });
        setEditValue(value);
    };

    // Salvar edição da célula
    const saveEdit = () => {
        if (!editingCell) return;

        const { row, col } = editingCell;
        const newProducts = { ...products };
        
        // Validar o valor baseado na coluna
        let validatedValue = editValue;
        
        // Converter para número se for valor inicial ou de reserva
        if (col === 3 || col === 4) {
            validatedValue = Number(editValue);
            if (isNaN(validatedValue)) {
                alert("Por favor, insira um valor numérico válido.");
                return;
            }
        }

        // Atualizar o valor na célula
        newProducts.values[row][col] = validatedValue;
        
        // Atualizar estado local
        setProducts(newProducts);
        
        // Atualizar o estado global usando a action específica
        dispatch(updateProducts(newProducts));
        
        // Limpar estado de edição
        cancelEdit();
    };

    // Cancelar edição
    const cancelEdit = () => {
        setEditingCell(null);
        setEditValue("");
    };

    // Lidar com teclas pressionadas durante a edição
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            saveEdit();
        } else if (e.key === "Escape") {
            cancelEdit();
        }
    };

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            refTableWindow.current.style.background = "#2d2d2dd8"
            refTableWindow.current.style.color = "#f6f6f6fe"
        } else {
            refTableWindow.current.style.background = "#ffffffbe"
            refTableWindow.current.style.color = "#595959"
        }

    }, [stateTheme])

    useEffect(() => {
        getAllModelsCategories(setCurrentCategories)
    }, [])

    useEffect(() => {
        setProducts(state)
    }, [state, errors])

    useEffect(() => {
        checkErrorsColumns()
    }, [products])

    useEffect(() => {
        validateFields();
    }, [products.values]);

    // Cancelar edição quando clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (editingCell && !e.target.closest('.editing-cell')) {
                saveEdit();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editingCell]);

    //CHECK ERRORS COLUNAS...................................................................................................................
    const checkErrorsColumns = async () => {
        setErros([])
        let newErrors = [];

        if (products.columns.length === 0) return null;

        if (products.columns.length !== 7) {
            newErrors.push('São necessárias 7 colunas de informações');
        }

        if (products.columns[0] !== 'title') {
            newErrors.push('A primeira coluna deve ser "title"');
        }

        if (products.columns[1] !== 'description') {
            newErrors.push('A segunda coluna deve ser "description"');
        }

        if (products.columns[2] !== 'categorie') {
            newErrors.push('A terceira coluna deve ser "categorie"');
        }

        if (products.columns[3] !== 'initial_value') {
            newErrors.push('A quarta coluna deve ser "initial_value"');
        }

        if (products.columns[4] !== 'reserve_value') {
            newErrors.push('A sexta coluna deve ser "reserve_value"');
        }

        if (products.columns[5] !== 'Group') {
            newErrors.push('A sétima coluna deve ser "Group"');
        }

        if (products.columns[6] !== 'owner_id') {
            newErrors.push('A oitava coluna deve ser "owner_id"');
        }


        // Atualizar o estado errors apenas uma vez
        setErros(prevErrors => [...prevErrors, ...newErrors]);
    };


    //Renderizar COLUNAS........................................................................................................................
    const RenderMainColumns = (column, index) => {

        if (index === 6) return (
            <span key={index} className="p-2 text-zinc-600 font-semibold flex gap-2 bg-slate-300 max-w-[100px] justify-between">
                <span>{column}</span>
                <ArrowDropDown />
            </span>
        )

        return (
            <span key={index} className="p-2 text-zinc-600 font-semibold flex gap-2 bg-slate-300 w-full justify-between">
                <span>{column}</span>
                <ArrowDropDown />
            </span>
        )
    }

    //Validar Campos....................................................................................................................

    const validateFields = () => {
        let newErrors = [];
        let errorCounts = {};

        products.values.forEach((line_values) => {
            line_values.map((value, index) => {
                if (index === 0 && (typeof value !== 'string' || !value)) {
                    const errorKey = 'O título precisa ser um texto não vazio';
                    updateOrAddError(errorKey, errorCounts, newErrors);
                }
                if (index === 1 && (typeof value !== 'string' || !value)) {
                    const errorKey = 'A descrição precisa ser um texto não vazio';
                    updateOrAddError(errorKey, errorCounts, newErrors);
                }
                if (index === 2 && (typeof value !== 'string' || !value)) {
                    const errorKey = 'A categoria precisa ser um texto não vazio';
                    updateOrAddError(errorKey, errorCounts, newErrors);
                }

                if (index === 2) {
                    let isExistedField = false;
                    Object.entries(allcategories).forEach(([key]) => {
                        if (key === value) {
                            isExistedField = true
                        }
                    })
                    if (!isExistedField) {
                        const errorKey = `A categoria '${value}' não existe`;
                        dispatch(reportError(errorKey))
                        updateOrAddError(errorKey, errorCounts, newErrors);
                    }

                    return false
                }

                if (index === 3 && (typeof value !== 'number' || isNaN(value))) {
                    const errorKey = 'O valor inicial precisa ser um número';
                    updateOrAddError(errorKey, errorCounts, newErrors);
                }
                if (index === 4 && (typeof value !== 'number' || isNaN(value))) {
                    const errorKey = 'O valor de reserva precisa ser um número';
                    updateOrAddError(errorKey, errorCounts, newErrors);
                }
                if (index === 5 && (typeof value !== 'string' || !value)) {
                    const errorKey = 'O grupo precisa ser um texto não vazio';
                    updateOrAddError(errorKey, errorCounts, newErrors);
                }
                if (index === 6 && (typeof value !== 'string' || !value)) {
                    const errorKey = 'O id do proprietário precisa ser um texto hexadecimal válido';
                    updateOrAddError(errorKey, errorCounts, newErrors);
                }
            });
        });

        // Atualizar o estado errors apenas uma vez
        setErros(prevErrors => [...prevErrors, ...newErrors]);
    };

    const updateOrAddError = (errorKey, errorCounts, newErrors) => {
        if (errorCounts[errorKey]) {
            errorCounts[errorKey]++;
            const existingIndex = newErrors.findIndex(error => error.startsWith(errorKey));
            if (existingIndex !== -1) {
                newErrors[existingIndex] = `${errorKey} ${errorCounts[errorKey]}x`;
            }
        } else {
            errorCounts[errorKey] = 1;
            newErrors.push(`${errorKey} ${errorCounts[errorKey]}x`);
        }
    };

    //Renderizar CAMPOS..................................................................................................................
    const RenderFields = (field, index, rowIndex) => {
        const isEditing = editingCell?.row === rowIndex && editingCell?.col === index;
        let tailwindCode = "p-2 text-left text-[14px] font-bold bg-stone-400/10 w-full min-h-[100px] rounded-md max-h-[100px] overflow-y-auto justify-between cursor-pointer"

        if (index === 6) tailwindCode = "p-2 text-left text-[14px] font-bold bg-stone-400/10 min-w-[100px] min-h-[100px] rounded-md max-h-[100px] overflow-y-auto justify-between cursor-pointer"

        if (isEditing) {
            return (
                <div key={index} className={`${tailwindCode} p-0 bg-blue-50 editing-cell border-2 border-blue-400 shadow-lg`}>
                    <div className="flex flex-col h-full relative">
                        {index === 3 || index === 4 ? (
                            <div className="relative flex items-center w-full">
                                <span className="absolute left-2 text-blue-700 font-semibold">R$</span>
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 py-2 pl-8 pr-2 border-none focus:outline-none bg-transparent w-full h-full text-blue-700"
                                    autoFocus
                                    step="0.01"
                                />
                            </div>
                        ) : (
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 p-3 border-none focus:outline-none bg-transparent w-full h-full resize-none text-blue-700"
                                autoFocus
                                style={{ minHeight: "70px" }}
                            />
                        )}
                        
                        <div className="flex justify-end p-2 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200">
                            <button 
                                onClick={saveEdit}
                                className="p-1.5 px-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
                                title="Salvar (Enter)"
                            >
                                ✓
                            </button>
                            <button 
                                onClick={cancelEdit}
                                className="p-1.5 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ml-2 text-xs"
                                title="Cancelar (Esc)"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        let content;
        if (index === 3 || index === 4) {
            content = `R$ ${field}`;
        } else {
            content = field;
        }

        return (
            <div 
                key={index} 
                className={`${tailwindCode} hover:bg-blue-50 group relative transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-200`}
                onClick={() => startEditing(rowIndex, index, field)}
            >
                {content}
            </div>
        );
    }

    // Maximizar tabela

    const refTableWindow = useRef()

    const handleMaximizeWindow = () => {
        setMaximized(!maximized)

        if (!maximized) {
            refTableWindow.current.style.transition = ".1s"
            refTableWindow.current.style.position = "fixed"
            refTableWindow.current.style.width = '50%'
            refTableWindow.current.style.height = '50%'
            refTableWindow.current.style.left = '0'
            refTableWindow.current.style.top = '0'

            setTimeout(() => {
                refTableWindow.current.style.transition = "1s"
                refTableWindow.current.style.marginTop = '7vh'
                refTableWindow.current.style.width = '100%'
                refTableWindow.current.style.height = '90%'
            }, 300);

        } else {
            refTableWindow.current.style.marginTop = '0'
            refTableWindow.current.style.transition = ".3s"
            refTableWindow.current.style.width = '60%'
            refTableWindow.current.style.height = '30%'

            setTimeout(() => {
                refTableWindow.current.style.position = "relative"
                refTableWindow.current.style.width = '100%'
                refTableWindow.current.style.height = '100%'
            }, 300);

        }
    }

    return (
        <div
            ref={refTableWindow}
            className="flex flex-col bg-[#e4f4ffe8] w-full 
        h-[100%] rounded-md  shadow-md shadow-[#1b1b1b2a] 
        relative overflow-hidden backdrop-blur-[16px]">

            <span className="flex w-[100%] h-auto  bg-zinc-600 relative">
                <button onClick={handleMaximizeWindow} className="absolute right-2 top-1 cursor-pointer text-white">
                    <HomeMax />
                </button>
                <span ref={refMessage}
                    className="flex flex-col w-full min-h-[40px] p-1 justify-start items-start text-red-600 text-[12px] gap-1">
                    {
                        errors.length > 0
                            ? errors.map((error, index) => {
                                return (
                                    <span key={index} className="p-2 font-semibold flex gap-2 bg-red-300 w-[96%] justify-between rounded-md">
                                        <span>{error}</span>
                                        <ArrowDropDown />
                                    </span>
                                )
                            })
                            : null
                    }
                </span>
            </span>
            <div className="w-full overflow-y-auto overflow-x-auto">
                <div className="w-full h-max-[100px] flex gap-1 justify-between">

                    {products.columns.map((column, index) => RenderMainColumns(column, index))}

                </div>

                <div className="w-full flex flex-col gap-1">

                    {products.values.map((value, rowIndex) => (

                        <div className="w-full flex justify-between items-center gap-1" key={rowIndex}>
                            {value.map(((field, colIndex) => RenderFields(field, colIndex, rowIndex)))}
                        </div>

                    ))}

                </div>
            </div>

        </div>
    )
}

export default DisplayTableProducts