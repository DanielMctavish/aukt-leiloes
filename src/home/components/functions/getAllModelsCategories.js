import axios from "axios"

const getAllModelsCategories = async (setCurrentCategory) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/category`);
        setCurrentCategory(response.data);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
    }
};


export { getAllModelsCategories }