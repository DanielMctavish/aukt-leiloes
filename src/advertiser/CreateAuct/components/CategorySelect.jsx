/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getAllModelsCategories } from "../../../home/components/functions/getAllModelsCategories";
import { Search } from "@mui/icons-material";

function CategorySelect({ handleDispatchCategories, refCategories }) {
    const [categories, setCategories] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState({});

    useEffect(() => {
        // Carregar categorias do backend
        getAllModelsCategories(setCategories);
    }, []);

    // Função para normalizar texto (remover acentos e converter para minúsculas)
    const normalizeText = (text) => {
        return text.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    // Filtrar categorias baseado no termo de busca
    useEffect(() => {
        if (Object.keys(categories).length > 0) {
            const filtered = Object.entries(categories).reduce((acc, [key, value]) => {
                const normalizedValue = normalizeText(value);
                const normalizedSearch = normalizeText(searchTerm);
                
                if (normalizedValue.includes(normalizedSearch)) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            
            setFilteredCategories(filtered);
        }
    }, [searchTerm, categories]);

    return (
        <section className="w-full flex flex-col gap-2 justify-center items-center mt-6">
            <div className="w-[80%] flex flex-col gap-3">
                <div className="relative flex items-center mb-2">
                    <Search className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md 
                        focus:ring-2 focus:ring-[#012038] focus:border-transparent 
                        transition-all outline-none bg-gray-50"
                    />
                </div>

                <select 
                    onChange={handleDispatchCategories}
                    ref={refCategories}
                    defaultValue={refCategories.current ? refCategories.current.value : ""}
                    className="w-full bg-transparent h-[40px] p-2 border-[1px] 
                    border-gray-300 rounded-md focus:ring-2 focus:ring-[#012038] 
                    focus:border-transparent transition-all outline-none"
                >
                    <option value="">selecione</option>
                    {Object.entries(searchTerm ? filteredCategories : categories)
                        .sort(([, a], [, b]) => a.localeCompare(b)) // Ordenar alfabeticamente
                        .map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))
                    }
                </select>
            </div>
        </section>
    );
}

export default CategorySelect;