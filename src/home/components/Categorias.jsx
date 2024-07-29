import axios from "axios";
import { useEffect, useState } from "react";

function Categorias() {
    const [currentCategory, setCurrentCategory] = useState({});

    useEffect(() => {
        getAllModelsCategories();
    }, []);

    const getAllModelsCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/category`);
            setCurrentCategory(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    return (
        <div className="w-full h-[100vh] bg-black text-white p-4 overflow-y-auto">
            <h1>Categorias</h1>
            <ul>
                {Object.entries(currentCategory).map(([key, value]) => {
                    // Verifica se a chave termina com '0' e não é apenas '0'
                    const isSpecialCategory = key.endsWith('0') && key.length > 1;

                    return (
                        <li key={key} className={`mb-2 ${isSpecialCategory ? 'text-[16px] font-bold text-[#6499fb]' : 'text-[14px]'}`}>
                            <strong>{key}:</strong> {value}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Categorias;
